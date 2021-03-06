import React, { Component } from 'react'
import styled from 'styled-components'
import { filter, omit, reduce } from 'lodash'

import Filters from './Filters/Filters'
import Header from './Header/Header'
import Login from './Login/Login'
import Logout from './Logout/Logout'
import MagicBar from './MagicBar/MagicBar'
import ObsessionsList from './ObsessionsList/ObsessionsList'
import { auth, db, serverTimestamp } from '../../firebase'
import MiniProfile from './MiniProfile/MiniProfile'
import getSlackURL from '../../utils/getSlackURL'

const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

class App extends Component {
  state = {
    availableCategories: ['all'],
    obsessions: {},
    filteredCategory: 'all',
    users: {},
    obsessionVotesList: {},
    isLoadingAuth: true
  }

  unsubscribeObsessions
  unsubscribeAuth

  static getCategoriesCounts(obsessions) {
    return reduce(
      obsessions,
      (accumulator, obsession) => {
        accumulator[obsession.category] = accumulator[obsession.category]
          ? accumulator[obsession.category] + 1
          : 1
        return accumulator
      },
      {}
    )
  }

  static getVoteId(obsessionId, userId) {
    return `${obsessionId}|${userId}`
  }

  addDocsToUsers = docs => {
    this.setState(({ users }) => ({
      users: docs.reduce(
        (acc, doc) => {
          acc[doc.id] = { id: doc.id, ...doc.data() }
          return acc
        },
        { ...users }
      )
    }))
  }

  parseObsessionsSnapshot = querySnapshot => {
    const newObsessions = {}
    const deletedObsessionIds = []
    const newUserPromises = []

    querySnapshot.docChanges.forEach(({ doc, type }) => {
      const obsession = { id: doc.id, ...doc.data() }

      switch (type) {
        case 'added':
        case 'modified':
          const { users } = this.state
          newObsessions[obsession.id] = obsession

          if (obsession.submitterRef && !users[obsession.submitterRef.id]) {
            newUserPromises.push(obsession.submitterRef.get())
          }
          break
        case 'removed':
          deletedObsessionIds.push(obsession.id)
          break
        default:
          break
      }
    })

    return { newObsessions, deletedObsessionIds, newUserPromises }
  }

  handleObsessions = querySnapshot => {
    const {
      newObsessions,
      deletedObsessionIds,
      newUserPromises
    } = this.parseObsessionsSnapshot(querySnapshot)

    this.setState(({ obsessions: prevObsessions }) => {
      const obsessions = {
        ...omit(prevObsessions, deletedObsessionIds),
        ...newObsessions
      }
      const availableCategories = [
        'all',
        ...Object.keys(App.getCategoriesCounts(obsessions))
      ]
      return {
        availableCategories,
        obsessions
      }
    })

    Promise.all(newUserPromises).then(this.addDocsToUsers)
  }

  watchObsessions = () =>
    db.collection('obsessions').onSnapshot(this.handleObsessions)

  watchVotes = userRef =>
    db
      .collection('votes')
      .where('userRef', '==', userRef)
      .onSnapshot(querySnapshot => {
        const newVotes = {}
        querySnapshot.docChanges.forEach(({ type, doc }) => {
          const obsessionId = doc.data().obsessionRef.id

          switch (type) {
            case 'added':
            case 'modified':
              newVotes[obsessionId] = doc.data().value
              break
            case 'removed':
              newVotes[obsessionId] = undefined
              break
            default:
              break
          }
        })
        this.setState(({ obsessionVotesList }) => ({
          obsessionVotesList: { ...obsessionVotesList, ...newVotes }
        }))
      })

  handleSlackResponse = (id, slackResponse) => {
    if (!slackResponse || !slackResponse.ok) {
      if (slackResponse && slackResponse.error === 'users_not_found') {
        console.log('Are you logging in with a non-triptease email?')
      } else {
        console.log(slackResponse)
      }
    } else {
      const slack = {
        id: slackResponse.user.id,
        teamId: slackResponse.user.team_id
      }
      db
        .collection('users')
        .doc(id)
        .update({ slack })
        .then(() =>
          this.setState(({ users }) => ({
            users: { ...users, [id]: { ...users[id], slack } }
          }))
        )
    }
  }

