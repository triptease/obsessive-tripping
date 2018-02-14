import React, { PureComponent } from 'react'

import { auth } from '../../../firebase'

class Login extends PureComponent {
  onClick() {
    auth.signOut()
  }
  render() {
    return <button onClick={this.onClick}>Logout</button>
  }
}

export default Login
