import React, { PureComponent } from 'react'

import { auth, GoogleAuthProvider } from '../../../firebase'

class Login extends PureComponent {
  onClick() {
    auth.signInWithPopup(GoogleAuthProvider).catch(function(error) {
      console.log(error)
    })
  }
  render() {
    return <button onClick={this.onClick}>Login</button>
  }
}

export default Login
