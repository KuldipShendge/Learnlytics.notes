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
  window.location.hash = courseId;
}

function closeDetail() {
  detailView.classList.remove('open');
  homeFooter.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // FIX: was 'auto', which broke the full-page slider after closing detail view
  // NEW: Remove the hash from the URL when going back home
  window.history.replaceState(null, null, window.location.pathname);
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

  const btn = document.querySelector('.modal-submit');
  btn.innerText = "Processing...";

  const scriptURL = 'https://script.google.com/macros/s/AKfycbxpLmLgjZ2EmPOap7jPvmjB_-6QMM8MbefF6LId6iVGAIFv4gAFks1EEF9Cj_HKAjjK/exec';

  const formData = new URLSearchParams();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('phone', wa);

  fetch(scriptURL, {
    method: 'POST',
    body: formData
  })
  .then(response => {
    document.getElementById('modal-form-content').style.display = 'none';
    document.getElementById('modal-success').style.display = 'block';
    btn.innerText = "Unlock My PDF"; 
  })
  .catch(error => {
    alert('Error submitting form. Please try again.');
    btn.innerText = "Unlock My PDF";
  });
}

// ── REVIEW MODAL LOGIC ──
function openReviewModal() {
  document.getElementById('review-modal').classList.add('open');
}

function closeReviewModal() {
  document.getElementById('review-modal').classList.remove('open');
  setTimeout(() => {
    document.getElementById('review-form-content').style.display = 'block';
    document.getElementById('review-success').style.display = 'none';
    document.getElementById('rev-name').value = '';
    document.getElementById('rev-rating').value = '5';
    document.getElementById('rev-text').value = '';
  }, 300);
}

function submitReviewForm() {
  const name = document.getElementById('rev-name').value.trim();
  const rating = document.getElementById('rev-rating').value.trim();
  const review = document.getElementById('rev-text').value.trim();
  
  if (!name || !review) { 
      alert('Please fill out your name and your review.'); return; 
  }

  const btn = document.querySelector('#review-form-content .modal-submit');
  btn.innerText = "Submitting...";

  const scriptURL = 'https://script.google.com/macros/s/AKfycbxpLmLgjZ2EmPOap7jPvmjB_-6QMM8MbefF6LId6iVGAIFv4gAFks1EEF9Cj_HKAjjK/exec';

  const formData = new URLSearchParams();
  formData.append('type', 'review'); 
  formData.append('name', name);
  formData.append('rating', rating);
  formData.append('review', review);

  fetch(scriptURL, {
    method: 'POST',
    body: formData
  })
  .then(response => {
    document.getElementById('review-form-content').style.display = 'none';
    document.getElementById('review-success').style.display = 'block';
    btn.innerText = "Submit Review"; 
  })
  .catch(error => {
    alert('Error submitting review. Please try again.');
    btn.innerText = "Submit Review";
  });
}

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (document.getElementById('modal').classList.contains('open')) {
      closeModal();
    } else if (document.getElementById('review-modal') && document.getElementById('review-modal').classList.contains('open')) {
      closeReviewModal();
    } else if (document.getElementById('courses-menu').classList.contains('open')) {
      closeCoursesMenu();
    } else if (detailView.classList.contains('open')) {
      closeDetail();
    }
  }
  // FIX: added review-modal to guard — previously arrow keys could navigate slides while review modal was open
  const reviewModal = document.getElementById('review-modal');
  if (detailView.classList.contains('open') || document.getElementById('modal').classList.contains('open') || document.getElementById('courses-menu').classList.contains('open') || (reviewModal && reviewModal.classList.contains('open'))) return;
  if (e.key === 'ArrowDown') goTo(current + 1);
  if (e.key === 'ArrowUp') goTo(current - 1);
});

// NEW: Make direct shared links work!
window.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash) {
    const hashId = window.location.hash.substring(1); // Removes the '#' to get the ID
    if (document.getElementById('course-' + hashId)) {
      openDetail(hashId);
    }
  }
});

// Function to detect location and swap currency + payment links
async function localizePrices() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    // If they are NOT in India, swap everything to USD
    if (data.country_code !== 'IN') {
      
      // 1. Update all Main Prices (in both the cards AND the top buttons)
      document.querySelectorAll('.price-basic').forEach(el => el.innerHTML = '$19');
      document.querySelectorAll('.price-bundle').forEach(el => el.innerHTML = '$29');
      
      // 2. Update the Crossed-Out (Strike) Prices in the cards
      document.querySelectorAll('.strike-basic').forEach(el => el.innerHTML = '$39');
      document.querySelectorAll('.strike-bundle').forEach(el => el.innerHTML = '$79');
      
      // 3. Swap the Checkout Links for Gumroad/Stripe (Optional for later)
      // document.querySelectorAll('.link-basic, .quick-notes, .quick-qa').forEach(el => {
      //  el.href = 'https://your-global-link.com/basic'; 
      // });
      // document.querySelectorAll('.link-bundle, .quick-bundle').forEach(el => {
      //  el.href = 'https://your-global-link.com/bundle';
      // });
    }
  } catch (error) {
    console.log("Location detection failed, defaulting to INR.", error);
  }
}

window.addEventListener('DOMContentLoaded', localizePrices);
