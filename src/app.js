import { getNotes, addNote, searchNotes } from "./notes.js";
import { renderNotes } from "./ui.js";

const noteInput = document.getElementById("noteInput");
const addNoteBtn = document.getElementById("addNoteBtn");
const searchInput = document.getElementById("searchInput");
const notesList = document.getElementById("notesList");

// render awal
renderNotes(getNotes(), notesList);

// tambah catatan
addNoteBtn.addEventListener("click", () => {
  const text = noteInput.value.trim();
  if (text) {
    addNote(text);
    noteInput.value = "";
    renderNotes(getNotes(), notesList);
  }
});

// cari catatan
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();
  const results = searchNotes(query);
  renderNotes(results, notesList);
});
