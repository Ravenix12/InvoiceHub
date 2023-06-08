document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
  
    // Get the form data
    const formData = new FormData(event.target);
    const username = formData.get("username");
    const password = formData.get("password");
  
    // Call the validateLogin function and pass the form data
    validateLogin(username, password);
  });

  function validateLogin(username,password) {

    fetch('/api/index/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {


      const login_verified = Object.keys(data).length;
      if (login_verified != 0) {        
        
        const localData =JSON.stringify(data);
        sessionStorage.setItem('localData',localData);
        window.location.href = 'html/landingpage.html';
      } else {
        alert('Invalid username or password');
      }
    })
    .catch(error => console.error(error));
  }
