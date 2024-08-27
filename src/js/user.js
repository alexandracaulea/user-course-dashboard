import fetchAndDisplayData from './fetch/fetchAndDisplayData';
import fetchAndDisplayUserCourse from './fetch/fetchAndDisplayUserCourse';
import fetchUsers from './fetch/fetchUsers';

export async function renderUserPage() {
  const path = window.location.pathname;
  const id = path.split('/')[2];

  // Load the `user.html` page
  await fetchAndDisplayData('/user.html');

  // Fetch the users
  const allUsers = await fetchUsers();

  // Find the current user based on the id specified in the query parameter
  const currentUser = allUsers.filter((user) => user.id === Number(id))[0];

  // Render the user information to the DOM
  displayUserInformation(currentUser);

  // Change the page title
  document.title = `${currentUser.first_name} ${currentUser.last_name} Details Page`;

  // Fetch and display the courses that the current user is enrolled
  await fetchAndDisplayUserCourse(id);
}

function displayUserInformation(user) {
  const pageContainer = document.querySelector('[data-page="user"]');
  if (!pageContainer) return;

  const { first_name, last_name } = user;
  pageContainer.querySelector(
    '#user-details'
  ).textContent = `User: ${first_name} ${last_name}`;

  // loop over each user key and display the information to the DOM
  loopOverUserKeys(user, pageContainer);
}

function loopOverUserKeys(user, domElement) {
  const printKeys = (user, level = 0) => {
    Object.keys(user).forEach((key) => {
      if (typeof user[key] === 'object' && user[key] !== null) {
        printKeys(user[key], level + 1); // Recursively handle nested objects
      }

      if (domElement.querySelector(`#${key}`)) {
        domElement.querySelector(`#${key}`).textContent = user[key];
      }
    });
  };

  printKeys(user);
}
