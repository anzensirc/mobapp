import { saveNotes, loadNotes } from "./storage.js";

let notes = loadNotes();

export function getNotes() {
  return notes;
}

export function addNote(text) {
  notes.push({ id: Date.now(), text });
  saveNotes(notes);
}

export function deleteNote(id) {
  notes = notes.filter(note => note.id !== id);
  saveNotes(notes);
}

export function searchNotes(query) {
  return notes.filter(note =>
    note.text.toLowerCase().includes(query.toLowerCase())
  );
}
