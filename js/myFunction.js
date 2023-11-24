const ID_LIST_NOTYET = "listNot";
const ID_LIST_DONE = "listDone";
const BOOK_ID = "idBook";
let thisBookElement;

function createCheckButton() {
    return createButton("checklist", function(event) {
        const parent = event.target.parentElement;
        addBookDone(parent.parentElement);
    });
}

function createBookList(judulB, penulisB, tahunB, selesai) {
    const judulBuku = document.createElement("h3");
    const judul = document.createElement("span");
    judul.classList.add("judul_buku");
    judul.innerText = judulB;
    judulBuku.append(judul);

    const penulisBuku = document.createElement("p");
    penulisBuku.innerText = "Penulis : ";
    const penulis = document.createElement("span");
    penulis.classList.add("penulis_buku");
    penulis.innerText = penulisB;
    penulisBuku.append(penulis);

    const tahunBuku = document.createElement("p");
    tahunBuku.innerText = "Tahun Terbit : ";
    const tahun = document.createElement("span");
    tahun.classList.add("tahun_buku");
    tahun.innerText = tahunB;
    tahunBuku.append(tahun);

    const infoBuku = document.createElement("div");
    infoBuku.classList.add("info");
    infoBuku.append(judulBuku, penulisBuku, tahunBuku);

    const bookAction = document.createElement("div");
    bookAction.classList.add("action");

    const container = document.createElement("article");
    container.classList.add("book_item");
    container.append(infoBuku, bookAction);

    if (selesai) {
        bookAction.append(
            createEditButton(),
            createUndoButton(),
            createTrashButton()
        );
    } else {
        bookAction.append(createEditButton(), createCheckButton(), createTrashButton());
    }

    return container;
}

function addBook() {
    const listNotRead = document.getElementById(ID_LIST_NOTYET);
    const listDoneRead = document.getElementById(ID_LIST_DONE);
    const checkType = document.getElementById("bookDone");

    let judul = document.getElementById("inputJudul").value;
    let penulis = document.getElementById("inputPenulis").value;
    let tahun = document.getElementById("inputTahun").value;

    if(judul=='' || penulis=='' || tahun==''){
        alert('Judul, Penulis dan Tahun tidak boleh kosong'); return false;
    }
    tahun = parseInt(tahun);

    if (!checkType.checked) {
        const listRead = createBookList(judul, penulis, tahun, false);
        const bookObject = createBookObject(judul, penulis, tahun, false);
        listRead[BOOK_ID] = bookObject.id;
        list.push(bookObject);
        listNotRead.append(listRead);
    } else {
        const listRead = createBookList(judul, penulis, tahun, true);
        const bookObject = createBookObject(judul, penulis, tahun, true);
        listRead[BOOK_ID] = bookObject.id;
        list.push(bookObject);
        listDoneRead.append(listRead);
    }
    updateDataToStorage();
    deleteForm();
}

function createButton(buttonTypeClass, eventListener) {
    const tombol = document.createElement("button");
    tombol.classList.add(buttonTypeClass);
    tombol.addEventListener("click", function(event) {
        eventListener(event);
    });
    return tombol;
}

function addBookDone(bookElement) {
    const judulBuku = bookElement.querySelector(".judul_buku").innerText;
    const penulisBuku = bookElement.querySelector(".penulis_buku").innerText;
    const tahunBuku = bookElement.querySelector(".tahun_buku").innerText;

    const bukuBaru = createBookList(judulBuku, penulisBuku, tahunBuku, true);
    const listSelesai = document.getElementById(ID_LIST_DONE);
    const book = searchBook(bookElement[BOOK_ID]);
    book.isComplete = true;
    bukuBaru[BOOK_ID] = book.id;
    listSelesai.append(bukuBaru);
    bookElement.remove();
    updateDataToStorage();
}

function deleteBookDone(bookElement) {
    const posisiBuku = searchIndexBook(bookElement[BOOK_ID]);
    list.splice(posisiBuku, 1);
    bookElement.remove();
    updateDataToStorage();
}

function deleteForm() {
    document.getElementById("inputJudul").value = "";
    document.getElementById("inputPenulis").value = "";
    document.getElementById("inputTahun").value = "";
    document.getElementById("bookDone").checked = false;
}

function createTrashButton() {
    return createButton("trash", function(event) {
        const parent = event.target.parentElement;
        deleteBookDone(parent.parentElement);
    });
}

