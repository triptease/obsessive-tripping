import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const ScoringButton = styled.button`
  margin-left: 4px;
`

class Obsession extends PureComponent {
  static propTypes = {
    score: PropTypes.number,
    title: PropTypes.string.isRequired
  }

  onLikeClick = () => {
    const { onScore, id, score } = this.props
    onScore(id, score + 1)
  }

  onDislikeClick = () => {
    const { onScore, id, score } = this.props
    onScore(id, score - 1)
  }

  render() {
    const { score, title } = this.props
    return (
      <div>
        {title} | Score: {typeof score !== 'undefined' ? score : 'N/A'}
        <ScoringButton onClick={this.onLikeClick}>
          <span role="img" aria-label="thumbs up">
            👍
          </span>
        </ScoringButton>
        <ScoringButton onClick={this.onDislikeClick}>
          <span role="img" aria-label="thumbs up">
            👎
          </span>
        </ScoringButton>
      </div>
    )
  }
}

export default Obsession
