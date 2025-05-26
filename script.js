const pupilLeft = document.getElementById('pupil-left');
const pupilRight = document.getElementById('pupil-right');
const face = document.querySelector('.face');
const customCursor = document.querySelector('.custom-cursor');

document.addEventListener('mousemove', (e) => {
  // Move pupils
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

  // Move custom cursor
  customCursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});
