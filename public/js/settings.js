document.getElementById("deleteaccount").addEventListener('click',function(event){    
    if(localData.mode=="guest"){
        fetch('/account/check-account', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(localData)
          })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Network response was not ok.');
          })
          .then((result) => {
            if (result.exists) {
              // Account exists in SQL table
              console.log('Account exists');
              window.location.replace("https://localhost:3000");
            } else {
              // Account doesn't exist in SQL table
              console.log('Account does not exist');
            }
          })
          .catch((error) => {
            console.error('Error occurred during account check:', error);
          });   
    }
    else{
        alert("Website does not suppose admin account deletion currently ");
    }
});

fillTable();

function fillTable() {
    document.getElementById('id').textContent = localData.id;
    document.getElementById('user').textContent = localData.user;
    document.getElementById('password').textContent = localData.password;
    document.getElementById('mode').textContent = localData.mode;
    document.getElementById('email').textContent = localData.Email;
}

function fillInvoices(){

  // Fetch the invoices data from the backend
  fetch('/invoice/all')
    .then(response => response.json())
    .then(data => {
      // Get the table body element
      const tableBody = document.querySelector('#invoices-table tbody');

      // Loop through the data and populate the table rows
      data.forEach(invoice => {
        const row = document.createElement('tr');

        const usersCell = document.createElement('td');
        usersCell.textContent = invoice.users;
        row.appendChild(usersCell);

        const invoiceIdCell = document.createElement('td');
        invoiceIdCell.textContent = invoice.invoiceid;
        row.appendChild(invoiceIdCell);

        const invoiceNameCell = document.createElement('td');
        invoiceNameCell.textContent = invoice.invoice_name;
        row.appendChild(invoiceNameCell);

        const uploadDateCell = document.createElement('td');
        uploadDateCell.textContent = invoice.upload_date;
        row.appendChild(uploadDateCell);

        const statusCell = document.createElement('td');
        statusCell.textContent = invoice.status;
        row.appendChild(statusCell);

        // Get the detected text cell element
        const detectedTextCell = document.createElement('td');
        detectedTextCell.textContent = "View";
        detectedTextCell.value= invoice.invoiceid;
        detectedTextCell.addEventListener('click',(event)=>{
          console.log('invoice id is ',event.target.value);
          const newURL = `http://localhost:8000/invoice/get-detected-text/${event.target.value}`;
        window.open(newURL);
        })
        row.appendChild(detectedTextCell);
        const pathCell = document.createElement('td');
        pathCell.textContent = invoice.path;
    
        pathCell.addEventListener('click', (event) => {
          const filePath = 'http://127.0.0.1:8080/'+event.target.textContent;

          window.open(filePath);
        });


        const notifs = document.createElement('div');

        var svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgElement.setAttribute('class', 'ic_notification');
        svgElement.setAttribute('width', '16');
        svgElement.setAttribute('height', '16');
        svgElement.setAttribute('fill', 'currentColor');
        svgElement.setAttribute('viewBox', '0 0 16 16');
        
        var pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.setAttribute('d', 'M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z');
        
        svgElement.appendChild(pathElement);
          
        

        notifs.appendChild(svgElement);
        
        var svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgElement.setAttribute('class', 'ic_notification');
        svgElement.setAttribute('width', '16');
        svgElement.setAttribute('height', '16');
        svgElement.setAttribute('fill', 'currentColor');
        svgElement.setAttribute('viewBox', '0 0 16 16');
        
        var pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.setAttribute('d', 'M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z');
        
        svgElement.appendChild(pathElement);
          
        notifs.appendChild(svgElement);
        
        
        row.appendChild(notifs);
        row.appendChild(pathCell);

        tableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Error fetching invoices data:', error);
    });

}

fillInvoices();
// Assuming you have a variable called isAdminMode that indicates whether you're in admin mode or not
const dangerzoneDiv = document.getElementById('dangerzone');
const dangerZoneElement = document.createElement("div")
dangerZoneElement.classList.add("dangerzone-elem")

if (localData.mode == "admin") {
  // Admin mode: render title requests under a bold and small heading tag
  const heading = document.createElement('h3');
  const boldText = document.createElement('b');
  const smallText = document.createElement('small');
  boldText.textContent = 'Requests';
  smallText.textContent = ' (Admin Mode)';
  heading.appendChild(boldText);
  heading.appendChild(smallText);

  // Create a div element for requests
  const requestsDiv = document.createElement('div');
  requestsDiv.id = 'requests';

  // Append the heading and requests div to the dangerzone div
  dangerzoneDiv.appendChild(heading);
  dangerzoneDiv.appendChild(requestsDiv);

  // Call the checkRequests function to populate the requests
  checkRequests();
} else {
  // Check the user's privilege level
  fetch(`/account/check-privilege?user=${localData.user}`)
    .then(response => response.json())
    .then(data => {
      if (data.length != 0) {
        // User has a privilege level
        const flag = data[0].flag;
        const update = document.createElement("div");
        if (flag == 1) {
          // Approved privilege level
          console.log("Approved");
          update.innerText = "You have been approved";
        } else if (flag == 0) {
          // No update yet
          console.log("No update yet");
          update.innerText = "No update yet";
        } else if (flag == -1) {
          // Request declined
          console.log('Request Declined');
          update.innerText = "You have been rejected";

          // Clear the privilege for the user
          fetch(`/account/clear-privilege?user=${localData.user}`, {
            method: 'DELETE'
          })
            .then(response => response.json())
            .then(data => {
              // Handle the response data
              console.log(data); // Output the response data to the console or perform further actions
            })
            .catch(error => {
              // Handle any errors that occur during the request
              console.error("Error:", error);
            });
        }
        // Append the update element to the dangerZoneElement
        dangerZoneElement.appendChild(update);
      } else {
        // User has no privilege level
        // Not in admin mode: render a button to request admin access
        const button = document.createElement('button');
        button.textContent = "Request admin access";
        button.addEventListener('click', requestAdminAccess);
        dangerZoneElement.appendChild(button);
      }
    })
    .catch(error => {
      // Handle any errors that occur during the request
      console.error("Error:", error);
    });

  // Append the dangerZoneElement to the dangerzoneDiv
  dangerzoneDiv.appendChild(dangerZoneElement);
}

function requestAdminAccess() {
  /**
  * Sends a request to elevate the user's privilege level to admin.
  * If the request is successful, it logs a success message.
  * If the request is pending approval, it logs a message indicating the account is waiting for approval.
  * If an error occurs during the process, it logs the error.
  */

  // Get the user requesting admin access from localData
  const user = `${localData.user}`; // Replace 'admin' with the actual user requesting admin access

  // Send a POST request to elevate-privilege endpoint with the user data
  fetch('/account/elevate-privilege', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user })
  })
    .then(response => response.json())
    .then(data => {
      // Process the response data
      if (data.exists) {
        // Log a message if the account is waiting for approval
        console.log('Account is still waiting for approval');
      } else {
        // Log a success message if the request was successful
        console.log('Admin access requested successfully');
      }
    })
    .catch(error => {
      // Log any errors that occur during the process
      console.error('Error:', error);
    });
}

