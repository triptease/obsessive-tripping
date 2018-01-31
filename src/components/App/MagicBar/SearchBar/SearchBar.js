import React, { PureComponent } from 'react'

class SearchBar extends PureComponent {
  onChange = event => {
    const rawValue = event.target.value
    const suffix = rawValue.lastIndexOf(' ') + 1 === rawValue.length ? ' ' : ''
    const value = event.target.value.trim() + suffix
    if (value !== this.props.value) {
      const { onChange } = this.props
      onChange(value)
    }
  }

  render() {
    const { category, value } = this.props

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
