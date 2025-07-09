import { animate, scroll } from 'motion';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

gsap.registerPlugin(ScrollTrigger);

import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

function animateText() {
  document.querySelector('.front-end-graphic').textContent = '';

  gsap.to('.front-end-graphic', {
    duration: 3,
    text: 'Front-End Developer and Graphic Designer',
    ease: 'power1.inOut',
  });
}

ScrollTrigger.create({
  trigger: '#home',
  start: 'top 80%',
  toggleActions: 'play reset play reset', // play on enter, reset on leave
  onEnter: () => {
    animateText();
  },
});

const select = (e) => document.querySelector(e);

const stage = select('.stage');
const tubeInner = select('.tube__inner');
const numLines = 10;
const angle = 360 / numLines;

let radius = 0;
let origin = 0;

function getFontSizeFromCSS() {
  const rootStyles = getComputedStyle(document.documentElement);
  const fontSizeValue = rootStyles.getPropertyValue('--fontSize');
  return parseFloat(fontSizeValue);
}

function set3D() {
  const width = window.innerWidth;
  const fontSize = getFontSizeFromCSS();
  const fontSizePx = (width / 100) * fontSize;

  radius = fontSizePx / 2 / Math.sin((180 / numLines) * (Math.PI / 180));
  origin = `50% 50% -${radius}px`;
}

function cloneNodes() {
  const clones = document.getElementsByClassName('line');

  for (let i = 0; i < numLines - 1; i++) {
    const newClone = clones[0].cloneNode(true);
    newClone.classList.add(`line--${i + 2}`);
    tubeInner.appendChild(newClone);
  }

  clones[0].classList.add('line--1');
}

function positionTxt() {
  gsap.set('.line', {
    rotationX: (index) => -angle * index,
    z: radius,
    transformOrigin: origin,
  });
}

function setProps(targets) {
  targets.forEach((target) => {
    const paramSet = gsap.quickSetter(target, 'css');
    const degrees = gsap.getProperty(target, 'rotateX');
    const radians = degrees * (Math.PI / 180);
    const conversion = Math.abs(Math.cos(radians) / 2 + 0.5);
    const fontW = 200 + 700 * conversion;
    const fontS = `${100 + 700 * conversion}%`;

    paramSet({
      opacity: conversion + 0.1,
      fontWeight: fontW,
      fontStretch: fontS,
    });
  });
}

function scrollRotate() {
  gsap.to('.line', {
    scrollTrigger: {
      trigger: '.stage',
      scrub: 1,
      start: 'top top',
    },
    rotateX: '+=300',
    onUpdate() {
      setProps(this.targets());
    },
  });

  gsap.to('.tube', {
    scrollTrigger: {
      trigger: '.stage',
      scrub: 1,
      start: 'top top',
    },
    perspective: '1vw',
    ease: 'expo.out',
  });
}

function startAnimation() {
  cloneNodes();
  set3D();
  positionTxt();
  setProps(gsap.utils.toArray('.line'));
  scrollRotate();

  window.addEventListener('resize', () => {
    set3D();
    positionTxt();
  });

  gsap.to(stage, { autoAlpha: 1, duration: 2, delay: 2 });
}

window.onload = () => {
  startAnimation();
};

document.fonts.ready.then(() => {
  gsap.registerPlugin(SplitText);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#about',
      start: 'top center',
      toggleActions: 'play reset play reset', // play on enter, reset on leave
    },
  });

  const split = SplitText.create('#compatibility', {
    type: 'chars',
  });

  const rough = 'rough({ strength: 2, clamp: true })';

  tl.set('#compatibility', { autoAlpha: 0.9 });

  split.chars.forEach((char, i) => {
    tl.fromTo(
      char,
      {
        transformOrigin: 'center -160px',
        z: 0.1,
        rotation: Math.random() < 0.5 ? 90 : -90,
      },
      {
        rotation: 0,
        ease: 'elastic.out',
        duration: 2.4,
      },
      0.3 + i * 0.06
    );

    tl.to(
      char,
      {
        y: 75,
        ease: 'bounce.out',
        duration: 0.6,
      },
      3.4 + Math.random() * 0.6
    );

    tl.to(
      char,
      {
        autoAlpha: 1,
        ease: rough,
        duration: 0.6,
      },
      4.5 + Math.random()
    );
  });
});

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

let words = gsap.utils.toArray('svg text'),
  timePerCharacter = 0.1;

let tl = gsap.timeline({
  scrollTrigger: {
    trigger: '#honors',
    start: 'top 80%',
    toggleActions: 'play reset play reset', // play on enter, reset on leave
  },
});

words.forEach((el) => {
  tl.from(el, {
    text: '',
    duration: el.textContent.length * timePerCharacter,
    ease: 'none',
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('.honor-card');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    {
      threshold: 0.3,
    }
  );

  cards.forEach((card) => observer.observe(card));
});

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

import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

const swiper = new Swiper('.swiper', {
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});

function init() {
  handleEyeMovement();
  initScrollAnimations();
  setupNavLinks();
  handleFormSubmission('form', 'result', 'https://api.web3forms.com/submit');
  setupHamburgerMenu();
  toggleProgressOnScroll();
}

document.addEventListener('DOMContentLoaded', init);
