document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
 
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    let validUsername = "user123";
    let validPassword = "pass123";
  
    if (username === validUsername && password === validPassword) {
      alert('Login successful!');
      window.location.href = '../../views/home.html';
    } else {
      alert('Invalid username or password. Please try again.');
    }
  });
  