// Nav hamburger toggle
const hamburger = document.getElementById('nav-hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  hamburger.setAttribute('aria-expanded', isOpen);
  hamburger.setAttribute(
    'aria-label',
    isOpen ? 'Close navigation menu' : 'Open navigation menu'
  );
});

// Close nav when a link is clicked on mobile
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', false);
  });
});
