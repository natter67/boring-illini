const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  const open = mobileMenu.style.display === 'flex';
  mobileMenu.style.display = open ? 'none' : 'flex';
  hamburger.querySelector('span:nth-child(1)').style.transform = open ? '' : 'translateY(7px) rotate(45deg)';
  hamburger.querySelector('span:nth-child(2)').style.opacity = open ? '1' : '0';
  hamburger.querySelector('span:nth-child(3)').style.transform = open ? '' : 'translateY(-7px) rotate(-45deg)';
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

document.getElementById('sponsorForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name    = document.getElementById('f-name').value;
  const company = document.getElementById('f-company').value;
  const email   = document.getElementById('f-email').value;
  const tier    = document.getElementById('f-tier').value;
  const message = document.getElementById('f-message').value;
  const body = encodeURIComponent(`Name: ${name}\nCompany: ${company}\nEmail: ${email}\nTier: ${tier}\n\nMessage:\n${message}`);
  window.location.href = `mailto:boringillini@gmail.com?subject=${encodeURIComponent(`Sponsorship Inquiry — ${company}`)}&body=${body}`;
});
