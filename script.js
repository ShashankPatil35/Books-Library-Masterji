const booksContainer = document.getElementById("booksContainer");
const searchBar = document.getElementById("searchBar");
const toggleViewBtn = document.getElementById("toggleView");
const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
const pageNo = document.getElementById("pageNumber");

let books = [];
let allBooks = [];
let currentPage = 1;
const booksPerPage = 10;

async function fetchBooks() {
    try {
        const response = await fetch(`https://api.freeapi.app/api/v1/public/books?page=${currentPage}&limit=10`);

        if(!response.ok) throw new Error(`HTTP error! Status:${response.status}`);

        const data = await response.json();
        console.log("API Response:", data);

        if (Array.isArray(data.data.data)) {
            allBooks = data.data.data;
            books = [...allBooks];
            displayBooks();
            console.log(books)
            console.log(allBooks)
        } else {
            throw new Error("Books data is missing or not an array");
        }
    } catch (error) {
        console.error("Error fetching books:", error);
    }
}


function displayBooks() {
    if (!Array.isArray(books) || books.length === 0) {
        console.error("Books is not an array or is empty:", books);
        booksContainer.innerHTML = "<p>No books found</p>";
        return;
    }
    
    booksContainer.innerHTML = "";

    
    books.forEach(book => {
        const bookElement = document.createElement("div");
        bookElement.classList.add("book");
        bookElement.innerHTML = `
            <img src="${book.volumeInfo?.imageLinks?.thumbnail || 'placeholder.jpg'}" alt="Book Cover">
            <h3>${book.volumeInfo?.title || 'Unknown Title'}</h3>
            <p><strong>Author:</strong> ${book.volumeInfo?.authors?.join(', ') || 'Unknown Author'}</p>
            <p><strong>Publisher:</strong> ${book.volumeInfo?.publisher || 'Unknown Publisher'}</p>
            <p><strong>Published:</strong> ${book.volumeInfo?.publishedDate || 'Unknown Date'}</p>
        `;

        bookElement.addEventListener("click", () => {
            window.open(book.volumeInfo?.infoLink, "_blank");
        });
        booksContainer.appendChild(bookElement);
    });
}

searchBar.addEventListener("input", () => {
    const query = searchBar.value.toLowerCase().trim();
    const filteredBooks = books.filter(book => 
        book.volumeInfo?.title?.toLowerCase().includes(query) ||
        (book.volumeInfo?.authors?.some(author => author.toLowerCase().includes(query)) ?? false)
    );

    displayFilteredBooks(filteredBooks);
});
function displayFilteredBooks(filteredBooks) {
    booksContainer.innerHTML = ""; 

    if (filteredBooks.length === 0) {
        booksContainer.innerHTML = "<p>No books found</p>";
        return;
    }

    filteredBooks.forEach(book => {
        const bookElement = document.createElement("div");
        bookElement.classList.add("book");

        bookElement.innerHTML = `
            <img src="${book.volumeInfo?.imageLinks?.thumbnail || 'placeholder.jpg'}" alt="Book Cover">
            <h3>${book.volumeInfo?.title || "No Title"}</h3>
            <p><strong>Author:</strong> ${book.volumeInfo?.authors?.join(", ") || "Unknown"}</p>
            <p><strong>Publisher:</strong> ${book.volumeInfo?.publisher || "Unknown"}</p>
            <p><strong>Published:</strong> ${book.volumeInfo?.publishedDate || "Unknown"}</p>
        `;

        bookElement.addEventListener("click", () => {
            window.open(book.volumeInfo?.infoLink, "_blank");
        });

        booksContainer.appendChild(bookElement);
    });
}


toggleViewBtn.addEventListener("click", () => {
    booksContainer.classList.toggle("list-view");
    booksContainer.classList.toggle("grid-view");
});

nextPageBtn.addEventListener("click", () => {
        currentPage++;
        pageNo.textContent = currentPage;
        fetchBooks();
});

prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        pageNumber.textContent = currentPage;
        fetchBooks();
    }
});

const sortOptions = document.getElementById("sortOptions");

sortOptions.addEventListener("change", () => {
    const sortBy = sortOptions.value;

    if (sortBy === "title-asc") {
        books.sort((a, b) => {
            let titleA = a.volumeInfo?.title?.toLowerCase() || "";
            let titleB = b.volumeInfo?.title?.toLowerCase() || "";
            return titleA.localeCompare(titleB); // A-Z
        });
    } else if (sortBy === "title-desc") {
        books.sort((a, b) => {
            let titleA = a.volumeInfo?.title?.toLowerCase() || "";
            let titleB = b.volumeInfo?.title?.toLowerCase() || "";
            return titleB.localeCompare(titleA); // Z-A
        });
    } else if (sortBy === "publishedDate-asc") {
        books.sort((a, b) => {
            let dateA = new Date(a.volumeInfo?.publishedDate || "1900-01-01");
            let dateB = new Date(b.volumeInfo?.publishedDate || "1900-01-01");
            return dateA - dateB; // Oldest to Newest
        });
    } else if (sortBy === "publishedDate-desc") {
        books.sort((a, b) => {
            let dateA = new Date(a.volumeInfo?.publishedDate || "1900-01-01");
            let dateB = new Date(b.volumeInfo?.publishedDate || "1900-01-01");
            return dateB - dateA; // Newest to Oldest
        });
    }

    displayBooks();
});


fetchBooks();
