import { shallow } from 'enzyme'
import React from 'react'

import Obsession from './Obsession'

describe('Obsession', () => {
  it('renders', () => {
    const component = shallow(<Obsession />)
    expect(component).toBeDefined()
  })
})
