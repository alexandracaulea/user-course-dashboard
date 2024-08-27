import { handleUserRegistrationFormSubmit } from './form';

export function initModal({ modalButtons, modal, modalOverlay }) {
  if (!modalButtons && !modal && !modalOverlay) return;

  // Register a click event for each modalButtons
  modalButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const closeModalBtn = modal.querySelector('.js-close-modal-btn');
      const resetBtn = modal.querySelector('.js-reset-btn');

      // Open the modal when the modal button is clicked
      toggleModal({ modal, modalOverlay, isOpen: true });
      // openModal({ modal, modalOverlay, isOpen: true });

      // Close the modal and overlay when clicking on the X button
      closeModalBtn.addEventListener('click', () => {
        toggleModal({ modal, modalOverlay, isOpen: false });
      });

      // Close the modal and overlay when clicking on the "Cancel"
      resetBtn.addEventListener('click', () => {
        toggleModal({ modal, modalOverlay, isOpen: false });
      });

      // Close the modal and overlay when clicking on the overlay
      modalOverlay.addEventListener('click', () => {
        toggleModal({ modal, modalOverlay, isOpen: false });
      });
    });
  });

  // Form registration
  handleUserRegistrationFormSubmit({
    form: modal.querySelector('.js-add-user-form'),
  });
}

export function toggleModal({ modal, modalOverlay, isOpen }) {
  document.body.classList.toggle('no-scroll', isOpen);
  modal.classList.toggle('hide-modal', !isOpen);
  modalOverlay.classList.toggle('hide-overlay', !isOpen);

  // Reset the form when closing the modal
  if (!isOpen) {
    modal.querySelector('form').reset();
  }
}
