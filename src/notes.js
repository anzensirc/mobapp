import { saveNotes, loadNotes } from "./storage.js";

/** State internal (hanya dimodifikasi lewat fungsi di file ini) */
let notes = loadNotes();

/** Dapatkan seluruh catatan (array referensi aman untuk dibaca) */
export function getNotes() {
  return notes;
}

/** Tambah catatan baru */
export function addNote(content) {
  const trimmed = String(content ?? "").trim();
  if (!trimmed) return null;

  const note = {
    id: Date.now(),
    content: trimmed,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  notes.push(note);
  saveNotes(notes);
  return note;
}

/** Update isi catatan berdasarkan id */
export function updateNote(id, newContent) {
  const idx = notes.findIndex(n => n.id === id);
  if (idx === -1) return false;
  const trimmed = String(newContent ?? "").trim();
  if (!trimmed) return false;

  notes[idx] = {
    ...notes[idx],
    content: trimmed,
    updatedAt: new Date().toISOString(),
  };
  saveNotes(notes);
  return true;
}

/** Hapus catatan berdasarkan id */
export function deleteNote(id) {
  const before = notes.length;
  notes = notes.filter(n => n.id !== id);
  const changed = notes.length !== before;
  if (changed) saveNotes(notes);
  return changed;
}

/** Cari catatan (case-insensitive) */
export function searchNotes(query) {
  const q = String(query ?? "").toLowerCase();
  if (!q) return notes;
  return notes.filter(n => n.content.toLowerCase().includes(q));
}
