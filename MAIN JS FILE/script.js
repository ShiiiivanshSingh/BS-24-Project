// JavaScript for slide-in animation
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.slide-in');
    sections.forEach(section => {
        section.classList.add('visible');
    });
});


const navButtons = document.querySelectorAll('.nav-button');
navButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        const href = button.getAttribute('href');

        // Check if the href is an internal link
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
        
    });
});