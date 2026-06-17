document.documentElement.classList.add('js-enabled');

// Pill nav: highlight active section on scroll and scroll pill into view
const pills = document.querySelectorAll('.nav__pill');
const pillsContainer = document.querySelector('.nav__pills-list');

if (pills.length && pillsContainer) {
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  let currentActiveId = null;
  let rafPending = false;

  const setActivePill = (id) => {
    const matchingPill = Array.from(pills).find((pill) => {
      const href = pill.getAttribute('href');
      return href === `#${id}` || (href === '#' && id === sections[0].id);
    });

    if (!matchingPill) return;

    pills.forEach((pill) =>
      pill.classList.toggle('is-active', pill === matchingPill)
    );

    const containerRect = pillsContainer.getBoundingClientRect();
    const pillRect = matchingPill.getBoundingClientRect();
    const offset =
      pillRect.left -
      containerRect.left -
      containerRect.width / 2 +
      pillRect.width / 2;
    const maxScroll = pillsContainer.scrollWidth - pillsContainer.clientWidth;
    const targetScroll = Math.max(
      0,
      Math.min(pillsContainer.scrollLeft + offset, maxScroll)
    );
    pillsContainer.scrollTo({ left: targetScroll, behavior: 'smooth' });
  };

  const updateActivePill = () => {
    const scrollMid = window.scrollY + window.innerHeight * 0.35;
    let active = sections[0];
    for (const section of sections) {
      if (section.offsetTop <= scrollMid) {
        active = section;
      }
    }
    if (active.id !== currentActiveId) {
      currentActiveId = active.id;
      setActivePill(active.id);
    }
  };

  const onScroll = () => {
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(() => {
        updateActivePill();
        rafPending = false;
      });
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  updateActivePill();
}

// Role card collapsible bullets
document.querySelectorAll('.role-card__bullets').forEach((bullets) => {
  const btn = document.createElement('button');
  btn.className = 'role-card__toggle';
  btn.setAttribute('aria-expanded', 'false');
  btn.textContent = 'Show details ↓';
  bullets.after(btn);

  btn.addEventListener('click', () => {
    const btnTopBefore = btn.getBoundingClientRect().top;
    const isOpen = bullets.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', isOpen);
    btn.textContent = isOpen ? 'Hide details ↑' : 'Show details ↓';

    if (!isOpen) {
      const btnTopAfter = btn.getBoundingClientRect().top;
      window.scrollBy({ top: btnTopAfter - btnTopBefore, behavior: 'instant' });
    }
  });
});

// Video thumbnail tap-to-play (mobile)
const videoThumbnail = document.getElementById('video-thumbnail');
const videoWrapper = document.querySelector('.hero__video-wrapper');

if (videoThumbnail && videoWrapper) {
  const activate = (e) => {
    if (e) e.preventDefault();
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

// Visitor counter — endpoint injected at deploy time by GitHub Actions
const visitorCountEl = document.getElementById('visitor-count');

if (visitorCountEl) {
  fetch('__COUNT_API_ENDPOINT__', { method: 'POST' })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.status);
      }
      return response.json();
    })
    .then((data) => {
      visitorCountEl.innerText =
        data && data.views !== undefined
          ? 'This page has been viewed ' + data.views + ' times'
          : 'Counter not available.';
    })
    .catch((error) => {
      console.error('Could not load visitor count:', error);
      visitorCountEl.innerText = 'Counter not available.';
    });
}
