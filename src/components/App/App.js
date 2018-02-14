import React, { Component } from 'react'
import styled from 'styled-components'
import { reduce } from 'lodash'

import Filters from './Filters/Filters'
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
    availableCategories: ['all'],
    obsessions: {}
  }

  unsubscribeCategories

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

  componentDidMount() {
    this.unsubscribeCategories = this.watchObsessions()
  }

  componentWillUnmount() {
    this.unsubscribeCategories && this.unsubscribeCategories()
  }

  onObsessionScore = (id, score) => {
    db
      .collection('obsessions')
      .doc(id)
      .update({ score })
  }

  addObsession = newObsession => {
    db.collection('obsessions').add(newObsession)
  }

  render() {
    const { availableCategories, obsessions } = this.state
    return (
      <Container>
        <Header />
        <MagicBar addObsession={this.addObsession} />
        <Filters categories={availableCategories} />
        <ObsessionsList
          obsessions={obsessions}
          onObsessionScore={this.onObsessionScore}
        />
      </Container>
    )
  }
}

export default App
