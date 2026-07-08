// ==========================================
// Year in footer
// ==========================================
document.getElementById('year').textContent = new Date().getFullYear();

// ==========================================
// Typing effect
// ==========================================
const roleTextEl = document.getElementById('roleText');
const roles = ["Frontend Developer", "UI/UX Enthusiast", "CS Student"];
let roleIndex = 0, charIndex = 0, deleting = false;

function typeRole() {
  const current = roles[roleIndex];
  charIndex = deleting ? charIndex - 1 : charIndex + 1;
  roleTextEl.textContent = current.substring(0, charIndex);

  let delay = deleting ? 45 : 90;

  if (!deleting && charIndex === current.length) {
    deleting = true;
    delay = 1200;
  } else if (deleting && charIndex === 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 400;
  }
  setTimeout(typeRole, delay);
}
typeRole();

// ==========================================
// Theme toggle (light/dark) with persistence
// ==========================================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const root = document.documentElement;

function applyTheme(theme) {
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  } else {
    root.removeAttribute('data-theme');
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
  }
}

let savedTheme = null;
try { savedTheme = localStorage.getItem('portfolio-theme'); } catch (e) { /* storage unavailable */ }

if (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  savedTheme = 'dark';
}
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const isDark = root.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('portfolio-theme', next); } catch (e) { /* storage unavailable */ }
});

// ==========================================
// Mobile nav toggle
// ==========================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ==========================================
// Active nav link on scroll
// ==========================================
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });

sections.forEach(section => observer.observe(section));

// ==========================================
// Firebase config + contact form submission
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyCeBbJ5OIcnH6Wy2z4_olL69M1AKLeGp08",
  authDomain: "portfolio-28605.firebaseapp.com",
  projectId: "portfolio-28605",
  storageBucket: "portfolio-28605.appspot.com",
  messagingSenderId: "760049360821",
  appId: "1:760049360821:web:b908ae57f58e2cce5e03fc"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  formStatus.textContent = 'Sending…';
  formStatus.className = 'form-status';

  db.collection('contacts').add({
    name, email, subject, message,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    formStatus.textContent = 'Message sent — thanks for reaching out!';
    formStatus.className = 'form-status success';
    contactForm.reset();
  })
  .catch((error) => {
    console.error('Error writing document: ', error);
    formStatus.textContent = 'Something went wrong. Please try again.';
    formStatus.className = 'form-status error';
  });
});
