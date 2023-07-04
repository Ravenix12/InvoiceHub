//load data from localStorage
document.getElementById("Data Table").innerHTML = localStorage.getItem("Data Table");
document.getElementById("Data Table").style.textAlign = "center";//center-aligns text

//Count number of reminders and alerts user of all the reminders
var table = document.getElementById("Data Table");
var row = document.getElementById("Data Table").getElementsByTagName("tr");
var length = row.length - 1;


for (let y = length; y > 0; y--) {
    var person = document.getElementById("Data Table").rows[y].cells[0].innerHTML;
    var amount = document.getElementById("Data Table").rows[y].cells[4].innerHTML;
    var currency = document.getElementById("Data Table").rows[y].cells[3].innerHTML;
    var date = document.getElementById("Data Table").rows[y].cells[2].innerHTML;

    var message = "You have an outstanding amount of " + currency + amount + " due to " + person;
    Notification.requestPermission();
    new Notification(message);
}

function AddReminder() {
    //Creates new table row at the bottom of the table
    var table = document.getElementById("Data Table");
    table.style.textAlign = "center";//center align text

    var table = document.getElementById("Data Table");
    var newRow = table.insertRow(table.rows.length);

    //Creates table cell and sets the default value to "NEW CELL" to be modified by the user
    var cell1 = newRow.insertCell(0);//add new cells
    cell1.innerHTML = "NEW CELL";

    var cell2 = newRow.insertCell(1);
    cell2.innerHTML = 'NEW CELL';

    var cell3 = newRow.insertCell(2);
    cell3.innerHTML = 'NEW CELL';

    var cell4 = newRow.insertCell(3);
    cell4.innerHTML = "NEW CELL";

    var cell5 = newRow.insertCell(4);
    cell5.innerHTML = 'NEW CELL';
    newRow.insertAdjacentHTML('beforeEnd', "<td> <div class='form-control'><input type='checkbox' id='checkbox' checked='false' >  </div></td>");   //add checkbox
};




function DeleteReminder() {
    //iterates every row in table (except the first), checks the status of the checkbox in each table row, and removes the table row if the checkbox is checked
    var table = document.getElementById("Data Table");
    var length = table.rows.length - 1;
    if (length == 0) {
        alert("There are no reminders to delete");
    }
    if (length == 1) {
        var cb = document.querySelector('#checkbox');
        if (cb.checked == true) {
            table.deleteRow(1);
        };
    }
    else {
        for (let i = length; i > 0; i--) {
            var cb = document.getElementById("Data Table").rows[i].querySelector("#checkbox");
            if (cb.checked == true) {
                table.deleteRow(i);
            };

        };
        //starts from last entry, otherwise rows may get skipped
    };
};

//Save table
function Save() {
    var arr = [];
    var table = document.getElementById("Data Table");
    var length = table.rows.length - 1;
    //For-loop to iterate through every table cell, extracts the value in the table cell and stores the value in an array
    //After all the table cells have been visited, the array is stored in localStorage
    for (let i = 1; i <= length; i++) {
        var supplier = table.rows[i].cells[0].innerHTML;
        var InVoiceNo = table.rows[i].cells[1].innerHTML;
        var InvoiceDate = table.rows[i].cells[2].innerHTML;
        var Currency = table.rows[i].cells[3].innerHTML;
        var amount = table.rows[i].cells[4].innerHTML;
        arr.push(supplier, InVoiceNo, InvoiceDate, Currency, amount);
        arr.push("\n");
    };
    localStorage.setItem("Data Table", document.getElementById("Data Table").innerHTML);

    alert("Changes Saved!");
};