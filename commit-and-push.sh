#!/bin/bash
# Script to ensure all changes are committed and pushed

cd /workspaces/Breaaad

# Check current status
echo "=== Current Git Status ==="
git status

echo ""
echo "=== Staging all changes ==="
git add -A

echo ""
echo "=== Current status after add ==="
git status

echo ""
echo "=== Checking git diff ==="
git diff --cached --name-status

echo ""
echo "=== Committing changes ==="
git commit -m "feat: Add visitor registration form with comprehensive validation and modular JavaScript

New Features:
- Visitor Registration Form with Flexbox Layout
  - Personal Information section (first/last name, email, phone)
  - Address section (street, city, state, zip)
  - How did you find us dropdown
  - Interests checkboxes (at least one required)
  - Optional comments textarea

- Modular JavaScript Architecture
  - validation.js: Comprehensive form validation library
    - Email, phone, zip regex patterns
    - State abbreviation validation
    - Required field validation
    - Checkbox group validation
    - Real-time error display
  
  - page.js: Page navigation and theme management
    - Section hiding/showing
    - Theme toggle with localStorage
    - Form and thank you message display
  
  - main.js: Application entry point
    - Form initialization
    - Event handlers
    - Form submission logic

- Enhanced CSS
  - Form styling with Flexbox layout
  - Validation states (green/red borders)
  - Error message display
  - Button styling with gradients
  - Mobile responsive design (<600px)
  - Dark theme form support

- Documentation
  - Author disclaimers in all files
  - JSDoc comments for functions
  - Comprehensive CSS file headers"

echo ""
echo "=== Commit complete. Files committed ==="
git log -1 --name-status

echo ""
echo "=== Pushing to remote ==="
git push origin main

echo ""
echo "=== Push complete ==="
echo "Changes have been committed and pushed to GitHub Pages!"
