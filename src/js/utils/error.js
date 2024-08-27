export function displayError({
  message = 'An error occurred',
  element = document.querySelector('body'),
  errorType = 'error',
}) {
  const errorElement = document.createElement('div');
  const errorClass =
    errorType === 'error'
      ? 'error-message'
      : 'warning'
      ? 'warning-message'
      : '';
  errorElement.classList.add(errorClass);
  errorElement.setAttribute('role', 'alert');
  errorElement.setAttribute('aria-live', 'assertive');
  errorElement.innerHTML = message;
  element.appendChild(errorElement);
}

function removeError({ element = document.querySelector('body') }) {
  element.firstElementChild.remove();
}
