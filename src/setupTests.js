const db = { collection: jest.fn(() => ({ onSnapshot: jest.fn() })) }
const auth = { onAuthStateChanged: jest.fn() }

const mockFirebase = {
  db,
  auth
}

jest.mock('./firebase', () => mockFirebase)
