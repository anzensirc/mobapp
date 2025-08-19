import { getNotes, addNote, deleteNote, searchNotes, updateNote } from "./notes.js";
import { renderNotes, toggleEmptyState, enterEditMode, exitEditMode } from "./ui.js";

/* --- Ambil elemen --- */
const noteForm = document.getElementById("noteForm");
const noteInput = document.getElementById("noteInput");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const editHint = document.getElementById("editHint");

const searchInput = document.getElementById("searchInput");
const notesList = document.getElementById("notesList");
const emptyState = document.getElementById("emptyState");

/* --- State UI --- */
let currentQuery = "";
let editingId = null;

/* --- Helper render --- */
function currentData() {
  return currentQuery ? searchNotes(currentQuery) : getNotes();
}
function refreshUI() {
  const data = currentData();
  renderNotes(data, notesList, {
    onEdit: handleStartEdit,
    onDelete: handleDelete,
  });
  toggleEmptyState(data.length === 0, emptyState);
}

/* --- Event handlers --- */
function handleStartEdit(id) {
  const note = getNotes().find(n => n.id === id);
  if (!note) return;
  editingId = id;
  enterEditMode({
    textarea: noteInput,
    submitBtn,
    cancelBtn: cancelEditBtn,
    hintEl: editHint,
    content: note.content,
  });
}

function handleDelete(id) {
  if (!confirm("Hapus catatan ini?")) return;
  deleteNote(id);
  // Jika sedang mengedit catatan yang dihapus, keluar dari edit mode
  if (editingId === id) {
    editingId = null;
    exitEditMode({ textarea: noteInput, submitBtn, cancelBtn: cancelEditBtn, hintEl: editHint });
  }
  refreshUI();
}
/* --- Theme toggle (light / dark) --- */
const THEME_KEY = "notes_app_theme";
const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-theme");
    if (themeToggle) themeToggle.checked = true;
  } else {
    document.body.classList.remove("dark-theme");
    if (themeToggle) themeToggle.checked = false;
  }
}

// default: localStorage -> system preference -> light
const savedTheme = localStorage.getItem(THEME_KEY)
  || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

applyTheme(savedTheme);

// toggle handler (simpan preferensi)
if (themeToggle) {
  themeToggle.addEventListener("change", () => {
    const newTheme = themeToggle.checked ? "dark" : "light";
    applyTheme(newTheme);
    try { localStorage.setItem(THEME_KEY, newTheme); } catch (e) { /* ignore */ }
  });
}

/* --- Init --- */
function init() {
  // Render awal
  refreshUI();

  // Submit form: tambah atau update
  noteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = noteInput.value.trim();
    if (!content) return;

    if (editingId) {
      updateNote(editingId, content);
      editingId = null;
      exitEditMode({ textarea: noteInput, submitBtn, cancelBtn: cancelEditBtn, hintEl: editHint });
    } else {
      addNote(content);
      noteInput.value = "";
    }
    refreshUI();
  });

  // Batal edit
  cancelEditBtn.addEventListener("click", () => {
    editingId = null;
    exitEditMode({ textarea: noteInput, submitBtn, cancelBtn: cancelEditBtn, hintEl: editHint });
  });

  // Pencarian realtime
  searchInput.addEventListener("input", () => {
    currentQuery = searchInput.value.trim();
    refreshUI();
  });
}

init();
