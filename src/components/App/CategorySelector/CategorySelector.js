import React, { PureComponent } from 'react'

class CategorySelector extends PureComponent {
  onChange = event => {
    const { setActiveCategory } = this.props
    setActiveCategory(event.target.value)
  }
  render() {
    const { activeCategory, categories } = this.props
    return (
      <select onChange={this.onChange} value={activeCategory}>
        {categories.map(category => <option key={category}>{category}</option>)}
      </select>
    )
  }
}

export default CategorySelector
