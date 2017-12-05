import React, { PureComponent } from 'react'
import styled from 'styled-components'

import dbObsessions from '../../../db/obsessions'
import Obsession from './Obsession/Obsession'

const Container = styled.ul`
  border: 1px solid #ffffff;
  border-radius: 4px;
  padding: 8px;
`

class ObsessionsList extends PureComponent {
  state = {
    obsessions: []
  }

  componentDidMount() {
    this.setState({ obsessions: dbObsessions })
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

  render() {
    const { obsessions } = this.state
    return (
      <Container>
        {obsessions.map(({ score, title, id }) => (
          <Obsession
            title={title}
            score={score}
            key={id}
            id={id}
            onScore={this.onObsessionScore}
          />
        ))}
      </Container>
    )
  }
}

export default ObsessionsList
