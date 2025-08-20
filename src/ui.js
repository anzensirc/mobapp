export function renderNotes(notes, container, { onEdit, onDelete } = {}) {
  container.innerHTML = "";

  if (!notes.length) return;

  const frag = document.createDocumentFragment();

  for (const note of notes) {
    const card = document.createElement("article");
    card.className = "note";
    card.dataset.id = String(note.id);

    const kategoriEl = document.createElement("p");
    kategoriEl.innerHTML = `<strong>Kategori :</strong> ${note.kategori || "Lainnya"}`;

    const contentEl = document.createElement("p");
    contentEl.innerHTML = `<strong>Catatan :</strong> ${note.content}`;

    const toolbar = document.createElement("div");
    toolbar.className = "note-toolbar";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "icon-btn";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => onEdit?.(note.id));

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "icon-btn danger";
    delBtn.textContent = "Hapus";
    delBtn.addEventListener("click", () => onDelete?.(note.id));

    toolbar.append(editBtn, delBtn);
    card.append(kategoriEl, contentEl, toolbar);
    frag.append(card);
  }

  container.append(frag);
}

/** Empty state toggle */
export function toggleEmptyState(isEmpty, emptyEl) {
  emptyEl.hidden = !isEmpty;
}

/** Masuk ke mode edit */
export function enterEditMode({ textarea, submitBtn, cancelBtn, hintEl, content }) {
  textarea.value = content;
  textarea.focus();
  submitBtn.textContent = "Update";
  cancelBtn.hidden = false;
  hintEl.hidden = false;
}

/** Keluar dari mode edit */
export function exitEditMode({ textarea, submitBtn, cancelBtn, hintEl }) {
  textarea.value = "";
  submitBtn.textContent = "Tambah";
  cancelBtn.hidden = true;
  hintEl.hidden = true;
}