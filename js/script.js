// ── SLIDER ──────────────────────────────
const totalCourses = 3; 
let current = 0, locked = false;
const track = document.getElementById('track');
const detailView = document.getElementById('detail-view');
const homeFooter = document.getElementById('homeFooter');

function buildDots() {
  const dotsEl = document.getElementById('dots');
  dotsEl.innerHTML = '';
  for(let i=0; i<totalCourses; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.onclick = () => goTo(i);
    dotsEl.appendChild(d);
  }
}

function goTo(n) {
  if (locked) return;
  if (detailView.classList.contains('open')) return;
  locked = true;
  current = Math.max(0, Math.min(totalCourses - 1, n));
  track.style.transform = `translateY(-${current * 100}%)`;
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
  const scrollHint = document.getElementById('scrollHint');
  if(scrollHint) scrollHint.style.opacity = current === totalCourses - 1 ? '0' : '1';
  setTimeout(() => locked = false, 800);
}

window.addEventListener('wheel', e => {
  if (detailView.classList.contains('open') || document.getElementById('courses-menu').classList.contains('open')) return;
  goTo(current + (e.deltaY > 0 ? 1 : -1));
}, { passive: true });

let touchStartY = 0;
window.addEventListener('touchstart', e => touchStartY = e.touches[0].clientY, { passive: true });
window.addEventListener('touchend', e => {
  if (detailView.classList.contains('open') || document.getElementById('courses-menu').classList.contains('open')) return;
  const dy = touchStartY - e.changedTouches[0].clientY;
  if (Math.abs(dy) > 40) goTo(current + (dy > 0 ? 1 : -1));
}, { passive: true });

buildDots();

// ── FULL WEBSITE MENU & DETAIL VIEWS ──
function openCoursesMenu() {
  document.getElementById('courses-menu').classList.add('open');
}

function closeCoursesMenu() {
  document.getElementById('courses-menu').classList.remove('open');
}

function openDetail(courseId) {
  document.querySelectorAll('.course-container').forEach(el => el.classList.remove('active'));
  document.getElementById('course-' + courseId).classList.add('active');
  detailView.classList.add('open');
  homeFooter.style.display = 'none'; 
  document.body.style.overflow = 'hidden'; 
  detailView.scrollTop = 0; 
}

function closeDetail() {
  detailView.classList.remove('open');
  homeFooter.style.display = 'flex'; 
  document.body.style.overflow = 'auto'; 
}

function togglePhase(id) {
  const card = document.getElementById(id);
  card.classList.toggle('open');
}

// ── FREE NOTES MODAL LOGIC ──
function openModal() {
  document.getElementById('modal').classList.add('open');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  setTimeout(() => {
    document.getElementById('modal-form-content').style.display = 'block';
    document.getElementById('modal-success').style.display = 'none';
    document.getElementById('inp-name').value = '';
    document.getElementById('inp-email').value = '';
    document.getElementById('inp-wa').value = '';
  }, 300);
}

function submitModalForm() {
  const name = document.getElementById('inp-name').value.trim();
  const email = document.getElementById('inp-email').value.trim();
  const wa = document.getElementById('inp-wa').value.trim();
  
  if (!name || !email.includes('@') || wa.replace(/\D/g,'').length < 10) { 
      alert('Please fill out all fields correctly.'); return; 
  }

  // Change button text to show loading
  const btn = document.querySelector('.modal-submit');
  btn.innerText = "Processing...";

  const scriptURL = 'https://script.google.com/macros/s/AKfycbwGAlorsFMI73Ct4k__llysyxnKYuXKALFgbEcHIvAmN0b_qU7gomzoTdJTJHiod4yD/exec';

  fetch(scriptURL, {
    method: 'POST',
    body: JSON.stringify({ name: name, email: email, phone: wa }),
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }
  })
  .then(response => {
    document.getElementById('modal-form-content').style.display = 'none';
    document.getElementById('modal-success').style.display = 'block';
    btn.innerText = "Unlock My PDF"; // reset
  })
  .catch(error => {
    alert('Error submitting form. Please try again.');
    btn.innerText = "Unlock My PDF";
  });
}

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (document.getElementById('modal').classList.contains('open')) {
      closeModal();
    } else if (document.getElementById('courses-menu').classList.contains('open')) {
      closeCoursesMenu();
    } else if (detailView.classList.contains('open')) {
      closeDetail();
    }
  }
  if (detailView.classList.contains('open') || document.getElementById('modal').classList.contains('open') || document.getElementById('courses-menu').classList.contains('open')) return;
  if (e.key === 'ArrowDown') goTo(current + 1);
  if (e.key === 'ArrowUp') goTo(current - 1);
});
