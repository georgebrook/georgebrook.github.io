const imageToggles = document.querySelectorAll('.image-toggle');

imageToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const img = toggle.querySelector('img');
    const isClicked = toggle.classList.toggle('clicked');
    toggle.setAttribute('aria-pressed', isClicked);
    img.src = isClicked ? 'me-black-and-white.jpg' : 'me3.webp';
    img.alt = isClicked ? 'A black and white version of me.' : 'An image of me with a great view.';
  });
});

const toggleButton = document.getElementById('themeToggle');
const html = document.documentElement;

function updateMetaThemeColor(theme) {
  const themeColor = theme === 'dark' ? '#121212' : '#ffffff';
  let metaTag = document.querySelector('meta[name="theme-color"]');

  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.name = 'theme-color';
    document.head.appendChild(metaTag);
  }

  metaTag.setAttribute('content', themeColor);
}

const applyTheme = (theme) => {
  html.setAttribute('data-theme', theme);
  updateMetaThemeColor(theme);
};

const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

let storedTheme = localStorage.getItem('theme');
if (storedTheme) {
  applyTheme(storedTheme);
} else {
  applyTheme(systemPrefersDark.matches ? 'dark' : 'light');
}

toggleButton.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const newTheme = current === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  localStorage.setItem('theme', newTheme);
});

systemPrefersDark.addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    applyTheme(e.matches ? 'dark' : 'light');
  }
});

const canvas = document.querySelector('.background-noise');
const ctx = canvas.getContext('2d');

const dotSize = 1;
const density = 0.25;
let imgData;

const isDesktop = () => window.innerWidth >= 1024;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function hexToRGBA(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const a = 255;
  return (a << 24) | (r << 16) | (g << 8) | b;
}

function drawNoise() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const bg = hexToRGBA(isDark ? '#1d1d1d' : '#f8f8f8');
  const fg = hexToRGBA(isDark ? '#2d2d2d' : '#dddddd');

  const cols = Math.ceil(canvas.width / dotSize);
  const rows = Math.ceil(canvas.height / dotSize);
  const buf = imgData.data;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const startX = x * dotSize;
      const startY = y * dotSize;

      const color = Math.random() < density ? fg : bg;

      for (let dy = 0; dy < dotSize; dy++) {
        for (let dx = 0; dx < dotSize; dx++) {
          const px = startX + dx;
          const py = startY + dy;
          if (px >= canvas.width || py >= canvas.height) continue;

          const pixelIndex = (py * canvas.width + px) * 4;
          buf[pixelIndex] = (color >> 16) & 0xFF;
          buf[pixelIndex + 1] = (color >> 8) & 0xFF;
          buf[pixelIndex + 2] = color & 0xFF;
          buf[pixelIndex + 3] = (color >> 24) & 0xFF;
        }
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  imgData = ctx.createImageData(canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;
}

function loop() {
  drawNoise();
  requestAnimationFrame(loop);
}

// Only run the animated noise effect on desktop, and skip it entirely for
// users who have asked the OS for reduced motion.
if (isDesktop() && !prefersReducedMotion) {
  resize();
  drawNoise();
  loop();
} else if (isDesktop()) {
  resize();
  drawNoise();
}

window.addEventListener('resize', () => {
  if (isDesktop()) {
    resize();
    drawNoise();
  }
});

console.log(
  "%c🧑🏼‍💻🕹️🎾🥁👟🎹🛹🥩🥤🍿",
  "font-size: 100px;"
);
