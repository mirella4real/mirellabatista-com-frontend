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

// Video thumbnail tap-to-play (mobile)
const videoThumbnail = document.getElementById('video-thumbnail');
const videoWrapper = document.querySelector('.hero__video-wrapper');

if (videoThumbnail && videoWrapper) {
  const activate = (e) => {
    e.preventDefault();
    videoThumbnail.style.display = 'none';
    videoWrapper.style.display = 'block';
    videoWrapper.querySelector('iframe').src =
      'https://www.youtube.com/embed/u1nH3fps6NE?autoplay=1&rel=0&modestbranding=1';
  };

  videoThumbnail.addEventListener('click', activate);
  videoThumbnail.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activate();
    }
  });
}
