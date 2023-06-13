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
  
          if (userType === "admin") {
            console.log("Calling elevatePrivilege")
            elevatePrivilege(name);
          }
        } else if (response.status === 409) {
          console.error('Error occurred during signup: Duplicate entry');
          // Handle the duplicate entry error
        } else {
          console.error('Error occurred during signup:', response.statusText);
          // Handle other errors
        }
      })
      .catch(error => {
        console.error('Error occurred during signup:', error);
        // Handle the error as needed
      });
  }
  
  function elevatePrivilege(user) {
    const requestBody = {
      user: user
    };
  
    fetch('/elevate-privilege', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Elevate privilege response:', data);
        // Handle the response as needed
      })
      .catch(error => {
        console.error('Error occurred during elevate privilege:', error);
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
  