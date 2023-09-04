import React, { useEffect, useMemo, useState } from 'react'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import Split from 'react-split'
// import { nanoid } from 'nanoid'
import {
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { db, notesCollection } from './firebase'

export default function App() {
  const [notes, setNotes] = React.useState([])
  const [currentNoteId, setCurrentNoteId] = React.useState('')
  const [tempNoteText, setTempNoteText] = useState('')
  const [sortedNotes, setSortedNotes] = useState([])

  const currentNote =
    notes.find((note) => note.id === currentNoteId) || notes[0]

  useEffect(() => {
    const sorted = notes?.sort((a, b) => b.updatedAt - a.updatedAt)
    setSortedNotes(sorted)
  }, [currentNoteId])

  React.useEffect(() => {
    const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
      // Sync up our local notes array with the snapshot data
      console.log(' things are changing')
      const notesArr = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      setNotes(notesArr)
    })

    return () => unsubscribe()
  }, [])

  React.useEffect(() => {
    if (!currentNoteId) setCurrentNoteId(notes[0]?.id)
  }, [notes])

  React.useEffect(() => {
    if (currentNote) setTempNoteText(currentNote.body)
  }, [currentNote])

  /*
   * Create a new note and add it to the notes collection.
   * If successful, set the current note ID.
   */

  async function createNewNote() {
    const newNote = {
      body: 'Hello! This is a sample note.',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    try {
      // addDoc(where, what)
      const newNoteRef = await addDoc(notesCollection, newNote)

      setCurrentNoteId(newNoteRef.id)
    } catch (error) {
      console.log(
        `An error has occurred when creating a new note : ${error.message}`
      )
    }
  }

  async function updateNote(text) {
    const docRef = doc(db, 'notes', currentNoteId)
    try {
      await setDoc(
        docRef,
        { body: text, updatedAt: serverTimestamp() },
        { merge: true }
      )
      console.log('doc updated', currentNoteId)
    } catch (error) {
      console.log('error update:', error.message)
    }
  }

  async function deleteNote(noteId) {
    // setNotes((oldNotes) => oldNotes.filter((note) => note.id !== noteId))
    try {
      const docRef = doc(db, 'notes', noteId)
      await deleteDoc(docRef)
      console.log('doc deleted', noteId)
    } catch (error) {
      console.log(`An error has occurred when deleting data: ${error.message}`)
    }
  }

  //Debouncing logic
  React.useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (tempNoteText !== currentNote.body) {
        updateNote(tempNoteText)
      }
    }, 500)
    return () => clearTimeout(timeOutId)
  }, [tempNoteText])

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={sortedNotes}
            currentNote={currentNote}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          <Editor
            tempNoteText={tempNoteText}
            setTempNoteText={setTempNoteText}
          />
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  )
}
