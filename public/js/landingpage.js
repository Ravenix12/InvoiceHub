const localData = JSON.parse(sessionStorage.getItem('localData'))[0];
document.getElementById("deleteaccount").addEventListener('click',function(event){
    
    if(localData.mode=="guest"){
    console.log("Please Login again to confirm account deletion");
        const data = localData;
        console.log('account check');
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
  // Not in admin mode: render a button to request admin access
  const button = document.createElement('button');
  button.textContent = "Request admin access";
  button.addEventListener('click', requestAdminAccess);

  // Append the button to the dangerzone div
  dangerzoneDiv.appendChild(button);
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
      console.log(data);
      const requestsContainer = document.getElementById('requests');
      requestsContainer.innerHTML = '';

      if (data.length > 0) {
       
        data.forEach(request => {
          const row = document.createElement('div');
          row.className = 'row';

          const requestInfo = document.createElement('span');
          requestInfo.textContent = request.user;

          const approveButton = document.createElement('button');
          approveButton.textContent = 'Approve';
          approveButton.addEventListener('click', () => approveRequest(request.id));

          row.appendChild(requestInfo);
          row.appendChild(approveButton);
          requestsContainer.appendChild(row);
        });
      } else {
        const noRequestsMessage = document.createElement('span');
        noRequestsMessage.textContent = 'No requests found';
        requestsContainer.appendChild(noRequestsMessage);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function approveRequest(requestId) {
  fetch('/approve-request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ requestId })
  })
    .then(response => response.json())
    .then(data => {
      console.log('Request approved:', data);
      // Perform any necessary actions after approval
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
