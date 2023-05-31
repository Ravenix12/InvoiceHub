fillTable();

function fillTable() {
    const localData = JSON.parse(sessionStorage.getItem('localData'))[0];
console.log(localData);
    document.getElementById('id').textContent = localData.id;
    document.getElementById('user').textContent = localData.user;
    document.getElementById('password').textContent = localData.password;
    document.getElementById('mode').textContent = localData.mode;
    document.getElementById('email').textContent = localData.Email;

  }
