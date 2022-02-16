const books = [];
const RENDER_EVENT = 'render-book';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');

    submitForm.addEventListener('submit', function () {
        alert('Buku berhasil ditambahkan');
        addBook();
    })
})


function addBook() {
    const inputBookTitle = document.getElementById('inputBookTitle').value;
    const inputBookAuthor = document.getElementById('inputBookAuthor').value;
    const inputBookYear = document.getElementById('inputBookYear').value;
    const inputBookIsComplete = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete, false);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
}


function generateId() {
    return +new Date();
}


function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}


function findBook(bookId) {
    for (bookItem of books) {
        if (bookItem.id == bookId) {
            return bookItem;
        }
    }

    return null;
}


function findBookIndex(bookId) {
    for (index in books) {
        if (books[index].id == bookId) {
            return index;
        }
    }

    return -1;
}


function addBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
}


function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
}


function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget === null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
}


function makeBook(bookObject) {
    const bookTitle = document.createElement('h3');
    bookTitle.classList.add('md:text-lg', 'inline-block', 'text-md');
    bookTitle.innerText = bookObject.title;

    const bookAuthor = document.createElement('p');
    bookAuthor.classList.add('md:text-sm', 'text-gray-700', 'italic', 'inline-block',
        'text-xs');
    bookAuthor.innerText = bookObject.author;

    const bookYear = document.createElement('p');
    bookYear.classList.add('md:text-sm', 'text-gray-700', 'inline-block', 'text-xs');
    bookYear.innerText = bookObject.year;

    const articleItem = document.createElement('div');
    articleItem.classList.add('flex', 'flex-col', 'space-y-1')
    articleItem.append(bookTitle, bookAuthor, bookYear);

    const bookContainer = document.createElement('article');
    bookContainer.classList.add('book_item', 'rounded-t-md', 'p-4', 'border-b-2', 'border-black', 'shadow-lg', 'shadow-indigo-200/60', 'flex', 'items-center', 'justify-between', 'space-x-6');
    bookContainer.append(articleItem);
    bookContainer.setAttribute('id', `book-${bookObject.id}`);

    const action = document.createElement('div');
    action.classList.add('action', 'flex', 'flex-col', 'space-y-4');


    if (bookObject.isCompleted) {
        const unfinishedButton = document.createElement('button');
        unfinishedButton.innerText = "Belum selesai dibaca";
        unfinishedButton.classList.add('green', 'text-xs', 'border-2', 'border-black', 'rounded-md', 'px-2', 'py-1', 'font-medium', 'shadow-lg', 'shadow-yellow-200/60', 'hover:-translate-y-1', 'hover:scale-10', 'transition', 'duration-300');
        unfinishedButton.addEventListener('click', function () {
            undoBookFromCompleted(bookObject.id);
        });

        const removeButton = document.createElement('button');
        removeButton.innerHTML = "Hapus buku";
        removeButton.classList.add('red', 'text-xs', 'border-2', 'border-black', 'rounded-md', 'px-2', 'py-1', 'font-medium', 'shadow-lg', 'shadow-red-200/60', 'hover:-translate-y-1', 'hover:scale-10', 'transition', 'duration-300');
        removeButton.addEventListener('click', function () {
            if (confirm("Apakah Anda yakin ingin menghapus buku " + bookObject.title + "?") == true) {
                removeBookFromCompleted(bookObject.id);
            }
        });

        action.append(unfinishedButton, removeButton);
        bookContainer.append(action);

    } else {
        const finishedButton = document.createElement('button');
        finishedButton.innerText = "Selesai dibaca"
        finishedButton.classList.add('green', 'text-xs', 'border-2', 'border-black', 'rounded-md', 'px-2', 'py-1', 'font-medium', 'shadow-lg', 'shadow-green-200/60', 'hover:-translate-y-1', 'hover:scale-10', 'transition', 'duration-300');
        finishedButton.addEventListener('click', function () {
            addBookFromCompleted(bookObject.id);
        });

        const removeButton = document.createElement('button');
        removeButton.innerText = "Hapus buku";
        removeButton.classList.add('red', 'text-xs', 'border-2', 'border-black', 'rounded-md', 'px-2', 'py-1', 'font-medium', 'shadow-lg', 'shadow-red-200/60', 'hover:-translate-y-1', 'hover:scale-10', 'transition', 'duration-300');
        removeButton.addEventListener('click', function () {
            if (confirm("Apakah Anda yakin ingin menghapus buku " + bookObject.title + "?") == true) {
                removeBookFromCompleted(bookObject.id);
            }
        });

        action.append(finishedButton, removeButton);
        bookContainer.append(action);
    }

    return bookContainer;
}


document.addEventListener(RENDER_EVENT, function () {
    const incompletedBookList = document.getElementById('incompleteBookshelfList');
    incompletedBookList.innerHTML = "";

    const completeBookList = document.getElementById('completeBookshelfList');
    completeBookList.innerHTML = "";

    for (bookItem of books) {
        const bookElement = makeBook(bookItem);

        if (bookItem.isCompleted == false) {
            incompletedBookList.append(bookElement);
        } else {
            completeBookList.append(bookElement);
        }
    }
});



const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';


function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}


function isStorageExist() {
    if (typeof (Storage) === 'undefined') {
        alert("Browser Anda tidak mendukung Local Web Storage");
        return false;
    }

    return true;
}


document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});


function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (let book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}


document.addEventListener('DOMContentLoaded', function () {
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});


function isChecked() {
    document.getElementById("readStatus").innerText = "Selesai dibaca";
}

function isUnchecked() {
    document.getElementById("readStatus").innerText = "Belum selesai dibaca";
}


const btnSearch = document.getElementById('searchSubmit');
btnSearch.addEventListener('click', function (event) {

    event.preventDefault();

    const searchBookByTitle = document.getElementById('searchBookTitle').value;
    const bookItem = document.querySelectorAll('.book_item');

    for (let book of bookItem) {
        const bookTitle = book.innerText;

        if (bookTitle.includes(searchBookByTitle)) {
            book.style.display = 'inline';
            console.log(bookTitle);
        } else {
            book.style.display = 'none';
        }
    }
});