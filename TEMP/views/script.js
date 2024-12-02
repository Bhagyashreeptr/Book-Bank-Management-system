const users = [];
const books = [
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', copies: 5 },
    { title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', category: 'Non-Fiction', copies: 3 },
    { title: 'A Brief History of Time', author: 'Stephen Hawking', category: 'Science', copies: 4 },
    { title: 'The Innovators', author: 'Walter Isaacson', category: 'Technology', copies: 2 }
];
let currentUser = null;

document.addEventListener('DOMContentLoaded', function () {
    const phoneInput = document.getElementById('registerPhone');
    intlTelInput(phoneInput, {
        initialCountry: "us"
    });
});

function showRegisterPage() {
    fadeOutAllSections();
    const registerPage = document.getElementById('registerPage');
    registerPage.classList.add('visible');
}

function showLoginPage() {
    fadeOutAllSections();
    const loginPage = document.getElementById('loginPage');
    loginPage.classList.add('visible');
}

function showForgotPassword() {
    fadeOutAllSections();
    const forgotPasswordSection = document.getElementById('forgotPasswordSection');
    forgotPasswordSection.classList.add('visible');
}

function fadeOutAllSections() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('visible'));
}

function register() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;

    // Remove all non-digit characters from the phone number and check if it has 10 digits
    const phoneDigits = phone.replace(/\D/g, ''); // Remove non-digit characters

    if (phoneDigits.length !== 10) {
        alert('Phone number must be exactly 10 digits.');
        return;
    }

     if (!email.endsWith('@gmail.com')) {
        alert('Invalid email. Please enter a valid Gmail address ending with @gmail.com.');
        return;
    }

    if (users.find(user => user.username === username)) {
        alert('Username already taken');
        return;
    }

    users.push({ username, password, email, phone });
    document.getElementById('registerMessage').style.display = 'block';
    showLoginPage();
}


function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    currentUser = users.find(user => user.username === username && user.password === password);

    if (currentUser) {
        showProfilePage();
    } else {
        document.getElementById('errorMessage').style.display = 'block';
    }
}

function resetPassword() {
    const username = document.getElementById('forgotUsername').value;
    const email = document.getElementById('forgotEmail').value;
    const user = users.find(user => user.username === username && user.email === email);

    if (user) {
        // Generate a random password with 8 characters
        const newPassword = generateRandomPassword(8); 
        user.password = newPassword;
        
        // Show the new password to the user
        document.getElementById('resetMessage').innerText = `Password reset to: ${newPassword}`;
        document.getElementById('resetMessage').style.display = 'block';
    } else {
        document.getElementById('resetMessage').innerText = 'User not found';
        document.getElementById('resetMessage').style.display = 'block';
    }
}

// Function to generate a random password of specified length
function generateRandomPassword(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}



function showProfilePage() {
    fadeOutAllSections();
    const profileSection = document.getElementById('profileSection');
    profileSection.classList.add('visible');

    document.getElementById('profileUsername').textContent = currentUser.username;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profilePhone').textContent = currentUser.phone;
}

function showBookList() {
    fadeOutAllSections();
    const bookListSection = document.getElementById('bookListSection');
    bookListSection.classList.add('visible');
    const bookListContainer = document.getElementById('bookList');
    bookListContainer.innerHTML = '';

    books.forEach(book => {
        const bookItem = document.createElement('tr');
        bookItem.innerHTML = `
            <td>${book.author}</td>
            <td>${book.title}</td>
            <td>${book.copies}</td>
            <td><button onclick="requestBook('${book.title}')">Request Book</button></td>
        `;
        bookListContainer.appendChild(bookItem);
    });
}

// Request Book function to decrease copies and show a success message
function requestBook(title) {
    const book = books.find(b => b.title === title);

    // Check if there are available copies to request
    if (book.copies > 0) {
        book.copies--; // Decrease the number of copies
        showSuccessMessage(`You have successfully requested "${book.title}".`);

        // Re-render the book list to reflect updated copies
        showBookList();
    } else {
        alert("No copies left to request.");
    }
}

