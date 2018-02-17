import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

const db = {
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({ get: jest.fn(() => Promise.resolve({})) })),
    onSnapshot: jest.fn()
  }))
}
const auth = { onAuthStateChanged: jest.fn() }

const mockFirebase = {
  db,
  auth
}

jest.mock('./firebase', () => mockFirebase)

configure({ adapter: new Adapter() })
