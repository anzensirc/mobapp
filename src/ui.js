import { deleteNote } from "./notes.js";

export function renderNotes(notes, container) {
  container.innerHTML = "";
  notes.forEach(note => {
    const el = createNoteElement(note);
    container.appendChild(el);
  });
}

function createNoteElement(note) {
  const div = document.createElement("div");
  div.className = "note";
  div.textContent = note.text;

  const btn = document.createElement("button");
  btn.textContent = "X";
  btn.onclick = () => {
    deleteNote(note.id);
    location.reload(); // refresh supaya update
  };

  div.appendChild(btn);
  return div;
}
