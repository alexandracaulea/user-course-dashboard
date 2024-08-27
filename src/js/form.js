import validator from 'validator';
import fetchUsers from './fetch/fetchUsers';
import { displayError } from './utils/error';
import { initToast } from './toast';

export function handleUserRegistrationFormSubmit({ form: formElement }) {
  formElement.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitButton = formElement.querySelector('.js-submit-btn');

    // Select the inputs and select elements
    const inputAndSelectElements =
      formElement.querySelectorAll('input, select');
    let isFormValid = true;

    // Clear any errors
    clearErrors(inputAndSelectElements);

    // Get the form values and sanitize them
    const data = {
      first_name: formElement.querySelector('#first_name').value,
      last_name: formElement.querySelector('#last_name').value,
      age: formElement.querySelector('#age').value,
      gender: formElement.querySelector('#gender').value,
      email: formElement.querySelector('#email').value,
      phone: formElement.querySelector('#phone').value,
      username: formElement.querySelector('#username').value,
      birthdate: formElement.querySelector('#birthdate').value,
      height: formElement.querySelector('#height').value,
      weight: formElement.querySelector('#weight').value,
      education: formElement.querySelector('#education').value,
      company: {
        name: formElement.querySelector('#name').value,
        position: formElement.querySelector('#position').value,
        salary: formElement.querySelector('#salary').value,
        start_date: formElement.querySelector('#start_date').value,
      },
    };

    const formData = sanitizeFormData(data);

    // Create the validations rules
    isFormValid = checkFormValidity({ formData, formElement, isFormValid });

    // Check if the user is already registered
    const registrationStatus = await isUserRegistered(formData);

    // Show error message and disable the button if the user is already registered
    if (registrationStatus) {
      submitButton.disabled = true;
      displayError({
        message: 'User already exists with this email address.',
        element: formElement.querySelector('#formValidationError'),
      });
    }

    // Close the modal if the user is not registered and if the form is valid
    // Show a toast message  after the modal was closed
    if (!registrationStatus && isFormValid) {
      document.body.classList.remove('no-scroll');
      document.querySelector('.modal').classList.add('hide-modal');
      document.querySelector('.modal-overlay').classList.add('hide-overlay');

      // Reset the form
      document.querySelector('.modal').querySelector('form').reset();

      // Initiate toast
      initToast({
        text: 'Form was validated successfully.',
        classes: [],
        duration: 3000,
      });
    }

    // Listen for the input event on the email and check if the email is already registered
    formElement.querySelector('#email').addEventListener(
      'input',
      debounce(async (e) => {
        const registrationStatus = await isUserRegistered({
          email: e.target.value,
        });
        if (!registrationStatus) {
          formElement.querySelector('#formValidationError').textContent = '';
          submitButton.disabled = false;
        }
      }, 500)
    );
  });
}

// Function used to clear errors
function clearErrors(domElements) {
  domElements.forEach((element) => {
    element.setAttribute('aria-invalid', false);
    element.nextElementSibling.textContent = '';
  });
}

// Function used to sanitize the form data
function sanitizeFormData(formData) {
  return {
    first_name: validator.escape(formData.first_name),
    last_name: validator.escape(formData.last_name),
    age: formData.age ? validator.toInt(formData.age).toString() : '',
    gender: validator.escape(formData.gender),
    email: validator.trim(formData.email),
    phone: validator.whitelist(formData.phone, '0-9-'), // remove the characters that do not appear in the whitelist
    username: validator.escape(formData.username),
    birthdate: validator.escape(formData.birthdate),
    height: validator.whitelist(formData.height, '0-9\'"'),
    weight: validator.toInt(formData.weight).toString(),
    education: validator.escape(formData.education),
    company: {
      name: validator.escape(formData.company.name),
      position: validator.escape(formData.company.position),
      salary: validator.toInt(formData.company.salary).toString(),
      start_date: validator.escape(formData.company.start_date),
    },
  };
}

