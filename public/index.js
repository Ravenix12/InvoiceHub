

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
      if (login_verified === 1) {        
        
        const localData =JSON.stringify(data);
        sessionStorage.setItem('localData',localData);
        window.location.href = 'html/landingpage.html';
      } else {
        alert('Invalid username or password');
      }
    })
    .catch(error => console.error(error));
  }

  // document.getElementById("button").addEventListener("click", function(event) {
  //   var fileInput = document.getElementById("imageInput");
  //   var file = fileInput.files[0];
  
  //   if (file) {
  //     var formData = new FormData();
  //     formData.append("image", file);
  
  //     fetch("/upload", {
  //       method: "POST",
  //       body: formData
  //     })
  //     .then(response => {
  //       if (response.ok) {
  //         console.log("Image uploaded successfully.");
  //       } else {
  //         console.error("Error uploading image:", response.statusText);
  //       }
  //     })
  //     .catch(error => {
  //       console.error("Error uploading image:", error);
  //     });
  //   } else {
  //     console.log("No image selected.");
  //   }
  // });
  
  // document.getElementById("displayimage").addEventListener("click", function(event) {
  //   fetch("/displayImage")
  //     .then(response => response.text())
  //     .then(imageSrc => {
  //         console.log(imageSrc)


  //       const image = document.createElement('img');

  //       // Set the src attribute to the base64-encoded image data
  //       image.src = 'data:image/jpeg;base64,' + imageSrc;

  //       // Append the image element to the container div
  //       const container = document.getElementById('container');
  //       container.innerText=imageSrc;
  //       container.appendChild(image);
  //     })
  //     .catch(error => {
  //       console.error("Error displaying image:", error);
  //     });
  // });
  