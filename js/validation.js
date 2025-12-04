/*
==========================================================
VALIDATION.JS - Visitor Form Validation Library
==========================================================
Author: James Behrmann
Purpose: Provides validation functions for the visitor registration form
Includes regex patterns and custom validation logic
==========================================================
*/

// Regular expressions for format validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
const zipRegex = /^\d{5}(-\d{4})?$/;

// List of valid US state abbreviations
const stateAbbreviations = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

/**
 * Initialize form validation by setting up event listeners
 * @param {string} formSelector - CSS selector for the form element
 */
function initValidation(formSelector) {
    const form = document.querySelector(formSelector);
    
    if (!form) {
        console.error('Form not found:', formSelector);
        return;
    }
    
    // Get all input elements (except submit button)
    const inputs = form.querySelectorAll('input[type!="submit"], textarea, select');
    
    // Add change event listeners for real-time validation
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('change', function() {
            if (this.type === 'checkbox') {
                validateCheckboxGroup(this.name);
            }
        });
    });
    
    // Add submit event listener
    const submitBtn = form.querySelector('#submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            validateFormSubmit(form);
        });
    }
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();
        validateFormSubmit(form);
    });
}

/**
 * Validate a single field based on its type and requirements
 * @param {HTMLElement} field - The form field to validate
 */
function validateField(field) {
    const fieldId = field.id;
    let isValid = true;
    let errorMessage = '';
    
    // Determine field type and validate accordingly
    if (fieldId === 'firstName' || fieldId === 'lastName') {
        isValid = checkRequired(fieldId, 'This field is required');
    } else if (fieldId === 'address') {
        isValid = checkRequired(fieldId, 'Address is required');
    } else if (fieldId === 'city') {
        isValid = checkRequired(fieldId, 'City is required');
    } else if (fieldId === 'state') {
        isValid = checkRequired(fieldId, 'State is required');
        if (isValid) {
            isValid = validateState(fieldId, 'Please enter a valid US state abbreviation (e.g., CA, NY)');
        }
    } else if (fieldId === 'zip') {
        isValid = checkRequired(fieldId, 'Zip code is required');
        if (isValid) {
            isValid = checkFormat(fieldId, 'Please enter a valid zip code (e.g., 12345 or 12345-6789)', zipRegex);
        }
    } else if (fieldId === 'phone') {
        isValid = checkRequired(fieldId, 'Phone number is required');
        if (isValid) {
            isValid = checkFormat(fieldId, 'Please enter a valid phone number (e.g., (555) 123-4567)', phoneRegex);
        }
    } else if (fieldId === 'email') {
        isValid = checkRequired(fieldId, 'Email is required');
        if (isValid) {
            isValid = checkFormat(fieldId, 'Please enter a valid email address', emailRegex);
        }
    } else if (fieldId === 'howFound') {
        isValid = checkRequired(fieldId, 'Please select how you found our page');
    } else if (fieldId === 'comments') {
        // Comments are optional, no validation needed
        isValid = true;
    }
}

/**
 * Check if a required field has a value
 * @param {string} fieldId - The ID of the field to check
 * @param {string} errorMessage - The error message to display if validation fails
 * @returns {boolean} - True if field has a value, false otherwise
 */
function checkRequired(fieldId, errorMessage) {
    const field = document.getElementById(fieldId);
    
    if (!field) {
        console.error('Field not found:', fieldId);
        return false;
    }
    
    let hasValue = false;
    
    // Handle checkbox groups
    if (field.type === 'checkbox') {
        const checkboxes = document.querySelectorAll(`input[name="${field.name}"]`);
        hasValue = Array.from(checkboxes).some(cb => cb.checked);
    } else {
        hasValue = field.value && field.value.trim().length > 0;
    }
    
    const isValid = hasValue;
    setElementValidity(fieldId, isValid, errorMessage);
    
    return isValid;
}

/**
 * Check if field value matches a regex pattern
 * @param {string} fieldId - The ID of the field to check
 * @param {string} errorMessage - The error message to display if validation fails
 * @param {RegExp} regex - The regex pattern to match against
 * @returns {boolean} - True if value matches pattern, false otherwise
 */
function checkFormat(fieldId, errorMessage, regex) {
    const field = document.getElementById(fieldId);
    
    if (!field) {
        console.error('Field not found:', fieldId);
        return false;
    }
    
    const value = field.value.trim();
    const isValid = regex.test(value);
    
    setElementValidity(fieldId, isValid, errorMessage);
    
    return isValid;
}

/**
 * Validate that state abbreviation is in the valid states list
 * @param {string} fieldId - The ID of the state field
 * @param {string} errorMessage - The error message to display if validation fails
 * @returns {boolean} - True if state is valid, false otherwise
 */
