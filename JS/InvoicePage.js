// TODO fix the overflow error -> reaches the min screen width then automatically hide  the rest elements 

/* CODE FOR RENDERING THE TABLE */

// data from InvoiceData.js
import { data } from './InvoiceData.js';

var table = document.getElementById("invoice_table");

// code for rendering the data
function showtable(data_arr) {

  // set up the title of each column
  table.innerHTML = `
    <tr>
      <th>ID</th>
      <th>CUSTOMER NAME</th>
      <th>INVOICE DATE</th>
      <th>AMOUNT</th>
      <th>STATUS</th>
      <th>ACTION</th>
    </tr>`
    ;

  // get the icons for edit, delete, and export
  for (var i = 0; i < data_arr.length; i++) {
    var previewIcon =  `
    <a href="#">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
      </svg>
    </a>`
    var editIcon = `
    <a href="#">
      <svg class="ic_edit"xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
      </svg>
    </a>`;
    var deleteIcon = `
    <svg class="ic_delete" data-id="${data_arr[i].id}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
      </svg>`;

    var exportIcon = `
      <a href="#">
        <svg class="ic_export" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
          <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
        </svg>
      </a>`;

    // var for saving the status' color column
    var statusColor = "";

    // classify the color for each status
    if (data_arr[i].status === "DRAFT") {
      statusColor = "#acacac";
    } else if (data_arr[i].status === "OVERDUE") {
      statusColor = "rgb(252, 183, 137)";
    } else if (data_arr[i].status === "PAID") {
      statusColor = "rgb(136, 197, 136)";
    }

    // render each row of data
    table.innerHTML += `
      <tr>
        <td>${data_arr[i].id}</td>
        <td>${data_arr[i].name}</td>
        <td>${data_arr[i].date}</td>
        <td>${data_arr[i].amount}</td>
        <td style="background-color: ${statusColor};">${data_arr[i].status}</td>
        <td>${previewIcon} ${editIcon} ${deleteIcon} ${exportIcon}</td>
      </tr>`;
  }
 
}

// Add event listener for delete icon using event delegation
table.addEventListener("click", function (event) {
  if (event.target.classList.contains("ic_delete")) {
    // Retrieve the id of the row from the custom attribute
    var rowId = event.target.getAttribute("data-id");

    // Find the index of the row with the matching id in the data array
    var rowIndex = data.findIndex(function (row) {
      return row.id === rowId;
    });

    // Show a confirmation popup
    var confirmed = confirm("Are you sure you want to delete this row?");

    if (confirmed) {
      // Remove the corresponding row from the data array
      if (rowIndex > -1) {
        data.splice(rowIndex, 1);
      }

      // Re-render the table with updated data
      showtable(data);
    }
  }
});


// execute the code for rendering the data
showtable(data);

// empty array for saving searched result
var searched = [];

// get the input for searching and dropdown
var input = document.getElementById("inp_search_blank");
var searchDropdown = document.getElementById("search_type_dropdown");

// code for searching and filter based on it
input.addEventListener("keyup", function() {
  var searchInput = this.value.toLowerCase();
  var filterValue = searchDropdown.value;

  // convert all saved data into lower case for easy searching
  searched = data.filter(function(val) {
    var id = val.id.toLowerCase();
    var name = val.name.toLowerCase();
    var date = val.date.toLowerCase();
    var amount = val.amount.toLowerCase();
    var status = val.status.toLowerCase();

    // check if input and searched input are the same
    if (
      (filterValue === "id" && id.includes(searchInput)) ||
      (filterValue === "name" && name.includes(searchInput)) ||
      (filterValue === "date" && date.includes(searchInput)) ||
      (filterValue === "amount" && amount.includes(searchInput)) ||
      (filterValue === "status" && status.includes(searchInput))
    ) {
      // saved the searched result into a new dictionary
      var newobj = {
        id: val.id,
        name: val.name,
        date: val.date,
        amount: val.amount,
        status: val.status,
        action: ""
      };
      return newobj;
    }
  });

  // render the searched result
  showtable(searched);
});

searchDropdown.addEventListener('change', function() {
  input.value = '';
  showtable(data);
});


/* CODE FOR SORT/ SORTING FUNCTION */

/* SORTING WITH DROPDOWN */

// get the dropdown
var sortDropdown = document.getElementById('sort_dropdown');

// Add change event listener to the sort dropdown
sortDropdown.addEventListener('change', function() {
  if (searched.length == 0) {
    sort(data);
  } else {
    sort(searched);
  }
});

function sort(data) {
  // Perform sorting or any other action here
  var selectedValue = sortDropdown.value;

  // Sort the data based on the selected value
  if (selectedValue === 'id_smallest') {
    data.sort(function(a, b) {
      return parseInt(a.id) - parseInt(b.id);
    });
  } else if (selectedValue === 'id_biggest') {
    data.sort(function(a, b) {
      return parseInt(b.id) - parseInt(a.id);
    });
  }

  // Render the sorted data
  showtable(data);
}


/* SORTING WITH POPUP */

// // var button for sort button
// var triggers = document.querySelectorAll('.sort_hint');

// // Add click event listener for the button
// triggers.forEach(function(trigger) {
//   trigger.addEventListener('click', function() {
    
//     // Get the corresponding popup element
//     var popup = document.getElementById("sort_popup")

//     // run 'show' function with the popup element
//     popup.classList.toggle('show');

//     // Calculate the position of the triggering box
//     var triggerRect = this.getBoundingClientRect();
//     var triggerTop = triggerRect.top + window.scrollY;
//     var triggerRight = triggerRect.right + window.scrollX;

//     // Set the position of the popup below the triggering box
//     popup.style.top = triggerTop + this.offsetHeight + 9 + 'px';
//     popup.style.left = triggerRight - popup.offsetWidth + 53 + 'px';
//   });
// });

// // Close the popup when the close button is clicked
// var closeButtons = document.querySelectorAll('.sort_popup .sort_close');

// // Add click event listener to each close button
// closeButtons.forEach(function(closeButton) {
//   closeButton.addEventListener('click', function() {
//     // Get the parent popup element
//     var popup = this.parentNode;

//     // Hide the popup by removing the 'show' class
//     popup.classList.remove('show');
//   });
// });