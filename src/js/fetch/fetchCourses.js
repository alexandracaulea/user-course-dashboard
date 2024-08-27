import { displayError } from '../utils/error';

export default async function fetchCourses() {
  try {
    const response = await fetch('/courses.json');
    const data = await response.json();

    if (!response.ok) throw new Error('Error, something went wrong');

    return data;
  } catch (error) {
    displayError({
      message: 'An unexpected error occurred. Please try again later.',
      element: document.querySelector('#view'),
    });
    console.error(error);
  }
}
