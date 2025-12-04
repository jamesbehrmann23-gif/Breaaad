/*
==========================================================
PAGE.JS - Page Navigation and Theme Management
==========================================================
Author: James Behrmann
Purpose: Handles page/section switching and theme toggling
Manages hiding/showing content sections
==========================================================
*/

/**
 * Initialize page navigation by setting up click handlers for nav links
 */
function initPageNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });
}

/**
 * Show a specific section and hide all others
 * @param {string} sectionId - The ID of the section to display
 */
function showSection(sectionId) {
    const allSections = document.querySelectorAll('main > section');
    // Special-case: support a "log-visit" nav target that opens the visitor form
    if (sectionId === 'log-visit') {
        allSections.forEach(section => {
            section.style.display = 'none';
            section.classList.remove('animate');
        });
        showVisitorForm();
        return;
    }

    allSections.forEach(section => {
        if (section.id === sectionId) {
            section.style.display = 'block';
            section.classList.add('animate');
        } else {
            section.style.display = 'none';
            section.classList.remove('animate');
        }
    });
}

/**
 * Initialize theme toggle functionality
 */
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    if (!themeToggleBtn) {
        console.warn('Theme toggle button not found');
        return;
    }
    
    themeToggleBtn.addEventListener('click', function() {
        const themeLink = document.querySelector('link[href="css/theme.css"]');
        
        if (themeLink) {
            themeLink.parentNode.removeChild(themeLink);
            localStorage.setItem('theme', 'light');
        } else {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/theme.css';
            document.head.appendChild(link);
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/theme.css';
        document.head.appendChild(link);
    }
}

/**
 * Show the visitor form and hide other sections
 */
function showVisitorForm() {
    const allSections = document.querySelectorAll('main > section');
    allSections.forEach(section => {
        section.style.display = 'none';
    });
    
    const visitorSection = document.getElementById('visitor-form-section');
    if (visitorSection) {
        visitorSection.style.display = 'block';
        visitorSection.classList.add('animate');
    }
}

/**
 * Show the thank you message after form submission
 */
function showThankYouMessage() {
    const formSection = document.getElementById('visitor-form-section');
    const thankYouMessage = document.getElementById('thank-you-message');
    
    if (formSection) {
        formSection.style.display = 'none';
    }
    
    if (thankYouMessage) {
        thankYouMessage.style.display = 'block';
        thankYouMessage.classList.add('animate');
    }
}

/**
 * Reset the visitor form for a new submission
 */
function resetVisitorForm() {
    const form = document.getElementById('visitorForm');
    if (form) {
        form.reset();
        form.querySelectorAll('input, textarea').forEach(field => {
            field.classList.remove('was-validated');
            field.setCustomValidity('');
        });
        form.querySelectorAll('.errorMsg').forEach(errorDiv => {
            errorDiv.textContent = '';
        });
    }
}

/**
 * Reset and show the visitor form again (when user clicks "Log Another Visit" button)
 */
function resetAndShowVisitorForm() {
    const formSection = document.getElementById('visitor-form-section');
    const thankYouMessage = document.getElementById('thank-you-message');
    
    if (thankYouMessage) {
        thankYouMessage.style.display = 'none';
    }
    
    resetVisitorForm();
    
    if (formSection) {
        formSection.style.display = 'block';
        formSection.classList.add('animate');
    }
}
