import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { map } from 'lodash'

import Obsession from './Obsession/Obsession'

const Container = styled.ul`
  border: 1px solid #ffffff;
  border-radius: 4px;
  padding: 8px;
`

class ObsessionsList extends PureComponent {
  render() {
    const { obsessions, onObsessionScore } = this.props
    return (
      <Container>
        {map(obsessions, ({ score, title, id }) => (
          <Obsession
            title={title}
            score={score}
            key={id}
            id={id}
            onScore={onObsessionScore}
          />
        ))}
      </Container>
    )
  }
}

export default ObsessionsList
