import fetchAndDisplayData from './fetch/fetchAndDisplayData';
import fetchUsers from './fetch/fetchUsers';
import fetchCourses from './fetch/fetchCourses';

export async function renderCoursePage() {
  const path = window.location.pathname;
  const id = path.split('/')[2];

  // Load the `course.html` page
  await fetchAndDisplayData('/course.html'); // Ensure the `course.html` page is fetched and rendered first

  // Fetch the courses
  const allCourses = await fetchCourses();
  const courseId = Number(id);
  const currentCourse = allCourses.filter(
    (course) => course.id === courseId
  )[0];
  const usersIdsEnrolled = currentCourse.userId;

  // Fetch the users
  const allUsers = await fetchUsers();

  // Filter the users enrolled
  const usersEnrolled = allUsers.filter((user) =>
    Array.isArray(usersIdsEnrolled)
      ? usersIdsEnrolled.includes(user.id)
      : user.id === usersIdsEnrolled
  );

  // Change the page title
  document.title = `Course: ${currentCourse.title}`;

  // Display the current course
  displayCurrentCourse(currentCourse);

  // Display the users enrolled in the current course
  displayUsersEnrolled(usersEnrolled);
}

function displayUsersEnrolled(usersEnrolled) {
  const pageContainer = document.querySelector('[data-page="course"]');
  if (!pageContainer) return;

  const usersEnrolledTemplate = usersEnrolled
    .map(
      (user) => `
			<div  class="enrolled__user__card">
				<div class="enrolled__user__information">
					<p id="enrolled__user__name" class="enrolled__user__name">${user.first_name} ${user.last_name}</p>
					<p id="enrolled__user__company" class="enrolled__user__company">${user.company.name}</p>
				</div>
				<div class="enrolled__user__contact">
					<div class="enrolled__user__contact--inner">
						<svg class="shrink-0" aria-hidden="true" width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M1.929 1.446a.484.484 0 0 0-.483.483v.666l5.199 4.267a1.686 1.686 0 0 0 2.142 0l5.195-4.267v-.666a.484.484 0 0 0-.482-.483H1.929Zm-.483 3.02v5.177c0 .265.217.482.483.482H13.5a.483.483 0 0 0 .482-.482V4.466L9.703 7.979a3.134 3.134 0 0 1-3.978 0L1.446 4.466ZM0 1.929A1.93 1.93 0 0 1 1.929 0H13.5a1.93 1.93 0 0 1 1.929 1.929v7.714A1.93 1.93 0 0 1 13.5 11.57H1.929A1.93 1.93 0 0 1 0 9.643V1.929Z"
								fill="#52525B"
							/>
						</svg>
						<p class="enrolled__user__email">${user.email}</p>
					</div>
				</div>
				<div class="enrolled__user__profile">
					<a href="/user/${user.id}" class="enrolled__user__link">View User <span aria-hidden="true">-&gt;</span></a>
				</div>
			</div>
	`
    )
    .join('');

  const userCardElement = pageContainer.querySelector('#enrolled__user__card');
  userCardElement.innerHTML = usersEnrolledTemplate;
}

function displayCurrentCourse(currentCourse) {
  const pageContainer = document.querySelector('[data-page="course"]');
  if (!pageContainer) return;

  const template = `
		<h2 class="course__page__title">Course: ${currentCourse.title}</h2>
			<p class="course__page__description">${currentCourse.description}</p>
			<div class="course__page__badges__container">
				<p>Category: <span class="badge badge--secondary">${currentCourse.category}</span></p>
				<p>Duration: <span class="badge badge--primary">${currentCourse.duration}</span></p>
        <p>Id: <span class="badge badge--info">${currentCourse.id}</span></p>
			</div>
		`;

  const courseContainer = pageContainer.querySelector(
    '#course__page__information'
  );
  courseContainer.innerHTML = template;
}
