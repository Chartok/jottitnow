let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

if (window.location.pathname === '/jott') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

const getJotts = () =>
  fetch('/routes/jottRoutes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const saveJott = (jott) =>
  fetch('/routes/jottRoutes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jott),
  });

const deleteJott = (id) =>
  fetch(`/routes/jottRoutes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const renderActiveJotts = () => {
  hide(saveNoteBtn);

  if (activeNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

const handleJottSave = () => {
  const newJott = {
    title: noteTitle.value,
    text: noteText.value,
  };
  saveJott(newJott).then(() => {
    getAndRenderJotts();
    renderActiveJotts();
  });
};

// Delete the clicked note
const handleJottDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const jott = e.target;
  const jottId = JSON.parse(jott.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === jottId) {
    activeNote = {};
  }

  deleteJott(jottId).then(() => {
    getAndRenderJotts();
    renderActiveJotts();
  });
};

// Sets the activeNote and displays it
const handleJottView = (e) => {
  e.preventDefault();
  activeJott = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveJotts();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewJottView = (e) => {
  activeNote = {};
  renderActiveJotts();
};

const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Render the list of note titles
const renderJottList = async (jotts) => {
  let jsonJotts = await jotts.json();
  if (window.location.pathname === '/jott') {
    jottList.forEach((el) => (el.innerHTML = ''));
  }

  let jottListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleJottView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleJottDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    jottListItems.push(createLi('No saved Jotts', false));
  }

  jsonJotts.forEach((jott) => {
    const li = createLi(note.title);
    li.dataset.jott = JSON.stringify(jott);

    jottListItems.push(li);
  });

  if (window.location.pathname === '/jott') {
    jottListItems.forEach((jott) => jottList[0].append(jott));
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderJotts = () => getJotts().then(renderJottList);

if (window.location.pathname === '/jott') {
  saveNoteBtn.addEventListener('click', handleJottSave);
  newNoteBtn.addEventListener('click', handleNewJottView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderJotts();
