import React, { Component } from 'react'
import styled from 'styled-components'

import Header from './Header/Header'
import MagicBar from './MagicBar/MagicBar'
import ObsessionsList from './ObsessionsList/ObsessionsList'

const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

class App extends Component {
  render() {
    return (
      <Container>
        <Header />
        <MagicBar />
        <ObsessionsList />
      </Container>
    )
  }
}

export default App
