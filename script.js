import { animate, scroll } from 'motion';

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

  pupilLeft.style.transform = `translate(${x}px, ${y}px)`;
  pupilRight.style.transform = `translate(${x}px, ${y}px)`;

  customCursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});

const items = document.querySelectorAll('.img-container');

scroll(
  animate('.img-group', {
    transform: ['none', `translateX(-${items.length - 1}00vw)`],
  }),
  { target: document.querySelector('.img-group-container') }
);

scroll(animate('.progress', { scaleX: [0, 1] }), {
  target: document.querySelector('.img-group-container'),
});

document.addEventListener('DOMContentLoaded', function () {
  const links = document.querySelectorAll('.nav-links a');

  links.forEach((link) => {
    link.addEventListener('click', function () {
      links.forEach((el) => el.classList.remove('active'));
      this.classList.add('active');
    });
  });
});

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
