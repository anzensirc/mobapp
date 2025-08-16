const form = document.getElementById('noteForm');
const notesList = document.getElementById('notesList');
const searchInput = document.getElementById('searchInput');

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
    renderNotes(searchInput.value);
});

// Pencarian real-time
searchInput.addEventListener('input', () => {
    renderNotes(searchInput.value);
});

function renderNotes(query = '') {
    notesList.innerHTML = '';
    notes
        .filter(note => 
            note.title.toLowerCase().includes(query.toLowerCase()) || 
            note.content.toLowerCase().includes(query.toLowerCase())
        )
        .forEach((note, index) => {
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
    renderNotes(searchInput.value);
}

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}
