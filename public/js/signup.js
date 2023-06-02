document.getElementById("signup-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
  
    // Get the form data
    const formData = new FormData(event.target);
    const name = formData.get("name");
    const password = formData.get("password");
    const email = formData.get("email");
    const userType = formData.get("user-type");
  
    // Call the validateSignup function and pass the form data
    Signup(name, password, email, userType);
  });
  
  // function Signup(name, password, email, userType) {  
  //   console.log("Validating signup with name:", name, "password:", password, "email:", email, "and userType:", userType);
  //   const default_access = "guest";
  //   // Construct the SQL query
  //   const query = `INSERT INTO users (name, password, email, userType) VALUES (?, ?, ?, ?)`;
  
  //   // Execute the query with the provided data
  //   connection.query(query, [name, password, email, default_access], (err, results) => {
  //     if (err) {
  //       console.error('Error occurred during signup:', err);
  //       // Handle the error as needed
  //     } else {
  //       console.log('Signup successful!');
  //       // Handle the successful signup
  //     }
  //   });
  // }
  
  function Signup(name, password, email, userType) {
    console.log("Validating signup with name:", name, "password:", password, "email:", email, "and userType:", userType);
    const default_access = "guest";
  
    // Construct the request body
    const requestBody = {
      name: name,
      password: password,
      email: email,
      userType: default_access
    };
  
    // Make a POST request to the server-side method
    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    .then(response => {
      if (response.ok) {
        console.log('Signup successful!');
        // Handle the successful signup
      } else {
        console.error('Error occurred during signup:', response.statusText);
        // Handle the error as needed
      }
    })
    .catch(error => {
      console.error('Error occurred during signup:', error);
      // Handle the error as needed
    });
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




