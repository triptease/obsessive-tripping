import React, { PureComponent } from 'react'

class CategorySelector extends PureComponent {
  onChange = event => {
    const { setActiveCategory } = this.props
    setActiveCategory(event.target.value)
  }
  render() {
    const { activeCategory, categories } = this.props
    return (
      <select onChange={this.onChange}>
        {categories.map(category => (
          <option selected={category === activeCategory}>{category}</option>
        ))}
      </select>
    )
  }
}

export default CategorySelector
