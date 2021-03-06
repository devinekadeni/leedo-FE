import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import { FirebaseConfig, Response, Where, Operator } from './types'

const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DB_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MSG_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()
const firestore = firebase.firestore()

export const registerByEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<unknown> => {
  try {
    await auth.createUserWithEmailAndPassword(email, password)
    const user = auth.currentUser
    user?.updateProfile({ displayName })

    return user
  } catch (error) {
    return error
  }
}

export const loginByEmail = (email: string, password: string): Promise<unknown> => {
  return auth.signInWithEmailAndPassword(email, password)
}

export const getDataByCollection = async (
  collection: string,
  where?: Where
): Promise<Response[]> => {
  const response: Response[] = []
  let querySnapshot

  if (where) {
    const { field, operator, value } = where
    querySnapshot = await firestore
      .collection(collection)
      .where(field, operator, value)
      .get()
  } else {
    querySnapshot = await firestore.collection(collection).get()
  }

  querySnapshot.forEach((doc) => {
    const data = { id: doc.id, ...doc.data() }
    response.push(data)
  })

  return response
}

export const getDataById = async (
  collection: string,
  id: string
): Promise<Response | undefined> => {
  const doc = await firestore.collection(collection).doc(id).get()

  if (doc.exists) {
    return doc.data()
  }

  return {}
}

export const updateDataById = async (
  collection: string,
  id: string,
  payload: { [key: string]: unknown }
): Promise<void> => {
  firestore.collection(collection).doc(id).update(payload)
}

export const addDataByCollection = (
  collection: string,
  payload: { [key: string]: unknown }
): Promise<any> => {
  return firestore.collection(collection).add(payload)
}

export { auth, firestore, Operator }
export default firebase
