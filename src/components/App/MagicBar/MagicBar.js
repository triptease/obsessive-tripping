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

let id = 1
class MagicBar extends PureComponent {
  state = {
    activeCategory: 'article',
    title: ''
  }

  setActiveCategory = activeCategory => {
    this.setState({ activeCategory })
  }

  onAddObsession = () => {
    const { addObsession } = this.props
    const { activeCategory, title } = this.state
    const obsession = { id, title, category: activeCategory, score: 1 }
    addObsession(obsession)
    id++
  }

  onChange = title => {
    this.setState({ title })
  }

  render() {
    const { activeCategory, title } = this.state
    return (
      <Container>
        <CategorySelector
          activeCategory={activeCategory}
          categories={categories}
          setActiveCategory={this.setActiveCategory}
        />
        <SearchBar
          category={activeCategory}
          value={title}
          onChange={this.onChange}
        />
        <AddButton onClick={this.onAddObsession} />
      </Container>
    )
  }
}

export default MagicBar
