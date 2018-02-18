import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const ScoringButton = styled.button`
  margin-left: 4px;
`

const Byline = styled.aside`
  font-size: 0.8rem;
`

class Obsession extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    score: PropTypes.number,
    submitterEmail: PropTypes.string,
    submitterName: PropTypes.string,
    submitterSlackURL: PropTypes.string
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
    const {
      score,
      title,
      submitterName,
      submitterSlackURL,
      submitterEmail
    } = this.props
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
        {submitterName ? (
          <Byline>
            Submitted by:{' '}
            <a href={submitterSlackURL || `mailto:${submitterEmail}`}>
              {submitterName}
            </a>
          </Byline>
        ) : null}
      </div>
    )
  }
}

export default Obsession
