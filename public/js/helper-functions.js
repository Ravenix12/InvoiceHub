function DisplayUser(){
    var nameDiv = document.querySelector('.name');
    var positionDiv = document.querySelector('.position');
    nameDiv.innerHTML = localData.user;
    positionDiv.innerHTML = localData.mode;
}


document.addEventListener("DOMContentLoaded", function(event){
    DisplayUser();
  });