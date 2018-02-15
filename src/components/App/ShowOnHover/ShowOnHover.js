import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Container = styled.span`
  position: relative;
`
const Button = styled.span`
  border: 1px solid #000;
  border-radius: 100%;
  background-color: #000;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
`

const ChildContainer = styled.div`
  position: absolute;
  top: 0;
  left: 6px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
`

class ShowOnHover extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired
  }

  state = {
    visible: false
  }

  onClick = () => {
    this.setState(({ visible }) => ({ visible: !visible }))
  }

  show = () => {
    const { visible } = this.state
    if (!visible) {
      this.setState({ visible: true })
    }
  }

  hide = () => {
    const { visible } = this.state
    if (visible) {
      this.setState({ visible: false })
    }
  }

  render() {
    const { children } = this.props
    const { visible } = this.state
    return (
      <Container>
        <Button
          onClick={this.onClick}
          onMouseEnter={this.show}
          onMouseOut={this.hide}
        >
          i
        </Button>
        {visible ? <ChildContainer>{children}</ChildContainer> : null}
      </Container>
    )
  }
}

export default ShowOnHover