  getSlackInfo = ({ email, id }) => {
    fetch(
      `https://slack.com/api/users.lookupByEmail?email=${email}&token=${
        process.env.REACT_APP_SLACK_TOKEN
      }`
    )
      .then(response => response.json())
      .then(this.handleSlackResponse.bind(undefined, id))
      .catch(console.log)
  }

  handleAuthUser = authUser => {
    if (authUser) {
      const { uid } = authUser
      const userRef = db.collection('users').doc(uid)
      return userRef
        .get()
        .then(doc => {
          const user = { id: doc.id, ...doc.data() }
          this.setState(({ users }) => ({
            currentUserId: user.id,
            users: { ...users, [user.id]: user },
            isLoadingAuth: false
          }))

          if (!user.slack) {
            this.getSlackInfo(user)
          }

          this.unsubscribeVotes = this.watchVotes(userRef)
        })
        .catch(console.log)
    } else {
      this.setState({ currentUserId: undefined, isLoadingAuth: false })
    }
  }

  watchAuth = () => {
    auth.onAuthStateChanged(this.handleAuthUser)
  }

  componentDidMount() {
    this.unsubscribeObsessions = this.watchObsessions()
    this.unsubscribeAuth = this.watchAuth()
  }

  componentWillUnmount() {
    this.unsubscribeObsessions && this.unsubscribeObsessions()
    this.unsubscribeAuth && this.unsubscribeAuth()
    this.unsubscribeVotes && this.unsubscribeVotes()
  }

  onObsessionDelete = id => {
    db
      .collection('obsessions')
      .doc(id)
      .delete()
      .catch(err => {
        if (err.message === 'Missing or insufficient permissions.') {
          console.log('You can only delete the obsessions you have submitted!')
        } else {
          console.log(err)
        }
      })
  }

  onObsessionVote = (id, { userId, value }) => {
    db
      .collection('votes')
      .doc(App.getVoteId(id, userId))
      .set({
        value,
        updatedAt: serverTimestamp,
        obsessionRef: db.collection('obsessions').doc(id),
        userRef: db.collection('users').doc(userId)
      })
  }

  onObsessionDeleteVote = (id, { userId }) => {
    db
      .collection('votes')
      .doc(App.getVoteId(id, userId))
      .delete()
  }

  addObsession = newObsession => {
    const { currentUserId } = this.state
    db.collection('obsessions').add({
      createdAt: serverTimestamp,
      submitterRef: db.collection('users').doc(currentUserId),
      ...newObsession
    })
  }

  setFilteredCategory = filteredCategory => {
    this.setState({ filteredCategory })
  }

  render() {
    const {
      availableCategories,
      currentUserId,
      filteredCategory,
      isLoadingAuth,
      obsessions,
      obsessionVotesList,
      users
    } = this.state
    const visibleObsessions =
      filteredCategory === 'all'
        ? obsessions
        : filter(obsessions, ({ category }) => category === filteredCategory)

    const currentUser = currentUserId && users[currentUserId]
    return (
      <Container>
        <Header />
        {currentUser ? <MagicBar addObsession={this.addObsession} /> : null}
        <Filters
          categories={availableCategories}
          filteredCategory={filteredCategory}
          setFilteredCategory={this.setFilteredCategory}
        />
        <ObsessionsList
          obsessions={visibleObsessions}
          onObsessionVote={this.onObsessionVote}
          onObsessionDelete={this.onObsessionDelete}
          onObsessionDeleteVote={this.onObsessionDeleteVote}
          submitters={users}
          obsessionVotesList={obsessionVotesList}
          userId={currentUserId}
        />
        {!isLoadingAuth ? currentUser ? <Logout /> : <Login /> : null}
        {currentUser ? (
          <MiniProfile
            displayName={currentUser.displayName}
            email={currentUser.email}
            slackURL={getSlackURL(currentUser)}
            photoURL={currentUser.photoURL}
          />
        ) : null}
      </Container>
    )
  }
}

export default App