function validateState(fieldId, errorMessage) {
    const field = document.getElementById(fieldId);
    
    if (!field) {
        console.error('Field not found:', fieldId);
        return false;
    }
    
    const value = field.value.trim().toUpperCase();
    const isValid = stateAbbreviations.includes(value);
    
    setElementValidity(fieldId, isValid, errorMessage);
    
    return isValid;
}

/**
 * Validate checkbox group (at least one must be selected)
 * @param {string} groupName - The name attribute of the checkbox group
 * @returns {boolean} - True if at least one checkbox is checked, false otherwise
 */
function validateCheckboxGroup(groupName) {
    const checkboxes = document.querySelectorAll(`input[name="${groupName}"]`);
    const isValid = Array.from(checkboxes).some(cb => cb.checked);
    const errorDiv = document.getElementById(groupName + '-error');
    
    if (!isValid) {
        const errorMessage = 'Please select at least one option';
        checkboxes.forEach(cb => {
            cb.classList.add('was-validated');
            cb.setCustomValidity(errorMessage);
        });
        if (errorDiv) {
            errorDiv.textContent = errorMessage;
            errorDiv.style.display = 'block';
        }
    } else {
        checkboxes.forEach(cb => {
            cb.classList.remove('was-validated');
            cb.setCustomValidity('');
        });
        if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
        }
    }
    
    return isValid;
}

/**
 * Set the validity state of a form element and display error message
 * @param {string} fieldId - The ID of the field
 * @param {boolean} isValid - Whether the field is valid
 * @param {string} message - The error message to display
 */
function setElementValidity(fieldId, isValid, message) {
    const field = document.getElementById(fieldId);
    
    if (!field) {
        console.error('Field not found:', fieldId);
        return;
    }
    
    // For checkbox groups, set validity on first checkbox
    if (field.type === 'checkbox') {
        const checkboxes = document.querySelectorAll(`input[name="${field.name}"]`);
        checkboxes.forEach(cb => {
            if (isValid) {
                cb.classList.remove('was-validated');
                cb.setCustomValidity('');
            } else {
                cb.classList.add('was-validated');
                cb.setCustomValidity(message);
            }
        });
        // Update error message for first checkbox
        if (checkboxes.length > 0) {
            const errorDiv = checkboxes[0].nextElementSibling;
            if (errorDiv && errorDiv.classList.contains('errorMsg')) {
                errorDiv.textContent = isValid ? '' : message;
            }
        }
    } else {
        if (isValid) {
            field.classList.remove('was-validated');
            field.setCustomValidity('');
        } else {
            field.classList.add('was-validated');
            field.setCustomValidity(message);
        }
        
        // Update error message
        const errorDiv = field.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('errorMsg')) {
            errorDiv.textContent = isValid ? '' : message;
        }
    }
}

/**
 * Validate the entire form on submit
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} - True if form is valid, false otherwise
 */
function validateForm(form) {
    let isFormValid = true;
    
    // Validate personal information
    if (!checkRequired('firstName', 'First name is required')) isFormValid = false;
    if (!checkRequired('lastName', 'Last name is required')) isFormValid = false;
    if (!checkRequired('email', 'Email is required')) isFormValid = false;
    if (document.getElementById('email').classList.contains('was-validated') && 
        !document.getElementById('email').validity.valid) {
        if (!checkFormat('email', 'Please enter a valid email address', emailRegex)) isFormValid = false;
    }
    if (!checkRequired('phone', 'Phone number is required')) isFormValid = false;
    if (document.getElementById('phone').classList.contains('was-validated') && 
        !document.getElementById('phone').validity.valid) {
        if (!checkFormat('phone', 'Please enter a valid phone number (e.g., (555) 123-4567)', phoneRegex)) isFormValid = false;
    }
    
    // Validate address information
    if (!checkRequired('address', 'Address is required')) isFormValid = false;
    if (!checkRequired('city', 'City is required')) isFormValid = false;
    if (!checkRequired('state', 'State is required')) isFormValid = false;
    if (document.getElementById('state').classList.contains('was-validated') && 
        !document.getElementById('state').validity.valid) {
        if (!validateState('state', 'Please enter a valid US state abbreviation (e.g., CA, NY)')) isFormValid = false;
    }
    if (!checkRequired('zip', 'Zip code is required')) isFormValid = false;
    if (document.getElementById('zip').classList.contains('was-validated') && 
        !document.getElementById('zip').validity.valid) {
        if (!checkFormat('zip', 'Please enter a valid zip code (e.g., 12345 or 12345-6789)', zipRegex)) isFormValid = false;
    }
    
    // Validate "How Found" dropdown
    if (!checkRequired('howFound', 'Please select how you found our page')) isFormValid = false;
    
    // Validate checkbox group (interests)
    if (!validateCheckboxGroup('interests')) isFormValid = false;
    
    return isFormValid;
}
