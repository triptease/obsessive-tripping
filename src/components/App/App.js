import React, { Component } from 'react'

import MagicBar from './MagicBar/MagicBar'
import ObsessionsList from './ObsessionsList/ObsessionsList'

class App extends Component {
  render() {
    return [
      <header key="header">Booktease</header>,
      <MagicBar key="magic-bar" />,
      <ObsessionsList key="list" />
    ]
  }
}

export default App
