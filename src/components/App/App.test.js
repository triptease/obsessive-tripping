import React from 'react'
import { mount, shallow } from 'enzyme'

import App from './App'
import { db } from '../../firebase'

it('renders without crashing', () => {
  mount(<App />)
})

describe('getCategoriesCounts', () => {
  it('returns an object with keys of all the categories in the given obsessions', () => {
    const result = App.getCategoriesCounts({
      abc: { id: 'abc', category: 'film' }
    })
    expect(Object.keys(result)).toEqual(['film'])

    const obsessions = {
      abc: { id: 'abc', category: 'book' },
      edf: { id: 'edf', category: 'book' },
      qwe: { id: 'qwe', category: 'film' },
      asd: { id: 'asd', category: 'podcast' },
      zxc: { id: 'zxc', category: 'book' },
      poi: { id: 'poi', category: 'film' }
    }
    const resultB = App.getCategoriesCounts(obsessions)
    expect(Object.keys(resultB)).toEqual(['book', 'film', 'podcast'])
  })

  it('returns the counts of the existing categories', () => {
    const result = App.getCategoriesCounts({
      abc: { id: 'abc', category: 'film' }
    })
    expect(result.film).toBe(1)

    const obsessions = {
      abc: { id: 'abc', category: 'book' },
      edf: { id: 'edf', category: 'book' },
      qwe: { id: 'qwe', category: 'film' },
      asd: { id: 'asd', category: 'podcast' },
      zxc: { id: 'zxc', category: 'book' },
      poi: { id: 'poi', category: 'film' }
    }
    const resultB = App.getCategoriesCounts(obsessions)
    expect(resultB.book).toBe(3)
    expect(resultB.film).toBe(2)
    expect(resultB.podcast).toBe(1)
  })
})

describe('handleAuthUser', () => {
  let component

  beforeEach(() => {
    component = shallow(<App />)
  })

  describe('when not given a user', () => {
    it('sets state to not loading auth', () => {
      expect(component.state('isLoadingAuth')).toBe(true)

      component.instance().handleAuthUser()

      expect(component.state('isLoadingAuth')).toBe(false)
    })

    it('unsets the current user id', () => {
      component.instance().handleAuthUser()

      expect(component.state('currentUserId')).toBeUndefined()

      component.setState({ currentUserId: 'timmyTester' })

      component.instance().handleAuthUser()

      expect(component.state('currentUserId')).toBeUndefined()
    })
  })

  describe('when given a user', () => {
    let mockDoc
    let mockUser

    beforeAll(() => {
      fetch.mockResponse(
        JSON.stringify({
          ok: true,
          user: { id: 'slackId', team_id: 'slackTeamId' }
        })
      )
    })

    beforeEach(() => {
      mockUser = {
        displayName: 'Timmy Tester',
        photoURL: 'http://someurl.png',
        email: 'timmy@tester.com'
      }
      mockDoc = jest.fn(id => ({
        get: jest.fn(() =>
          Promise.resolve({
            id,
            data: jest.fn(() => mockUser)
          })
        ),
        update: jest.fn(() => Promise.resolve())
      }))
      db.collection.mockReturnValue({
        doc: mockDoc,
        onSnapshot: jest.fn()
      })
    })

    it('gets information on the given auth user from the db', () => {
      const authUser = { uid: 'timmyTester' }

      component.instance().handleAuthUser(authUser)

      expect(db.collection).toBeCalledWith('users')
      expect(mockDoc).toBeCalledWith('timmyTester')

      db.collection.mockClear()
      const authUserB = { uid: 'another-user' }

      component.instance().handleAuthUser(authUserB)

      expect(db.collection).toBeCalledWith('users')
      expect(mockDoc).toBeCalledWith('another-user')
    })

    it('sets the current user id to that of the given authUser', async () => {
      expect(component.state('currentUserId')).toBeUndefined()

      const authUser = { uid: 'timmyTester' }

      await component.instance().handleAuthUser(authUser)

      expect(component.state('currentUserId')).toBe('timmyTester')
    })

    it('sets state to not loading auth', async () => {
      expect(component.state('isLoadingAuth')).toBe(true)

      const authUser = { uid: 'timmyTester' }

      await component.instance().handleAuthUser(authUser)

      expect(component.state('isLoadingAuth')).toBe(false)
    })

    it('adds the auth user to the users list, adding slack info as soon as it gets it', async () => {
      const authUser = { uid: 'timmyTester' }

      await component.instance().handleAuthUser(authUser)

      expect(component.state('users')).toEqual({
        timmyTester: {
          displayName: 'Timmy Tester',
          email: 'timmy@tester.com',
          id: 'timmyTester',
          photoURL: 'http://someurl.png'
        }
      })

      const authUserB = { uid: 'mrBithels' }

      Object.assign(mockUser, {
        displayName: 'Mr. Bithels',
        photoURL: 'http://austria.gif',
        email: 'labith@austria.at'
      })

      await component.instance().handleAuthUser(authUserB)

      expect(component.state('users')).toEqual({
        mrBithels: {
          displayName: 'Mr. Bithels',
          photoURL: 'http://austria.gif',
          email: 'labith@austria.at',
          id: 'mrBithels'
        },
        timmyTester: {
          displayName: 'Timmy Tester',
          email: 'timmy@tester.com',
          id: 'timmyTester',
          photoURL: 'http://someurl.png',
          slack: {
            id: 'slackId',
            teamId: 'slackTeamId'
          }
        }
      })
    })
  })
})

describe('addDocsToUsers', () => {
  let component

  beforeEach(() => {
    component = shallow(<App />)
  })

  it('adds given docs to users state', () => {
    expect(component.state('users')).toEqual({})

    const docs = [
      { id: 'me', data: jest.fn(() => ({ displayName: 'The Goddamn Batman' })) }
    ]
    component.instance().addDocsToUsers(docs)

    expect(component.state('users')).toEqual({
      me: { displayName: 'The Goddamn Batman', id: 'me' }
    })

    const docsB = [
      {
        id: 'anotherSubmitter',
        data: jest.fn(() => ({ displayName: 'Izzy' }))
      },
      { id: 'elena', data: jest.fn(() => ({ displayName: 'Elena Example' })) }
    ]
    component.instance().addDocsToUsers(docsB)

    expect(component.state('users')).toEqual({
      me: { displayName: 'The Goddamn Batman', id: 'me' },
      anotherSubmitter: { displayName: 'Izzy', id: 'anotherSubmitter' },
      elena: { displayName: 'Elena Example', id: 'elena' }
    })
  })

  it('overwrites existing users in the state', () => {
    component.setState({
      users: {
        me: { displayName: 'The Goddamn Batman', id: 'me' },
        anotherSubmitter: { displayName: 'Izzy', id: 'anotherSubmitter' },
        elena: { displayName: 'Elena Example', id: 'elena' }
      }
    })

    const docs = [
      {
        id: 'me',
        data: jest.fn(() => ({
          displayName: 'Bruce Wayne',
          photoURL: 'thebat.png'
        }))
      }
    ]
    component.instance().addDocsToUsers(docs)

    expect(component.state('users')).toEqual({
      me: { displayName: 'Bruce Wayne', photoURL: 'thebat.png', id: 'me' },
      anotherSubmitter: { displayName: 'Izzy', id: 'anotherSubmitter' },
      elena: { displayName: 'Elena Example', id: 'elena' }
    })
  })
})