// Function to show a success message after book request
function showSuccessMessage(message) {
    const successMessage = document.createElement('p');
    successMessage.style.color = 'green';
    successMessage.textContent = message;

    const bookListSection = document.getElementById('bookListSection');
    const existingMessage = document.getElementById('requestSuccessMessage');
    
    // Remove any existing success message
    if (existingMessage) {
        existingMessage.remove();
    }
    
    successMessage.id = 'requestSuccessMessage';
    bookListSection.appendChild(successMessage);
}


function searchBooks() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchInput) || 
        book.author.toLowerCase().includes(searchInput)
    );

    const bookListContainer = document.getElementById('bookList');
    bookListContainer.innerHTML = '';

    filteredBooks.forEach(book => {
        const bookItem = document.createElement('tr');
        bookItem.innerHTML = `
            <td>${book.author}</td>
            <td>${book.title}</td>
            <td>${book.copies}</td>
            <td><button onclick="viewBookDetails('${book.title}')">Read</button></td>
        `;
        bookListContainer.appendChild(bookItem);
    });
}

function viewBookDetails(title) {
    const book = books.find(b => b.title === title);

    // Decrease copies if there are available ones
    if (book.copies > 0) {
        book.copies--;  // Decrease the number of copies
        document.getElementById('bookTitle').textContent = book.title;
        document.getElementById('bookAuthor').textContent = book.author;
        document.getElementById('bookCategory').textContent = book.category;
        document.getElementById('readBookModal').style.display = 'flex';

        // Re-render the book list with updated copies
        showBookList();
    } else {
        alert("No copies left to read.");
    }
}

function closeModal() {
    document.getElementById('readBookModal').style.display = 'none';
}

function returnToProfile() {
    fadeOutAllSections();
    const profileSection = document.getElementById('profileSection');
    profileSection.classList.add('visible');
}

function addBook() {
    const title = document.getElementById('newBookTitle').value;
    const author = document.getElementById('newBookAuthor').value;
    const category = document.getElementById('newBookCategory').value;

    // Default to 1 copy for the book
    const copies = 1;

    books.push({ title, author, category, copies });
    alert('Book added successfully!');
    returnToProfile();
}

function showAddBookSection() {
    fadeOutAllSections();
    const addBookSection = document.getElementById('addBookSection');
    addBookSection.classList.add('visible');
}


// Existing functions (register, login, resetPassword, etc.) are here...

function showBookList() {
    fadeOutAllSections();
    const bookListSection = document.getElementById('bookListSection');
    bookListSection.classList.add('visible');
    const bookListContainer = document.getElementById('bookList');
    bookListContainer.innerHTML = '';  // Clear the existing book list

    books.forEach(book => {
        const bookItem = document.createElement('tr');
        bookItem.innerHTML = `
            <td>${book.author}</td>
            <td>${book.title}</td>
            <td>${book.copies}</td> <!-- Display number of copies -->
            <td><button onclick="requestBook('${book.title}')">Request Book</button></td>
        `;
        bookListContainer.appendChild(bookItem);
    });
}





// Add Book function updated to display the correct number of copies
function addBook() {
    const title = document.getElementById('newBookTitle').value;
    const author = document.getElementById('newBookAuthor').value;
    const category = document.getElementById('newBookCategory').value;
    const copies = parseInt(document.getElementById('newBookCopies').value, 10);  // Get the number of copies from input

    if (isNaN(copies) || copies <= 0) {
        alert('Please enter a valid number of copies.');
        return;
    }

    books.push({ title, author, category, copies });
    alert('Book added successfully!');
    showBookList(); // Refresh the book list to show newly added book with correct copies
    returnToProfile();
}

