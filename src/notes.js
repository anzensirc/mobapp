import { saveNotes, loadNotes } from "./storage.js";

// Daftar kategori fix
export const FIXED_CATEGORIES = [
  "Pekerjaan",
  "Pribadi",
  "Belajar",
  "Belanja",
  "Lainnya",
];

/** State internal */
let notes = loadNotes();

/** Getter aman */
export function getNotes() {
  return notes;
}

/** Tambah catatan */
export function addNote(content, kategori = "Umum") {
  const trimmed = String(content ?? "").trim();
  if (!trimmed) return null;

  const note = {
    id: Date.now(),
    content: trimmed,
    kategori: kategori || "Umum",   // kategori baru
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  notes.push(note);
  saveNotes(notes);
  return note;
}

/** Update catatan */
export function updateNote(id, newContent, newKategori) {
  const idx = notes.findIndex(n => n.id === id);
  if (idx === -1) return false;

  const trimmed = String(newContent ?? "").trim();
  if (!trimmed) return false;

  notes[idx] = {
    ...notes[idx],
    content: trimmed,
    kategori: newKategori || notes[idx].kategori, // bisa ganti kategori
    updatedAt: new Date().toISOString(),
  };
  saveNotes(notes);
  return true;
}

/** Hapus catatan */
export function deleteNote(id) {
  const before = notes.length;
  notes = notes.filter(n => n.id !== id);
  const changed = notes.length !== before;
  if (changed) saveNotes(notes);
  return changed;
}

/** Cari catatan */
/** Cari catatan */
export function searchNotes(query, kategori = null) {
  const q = String(query ?? "").toLowerCase();
  let results = notes;

  if (q) {
    results = results.filter(n => n.content.toLowerCase().includes(q));
  }

  if (kategori) {
    results = results.filter(
      n => (n.kategori ?? "Umum").toLowerCase() === kategori.toLowerCase()
    );
  }

  return results;
}

/** Tambah kategori baru */
/** Ambil semua kategori unik dari catatan */
export function getCategories() {
  const unique = [...new Set(notes.map(n => n.kategori || "Umum"))];
  return unique.sort();
}
