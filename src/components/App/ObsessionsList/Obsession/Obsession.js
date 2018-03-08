import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const BorderedButton = styled.button`
  margin-left: 4px;
  outline: none;
  ${({ border }) => border && 'border: 4px solid gold;'};
`

export const LikeButton = props => (
  <BorderedButton {...props}>
    <span role="img" aria-label="thumbs up">
      👍
    </span>
  </BorderedButton>
)

export const DislikeButton = props => (
  <BorderedButton {...props}>
    <span role="img" aria-label="thumbs down">
      👎
    </span>
  </BorderedButton>
)

export const DeleteButton = props => (
  <BorderedButton {...props}>
    <span role="img" aria-label="delete">
      🗑
    </span>
  </BorderedButton>
)

const Byline = styled.aside`
  font-size: 0.8rem;
`

class Obsession extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onVote: PropTypes.func,
    score: PropTypes.number,
    submitterId: PropTypes.string,
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

  onDelete = () => {
    const { onDelete, id } = this.props
    onDelete(id)
  }

  onLikeClick = this.onVote.bind(undefined, 1)

  onDislikeClick = this.onVote.bind(undefined, -1)

  render() {
    const {
      score,
      title,
      submitterId,
      submitterName,
      submitterSlackURL,
      submitterEmail,
      vote,
      userId
    } = this.props
    return (
      <div>
        {title} | Score: {typeof score !== 'undefined' ? score : 'N/A'}
        <LikeButton onClick={this.onLikeClick} border={vote === 1} />
        <DislikeButton onClick={this.onDislikeClick} border={vote === -1} />
        {userId && userId === submitterId ? (
          <DeleteButton onClick={this.onDelete} />
        ) : null}
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
