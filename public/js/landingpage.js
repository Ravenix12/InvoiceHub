const localData = JSON.parse(sessionStorage.getItem('localData'))[0];


document.getElementById("deleteaccount").addEventListener('click',function(event){    
    if(localData.mode=="guest"){
        fetch('/check-account', {
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

  // Assuming you have a variable called isAdminMode that indicates whether you're in admin mode or not

const dangerzoneDiv = document.getElementById('dangerzone');
const dangerZoneElement = document.createElement("div")
dangerZoneElement.classList.add("dangerzone-elem")

if (localData.mode=="admin") {

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
  checkRequests();
} else {

  fetch(`/check-privilege?user=${localData.user}`)
  .then(response => response.json())
  .then(data => {
    
    if (data.length!=0){
      flag = data[0].flag;
      const update = document.createElement("div");
      if(flag==1){
        console.log("Approved");
        update.innerText = "You have been approved";
      }
      else if(flag==0){
        console.log("No update yet");
        update.innerText="No update yet";
      }
      else if(flag==-1){
        console.log('Request Declined');    

        update.innerText="You have been rejected";


        fetch(`/clear-privilege?user=${localData.user}`, {
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
      dangerZoneElement.appendChild(update);
    }
    else{
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

  dangerzoneDiv.appendChild(dangerZoneElement);
}

function requestAdminAccess() {
  const user = `${localData.user}`; // Replace 'admin' with the actual user requesting admin access
  fetch('/elevate-privilege', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user })
  })
    .then(response => response.json())
    .then(data => {
      if (data.exists) {
        console.log('Account is still waiting for approval');
      } else {
        console.log('Admin access requested successfully');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function checkRequests() {
  fetch('/check-requests')
    .then(response => response.json())
    .then(data => {
      const requestsContainer = document.getElementById('requests');
      requestsContainer.innerHTML = ''; // Clear previous content

      if (data.length > 0) {
        data.forEach(request => {
          const row = document.createElement('div');
          row.classList.add('row');

          const requestsWrapper = document.createElement('div');
          requestsWrapper.classList.add('requests'); // Add 'requests' class

          const user = document.createElement('div');
          user.classList.add('user');
          user.textContent = request.user;

          const approveButton = document.createElement('button');
          approveButton.textContent = 'Approve';
          approveButton.value = 'accept'; // Set the value to 1
          approveButton.addEventListener('click', () => {
            approveButton.classList.add("selected-button");
            respondRequest(request.user, approveButton.value); // Call respondRequest with the value
          });

          const declineButton = document.createElement('button');
          declineButton.textContent = 'Decline';
          declineButton.value = 'decline'; // Set the value to 0
          declineButton.addEventListener('click', () => {
            declineButton.classList.add("selected-button");
            respondRequest(request.user, declineButton.value); // Call respondRequest with the value
          });

          requestsWrapper.appendChild(user);
          requestsWrapper.appendChild(approveButton);
          requestsWrapper.appendChild(declineButton);

          row.appendChild(requestsWrapper); // Add requestsWrapper to the row
          requestsContainer.appendChild(row);
        });
      } else {
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
  const payload = {
    user: user,
    action: value
  };
  console.log(payload);
  fetch('/respond-request', {
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
