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

**Searching localStorage and extracting information to create custom reminders**
After logging in, the Notifications system searches localStorage and extracts all the information stored. It then iterates through every element, extracts the outstanding amount, currency, and supplier from each table, creates a formatted string with the extracted information which is then shown as a push notification. 
