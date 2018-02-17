import React, { Component } from 'react'
import styled from 'styled-components'
import { filter, reduce } from 'lodash'

import Filters from './Filters/Filters'
import Header from './Header/Header'
import Login from './Login/Login'
import Logout from './Logout/Logout'
import MagicBar from './MagicBar/MagicBar'
import ObsessionsList from './ObsessionsList/ObsessionsList'
import { auth, db, serverTimestamp } from '../../firebase'
import MiniProfile from './MiniProfile/MiniProfile'

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

  watchObsessions = () =>
    db.collection('obsessions').onSnapshot(querySnapshot => {
      const newObsessions = {}
      const newUserPromises = []
      querySnapshot.forEach(doc => {
        const { users } = this.state
        const obsession = { id: doc.id, ...doc.data() }
        newObsessions[obsession.id] = obsession
        if (obsession.submitterRef && !users[obsession.submitterRef.id]) {
          newUserPromises.push(obsession.submitterRef.get())
        }
      })

      this.setState(({ obsessions: prevObsessions }) => {
        const obsessions = { ...prevObsessions, ...newObsessions }
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
    })

  handleAuthUser = authUser => {
    if (authUser) {
      const { uid } = authUser
      return db
        .collection('users')
        .doc(uid)
        .get()
        .then(doc => {
          const user = { id: doc.id, ...doc.data() }
          this.setState(({ users }) => ({
            currentUserId: user.id,
            users: { ...users, [user.id]: user },
            isLoadingAuth: false
          }))
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
  }

  onObsessionScore = (id, score) => {
    db
      .collection('obsessions')
      .doc(id)
      .update({ score })
  }

  addObsession = newObsession => {
    const { currentUserId } = this.state
    db.collection('obsessions').add({
      timestamp: serverTimestamp,
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
          onObsessionScore={this.onObsessionScore}
          submitters={users}
        />
        {!isLoadingAuth ? currentUser ? <Logout /> : <Login /> : null}
        {currentUser ? (
          <MiniProfile
            displayName={currentUser.displayName}
            email={currentUser.email}
            photoURL={currentUser.photoURL}
          />
        ) : null}
      </Container>
    )
  }
}

export default App
