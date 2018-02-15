import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  align-items: center;
`
const Avatar = styled.img`
  width: 64px;
  border-radius: 100%;
  margin-right: 8px;
`

class MiniProfile extends PureComponent {
  static propTypes = {
    displayName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    photoURL: PropTypes.string.isRequired
  }

  render() {
    const { displayName, email, photoURL } = this.props
    const title = `Avatar of ${displayName}`
    return (
      <Container>
        <Avatar src={photoURL} title={title} alt={title} />
        <div>
          <a href={`mailto:${email}`}>{displayName}</a>
        </div>
      </Container>
    )
  }
}

export default MiniProfile