function undoBookDone(bookElement) {
    const judulBuku = bookElement.querySelector(".judul_buku").innerText;
    const penulisBuku = bookElement.querySelector(".penulis_buku").innerText;
    const tahunBuku = bookElement.querySelector(".tahun_buku").innerText;

    const bukuBaru = createBookList(judulBuku, penulisBuku, tahunBuku, false);
    const listNotRead = document.getElementById(ID_LIST_NOTYET);

    const book = searchBook(bookElement[BOOK_ID]);
    book.isComplete = false;
    bukuBaru[BOOK_ID] = book.id;
    listNotRead.append(bukuBaru);
    bookElement.remove();

    updateDataToStorage();
}

function createUndoButton() {
    return createButton("undo", function(event) {
        const parent = event.target.parentElement;
        undoBookDone(parent.parentElement);
    });
}

function createEditButton() {
    return createButton("edit", function(event) {
        const parent = event.target.parentElement;
        thisBookElement = parent.parentElement;
        editBookInfo(thisBookElement);
    });
}

function editBookInfo(bookElement) {
    document.getElementById("save").style.display = "none";
    editButton.style.display = "block";
    document.getElementById("inputJudul").value = bookElement.querySelector(".judul_buku").innerText;
    document.getElementById("inputPenulis").value = bookElement.querySelector(".penulis_buku").innerText;
    document.getElementById("inputTahun").value = bookElement.querySelector(".tahun_buku").innerText;
}

const editButton = document.getElementById("editBook");
editButton.addEventListener("click", function(event) {
    event.preventDefault();
    addBookEdit(thisBookElement);
});

function addBookEdit(bookElement) {
    bookElement.remove();
    deleteBookDone(bookElement);
    const listNotRead = document.getElementById(ID_LIST_NOTYET);
    const listDoneRead = document.getElementById(ID_LIST_DONE);
    const checkType = document.getElementById("bookDone");

    let judul = document.getElementById("inputJudul").value;
    let penulis = document.getElementById("inputPenulis").value;
    let tahun = document.getElementById("inputTahun").value;

    if(judul=='' || penulis=='' || tahun==''){
        alert('Judul, Penulis dan Tahun tidak boleh kosong'); return false;
    }
    tahun = parseInt(tahun);
    if (!checkType.checked) {
        const listRead = createBookList(judul, penulis, tahun, false);
        const bookObject = createBookObject(judul, penulis, tahun, false);
        listRead[BOOK_ID] = bookObject.id;
        list.push(bookObject);
        listNotRead.append(listRead);
    } else {
        const listRead = createBookList(judul, penulis, tahun, true);
        const bookObject = createBookObject(judul, penulis, tahun, true);
        listRead[BOOK_ID] = bookObject.id;
        list.push(bookObject);
        listDoneRead.append(listRead);
    }
    updateDataToStorage();
    deleteForm();
    buttonBack();
    return false;
}

function buttonBack() {
    document.getElementById("save").style.display = "block";
    document.getElementById("editBook").style.display = "none";
}

function searchBookByTitle(title) {
    const bookList = [];
    for (let index = 0; index < list.length; index++) {
        const tempTitle = list[index].title.toLowerCase();
        const tempTitleTarget = title.toLowerCase();
        if (list[index].title.includes(title) || tempTitle.includes(tempTitleTarget)) {
          bookList.push(list[index]);
        }
    }

    document.getElementById("searchBookTitle").value = title;
    refreshDataFromSearch(bookList)
    return bookList;
}

function refreshDataFromList() {
    const listBelumSelesai = document.getElementById(ID_LIST_NOTYET);
    let listSelesai = document.getElementById(ID_LIST_DONE);
    for (book of list) {
        const newBook = createBookList(book.title, book.author, book.year, book.isComplete);
        newBook[BOOK_ID] = book.id;
        if (book.isComplete) {
            listSelesai.append(newBook);
        } else {
            listBelumSelesai.append(newBook);
        }
    }
}

function refreshDataFromSearch(listSearch) {
    let listBelumSelesai = document.getElementById(ID_LIST_NOTYET);
    let listSelesai = document.getElementById(ID_LIST_DONE);
    listBelumSelesai.innerHTML = '';
    listSelesai.innerHTML = '';
    
    for (book of listSearch) {
        const newBook = createBookList(book.title, book.author, book.year, book.isComplete);
        newBook[BOOK_ID] = book.id;
        if (book.isComplete) {
            listSelesai.append(newBook);
        } else {
            listBelumSelesai.append(newBook);
        }
    }
}