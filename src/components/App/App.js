import React, { Component } from 'react'
import styled from 'styled-components'

import Header from './Header/Header'
import MagicBar from './MagicBar/MagicBar'
import ObsessionsList from './ObsessionsList/ObsessionsList'
import { db } from '../../firebase'

const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

class App extends Component {
  state = {
    obsessions: {}
  }

  watchObsessions = () => {
    db.collection('obsessions').onSnapshot(querySnapshot => {
      const newObsessions = {}
      querySnapshot.forEach(function(doc) {
        newObsessions[doc.id] = { id: doc.id, ...doc.data() }
      })
      this.setState(({ obsessions }) => ({
        obsessions: { ...obsessions, ...newObsessions }
      }))
    })
  }
  componentDidMount() {
    // todo: query firestore to get the obsessions
    this.watchObsessions()
  }

  updateObsessionScore = (state, id, score) => ({
    ...state,
    obsessions: state.obsessions.map(
      obsession => (obsession.id !== id ? obsession : { ...obsession, score })
    )
  })

  onObsessionScore = (id, newScore) => {
    this.setState(state => this.updateObsessionScore(state, id, newScore))
  }

  addObsession = newObsession => {
    this.setState(({ obsessions }) => {
      const newObsessions = obsessions.concat([newObsession])
      return { obsessions: newObsessions }
    })
  }

  render() {
    const { obsessions } = this.state
    return (
      <Container>
        <Header />
        <MagicBar addObsession={this.addObsession} />
        <ObsessionsList
          obsessions={obsessions}
          onObsessionScore={this.onObsessionScore}
        />
      </Container>
    )
  }
}

export default App
