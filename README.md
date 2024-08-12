VISIT AND TRY => [https://cherdak-pavlo.github.io/library/](url)

#Overview
The Books Management System is a React-based application that allows users to manage a collection of books. Users can view, sort, filter, update, and delete books, as well as download the data in JSON format. The application also provides functionalities to add new books with validation and dynamic author management.

#Features
Dropdown Sorting
At the top of the page, there's a dropdown list that allows users to sort the books alphabetically. You can choose to sort the books by:
Name: Sorts books alphabetically by their name.
Author: Sorts books alphabetically by the author's name.
Download Data
Next to the sorting dropdown, there is a "Download" button. This button enables users to download the current view of the data as a JSON file. If you have filtered books by a specific author, the downloaded JSON will only include the books of that author.

#Table Operations
The main table displays the books with the following functionalities:
Sort by Author: Click on an author's name to filter and display only the books by that author.
Update: Click the "Update" button next to a book to edit its details.
Delete: Click the "Delete" button next to a book to remove that specific record.
When an author is selected (by clicking on their name), two additional buttons appear below the table:

#View All Books: Returns to the view of all books.
Delete Author: Removes the selected author and all books associated with them.
Add New Book
Below the table, there's a form for adding new books:

#Form Fields:
Name: The name of the book (required).
Author: The author of the book (required). You can either select an existing author from the dropdown or create a new one by choosing the appropriate option.
Annotation: A brief annotation or description of the book (required).
Validation: All fields in the form must be filled out to successfully add a book.
