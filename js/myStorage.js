const STORAGE_KEY = "MyBook";

let list = [];

function isStorageExist() /* boolean */ {
    if (typeof(Storage) === undefined) {
        console.log("Browser Anda tidak mendukung local storage");
        return false
    }
    return true;
}

function saveData() {
    const parsed = JSON.stringify(list);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event("ondatasaved"));
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if (data !== null)
        list = data;
    document.dispatchEvent(new Event("ondataloaded"));
}

function updateDataToStorage() {
    if (isStorageExist())
        saveData();
}

function createBookObject(title, author, year, isComplete) {
    return {
        id: +new Date(),
        title,
        author,
        year,
        isComplete
    };
}

function searchBook(idBuku) {
    for (book of list) {
        if (book.id === idBuku)
            return book;
    }
    return null;
}

function searchIndexBook(idBuku) {
    let index = 0
    for (book of list) {
        if (book.id === idBuku)
            return index;

        index++;
    }
    return -1;
}