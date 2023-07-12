document.getElementById("login-form").addEventListener("submit", function(event) {
  /**
  * Event listener attached to the login form submit event.
  * It prevents the form from submitting normally and calls the validateLogin function with the entered username and password.
  * @param {Event} event - The submit event triggered by the login form.
  */
  event.preventDefault(); // Prevent the form from submitting normally

  // Get the form data
  const formData = new FormData(event.target);
  const username = formData.get("username");
  const password = formData.get("password");

  // Call the validateLogin function and pass the form data
  validateLogin(username, password);
});

function validateLogin(username, password) {
  /**
  * Function to validate the login credentials by making a POST request to the server-side login endpoint.
  * It sends the provided username and password in the request body.
  * If the login is successful and the response contains data, it stores the data in sessionStorage and redirects to the landing page.
  * If the login is unsuccessful, it displays an alert message.
  * @param {string} username - The entered username for login validation.
  * @param {string} password - The entered password for login validation.
  */
  fetch('/account/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
    .then(response => response.json())
    .then(data => {
      const login_verified = Object.keys(data).length;
      if (login_verified !== 0) {
        // If login is verified and data is received in the response
        const localData = JSON.stringify(data);
        sessionStorage.setItem('localData', localData);
        window.location.href = 'html/HomePage.html';
      } else {
        // If login is unsuccessful or no data is received in the response
        alert('Invalid username or password');
      } 
    })
    .catch(error => console.error(error));
}
