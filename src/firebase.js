import firebase from 'firebase'
import 'firebase/firestore'

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'obsessive-trippin.firebaseapp.com',
  projectId: 'obsessive-trippin'
})

export const db = firebase.firestore()
