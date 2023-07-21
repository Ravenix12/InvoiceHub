const manage = document.getElementById('manage-btn');

var imageUpload = document.getElementById('template');
var previewImage = document.getElementById('previewImage');
const previewButton = document.getElementById('previewButton');

var nameInput = document.getElementById('name');
var emailInput = document.getElementById('email');
var phoneInput = document.getElementById('phone');
var itemsInput = document.getElementById('csvFile');
const submit = document.getElementById('submit');

const table = document.getElementById('supplier-table');
let supplier_data = []; 

var suppliers = 0;
var code = 0;

function addSupplier() {
    suppliers += 1;
}

function SupplierCode(){
    code = suppliers;
    if (code<10){
        code = "00"+code;
    }
    if (code<100){
        code = "0"+code;
    }
    else code=code.toString();
}

manage.addEventListener('click', function() {
    table.style.display = 'block';

})

imageUpload.addEventListener('change', function() {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
      
      //previewImage.style.display = 'block';
      previewButton.style.display = 'inline-block';
      previewButton.dataset.imageSrc = e.target.result;
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  });

  previewButton.addEventListener('click', function() {
    // Handle the preview button click event
    const imageSrc = previewButton.dataset.imageSrc;
    previewImage.src = imageSrc;
    previewImage.style.display = 'block';
    console.log('Preview button clicked!');

    if (file) {
        reader.readAsDataURL(file);
      }
  });

function validateForm() {
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    
    if (!emailInput.checkValidity()) {
      emailError.style.display = 'block';        
    }
    else if (!phoneInput.checkValidity()) {
        phoneError.style.display = 'block';
    }
    else {
      emailError.style.display = 'none';
      phoneError.style.display = 'none';
      // Proceed with form submission or further processing
    }
    
  } 

submit.addEventListener('click', function() {
    validateForm();
    addSupplier();
    addData(saveData());

})

function addData(inputs) {
    supplier_data.push(inputs);
    localStorage.setItem('supplierData', JSON.stringify(supplier_data));
}

function saveData() {
    data = {
      code: SupplierCode(),
      name: nameInput.value,
      email: emailInput.value,
      phone: phoneInput.value
    };

    const csvFile = csvFileUpload.files[0];
    if (csvFile) {
      data.csvFileName = csvFile.name;
    }
  
    const imageFile = imageUpload.files[0];
    if (imageFile) {
      data.imageFileName = imageFile.name;
      data.imageSrc = previewButton.dataset.imageSrc;
    }
    
    //localStorage.setItem('formData', JSON.stringify(data));
  }
  
function loadData() {
    const data = JSON.parse(localStorage.getItem('supplierData'));
    
    if (data) {
      nameInput.value = data.name;
      emailInput.value = data.email;
      phoneInput.value = data.phone;

      if (data.imageSrc) {
        previewButton.dataset.imageSrc = data.imageSrc;
        previewImage.src = data.imageSrc;
        previewImage.style.display = 'block';
      }
  
      if (data.csvFileName) {
        // Display the name of the selected CSV file
        // You can customize this based on your requirements
        console.log('CSV File Name:', data.csvFileName);
      }
  
      if (data.imageFileName) {
        // Display the name of the selected image file
        // You can customize this based on your requirements
        console.log('Image File Name:', data.imageFileName);
      }
    }
    console.log(data);
  }
  
  
  // Call the function to load saved data when the page loads
  //  window.addEventListener('load', loadData);

