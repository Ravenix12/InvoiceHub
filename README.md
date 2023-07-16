# InvoiceHub
## 50.003 - Retail Invoice Management System 

Project Description : 
The Retail Invoice Management System is a comprehensive software solution designed to streamline and automate invoice data management in the retail industry. The system offers a set of powerful subsystems that enable efficient handling of invoices, data extraction, storage, search, analysis, and export. It simplifies the entire invoice processing workflow, from importing physical invoices to generating customized reports and integrating with other software applications.


### Progress notes

> Implementing subsytem by subsystem 
> User Authentication (Subsystem)
>Main Functions :
>> Create and modify notifications
>> Send push notifications to user on upcoming payments to be made



### Commenting Guidelines 

The notifications and reminders system allows users to create and modify reminders on upcoming payments to be made. 

### Searching localStorage for reminders

After logging in, the Notifications system searches localStorage and extracts all the information stored. It then iterates through every element, extracts the outstanding amount, currency, and supplier from each table, creates a formatted string with the extracted information which is then shown as a push notification. Users must press the notificatoin to aclmpw;edge. Acknowledging all notifications results in an alert message appearing informing that all notifications have been acknowledged.

### Adding Reminders
Pressing the "Add Reminder" button causes a new row to be added in the table. Users can edit each table cell with the relevant information. 

### Deleting Reminders
Users can delete reminders by selecting all the reminders to be deleted before pressing the "Delete Reminder" button. Pressing this button causes the algorithm to iterate over every row in the table and checks the status of the checkbox (located at the last column of the table): if the checkbox is checked (cb.checked==true), the algorithm removes the entire row from the table.

### Saving changes
After all necessary modifications to reminders are made, users have to their changes using the "Save" button. Upon pressing "Save", the values of all the table cells in each row are extracted and pushed as an array of strings into an array. After iterating through all the rows, the array is stored in localStorage.  
