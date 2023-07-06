var localData = JSON.parse(sessionStorage.getItem('localData'));
if (!localData || localData.length === 0) {
  alert("Unauthorized Acess , Please Relogin.");
  window.location.href = "../../index.html";
}
else{
  localData = localData[0];
}
