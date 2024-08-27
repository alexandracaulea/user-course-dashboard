export function initToast({ text = 'Success', classes = '', duration = 4000 }) {
  const toastContainer = document.querySelector('#toast-container');

  // Early return if the toastContainer does not exist on the page
  if (!toastContainer) return;

  toastContainer.setAttribute('role', 'alert');

  const template = `
		<div class="toast ${classes.join(' ')}">
			<div class="toast__inner">
				<div class="toast__content">
					<svg width="18" height="18" aria-hidden="true" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M17 8.269v.736a8 8 0 1 1-4.744-7.312" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
						<path d="m17 2.605-8 8.008-2.4-2.4" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
					<p class="toast__text">${text}</p>
				</div>
				<button class="toast__button hidden">
					<span class="sr-only">Close</span>
					<svg class="w-3.5 h-3.5" aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M16.98 2.434a1 1 0 0 0-1.414-1.414L9 7.586 2.434 1.02A1 1 0 0 0 1.02 2.434L7.586 9 1.02 15.566a1 1 0 1 0 1.414 1.414L9 10.414l6.566 6.566a1 1 0 1 0 1.414-1.414L10.414 9l6.566-6.566Z"
							fill="#16a34a"
						></path>
					</svg>
				</button>
			</div>
		</div>
	`;

  toastContainer.innerHTML = template;

  const toast = toastContainer.querySelector('.toast');

  // Show the toast
  setTimeout(() => {
    toast.classList.add('toast--show');
  }, 100);

  // Hide the toast after the specified duration
  setTimeout(() => {
    toast.classList.remove('toast--show');
    toast.classList.add('toast--hide');

    // Remove the toast from the DOM after the transition ends
    toast.addEventListener('transitionend', () => {
      if (toast.parentElement === toastContainer) {
        toastContainer.removeChild(toast);
      }
    });
  }, duration);
}
