import React, { PureComponent } from 'react'

import { auth, db, GoogleAuthProvider } from '../../../firebase'

class Login extends PureComponent {
  onClick() {
    auth
      .signInWithPopup(GoogleAuthProvider)
      .then(response => {
        const { user: { displayName, email, photoURL, uid } } = response
        db
          .collection('users')
          .doc(uid)
          .set({ displayName, email, photoURL }, { merge: true })
      })
      .catch(function(error) {
        console.log(error)
      })
  }
  render() {
    return <button onClick={this.onClick}>Login</button>
  }
}

export default Login
