import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { map, orderBy } from 'lodash'

import Obsession from './Obsession/Obsession'

const Container = styled.ul`
  border: 1px solid #ffffff;
  border-radius: 4px;
  padding: 8px;
`

class ObsessionsList extends PureComponent {
  getSubmitter(submitters, submitterRef) {
    return (submitterRef && submitters[submitterRef.id]) || {}
  }

  render() {
    const { obsessions, onObsessionScore, submitters } = this.props
    return (
      <Container>
        {map(
          orderBy(obsessions, ['score'], ['desc']),
          ({ score, title, id, submitterRef }) => {
            const { displayName } = this.getSubmitter(submitters, submitterRef)
            return (
              <Obsession
                title={title}
                score={score}
                key={id}
                id={id}
                onScore={onObsessionScore}
                submitterName={displayName}
              />
            )
          }
        )}
      </Container>
    )
  }
}

export default ObsessionsList
