import {
  getNotes,
  addNote,
  deleteNote,
  searchNotes,
  updateNote,
  FIXED_CATEGORIES
} from "./notes.js";
import {
  renderNotes,
  toggleEmptyState,
  enterEditMode,
  exitEditMode
} from "./ui.js";

/* --- Ambil elemen --- */
const noteForm = document.getElementById("noteForm");
const noteInput = document.getElementById("noteInput");
const categoryInput = document.getElementById("noteCategory"); // sekarang <select>
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const editHint = document.getElementById("editHint");

const searchInput = document.getElementById("searchInput");
const notesList = document.getElementById("notesList");
const emptyState = document.getElementById("emptyState");

// filter kategori (optional dropdown di UI)
const categoryFilter = document.getElementById("categoryFilter");

/* --- State UI --- */
let currentQuery = "";
let currentCategoryFilter = null;
let editingId = null;

/* --- Helper render --- */
function currentData() {
  return currentQuery || currentCategoryFilter
    ? searchNotes(currentQuery, currentCategoryFilter)
    : getNotes();
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
  if (categoryInput) categoryInput.value = note.kategori || FIXED_CATEGORIES[0];
}

function handleDelete(id) {
  if (!confirm("Hapus catatan ini?")) return;
  deleteNote(id);
  if (editingId === id) {
    editingId = null;
    exitEditMode({ textarea: noteInput, submitBtn, cancelBtn: cancelEditBtn, hintEl: editHint });
    if (categoryInput) categoryInput.value = FIXED_CATEGORIES[0];
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

function populateCategorySelect() {
  if (!categoryInput) return;
  categoryInput.innerHTML = "";
  FIXED_CATEGORIES.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryInput.appendChild(opt);
  });
}

// default: localStorage -> system preference -> light
const savedTheme = localStorage.getItem(THEME_KEY)
  || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener("change", () => {
    const newTheme = themeToggle.checked ? "dark" : "light";
    applyTheme(newTheme);
    try { localStorage.setItem(THEME_KEY, newTheme); } catch (e) { /* ignore */ }
  });
}

/* --- Init --- */
function init() {
  populateCategorySelect();
  refreshUI();

  // Submit form
  noteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = noteInput.value.trim();
    const kategori = categoryInput ? categoryInput.value : FIXED_CATEGORIES[0];
    if (!content) return;

    if (editingId) {
      updateNote(editingId, content, kategori);
      editingId = null;
      exitEditMode({ textarea: noteInput, submitBtn, cancelBtn: cancelEditBtn, hintEl: editHint });
      if (categoryInput) categoryInput.value = FIXED_CATEGORIES[0];
    } else {
      addNote(content, kategori);
      noteInput.value = "";
      if (categoryInput) categoryInput.value = FIXED_CATEGORIES[0];
    }
    refreshUI();
  });

  // Batal edit
  cancelEditBtn.addEventListener("click", () => {
    editingId = null;
    exitEditMode({ textarea: noteInput, submitBtn, cancelBtn: cancelEditBtn, hintEl: editHint });
    if (categoryInput) categoryInput.value = FIXED_CATEGORIES[0];
  });

  // Pencarian realtime
  searchInput.addEventListener("input", () => {
    currentQuery = searchInput.value.trim();
    refreshUI();
  });

  // Filter kategori (jika ada select di HTML)
  if (categoryFilter) {
    categoryFilter.innerHTML = "<option value=''>Semua</option>";
    FIXED_CATEGORIES.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      categoryFilter.appendChild(opt);
    });

    categoryFilter.addEventListener("change", () => {
      currentCategoryFilter = categoryFilter.value || null;
      refreshUI();
    });
  }
}

init();
