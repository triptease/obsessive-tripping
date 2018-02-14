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
    filteredCategory: 'all'
  }

  unsubscribeObsessions

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

  watchObsessions = () =>
    db.collection('obsessions').onSnapshot(querySnapshot => {
      const newObsessions = {}
      querySnapshot.forEach(function(doc) {
        newObsessions[doc.id] = { id: doc.id, ...doc.data() }
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
    })

  watchAuth = () => {
    auth.onAuthStateChanged(authUser => {
      if (authUser) {
        const { displayName, email, photoURL, uid } = authUser
        this.setState({
          user: { displayName, email, photoURL, uid }
        })
      } else {
        this.setState({ user: undefined })
      }
    })
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
    db
      .collection('obsessions')
      .add({ timestamp: serverTimestamp, ...newObsession })
  }

  setFilteredCategory = filteredCategory => {
    this.setState({ filteredCategory })
  }

  render() {
    const {
      availableCategories,
      obsessions,
      filteredCategory,
      user
    } = this.state
    const visibleObsessions =
      filteredCategory === 'all'
        ? obsessions
        : filter(obsessions, ({ category }) => category === filteredCategory)

    return (
      <Container>
        <Header />
        <MagicBar addObsession={this.addObsession} />
        <Filters
          categories={availableCategories}
          filteredCategory={filteredCategory}
          setFilteredCategory={this.setFilteredCategory}
        />
        <ObsessionsList
          obsessions={visibleObsessions}
          onObsessionScore={this.onObsessionScore}
        />
        {user ? <Logout /> : <Login />}
      </Container>
    )
  }
}

export default App
