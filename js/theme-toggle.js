document.getElementById('theme-toggle').addEventListener('click', function() {
    const themeLink = document.querySelector('link[href="css/theme.css"]');
    
    if (themeLink) {
        themeLink.parentNode.removeChild(themeLink);
    } else {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/theme.css';
        document.head.appendChild(link);
    }
});