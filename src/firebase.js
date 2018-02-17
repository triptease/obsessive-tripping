import firebase from 'firebase'
import 'firebase/firestore'

if (!process.env.REACT_APP_FIREBASE_API_KEY) {
  throw new Error('No Firebase API key configured!')
}

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'obsessive-trippin.firebaseapp.com',
  projectId: 'obsessive-trippin'
})

export const GoogleAuthProvider = new firebase.auth.GoogleAuthProvider()
export const auth = firebase.auth()

export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp()
export const db = firebase.firestore()
