import { animate, scroll } from 'motion';

function handleEyeMovement() {
  const pupilLeft = document.getElementById('pupil-left');
  const pupilRight = document.getElementById('pupil-right');
  const face = document.querySelector('.face');
  const customCursor = document.querySelector('.custom-cursor');

  document.addEventListener('mousemove', (e) => {
    const rect = face.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    const angle = Math.atan2(deltaY, deltaX);
    const maxDist = window.innerWidth > 600 ? 8 : 4;
    const x = Math.cos(angle) * maxDist;
    const y = Math.sin(angle) * maxDist;
    const isInHero = e.target.closest('.hero');

    if (isInHero) {
      customCursor.style.display = 'block';
    } else {
      customCursor.style.display = 'none';
    }

    pupilLeft.style.transform = `translate(${x}px, ${y}px)`;
    pupilRight.style.transform = `translate(${x}px, ${y}px)`;

    customCursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });
}

function initScrollAnimations() {
  const items = document.querySelectorAll('.img-container');
  const groupContainer = document.querySelector('.img-group-container');

  if (!items.length || !groupContainer) return;

  scroll(
    animate('.img-group', {
      transform: ['none', `translateX(-${items.length - 1}00vw)`],
    }),
    { target: groupContainer }
  );

  scroll(animate('.progress', { scaleX: [0, 1] }), { target: groupContainer });
}

function setupNavLinks() {
  const links = document.querySelectorAll('.nav-links a');

  links.forEach((link) => {
    link.addEventListener('click', function () {
      links.forEach((el) => el.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

function setupHamburgerMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links li a');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    hamburger.classList.toggle('active');
  });

  navItems.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('show');
      hamburger.classList.remove('active');
    });
  });
}

function handleFormSubmission(formId, resultId, endpoint) {
  const form = document.getElementById(formId);
  const result = document.getElementById(resultId);

  if (!form || !result) {
    console.error('Form or result element not found');
    return;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    result.style.display = 'block';
    result.innerHTML = 'Please wait...';

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: json,
    })
      .then(async (response) => {
        const json = await response.json();
        result.innerHTML = json.message;
        if (response.status !== 200) {
          console.log(response);
        }
      })
      .catch((error) => {
        console.error(error);
        result.innerHTML = 'Something went wrong!';
      })
      .finally(() => {
        form.reset();
        setTimeout(() => {
          result.style.display = 'none';
        }, 3000);
      });
  });
}

function toggleProgressOnScroll() {
  const progressBar = document.querySelector('.progress');
  const contactSection = document.querySelector('#contact');

  if (!progressBar || !contactSection) return;

  function handleScroll() {
    const contactTop = contactSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (contactTop < windowHeight && contactTop > 0) {
      progressBar.style.display = 'none';
    } else {
      progressBar.style.display = 'block';
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll();
}

function init() {
  handleEyeMovement();
  initScrollAnimations();
  setupNavLinks();
  handleFormSubmission('form', 'result', 'https://api.web3forms.com/submit');
  setupHamburgerMenu();
  toggleProgressOnScroll();
}

document.addEventListener('DOMContentLoaded', init);
