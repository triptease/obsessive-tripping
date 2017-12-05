import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

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
        <button onClick={this.onLikeClick}>
          <span role="img" aria-label="thumbs up">
            👍
          </span>
        </button>
        <button onClick={this.onDislikeClick}>
          <span role="img" aria-label="thumbs up">
            👎
          </span>
        </button>
      </div>
    )
  }
}

export default Obsession
