// Function to load HTML components
async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        const data = await response.text();
        document.getElementById(elementId).innerHTML = data;
        
        // Re-initialize any scripts or listeners if needed
        if (elementId === 'header-placeholder') {
            initMobileMenu();
        }
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

// Initialize Navigation Logic (Mobile Menu, Scroll Effect)
function initMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }
}

// Scroll Effect for Header
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// Load components on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('header-placeholder', 'components/header.html');
    loadComponent('footer-placeholder', 'components/footer.html');
});
