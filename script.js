const form = document.getElementById('noteForm');
const notesList = document.getElementById('notesList');

let notes = JSON.parse(localStorage.getItem('notes')) || [];

// Render catatan saat halaman dibuka
renderNotes();

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;

    const note = { title, content };
    notes.push(note);

    saveNotes();
    form.reset();
    renderNotes();
});

function renderNotes() {
    notesList.innerHTML = '';
    notes.forEach((note, index) => {
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('note');
        noteDiv.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <button onclick="deleteNote(${index})">Hapus</button>
        `;
        notesList.appendChild(noteDiv);
    });
}

function deleteNote(index) {
    notes.splice(index, 1);
    saveNotes();
    renderNotes();
}

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}
