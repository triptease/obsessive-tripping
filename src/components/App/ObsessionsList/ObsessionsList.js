import React, { Component } from 'react'
import styled from 'styled-components'

const obsessions = [
  { id: 'abc', title: 'Hello' },
  { id: 'bithels', title: 'World' }
]

const Container = styled.ul`
  border: 1px solid #ffffff;
  border-radius: 4px;
  padding: 8px;
`

class ObsessionsList extends Component {
  render() {
    return (
      <Container>
        {obsessions.map(({ title, id }) => <li key={id}>{title}</li>)}
      </Container>
    )
  }
}

export default ObsessionsList
