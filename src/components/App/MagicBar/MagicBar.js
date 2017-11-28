import React, { PureComponent } from 'react'
import styled from 'styled-components'

import CategorySelector from './CategorySelector/CategorySelector'
import SearchBar from './SearchBar/SearchBar'
import AddButton from './AddButton/AddButton'

const Container = styled.section`
  display: flex;
`

class MagicBar extends PureComponent {
  render() {
    return (
      <Container>
        <CategorySelector />
        <SearchBar />
        <AddButton />
      </Container>
    )
  }
}

export default MagicBar
