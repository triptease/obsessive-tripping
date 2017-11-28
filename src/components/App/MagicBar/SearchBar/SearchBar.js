import React, { PureComponent } from 'react'

class SearchBar extends PureComponent {
  state = {
    value: 's'
  }

  onChange = event => {
    this.setState({ value: event.target.value })
  }

  render() {
    const { category } = this.props
    const { value } = this.state

    return (
      <input
        placeholder={`Search for ${category}`}
        value={value}
        onChange={this.onChange}
      />
    )
  }
}

export default SearchBar
