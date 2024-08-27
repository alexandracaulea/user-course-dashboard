import '../css/index.css';
import { renderHomepage } from './home';
import { renderUserPage } from './user';
import { renderCoursePage } from './course';

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  const isUserPage = path.startsWith('/user/');
  const isCoursePage = path.startsWith('/course');

  if (isUserPage) {
    renderUserPage();
  } else if (isCoursePage) {
    renderCoursePage();
  } else {
    renderHomepage();
  }
});
