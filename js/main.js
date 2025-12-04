/*
==========================================================
MAIN.JS - Application Entry Point
==========================================================
Author: James Behrmann
Purpose: Main initialization file for the Bread Delight website
Initializes validation, page navigation, and theme management

Changes in this iteration:
- Refactored from theme-toggle.js into modular structure
- Separated concerns: validation (validation.js), page nav (page.js)
- Added visitor form functionality and validation
- Implemented hide/show pattern for all content sections
- Added form submission handling with thank you message
==========================================================
*/

document.addEventListener('DOMContentLoaded', function(event) {
    // Initialize page navigation
    initPageNavigation();
    
    // Initialize theme toggle
    initThemeToggle();
    
    // Initialize form validation for visitor form
    initValidation('#visitorForm');
    
    // Set up "Log Visit" button to show the visitor form
    const logVisitLinks = document.querySelectorAll('a[href="#log-visit"]');
    logVisitLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            showVisitorForm();
        });
    });
    
    // Set up form submit event handler
    const form = document.getElementById('visitorForm');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            // Validate the entire form
            if (validateForm(form)) {
                // Form is valid, show thank you message
                showThankYouMessage();
                
                // Log the form data (for demonstration)
                console.log('Form submitted successfully!');
                console.log({
                    firstName: document.getElementById('firstName').value,
                    lastName: document.getElementById('lastName').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    address: document.getElementById('address').value,
                    city: document.getElementById('city').value,
                    state: document.getElementById('state').value,
                    zip: document.getElementById('zip').value,
                    howFound: document.getElementById('howFound').value,
                    comments: document.getElementById('comments').value
                });
            }
        });
    }
    
    // Set up "Log Another Visit" button
    const logAnotherBtn = document.getElementById('logAnotherVisit');
    if (logAnotherBtn) {
        logAnotherBtn.addEventListener('click', function(event) {
            event.preventDefault();
            resetAndShowVisitorForm();
        });
    }
    
    // Show home section by default
    showSection('home');
});
