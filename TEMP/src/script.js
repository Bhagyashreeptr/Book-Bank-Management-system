function register() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
  
    // Validate the input
    if (!username || !password || !email || !phone) {
      alert('Please fill in all fields.');
      return;
    }
  
    // Send a POST request to the backend to register the user
    fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password, email, phone })
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'User registered successfully') {
          alert('Registration successful! Please login.');
          showLoginPage();
        } else {
          alert(data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Registration failed.');
      });
  }
  