// Updated Read Book function to decrease the number of copies when read
function readBook(title) {
    const book = books.find(b => b.title === title);

    if (book) {
        if (book.copies > 0) {
            book.copies--;  // Decrease the number of copies when reading
            document.getElementById('bookTitle').textContent = book.title;
            document.getElementById('bookAuthor').textContent = book.author;
            document.getElementById('bookCategory').textContent = book.category;
            document.getElementById('bookContent').textContent = `Content of ${book.title}`;  // Placeholder content

            // Display the modal with the book content
            document.getElementById('readBookModal').style.display = 'flex';

            // Refresh book list after reading (to update number of copies)
            showBookList();
        } else {
            alert("No copies left to read.");
        }
    }
}






function readBook(title) {
    const book = books.find(b => b.title === title);

    if (book) {
        // Check if there are copies available to read
        if (book.copies > 0) {
            book.copies--;  // Decrease the number of copies when reading
            
            document.getElementById('bookTitle').textContent = book.title;
            document.getElementById('bookAuthor').textContent = book.author;
            document.getElementById('bookCategory').textContent = book.category;
            document.getElementById('bookContent').textContent = `Content of ${book.title}`;  // Placeholder content

            // Display the modal with the book content
            document.getElementById('readBookModal').style.display = 'flex';

            // Refresh the book list after reading (to update number of copies)
            showBookList();
        } else {
            alert("No copies left to read.");
        }
    }
}




function closeModal() {
    document.getElementById('readBookModal').style.display = 'none';
}

function readBook(title) {
    const book = books.find(b => b.title === title);

    if (book) {
        // Check if there are copies available to read
        if (book.copies > 0) {
            book.copies--;  // Decrease the number of copies when reading
            
            // Optional: Display message showing the remaining number of copies
            alert(`You have read "${book.title}". Copies left: ${book.copies}`);

            // Refresh the book list after reading (to update number of copies)
            showBookList();  // Re-render the list to reflect the updated copies count
        } else {
            alert("No copies left to read.");
        }
    }
}



function showSuccessMessage(message) {
    const successMessage = document.createElement('p');
    successMessage.style.color = 'green';
    successMessage.textContent = message;

    const bookListSection = document.getElementById('bookListSection');
    const existingMessage = document.getElementById('requestSuccessMessage');
    
    // Remove any existing success message
    if (existingMessage) {
        existingMessage.remove();
    }
    
    successMessage.id = 'requestSuccessMessage';
    bookListSection.appendChild(successMessage);
}

function returnToProfile() {
    fadeOutAllSections();
    const profileSection = document.getElementById('profileSection');
    profileSection.classList.add('visible');
}

function validatePasswordLength(password) {
    if (password.length !== 8) {
        alert('Password must be exactly 8 characters long.');
        return false;
    }
    return true;
}

function register() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;

    // Validate password length
    if (!validatePasswordLength(password)) {
        return;
    }

    // Remove all non-digit characters from the phone number and check if it has 10 digits
    const phoneDigits = phone.replace(/\D/g, ''); // Remove non-digit characters

    if (phoneDigits.length !== 10) {
        alert('Phone number must be exactly 10 digits.');
        return;
    }

    if (!email.endsWith('@gmail.com')) {
        alert('Invalid email. Please enter a valid Gmail address ending with @gmail.com.');
        return;
    }

    if (users.find(user => user.username === username)) {
        alert('Username already taken');
        return;
    }

    users.push({ username, password, email, phone });
    document.getElementById('registerMessage').style.display = 'block';
    showLoginPage();
}

function resetPassword() {
    const username = document.getElementById('forgotUsername').value;
    const email = document.getElementById('forgotEmail').value;
    const user = users.find(user => user.username === username && user.email === email);

    if (user) {
        // Generate a random password with 8 characters
        let newPassword = generateRandomPassword(8); 

        // Ensure the generated password is 8 characters long
        while (!validatePasswordLength(newPassword)) {
            newPassword = generateRandomPassword(8);
        }

        user.password = newPassword;
        
        // Show the new password to the user
        document.getElementById('resetMessage').innerText = `Password reset to: ${newPassword}`;
        document.getElementById('resetMessage').style.display = 'block';
    } else {
        document.getElementById('resetMessage').innerText = 'User not found';
        document.getElementById('resetMessage').style.display = 'block';
    }
}
