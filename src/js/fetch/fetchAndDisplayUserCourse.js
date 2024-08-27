export default async function fetchAndDisplayUserCourse(id) {
  try {
    const response = await fetch('/src/data/courses.json');
    if (!response.ok) throw new Error('Error, something went wrong');

    const allCourses = await response.json();

    // Find all the courses the current user is enrolled
    const currentCourses = allCourses.filter((course) =>
      Array.isArray(course.userId)
        ? course.userId.includes(Number(id))
        : course.userId === Number(id)
    );

    // Create the HTML template
    const coursesList = currentCourses
      .map(
        (course) => `
					<a class="user__detail__enrolled" href="/course/${course.id}">
						<h2 class="user__detail__course">${course.title}</h2>
						<p class="user__detail__course__detail">${course.description}</p>
						<div class="badge__container">
							<span class="badge badge--secondary">${course.category}</span>
							<span class="badge badge--primary">${course.duration}</span>
						</div>
					</a>
                    `
      )
      .join('');

    document.querySelector('#courses').innerHTML = coursesList;
  } catch (error) {
    console.error(error);
  }
}
