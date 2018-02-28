import { shallow } from 'enzyme'
import React from 'react'

import Obsession, { DeleteButton } from './Obsession'

describe('Obsession', () => {
  it('renders', () => {
    const component = shallow(<Obsession id="ID0001" title="TDD" />)
    expect(component).toMatchSnapshot()
  })

  it('calls its `onDelete` with its id when the delete button is clicked', () => {
    const onDelete = jest.fn()
    const component = shallow(
      <Obsession id="ID0001" title="TDD" onDelete={onDelete} />
    )
    component.find(DeleteButton).simulate('click')
    expect(onDelete).toBeCalledWith('ID0001')

    component.setProps({ id: 'different-id' })
    component.find(DeleteButton).simulate('click')
    expect(onDelete).toBeCalledWith('different-id')
  })
})
