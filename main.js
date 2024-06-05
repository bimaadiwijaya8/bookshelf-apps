const saveStorage = 'STORAGE';
const data = [];
const change = new Event('change');

document.addEventListener('DOMContentLoaded', function () {
    loadData();
    const inputBook = document.getElementById('inputBook');
    inputBook.addEventListener('submit', function (e) {
        e.preventDefault();
        input();
    });
});

function input() {
    const inputBookTitle = document.getElementById('inputBookTitle').value;
    const inputBookAuthor = document.getElementById('inputBookAuthor').value;
    const inputBookYear = document.getElementById('inputBookYear').value;
    const inputBookIsComplete = document.getElementById('inputBookIsComplete').checked;
    const id = generateId();
    const object = dataInput(id, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);

    data.push(object);
    saveData();

    document.dispatchEvent(change);
}

function dataInput(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year: parseInt(year),
        isComplete
    };
}

function generateId() {
    return +new Date();
}

function saveData() {
    if (storage()) {
        const parsed = JSON.stringify(data);
        localStorage.setItem(saveStorage, parsed);
    }
}

function storage() {
    if (typeof (Storage) === undefined) {
        alert('SALAH');
        return false;
    }
    return true;
}

document.addEventListener('change', function() {
    const task = document.getElementById('incompleteBookshelfList');
    task.innerHTML = '';
    
    const done = document.getElementById('completeBookshelfList');
    done.innerHTML = '';

    for (const next of data) {
        const nextData = buatBuku(next);
        if (!next.isComplete)
            task.append(nextData);
        else
            done.append(nextData);
    }
});

function buatBuku (todo) {
    const title = document.createElement('h3');
    title.innerText = todo.title;

    const author = document.createElement('p');
    author.innerText = "Penulis: " + todo.author;

    const year = document.createElement('p');
    year.innerText = "Tahun: " + todo.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('book_item');
    textContainer.append(title, author, year);

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(textContainer);
    container.setAttribute('id', `todo-${todo.id}`);

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action');
    container.append(actionContainer);

    if (!todo.isComplete) {
        const completeButton = document.createElement('button');
        completeButton.innerText = 'Selesai dibaca';
        completeButton.classList.add('green');
        completeButton.addEventListener('click', function() {
            taskComplete(todo.id);
        });

        const removeButton = document.createElement('button');
        removeButton.innerText = 'Hapus buku';
        removeButton.classList.add('red');
        removeButton.addEventListener('click', function () {
            taskRemove(todo.id);
        });

        actionContainer.append(completeButton, removeButton);
    } else {
        const incompleteButton = document.createElement('button');
        incompleteButton.innerText = 'Belum selesai dibaca';
        incompleteButton.classList.add('green');
        incompleteButton.addEventListener('click', function() {
            taskIncomplete(todo.id);
        });

        const removeButton = document.createElement('button');
        removeButton.innerText = 'Hapus buku';
        removeButton.classList.add('red');
        removeButton.addEventListener('click', function () {
            taskRemove(todo.id);
        });

        actionContainer.append(incompleteButton, removeButton);
    }

    return container;
}

function taskComplete(id) {
    const todo = data.find(item => item.id === id);
    if (todo) {
        todo.isComplete = true;
        saveData();
        document.dispatchEvent(change);
    }
}

function taskIncomplete(id) {
    const todo = data.find(item => item.id === id);
    if (todo) {
        todo.isComplete = false;
        saveData();
        document.dispatchEvent(change);
    }
}

function taskRemove(id) {
    const todoIndex = data.findIndex(item => item.id === id);
    if (todoIndex !== -1) {
        data.splice(todoIndex, 1);
        saveData();
        document.dispatchEvent(change);
    }
}

document.addEventListener('change', function () {
    const unfinished = document.getElementById('incompleteBookshelfList');
    unfinished.innerHTML = '';

    const complete = document.getElementById('completeBookshelfList');
    complete.innerHTML = '';

    for (const todoItem of data) {
        const newTodo = buatBuku(todoItem);
        if (!todoItem.isComplete) {
            unfinished.append(newTodo);
        } else {
            complete.append(newTodo);
        }
    }
});

function loadData() {
  if (storage()) {
      const savedData = localStorage.getItem(saveStorage);
      if (savedData) {
          data.push(...JSON.parse(savedData));
          document.dispatchEvent(change);
      }
  }
}

document.getElementById('searchBook').addEventListener('submit', function (event) {
    event.preventDefault();
    const searchTitle = document.getElementById('searchBookTitle').value;
    cariBuku(searchTitle);
});

function cariBuku(kataKunci) {
    const parse = JSON.parse(localStorage.getItem(saveStorage)) || [];
    const filter = parse.filter(book =>
        book.title.toLowerCase().includes(kataKunci.toLowerCase())
    );

    const task = document.getElementById('incompleteBookshelfList');
    task.innerHTML = '';
    const done = document.getElementById('completeBookshelfList');
    done.innerHTML = '';

    for (const next of filter) {
        const nextData = buatBuku(next);
        if (!next.isComplete)
            task.append(nextData);
        else
            done.append(nextData);
    }
}