// Function used to check form validity and create form rules
function checkFormValidity({ isFormValid = true, formData, formElement }) {
  const formDataValidators = [
    {
      field: 'last_name',
      rules: [
        {
          validator: (value) => {
            return !validator.isEmpty(value);
          },
          args: [],
          message: 'Last name is required.',
        },
        {
          validator: validator.isAlpha,
          args: ['en-US', { ignore: " -'" }],
          message: 'Last name contains invalid characters.',
        },
      ],
    },
    {
      field: 'username',
      rules: [
        {
          validator: (value) => {
            return !validator.isEmpty(value);
          },
          args: [],
          message:
            'Username is required, must be 5-15 characters long, and can only contain lowercase letters and optionally a single dot.',
        },
        {
          validator: validator.isLength,
          args: [{ min: 5, max: 15 }],
          message: 'Username must be 5-15 characters long.',
        },
        {
          validator: validator.matches,
          args: [/^[a-z]*(\.[a-z]*)?$/],
          message:
            'Username can only contain lowercase letters and optionally a single dot.',
        },
      ],
    },
    {
      field: 'gender',
      rules: [
        {
          validator: (value) => {
            return !validator.isEmpty(value);
          },
          args: [],
          message: 'Gender is required.',
        },
        {
          validator: (value) => ['Male', 'Female'].includes(value),
          args: [],
          message: 'Invalid gender.',
        },
      ],
    },
    {
      field: 'age',
      rules: [
        {
          validator: (value) => {
            return !validator.isEmpty(value);
          },
          args: [],
          message: 'Age is required, must be a positive number.',
        },
        {
          validator: validator.isInt,
          args: [{ min: 0 }],
          message: 'Age must be a positive number.',
        },
      ],
    },
    {
      field: 'email',
      rules: [
        {
          validator: (value) => {
            return !validator.isEmpty(value);
          },
          args: [],
          message: 'Email is required.',
        },
        {
          validator: validator.isEmail,
          args: [],
          message: 'Invalid email address.',
        },
      ],
    },
    {
      field: 'phone',
      rules: [
        {
          validator: (value) => {
            return !validator.isEmpty(value);
          },
          args: [],
          message:
            'Phone number is required, must be in the format 000-000-0000.',
        },
        {
          validator: validator.matches,
          args: [/^\d{3}-\d{3}-\d{4}$/], // Matches pattern 000-000-0000
          message: 'Phone number must be in the format 000-000-0000.',
        },
      ],
    },
    {
      field: 'education',
      rules: [
        {
          validator: (value) => {
            return !validator.isEmpty(value);
          },
          args: [],
          message: 'Education is required.',
        },
      ],
    },
    {
      field: 'birthdate',
      rules: [
        {
          validator: (value) => {
            return !validator.isEmpty(value);
          },
          args: [],
          message: 'Birth date is required.',
        },
        {
          validator: validator.isDate,
          args: [{ format: 'YYYY-MM-DD', strictMode: true }],
          message: 'Invalid date format, must be YYYY-MM-DD.',
        },
        {
          validator: (value) => {
            return validator.isBefore(
              value,
              new Date().toISOString().split('T')[0]
            );
          },
          args: [],
          message: 'Birth date cannot be in the future.',
        },
        {
          validator: (value) => {
            return validator.isAfter(value, '1900-01-01');
          },
          args: [],
          message: 'Birth date too far in the past.',
        },
      ],
    },
    {
      field: 'weight',
      rules: [
        {
          validator: (value) => !validator.isEmpty(value),
          args: [],
          message: 'Weight is required, must be a positive number.',
        },
        {
          validator: validator.isInt,
          args: [{ min: 0 }],
          message: 'Weight must be a positive number.',
        },
      ],
    },
    {
      field: 'company.position',
      rules: [
        {
          validator: (value) => {
            return !validator.isEmpty(value);
          },
          args: [],
          message: 'Position is required.',
        },
      ],
    },
    {
      field: 'height',
      rules: [
        {
          validator: (value) => {
            return !validator.isEmpty(value);
          },
          args: [],
          message: 'Height is required, must be in the format e.g. 7\' 10".',
        },
        {
          validator: validator.matches,
          args: [/^(\d+)'(\d{1,2})"$/],
          message: 'Height must be in the format 7\' 10".',
        },
      ],
    },
    {
      field: 'first_name',
      rules: [
        {
          validator: (value) => {
            return !validator.isEmpty(value);
          },
          args: [],
          message: 'First name is required.',
        },
        {
          validator: validator.isAlpha,
          args: ['en-US', { ignore: " -'" }],
          message: 'First name contains invalid characters.',
        },
      ],
    },
    {
      field: 'company.name',
      rules: [
        {
          validator: (value) => {
            return !validator.isEmpty(value);
          },
          args: [],
          message: 'Company Name is required.',
        },
      ],
    },
    {
      field: 'company.salary',
      rules: [
        {
          validator: validator.isInt,
          args: [{ min: 0 }],
          message: 'Salary is required, must be a positive number.',
        },
      ],
    },
    {
      field: 'company.start_date',
      rules: [
        {
          validator: (value) => {
            return !validator.isEmpty(value);
          },
          args: [],
          message: 'Start date is required.',
        },
        {
          validator: validator.isDate,
          args: [{ format: 'YYYY-MM-DD', strictMode: true }],
          message: 'Invalid date format, must be YYYY-MM-DD.',
        },
        {
          validator: (value) =>
            validator.isAfter(value, new Date().toISOString().split('T')[0]),
          args: [],
          message: 'Start date cannot be in the past.',
        },
      ],
    },
  ];

  formDataValidators.forEach((item) => {
    const { field, rules } = item;
    const fieldKey = getNestedProperty(field);
    // Destructure the prevKey and lastKey from the nested object
    // prevKey will be the parentKey of the nested object
    // nestedKey will be the nested key inside the nested object
    // e.g. {
    // 	..
    // 	"company": {"name": "ABC Inc."}
    // }
    const { prevKey: parentKey, lastKey: nestedKey } = fieldKey;

    // Iterate over each form validator rules
    for (const rule of rules) {
      const { validator: validatorFn, args, message } = rule;

      // Determine which value to validate, and show an error in the DOM for the specific DOM element
      const valueToValidate = field.includes('.')
        ? formData[parentKey][nestedKey]
        : formData[field];

      if (!validatorFn(valueToValidate, ...args)) {
        showError({
          formElement,
          domElement: nestedKey || field,
          errorMessage: message,
        });
        isFormValid = false;
        break;
      }
    }
  });

  return isFormValid;
}

function getNestedProperty(field) {
  const keysArray = field.split('.');
  if (keysArray.length > 1) {
    return {
      prevKey: keysArray[keysArray.length - 2],
      lastKey: keysArray[keysArray.length - 1],
    };
  }
  return field;
}

// Show DOM errors
function showError({ formElement, domElement, errorMessage }) {
  formElement
    .querySelector(`#${domElement}`)
    .setAttribute('aria-invalid', true);
  formElement.querySelector(`#${domElement}`).nextElementSibling.textContent =
    errorMessage;
}

// Function to check if the user is already registered with the email address
async function isUserRegistered(formData) {
  const users = await fetchUsers();
  const userExists = users.some((user) => user.email === formData.email);

  return userExists;
}

// Debounce
const debounce = (func, delay = 1000) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};
