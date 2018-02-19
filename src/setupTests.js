import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import fetch from 'jest-fetch-mock'
const db = {
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({ get: jest.fn(() => Promise.resolve({})) })),
    onSnapshot: jest.fn(),
    where: jest.fn()
  }))
}
const auth = { onAuthStateChanged: jest.fn() }

const mockFirebase = {
  db,
  auth
}

jest.mock('./firebase', () => mockFirebase)

global.fetch = fetch
fetch.mockResponse(JSON.stringify({}))

configure({ adapter: new Adapter() })