function checkRequests() {
  /**
  * Retrieves requests from the server and displays them on the page.
  * If there are no requests, it displays a message indicating that no requests were found.
  */
  // Fetch requests from the server
  fetch('/account/check-requests')
    .then(response => response.json())
    .then(data => {
      // Get the container element for requests
      const requestsContainer = document.getElementById('requests');

      // Clear previous content
      requestsContainer.innerHTML = '';

      // Process the retrieved data
      if (data.length > 0) {
        // Iterate through each request
        data.forEach(request => {
          // Create a row element
          const row = document.createElement('div');
          row.classList.add('row');

          // Create a wrapper for requests
          const requestsWrapper = document.createElement('div');
          requestsWrapper.classList.add('requests');

          // Create a user element
          const user = document.createElement('div');
          user.classList.add('user');
          user.textContent = request.user;

          // Create an approve button
          const approveButton = document.createElement('button');
          approveButton.textContent = 'Approve';
          approveButton.value = 'accept';
          approveButton.addEventListener('click', () => {
            // Add a selected-button class for styling
            approveButton.classList.add("selected-button");
            // Call the respondRequest function with the value
            respondRequest(request.user, approveButton.value);
          });

          // Create a decline button
          const declineButton = document.createElement('button');
          declineButton.textContent = 'Decline';
          declineButton.value = 'decline';
          declineButton.addEventListener('click', () => {
            // Add a selected-button class for styling
            declineButton.classList.add("selected-button");
            // Call the respondRequest function with the value
            respondRequest(request.user, declineButton.value);
          });

          // Append elements to the requestsWrapper
          requestsWrapper.appendChild(user);
          requestsWrapper.appendChild(approveButton);
          requestsWrapper.appendChild(declineButton);

          // Add requestsWrapper to the row
          row.appendChild(requestsWrapper);

          // Add the row to the requestsContainer
          requestsContainer.appendChild(row);
        });
      } else {
        // Display a message if no requests are found
        const noRequests = document.createElement('div');
        noRequests.textContent = 'No requests found.';
        requestsContainer.appendChild(noRequests);
      }
    })
    .catch(error => {
      console.error('Error occurred while checking requests:', error);
    });
}

