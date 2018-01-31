import React, { PureComponent } from 'react'

class AddButton extends PureComponent {
  render() {
    const { onClick } = this.props
    return <button onClick={onClick}>+</button>
  }
}

export default AddButton
