import firebase from 'firebase-admin'
import * as Constants from './constants'

firebase.initializeApp({
  credential: firebase.credential.cert({
    projectId: Constants.PROJECT_ID,
    privateKey: Constants.PRIVATE_KEY,
    clientEmail: Constants.CLIENT_EMAIL
  })
})

export default firebase
