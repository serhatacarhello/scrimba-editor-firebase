// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { collection, getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDOCDSareMit5mBjGfvW1F8bWXCznn6K1Y',
  authDomain: 'scrimba-editor.firebaseapp.com',
  projectId: 'scrimba-editor',
  storageBucket: 'scrimba-editor.appspot.com',
  messagingSenderId: '226228670035',
  appId: '1:226228670035:web:1f58c1f9b6433fdbdb80a6',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
//Initialize Firestore
export const db = getFirestore(app)
export const notesCollection = collection(db, 'notes')
