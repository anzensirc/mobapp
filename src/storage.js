// Simpan & Ambil catatan dari localStorage
export function saveNotes(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

export function loadNotes() {
  const data = localStorage.getItem("notes");
  return data ? JSON.parse(data) : [];
}
