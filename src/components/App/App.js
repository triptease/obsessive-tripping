import React, { Component } from 'react'

import MagicBar from './MagicBar/MagicBar'

class App extends Component {
  render() {
    return [
      <header key="header">Booktease</header>,
      <MagicBar key="magic-bar" />,
      <div key="book-list">book list</div>
    ]
  }
}

export default App
