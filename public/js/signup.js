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
  /**
 * Signup function to register a user with the provided name, password, email, and userType.
 * It constructs a request body and makes a POST request to the '/signup' endpoint.
 * If the signup is successful, it logs the provided signup details and performs additional actions based on the userType.
 * If a duplicate entry error occurs, it displays an alert message.
 * If any other error occurs during signup, it logs the error message.
 * @param {string} name - The name of the user signing up.
 * @param {string} password - The password of the user signing up.
 * @param {string} email - The email of the user signing up.
 * @param {string} userType - The type of the user signing up.
 */
  const default_access = "guest";

  // Construct the request body
  const requestBody = {
    name: name,
    password: password,
    email: email,
    userType: default_access
  };

  // Make a POST request to the server-side method
  fetch('/account/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })
    .then(response => {
      if (response.ok) {
        // Handle the successful signup
        console.log("Validating signup with name:", name, "password:", password, "email:", email, "and userType:", userType);
        
        // Perform additional actions based on userType
        if (userType === "admin") {
          console.log("Calling elevatePrivilege");
          elevatePrivilege(name);
        }
        
        // Redirect to the homepage
        var port = window.location.port || ""; // Get the current port number, or an empty string if not present
        var url = 'http://localhost' + (port ? ':' + port : ''); // Construct the URL with the dynamic port number
        
        window.location.href = url; // Redirect to the dynamically constructed URL
        
      } else if (response.status === 409) {
        // Handle the duplicate entry error
        alert("Error occurred during signup: Duplicate entry");
        alert("Account Already Exists");
      } else {
        // Handle other errors
        console.error('Error occurred during signup:', response.statusText);
        alert("Sign up Failed")
      }
    })
    .catch(error => {
      // Handle the error as needed
      console.error('Error occurred during signup:', error);
    });
}


function elevatePrivilege(user) {
  /**
 * Function to elevate the privilege level of a user.
 * It makes a POST request to the '/elevate-privilege' endpoint with the provided user parameter.
 * It logs the response received from the server.
 * @param {string} user - The user for whom the privilege level needs to be elevated.
 */
  const requestBody = {
    user: user
  };

  fetch('/acccount/elevate-privilege', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })
    .then(response => response.json())
    .then(data => {
      // Handle the response as needed
      console.log('Elevate privilege response:', data);
    })
    .catch(error => {
      // Handle the error as needed
      console.error('Error occurred during elevate privilege:', error);
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
  
document.querySelectorAll(".redirect")
.forEach(
  (button)=>{button.addEventListener('click',()=>{
  var port = window.location.port || ""; // Get the current port number, or an empty string if not present
  var url = 'http://localhost' + (port ? ':' + port : ''); // Construct the URL with the dynamic port number
  window.location.href = url; // Redirect to the dynamically constructed URL
});
});


