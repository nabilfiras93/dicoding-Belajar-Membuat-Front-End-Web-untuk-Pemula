document.addEventListener("DOMContentLoaded", function() {
    const submitForm = document.getElementById("save");
    submitForm.addEventListener("click", function(event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener("ondataloaded", () => {
    refreshDataFromList();
});

const checkType = document.getElementById("bookDone");
checkType.addEventListener("click", () => {
    if (checkType.checked) {
        document.getElementById("bookType").innerHTML = " <strong>Selesai Dibaca</strong>";
        document.getElementById("editBookType").innerHTML = " <strong>Selesai Dibaca</strong>";
    } else {
        document.getElementById("bookType").innerHTML = " <strong>Belum Dibaca</strong>";
        document.getElementById("editBookType").innerHTML = " <strong>Belum Dibaca</strong>";
    }
});

const searchBookForm = document.getElementById("searchBook");
searchBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const title = document.getElementById("searchBookTitle").value;
    searchBookByTitle(title)
});

