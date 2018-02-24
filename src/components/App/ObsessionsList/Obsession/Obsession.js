import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const ScoringButton = styled.button`
  margin-left: 4px;
  outline: none;
  ${({ voted }) => voted && 'border: 4px solid gold;'};
`

const Byline = styled.aside`
  font-size: 0.8rem;
`

class Obsession extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    onVote: PropTypes.func,
    score: PropTypes.number,
    submitterEmail: PropTypes.string,
    submitterName: PropTypes.string,
    submitterSlackURL: PropTypes.string,
    userId: PropTypes.string
  }

  onVote = value => {
    const { onVote, onDeleteVote, id, userId, vote } = this.props
    if (!userId) {
      console.log('You need to be logged-in to vote!')
      return
    }
    if (vote !== value) {
      onVote(id, { userId, value })
    } else {
      onDeleteVote(id, { userId })
    }
  }

  onLikeClick = this.onVote.bind(undefined, 1)

  onDislikeClick = this.onVote.bind(undefined, -1)

  render() {
    const {
      score,
      title,
      submitterName,
      submitterSlackURL,
      submitterEmail,
      vote
    } = this.props
    return (
      <div>
        {title} | Score: {typeof score !== 'undefined' ? score : 'N/A'}
        <ScoringButton onClick={this.onLikeClick} voted={vote === 1}>
          <span role="img" aria-label="thumbs up">
            👍
          </span>
        </ScoringButton>
        <ScoringButton onClick={this.onDislikeClick} voted={vote === -1}>
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
