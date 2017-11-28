import React, { Component } from 'react'

const obsessions = [
  { id: 'abc', title: 'Hello' },
  { id: 'bithels', title: 'World' }
]

class ObsessionsList extends Component {
  render() {
    return (
      <ul>{obsessions.map(({ title, id }) => <li key={id}>{title}</li>)}</ul>
    )
  }
}

export default ObsessionsList
