import React, { PureComponent } from 'react'

class SearchBar extends PureComponent {
  render() {
    const { category } = this.props

    return <input placeholder={`Search for ${category}`} value="" />
  }
}

export default SearchBar
