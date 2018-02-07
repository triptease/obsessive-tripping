import React, { PureComponent } from 'react'

import CategorySelector from '../CategorySelector/CategorySelector'

class Filters extends PureComponent {
  state = {
    activeCategory: 'article'
  }

  setActiveCategory = activeCategory => {
    this.setState({ activeCategory })
  }

  render() {
    const { categories } = this.props
    const { activeCategory } = this.state
    return (
      <div>
        <span>Show</span>{' '}
        <CategorySelector
          activeCategory={activeCategory}
          categories={categories}
          setActiveCategory={this.setActiveCategory}
        />
      </div>
    )
  }
}

export default Filters
