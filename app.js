// Sample users and books data
const users = [
  { username: "user", password: "user", role: "user" },
  { username: "admin", password: "admin", role: "admin" }
];
let books = [
  { id: 1, name: "Book 1", isbn: "123456789", category: "Fiction", quantity: 5, available: true, borrowedBy: null },
  { id: 2, name: "Book 2", isbn: "987654321", category: "Non-fiction", quantity: 3, available: false, borrowedBy: "user" }
];

let currentUser = null;

// UI class
function UI() {}

// Show alert method
UI.prototype.showAlert = function(message, className) {
  // Create a div
  const div = document.createElement('div');
  // Add classes
  div.className = `alert ${className}`;
  // Add text
  div.appendChild(document.createTextNode(message));
  // Get parent
  const container = document.querySelector('.container');
  if (container) {
      // Get form
      const form = document.querySelector('#book-form');
      // Insert alert
      container.insertBefore(div, form);
      // Timeout after 3sec
      setTimeout(function(){
          div.remove();
      }, 3000);
  }
}

// Instantiate UI
const ui = new UI();

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
      currentUser = user;
      document.getElementById("loginForm").style.display = "none";
      if (currentUser.role === "user") {
          document.getElementById("userActions").style.display = "block";
      } else if (currentUser.role === "admin") {
          document.getElementById("adminActions").style.display = "block";
      }
  } else {
      ui.showAlert("Invalid username or password", "alert-danger");
  }
}

function logout() {
  currentUser = null;
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("userActions").style.display = "none";
  document.getElementById("adminActions").style.display = "none";
  document.getElementById("addBookForm").style.display = "none";
  document.getElementById("booksList").style.display = "none";
}

function showAddBookForm() {
  document.getElementById("addBookForm").style.display = "block";
}

function addBook() {
  const name = document.getElementById("name").value;
  const isbn = document.getElementById("isbn").value;
  const category = document.getElementById("category").value;
  const quantity = parseInt(document.getElementById("quantity").value);
  const available = document.getElementById("available").value === "true";

  // Generate a unique ID for the new book
  const id = books.length > 0 ? books[books.length - 1].id + 1 : 1;

  const newBook = { id, name, isbn, category, quantity, available, borrowedBy: null };
  books.push(newBook);

  ui.showAlert("Book added successfully", "alert-success");

  // Display books list if logged in as admin
  if (currentUser.role === "admin") {
      displayBooks();
  }
}

function displayBooks() {
  const booksList = document.getElementById("books");
  booksList.innerHTML = ""; // Clear previous list

  books.forEach(book => {
      const li = document.createElement("li");
      li.classList.add("book-item");
      li.innerHTML = `${book.name} - ISBN: ${book.isbn} - Category: ${book.category} - Quantity: ${book.quantity} - Available: ${book.available ? 'Yes' : 'No'}`;
      if (currentUser.role === "admin") {
          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.onclick = () => deleteBook(book.id);
          li.appendChild(deleteButton);
      } else if (currentUser.role === "user" && book.available) {
          const borrowButton = document.createElement("button");
          borrowButton.textContent = "Borrow";
          borrowButton.onclick = () => borrowBook(book.id);
          li.appendChild(borrowButton);
      }
      booksList.appendChild(li);
  });

  document.getElementById("booksList").style.display = "block";
}

function deleteBook(bookId) {
  books = books.filter(book => book.id !== bookId);
  displayBooks();
}

function borrowBook(bookId) {
  const book = books.find(b => b.id === bookId);
  if (book) {
      book.available = false;
      book.borrowedBy = currentUser.username;
      ui.showAlert("Book borrowed successfully", "alert-success");
      displayBooks();
  }
}

function showAvailableBooks() {
  displayBooks();
}

function showBorrowedBooks() {
  const borrowedBooks = books.filter(book => book.borrowedBy === currentUser.username);
  const booksList = document.getElementById("books");
  booksList.innerHTML = ""; // Clear previous list

  borrowedBooks.forEach(book => {
      const li = document.createElement("li");
      li.classList.add("book-item");
      li.innerHTML = `${book.name} - ISBN: ${book.isbn} - Category: ${book.category} - Quantity: ${book.quantity} - Available: ${book.available ? 'Yes' : 'No'}`;
      const returnButton = document.createElement("button");
      returnButton.textContent = "Return";
      returnButton.onclick = () => returnBook(book.id);
      li.appendChild(returnButton);
      booksList.appendChild(li);
  });

  document.getElementById("booksList").style.display = "block";
}

function returnBook(bookId) {
  const book = books.find(b => b.id === bookId);
  if (book) {
      book.available = true;
      book.borrowedBy = null;
      ui.showAlert("Book returned successfully", "alert-success");
      showBorrowedBooks();
  }
}