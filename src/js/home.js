import fetchUsers from './fetch/fetchUsers';
import warningIcon from '../images/smiley-face.svg?raw';
import fetchAndDisplayData from './fetch/fetchAndDisplayData';
import { initModal } from '../js/modal.js';
import { displayError } from './utils/error.js';

export async function renderHomepage() {
  await fetchAndDisplayData('/home.html');
  // Render the Table view on page load
  createViewMode({
    root: document.querySelector('#view'),
    buttonGroupRoot: document.querySelector('.view-mode-group'),
  });

  // Initiate the modal
  initModal({
    modalButtons: document.querySelectorAll('.js-open-modal-btn'),
    modal: document.querySelector('#js-modal'),
    modalOverlay: document.querySelector('#js-modal-overlay'),
  });

  document.addEventListener('keydown', (e) => {
    const modal = document.querySelector('#js-modal');
    const modalOverlay = document.querySelector('#js-modal-overlay');

    // Pressing the ESC key closes the modal and overlay
    if (
      e.key === 'Escape' &&
      !modal.classList.contains('hide-modal') &&
      !modalOverlay.classList.contains('hide-overlay')
    ) {
      // Close the modal and overlay
      document.body.classList.remove('no-scroll');
      modal.classList.add('hide-modal');
      modalOverlay.classList.add('hide-overlay');

      // Reset the form
      modal.querySelector('form').reset();
    }
  });
}

// Generate the markup for the Table View
function generateMarkupTableMode(users) {
  const numberOfUsers = users.length;
  const usersList = users
    .map(
      (user) => `
				<tr>
					<td class="table-view__cell table-view__cell--data">${user.first_name}</td>
					<td class="table-view__cell table-view__cell--data">${user.last_name}</td>
					<td class="table-view__cell table-view__cell--data">${user.email}</td>
					<td class="table-view__cell table-view__cell--data">
						<a href="/user/${user.id}" class="table-view__link">
						View <span class="table-view__link-arrow" aria-hidden="true">-&gt;</span>
						</a>
					</td>
				</tr>
				`
    )
    .join('');

  const template = `
		<section class="table-view">
			<h3 class="table-view__title">
				All Users
				<span class="table-view__total">${numberOfUsers}</span>
			</h3>
			<div class="table-view__container">
				<table class="table-view__table">
					<thead class="table-view__header">
						<tr>
							<th class="table-view__cell table-view__cell--header">First name</th>
							<th class="table-view__cell table-view__cell--header">Last name</th>
							<th class="table-view__cell table-view__cell--header">Email</th>
							<th class="utility-sr-only">User details</th>
						</tr>
					</thead>
					<tbody class="table-view__body">
						${usersList}
					</tbody>
				</table>
			</div>
		</section>
	`;
  return template;
}

// Generate the markup for the Card View
function generateMarkupCardMode(users) {
  const numberOfUsers = users.length;
  const usersList = users
    .map(
      (user) => `
				<li class="card-view__item">
					<div class="card-view__content">
						<h2 class="card-view__title">${user.first_name} ${user.last_name}</h2>
						<p class="card-view__text">${user.email}</p>
					</div>
					<div class="card-view__footer">
						<a href="/user/${user.id}" class="card-view__link">View<span class="card-view__link-arrow" aria-hidden="true">-&gt;</span></a>
					</div>
				</li>
				`
    )
    .join('');

  const template = `
		<section class="card-view">
			<h3 class="card-view__header">
				All Users
				<span class="card-view__total">${numberOfUsers}</span>
			</h3>
			<ul class="card-view__list">
				${usersList}
			</ul>
		</section>
	`;

  return template;
}

// Render the Table or Card View on the DOM
function renderTemplate({ viewType, root, users, buttonGroupRoot }) {
  if (viewType === 'table') {
    const template = generateMarkupTableMode(users);
    root.innerHTML = template;
  }

  if (viewType === 'card') {
    const template = generateMarkupCardMode(users);
    root.innerHTML = template;
  }

  const activeView = buttonGroupRoot.querySelector(`[data-value=${viewType}]`);
  activeView.classList.add('active-view');
  activeView.setAttribute('aria-pressed', true);
}

// Create the View Mode functionality
async function createViewMode({ root, buttonGroupRoot, viewType = 'table' }) {
  const users = await fetchUsers();

  if (users?.length > 0) {
    renderTemplate({ users, viewType, root, buttonGroupRoot });

    buttonGroupRoot.addEventListener('click', (event) => {
      const viewButtons = buttonGroupRoot.querySelectorAll('button');
      viewButtons.forEach((button) => {
        button.classList.remove('active-view');
        button.setAttribute('aria-pressed', false);
      });

      const activeButton = event.target.closest('button');
      activeButton.classList.add('active-view');
      activeButton.setAttribute('aria-pressed', true);
      renderTemplate({
        users,
        viewType: activeButton.dataset.value,
        root,
        buttonGroupRoot,
      });
    });
  } else {
    if (!users) return;

    displayError({
      message: `${warningIcon} It looks like there are no users. Click Add User to create one.`,
      element: document.querySelector('#view'),
      errorType: 'warning',
    });
  }
}
