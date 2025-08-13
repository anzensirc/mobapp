const form = document.getElementById('noteForm');
const notesList = document.getElementById('notesList');

let notes = [];

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;

    const note = { title, content };
    notes.push(note);

    form.reset();
    renderNotes();
});

function renderNotes() {
    notesList.innerHTML = '';
    notes.forEach((note, index) => {
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('note');
        noteDiv.innerHTML = `<h3>${note.title}</h3><p>${note.content}</p>`;
        notesList.appendChild(noteDiv);
    });
}
