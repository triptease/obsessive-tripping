import { shallow } from 'enzyme'
import React from 'react'

import Obsession, { DeleteButton } from './Obsession'

describe('Obsession', () => {
  it('renders', () => {
    const component = shallow(
      <Obsession
        id="ID0001"
        title="TDD"
        userId="User0001"
        submitterId="User0001"
      />
    )
    expect(component).toMatchSnapshot()
  })

  it('does not display delete button when the user is not logged in', () => {
    const component = shallow(<Obsession id="ID0001" title="TDD" />)
    expect(component.find(DeleteButton).length).toBe(0)
  })

  it('does not display delete button when the user is not the submitter', () => {
    const component = shallow(
      <Obsession
        id="ID0001"
        title="TDD"
        userId="User0001"
        submitterId="User0002"
      />
    )
    expect(component.find(DeleteButton).length).toBe(0)
  })

  it('displays delete button when the user is the submitter', () => {
    const component = shallow(
      <Obsession
        id="ID0001"
        title="TDD"
        userId="User0001"
        submitterId="User0001"
      />
    )
    expect(component.find(DeleteButton).length).toBe(1)
  })

  it('calls its `onDelete` with its id when the delete button is clicked', () => {
    const onDelete = jest.fn()
    const component = shallow(
      <Obsession
        id="ID0001"
        title="TDD"
        onDelete={onDelete}
        userId="User0001"
        submitterId="User0001"
      />
    )
    component.find(DeleteButton).simulate('click')
    expect(onDelete).toBeCalledWith('ID0001')

    component.setProps({ id: 'different-id' })
    component.find(DeleteButton).simulate('click')
    expect(onDelete).toBeCalledWith('different-id')
  })
})
