import React, { PureComponent } from 'react'

import CategorySelector from '../CategorySelector/CategorySelector'

class Filters extends PureComponent {
  render() {
    const { categories, filteredCategory, setFilteredCategory } = this.props
    return (
      <div>
        <span>Show</span>{' '}
        <CategorySelector
          activeCategory={filteredCategory}
          categories={categories}
          setActiveCategory={setFilteredCategory}
        />
      </div>
    )
  }
}

export default Filters
