// data from InvoiceData.js
import { data } from './InvoiceData.js';

// code for rendering the data
function showtable(data_arr) {

  // set up the title of each column
  var table = document.getElementById("invoice_table");
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

  // get the icons for delete and more
  for (var i = 0; i < data_arr.length; i++) {
    var deleteIcon = `
      <svg class="ic_delete" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
      </svg>`;

    var moreIcon = `
      <a href="#">
        <svg class="ic_more" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
          <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
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
        <td>${deleteIcon} ${moreIcon}</td>
      </tr>`;
  }
  // Add event listener for delete icon using event delegation
  table.addEventListener("click", function (event) {
    if (event.target.classList.contains("ic_delete")) {
      // Retrieve the row index by finding the parent row element
      var rowIndex = event.target.closest("tr").rowIndex - 1;

      // Remove the corresponding row from the data_arr array
      data_arr.splice(rowIndex, 1);

      // Re-render the table with updated data
      showtable(data_arr);
    }
  });
}


// execute the code for rendering the data
showtable(data);

// empty array for saving searched result
var searched = [];

// get the input for searching and dropdown
var input = document.getElementById("inp_search_blank");
var dropdown = document.getElementById("search_type");

// code for searching and filter based on it
input.addEventListener("keyup", function() {
  var searchInput = this.value.toLowerCase();
  var filterValue = dropdown.value;

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
