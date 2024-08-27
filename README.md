# User Course Dashboard

A web app for viewing users and the courses they are enrolled in.

## Key Features

1. Routes:

- `/`: List of users with options for table or card view.
- `/user`: Detailed view of a selected user.
- `/course`: Details of courses associated with a user.

## User Stories

The workflow:

On the homepage (url: /):

- Upon loading, a request is made to `users.json`, and the list of users is displayed in a table format, with the button associated with this view highlighted.
- If the button for the card view is clicked, the user list changes to card view, and the button associated with this functionality is highlighted.
- If there are 0 users, a custom message is displayed.
- If the "Add User" button is clicked, all elements are validated. When the form is submitted, a request is made to the `users.json` file to check if the user already exists. If the user exists, the form is disabled, and a custom message is displayed. The button will not be disabled when there are no errors.
- The modal closes when the X button, Cancel button is clicked, the overlay is clicked, or the ESC key is pressed. When the modal is closed, all inputs are reset. If there are no errors, the modal will disappear, and a toast message will be displayed for a few seconds.
- When the "View" link for a user is clicked, it redirects to `/user/id`, where id is the ID of the respective user.

On the `/user/id` page:

- Upon loading, a request is made to `users.json`, and I display the details of the user associated with the ID taken from the URL and the courses in which this user is enrolled. If one of the courses is clicked, it redirects to the course in which that user is enrolled.

On the `/course/id` page:

- Upon loading, a request is made to `courses.json`, and I display the details of the course associated with the ID taken from the URL. Another request is made to check which users are enrolled in the course. When one of the "View User" links is clicked, it redirects to the detail page of the respective user.

## Tools and technologies

- HTML, CSS, TailwindCSS, JavaScript.
- Vite, [Validator](https://www.npmjs.com/package/validator).
