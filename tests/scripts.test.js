'use strict';

// Mock requestAnimationFrame — jsdom doesn't implement it
global.requestAnimationFrame = (cb) => cb();

// Mock Element.scrollTo — jsdom doesn't implement it on elements
Element.prototype.scrollTo = jest.fn();

// Mock fetch — prevents the visitor counter from making real network calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ views: 42 }),
  })
);

// loadScript re-requires scripts.js fresh each time so its top-level code
// re-runs against the current DOM state.
function loadScript() {
  jest.resetModules();
  require('../scripts/scripts.js');
}

// Minimal DOM fixtures used across test suites
const NAV_HTML = `
  <nav>
    <ul class="nav__pills-list">
      <li><a class="nav__pill" href="#">About</a></li>
      <li><a class="nav__pill" href="#experience">Experience</a></li>
      <li><a class="nav__pill" href="#skills">Skills</a></li>
    </ul>
  </nav>
  <main>
    <section id="about"></section>
    <section id="experience"></section>
    <section id="skills"></section>
  </main>
`;

const VIDEO_HTML = `
  <div id="video-thumbnail" tabindex="0"></div>
  <div class="hero__video-wrapper" style="display:none">
    <iframe src=""></iframe>
  </div>
`;

const ROLE_CARD_HTML = `
  <div class="role-card">
    <ul class="role-card__bullets">
      <li>Bullet one</li>
      <li>Bullet two</li>
    </ul>
  </div>
`;

// ─── js-enabled ───────────────────────────────────────────────────────────────

describe('js-enabled class', () => {
  beforeEach(() => {
    document.documentElement.className = '';
    document.body.innerHTML = '';
  });

  it('adds js-enabled to the html element on load', () => {
    loadScript();
    expect(document.documentElement.classList.contains('js-enabled')).toBe(
      true
    );
  });
});

// ─── Pill nav ─────────────────────────────────────────────────────────────────

describe('pill nav', () => {
  beforeEach(() => {
    document.documentElement.className = '';
    document.body.innerHTML = NAV_HTML;

    // Give each section a measurable position in the fake DOM
    document.getElementById('about').getBoundingClientRect = () => ({});
    ['about', 'experience', 'skills'].forEach((id, i) => {
      Object.defineProperty(document.getElementById(id), 'offsetTop', {
        configurable: true,
        value: i * 800,
      });
    });

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 600,
    });
  });

  it('activates the About pill on initial load (scrollY = 0)', () => {
    loadScript();
    const pills = document.querySelectorAll('.nav__pill');
    expect(pills[0].classList.contains('is-active')).toBe(true);
    expect(pills[1].classList.contains('is-active')).toBe(false);
  });

  it('activates the Experience pill when scrolled to that section', () => {
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 800,
    });
    loadScript();
    const pills = document.querySelectorAll('.nav__pill');
    expect(pills[1].classList.contains('is-active')).toBe(true);
    expect(pills[0].classList.contains('is-active')).toBe(false);
  });
});

// ─── Video thumbnail tap-to-play ──────────────────────────────────────────────

describe('video thumbnail tap-to-play', () => {
  beforeEach(() => {
    document.documentElement.className = '';
    document.body.innerHTML = VIDEO_HTML;
    loadScript();
  });

  it('hides the thumbnail on click', () => {
    document.getElementById('video-thumbnail').click();
    expect(document.getElementById('video-thumbnail').style.display).toBe(
      'none'
    );
  });

  it('shows the video wrapper on click', () => {
    document.getElementById('video-thumbnail').click();
    expect(document.querySelector('.hero__video-wrapper').style.display).toBe(
      'block'
    );
  });

  it('sets the iframe src with autoplay on click', () => {
    document.getElementById('video-thumbnail').click();
    const src = document.querySelector('.hero__video-wrapper iframe').src;
    expect(src).toContain('autoplay=1');
  });

  it('activates on Enter keydown', () => {
    const thumbnail = document.getElementById('video-thumbnail');
    thumbnail.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(thumbnail.style.display).toBe('none');
  });
});

// ─── Role card toggle ─────────────────────────────────────────────────────────

describe('role card toggle', () => {
  beforeEach(() => {
    document.documentElement.className = '';
    document.body.innerHTML = ROLE_CARD_HTML;
    loadScript();
  });

  it('injects a toggle button after each bullets list', () => {
    const btn = document.querySelector('.role-card__toggle');
    expect(btn).not.toBeNull();
  });

  it('toggle button initial text is "Show details ↓"', () => {
    const btn = document.querySelector('.role-card__toggle');
    expect(btn.textContent).toBe('Show details ↓');
  });

  it('clicking the button opens the bullets and updates aria-expanded', () => {
    const btn = document.querySelector('.role-card__toggle');
    const bullets = document.querySelector('.role-card__bullets');
    btn.click();
    expect(bullets.classList.contains('is-open')).toBe(true);
    expect(btn.getAttribute('aria-expanded')).toBe('true');
    expect(btn.textContent).toBe('Hide details ↑');
  });

  it('clicking the button a second time closes the bullets', () => {
    const btn = document.querySelector('.role-card__toggle');
    const bullets = document.querySelector('.role-card__bullets');
    btn.click();
    btn.click();
    expect(bullets.classList.contains('is-open')).toBe(false);
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(btn.textContent).toBe('Show details ↓');
  });
});
