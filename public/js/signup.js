document.getElementById("signup-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
  
    // Get the form data
    const formData = new FormData(event.target);
    const name = formData.get("name");
    const password = formData.get("password");
    const email = formData.get("email");
    const userType = formData.get("user-type");
  
    // Call the validateSignup function and pass the form data
    validateSignup(name, password, email, userType);
  });
  
  function validateSignup(name, password, email, userType) {
    // Perform validation logic or make AJAX requests for signup validation
    // ...
    console.log("Validating signup with name:", name, "password:", password, "email:", email, "and userType:", userType);
  }
  const passwordInput = document.getElementById("password");
  const passwordToggle = document.getElementById("password-toggle");
  
  passwordToggle.addEventListener("mousedown", function () {
    passwordInput.type = "text";
    passwordToggle.textContent = "Hide";
  });
  
  passwordToggle.addEventListener("mouseup", function () {
    passwordInput.type = "password";
    passwordToggle.textContent = "Show";
  });
  

  function login() {
    const username = "dummy1";
    const password = "dummypassword";
  
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
    })
    .catch(error => console.error(error));
  }