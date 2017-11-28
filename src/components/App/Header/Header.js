import React, { PureComponent } from 'react'
import styled from 'styled-components'

const Container = styled.header`
  font-size: 48px;
`

class Header extends PureComponent {
  render() {
    return (
      <Container>
        <h1>Obsessive Trippin'</h1>
      </Container>
    )
  }
}

export default Header
