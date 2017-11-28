import React, { PureComponent } from 'react'
import styled from 'styled-components'

import CategorySelector from './CategorySelector/CategorySelector'
import SearchBar from './SearchBar/SearchBar'
import AddButton from './AddButton/AddButton'

const Container = styled.section`
  display: flex;
  padding: 1rem 0;
  align-items: center;
`

const categories = ['book', 'film', 'article', 'podcast']

class MagicBar extends PureComponent {
  state = {
    activeCategory: 'article'
  }

  setActiveCategory = activeCategory => {
    this.setState({ activeCategory })
  }

  render() {
    const { activeCategory } = this.state
    return (
      <Container>
        <CategorySelector
          activeCategory={activeCategory}
          categories={categories}
          setActiveCategory={this.setActiveCategory}
        />
        <SearchBar category={activeCategory} />
        <AddButton />
      </Container>
    )
  }
}

export default MagicBar
