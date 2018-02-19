const admin = require('firebase-admin')
const functions = require('firebase-functions')

admin.initializeApp(functions.config().firebase)

const db = admin.firestore()

exports.default = functions.firestore
  .document('votes/{voteId}')
  .onWrite(event => {
    let obsessionRef
    let value
    if (event.data.exists) {
      const data = event.data.data()
      const previousData = event.data.previous.data()
      if (data.value === previousData.value) {
        // already voted with the same value.
        return 0
      }

      obsessionRef = data.obsessionRef
      value = data.value
    } else {
      const data = event.data.previous.data()
      obsessionRef = data.obsessionRef
      value = -data.value
    }

    return db
      .runTransaction(t =>
        t.get(obsessionRef).then(doc => {
          const score = doc.data().score + value
          return t.update(obsessionRef, { score })
        })
      )
      .catch(err => {
        console.log('Voting transaction failure:', err)
      })
  })
