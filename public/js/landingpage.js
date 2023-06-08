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

// function messageBoxFill(){
//     const target = document.getElementById("messagebox");
//     target.innerHTML="";
// }
