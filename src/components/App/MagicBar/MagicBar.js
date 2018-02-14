import React, { PureComponent } from 'react'
import styled from 'styled-components'

import CategorySelector from '../CategorySelector/CategorySelector'
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
    activeCategory: 'article',
    title: ''
  }

  setActiveCategory = activeCategory => {
    this.setState({ activeCategory })
  }

  onAddObsession = () => {
    const { addObsession } = this.props
    const { activeCategory, title } = this.state
    const obsession = { title, category: activeCategory, score: 1 }
    addObsession(obsession)
  }

  onChange = title => {
    this.setState({ title })
  }

  onKeyDown = event => {
    if (!event) return
    if (event.key && event.key === 'Enter') {
      event.target.blur()
      event.preventDefault()
      this.onAddObsession()
    }
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
          onKeyDown={this.onKeyDown}
        />
        <AddButton onClick={this.onAddObsession} />
      </Container>
    )
  }
}

export default MagicBar