function respondRequest(user, value) {
  /**
  * Sends a request response to the server.
  * @param {string} user - The user associated with the request.
  * @param {string} value - The action value for the request.
  */
  // Create the payload object
  const payload = {
    user: user,
    action: value
  };

  // Log the payload for debugging purposes
  console.log(payload);

  // Send the payload to the server using fetch API
  fetch('/account/respond-request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then(response => {
      if (response.ok) {
        // Handle successful response
        console.log('Request response sent successfully.');
      } else {
        // Handle error response
        console.error('Failed to send request response.');
      }
    })
    .catch(error => {
      console.error('An error occurred while sending request response:', error);
    });
}

const fileInput = document.getElementById('aws-call');
fileInput.addEventListener('change', event => {
  const file = event.target.files[0];
  const formData = new FormData();
  formData.append('jpeg', file);
  const fileSizeInMB = file.size / (1024 * 1024);
  console.log('File Size:', fileSizeInMB.toFixed(2), 'MB');

  // Send the form data to the server-side script
  fetch('/invoice/save-image', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data=>{
      
      var user = localData.user;
      var invoiceid = "invoice_id";
      var invoice_name = "invoice_name";
      var upload_date = new Date().toISOString().split('T')[0];
      var status = "db";

      const requestBody = {
        user,
        invoiceid,
        invoice_name,
        upload_date,
        status,
        data
      };

      const fakerequestBody = {
        user: localData.user,
        invoiceid: 12345,
        invoice_name: "Sample Invoice",
        upload_date: upload_date,
        status: "Paid",
        path: data
      }

      // Send the POST request to the server
      fetch('/invoice/insert-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fakerequestBody)
      })
        .then(response => {
          if (response.ok) {
            console.log('Record inserted successfully.');
          } else {
            console.error('Failed to insert the record.');
          }
        })
        .catch(error => {
          console.error('Error occurred while inserting the record:', error);
        });
    })
    .catch(error => {
      console.error('Error occurred while saving the image:', error);

    });

  if(formData.get('jpeg').size/(1024*1024).toFixed(2)>=5){
    detectTextBuckets(formData).then(detectedText=>{
      console.log(typeof detectedText);

      fetch('/invoice/save-detected-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ invoiceid: 12345, detectedText: JSON.stringify(detectedText) })
      }).then(response=>response.json())
      .then(data=>{
        console.log(data);
      });
    })
    .catch(error=>{
      console.error("Error occured"+error);
    })
  }
  else{
    detectText(formData).then(detectedText=>{
      console.log(detectedText);

      fetch('/invoice/save-detected-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ invoiceid: 12345, detectedText: detectedText })
      }).then(response=>response.json())
      .then(data=>{
        console.log(data);
      });
    
    })
    .catch(error=>{
      console.error("Error occured"+error);
    })
  }


});

function detectText(formData) {
  return fetch('/rekognition/upload-jpeg', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log('Text Detected:', data);
    return data; // Return the data
  })
  .catch(error => {
    console.error('Error uploading file:', error);
    throw error; // Throw the error to propagate it further
  });
}


function detectTextBuckets(formData) {
  return fetch('/rekognition/upload-jpeg-bucket', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log('Text Detected Buckets:');
    return data; // Return the data
  })
  .catch(error => {
    console.error('Error uploading file:', error);
    throw error; // Throw the error to propagate it further
  });
}


function logout(){
  sessionStorage.removeItem('localData');
  localData = "";
  window.location.href = "../../index.html";
}

