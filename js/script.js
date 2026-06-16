// ── SLIDER ──────────────────────────────

const totalCourses = 3; 

let current = 0, locked = false;

const track = document.getElementById('track');

const detailView = document.getElementById('detail-view');

const homeFooter = document.getElementById('homeFooter');

function buildDots() {

  const dotsEl = document.getElementById('dots');

  if (!dotsEl) return;

  dotsEl.innerHTML = '';

  for(let i=0; i<totalCourses; i++) {

    const d = document.createElement('div');

    d.className = 'dot' + (i === 0 ? ' active' : '');

    d.onclick = () => goTo(i);

    dotsEl.appendChild(d);

  }

}

function goTo(n) {

  if (!track || !detailView) return;

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

  if (!track || !detailView) return;

  if (detailView.classList.contains('open') || document.getElementById('coursesMenuSection')?.style.display === 'block') return;

  goTo(current + (e.deltaY > 0 ? 1 : -1));

}, { passive: true });

let touchStartY = 0;

window.addEventListener('touchstart', e => touchStartY = e.touches[0].clientY, { passive: true });

window.addEventListener('touchend', e => {

  if (!track || !detailView) return;

  if (detailView.classList.contains('open') || document.getElementById('coursesMenuSection')?.style.display === 'block') return;

  const dy = touchStartY - e.changedTouches[0].clientY;

  if (Math.abs(dy) > 40) goTo(current + (dy > 0 ? 1 : -1));

}, { passive: true });

buildDots();

// ── FULL WEBSITE MENU & DETAIL VIEWS ──

function openCoursesMenu() {

      if (document.getElementById('pythonDetailSection')?.style.display === 'block') {
    closePythonHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  // Hide main dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = 'none';

  if (dashGrid) dashGrid.style.display = 'none';

  if (dashBottom) dashBottom.style.display = 'none';

  // Hide all sections first

  hideAllSections();

  // Show Courses section

  const cms = document.getElementById('coursesMenuSection');

  if (cms) cms.style.display = 'block';

  // Update sidebar active states

  document.querySelectorAll('.dashboard-nav-item').forEach(item => item.classList.remove('active'));

  const courseNavItem = Array.from(document.querySelectorAll('.dashboard-nav-item'))

    .find(item => item.textContent.includes('Course Handbook Bundle'));

  if (courseNavItem) courseNavItem.classList.add('active');

  // Update topbar header text to breadcrumbs

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft) {

    if (!topbarLeft.dataset.originalHtml) {

      topbarLeft.dataset.originalHtml = topbarLeft.innerHTML;

    }

    topbarLeft.innerHTML = `

      <div class="breadcrumbs" style="font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;display:flex;align-items:center;">

        <span onclick="showDashboard()" style="cursor:pointer;color:var(--muted);transition:color 0.2s;">Home</span>

        <span style="color:var(--muted);margin:0 8px;">&gt;</span>

        <span style="color:var(--navy);font-weight:700;">Course Bundles</span>

      </div>

    `;

  }

  var sh = document.getElementById('sideHighlights'); if (sh) sh.style.display = 'none';

  window.scrollTo({ top: 0, behavior: 'instant' });

}

function closeCoursesMenu() {

  showDashboard();

}

// ── HANDBOOK DROPDOWN LOGIC ──

function toggleHandbookDropdown(e) {

  e.stopPropagation();

  var dd = document.getElementById('handbookDropdown');

  if (!dd) return;

  dd.classList.toggle('open');

}

function closeHandbookDropdown() {

  var dd = document.getElementById('handbookDropdown');

  if (dd) dd.classList.remove('open');

}

// Close dropdown when clicking outside

document.addEventListener('click', function(e) {

  var wrap = document.querySelector('.handbook-dropdown-wrap');

  if (wrap && !wrap.contains(e.target)) {

    closeHandbookDropdown();

  }

});

function goToFreeSQL() {

  openDetail('data-analyst');

  // Scroll to the free SQL handbook button after the detail view opens

  setTimeout(function() {

    var btn = document.querySelector('#course-data-analyst .form-submit-full');

    if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'center' });

  }, 500);

}

function goToFreeML() {

  openDetail('data-science');

  // Scroll to the free ML handbook button after the detail view opens

  setTimeout(function() {

    var btn = document.querySelector('#course-data-science .form-submit-full');

    if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'center' });

  }, 500);

}

function openDetail(courseId) {

  if (courseId === 'data-analyst' || courseId === 'data-analyst-questions' || courseId === 'data-science' || courseId === 'data-science-questions') {

            if (document.getElementById('pythonDetailSection')?.style.display === 'block') {
      closePythonHandbook();
    }
    if (document.getElementById('mathDetailSection')?.style.display === 'block') {
      closeMathHandbook();
    }
    if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
      closeMathDsHandbook();
    }
    if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
      closeSqlHandbook();
    }
    if (document.getElementById('biDetailSection')?.style.display === 'block') {
      closeBiHandbook();
    }
    if (document.getElementById('deDetailSection')?.style.display === 'block') {
      closeDeHandbook();
    }
    if (document.getElementById('domainDetailSection')?.style.display === 'block') {
      closeDomainHandbook();
    }
    if (document.getElementById('aiDetailSection')?.style.display === 'block') {
      closeAiHandbook();
    }
    if (document.getElementById('excelDetailSection')?.style.display === 'block') {
      closeExcelHandbook();
    }
    if (document.getElementById('mathDetailSection')?.style.display === 'block') {
      closeMathHandbook();
    }
    if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
      closeSqlHandbook();
    }
    if (document.getElementById('biDetailSection')?.style.display === 'block') {
      closeBiHandbook();
    }
    if (document.getElementById('deDetailSection')?.style.display === 'block') {
      closeDeHandbook();
    }
    if (document.getElementById('domainDetailSection')?.style.display === 'block') {
      closeDomainHandbook();
    }
    if (document.getElementById('aiDetailSection')?.style.display === 'block') {
      closeAiHandbook();
    }
    if (document.getElementById('excelDetailSection')?.style.display === 'block') {
      closeExcelHandbook();
    }
    // Hide main dashboard homepage elements

    const statsGrid = document.querySelector('.stats-grid');

    const dashGrid = document.querySelector('.dashboard-grid');

    const dashBottom = document.querySelector('.dashboard-bottom');

    if (statsGrid) statsGrid.style.display = 'none';

    if (dashGrid) dashGrid.style.display = 'none';

    if (dashBottom) dashBottom.style.display = 'none';

    // Hide other sections

    hideAllSections();

    // Show the target section

    const target = document.getElementById('course-' + courseId);

    if (target) {

      target.style.display = 'block';

    }

    // Update sidebar active states to 'Course Handbook Bundle'

    document.querySelectorAll('.dashboard-nav-item').forEach(item => item.classList.remove('active'));

    const courseNavItem = Array.from(document.querySelectorAll('.dashboard-nav-item'))

      .find(item => item.textContent.includes('Course Handbook Bundle'));

    if (courseNavItem) courseNavItem.classList.add('active');

    // Update topbar header text to breadcrumbs

    const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

    if (topbarLeft) {

      if (!topbarLeft.dataset.originalHtml) {

        topbarLeft.dataset.originalHtml = topbarLeft.innerHTML;

      }

      if (courseId === 'data-analyst' || courseId === 'data-science') {

        const title = courseId === 'data-analyst' ? 'Data &amp; BI Analyst Bundle' : 'Data Scientist &amp; Gen AI Engineer Bundle';

        topbarLeft.innerHTML = `

          <div class="breadcrumbs" style="font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;display:flex;align-items:center;">

            <span onclick="showDashboard()" style="cursor:pointer;color:var(--muted);transition:color 0.2s;">Home</span>

            <span style="color:var(--muted);margin:0 8px;">&gt;</span>

            <span onclick="openCoursesMenu()" style="cursor:pointer;color:var(--muted);transition:color 0.2s;">Course Bundles</span>

            <span style="color:var(--muted);margin:0 8px;">&gt;</span>

            <span style="color:var(--navy);font-weight:700;">${title}</span>

          </div>

        `;

      } else {

        const parentId = courseId === 'data-analyst-questions' ? 'data-analyst' : 'data-science';

        const parentTitle = courseId === 'data-analyst-questions' ? 'Data &amp; BI Analyst Bundle' : 'Data Scientist &amp; Gen AI Engineer Bundle';

        topbarLeft.innerHTML = `

          <div class="breadcrumbs" style="font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;display:flex;align-items:center;">

            <span onclick="showDashboard()" style="cursor:pointer;color:var(--muted);transition:color 0.2s;">Home</span>

            <span style="color:var(--muted);margin:0 8px;">&gt;</span>

            <span onclick="openDetail('${parentId}')" style="cursor:pointer;color:var(--muted);transition:color 0.2s;">${parentTitle}</span>

            <span style="color:var(--muted);margin:0 8px;">&gt;</span>

            <span style="color:var(--navy);font-weight:700;">Interview Questions</span>

          </div>

        `;

      }

    }

    var sh = document.getElementById('sideHighlights'); if (sh) sh.style.display = 'none';

    window.scrollTo({ top: 0, behavior: 'instant' });

    return;

  }

  document.querySelectorAll('.course-container').forEach(el => el.classList.remove('active'));

  var course = document.getElementById('course-' + courseId);

  if (!course || !detailView) return;

  course.classList.add('active');

  detailView.classList.add('open');

  if (homeFooter) homeFooter.style.display = 'none'; 

  document.body.style.overflow = 'hidden'; 

  detailView.scrollTop = 0; 

  window.location.hash = courseId;

  var sh = document.getElementById('sideHighlights'); if (sh) sh.style.display = 'none';

}

function closeDetail() {

  if (!detailView) return;

  detailView.classList.remove('open');

  if (homeFooter) homeFooter.style.display = 'flex';

  document.body.style.overflow = 'auto';

  // NEW: Remove the hash from the URL when going back home

  window.history.replaceState(null, null, window.location.pathname);

  var sh = document.getElementById('sideHighlights'); if (sh) sh.style.display = '';

}

function scrollDashboardTop() {

  showDashboard();

}

// All section IDs that can be toggled

var allSectionIds = ['coursesMenuSection', 'exploreAllHandbooksSection', 'insideHandbookSection', 'toolsTechSection', 'freeHandbooksSection', 'reviewsSection', 'course-data-analyst', 'course-data-analyst-questions', 'course-data-science', 'course-data-science-questions'];

function hideAllSections() {

  allSectionIds.forEach(function(id) {

    var el = document.getElementById(id);

    if (el) el.style.display = 'none';

  });

}

function showDashboard() {

      if (document.getElementById('pythonDetailSection')?.style.display === 'block') {
    closePythonHandbook();
    return;
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
    return;
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
    return;
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
    return;
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
    return;
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
    return;
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
    return;
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
    return;
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
    return;
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
    return;
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
    return;
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
    return;
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
    return;
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
    return;
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
    return;
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
    return;
  }
  hideAllSections();

  // Show main dashboard homepage elements

  var statsGrid = document.querySelector('.stats-grid');

  var dashGrid = document.querySelector('.dashboard-grid');

  var dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = '';

  if (dashGrid) dashGrid.style.display = '';

  if (dashBottom) dashBottom.style.display = '';

  // Update sidebar active state

  document.querySelectorAll('.dashboard-nav-item').forEach(function(item) { item.classList.remove('active'); });

  var dashBtn = Array.from(document.querySelectorAll('.dashboard-nav-item'))

    .find(function(item) { return item.textContent.includes('Dashboard'); });

  if (dashBtn) dashBtn.classList.add('active');

  // Restore original header content if modified

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft && topbarLeft.dataset.originalHtml) {

    topbarLeft.innerHTML = topbarLeft.dataset.originalHtml;

  } else {

    // Restore topbar header text just in case

    var h1 = document.querySelector('.dashboard-topbar h1');

    var p = document.querySelector('.dashboard-topbar p');

    if (h1 && p) {

      h1.innerHTML = 'Welcome to Learn<span class="brand-lytics">lytics</span>';

      p.innerHTML = 'Your one-stop hub for high-quality handbooks to <strong>learn, practice &amp; grow.</strong>';

    }

  }

  var sh = document.getElementById('sideHighlights'); if (sh) sh.style.display = '';

  window.scrollTo({ top: 0, behavior: 'instant' });

}

var sectionConfig = {

  inside:  { id: 'insideHandbookSection',  title: "What's Inside Handbook", subtitle: 'Discover the 3 powerful files you get in every handbook.' },

  tools:   { id: 'toolsTechSection',        title: 'Tools & Tech Cover',     subtitle: 'Everything you need to succeed in the Data World.' },

  free:    { id: 'freeHandbooksSection',     title: 'Free Handbooks',         subtitle: 'Download high-quality handbooks completely free.' },

  reviews: { id: 'reviewsSection',          title: 'Student Reviews',        subtitle: 'Hear from learners who upgraded their careers.' }

};

function showSection(section) {

      if (document.getElementById('pythonDetailSection')?.style.display === 'block') {
    closePythonHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  // Restore original header content if it was replaced with breadcrumbs

  var topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft && topbarLeft.dataset.originalHtml) {

    topbarLeft.innerHTML = topbarLeft.dataset.originalHtml;

  }

  var config = sectionConfig[section];

  if (!config) return;

  var target = document.getElementById(config.id);

  if (!target) return;

  // Hide dashboard grids

  var statsGrid = document.querySelector('.stats-grid');

  var dashGrid = document.querySelector('.dashboard-grid');

  var dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = 'none';

  if (dashGrid) dashGrid.style.display = 'none';

  if (dashBottom) dashBottom.style.display = 'none';

  // Hide all sections, then show target

  hideAllSections();

  target.style.display = 'block';

  // Update sidebar active

  document.querySelectorAll('.dashboard-nav-item').forEach(function(item) { item.classList.remove('active'); });

  var activeButton = Array.from(document.querySelectorAll('.dashboard-nav-item'))

    .find(function(item) { var oc = item.getAttribute('onclick'); return oc && oc.includes("'" + section + "'"); });

  if (activeButton) activeButton.classList.add('active');

  // Update topbar

  var h1 = document.querySelector('.dashboard-topbar h1');

  var p = document.querySelector('.dashboard-topbar p');

  if (h1 && p) {

    h1.innerHTML = config.title;

    p.innerHTML = config.subtitle;

  }

  var sh = document.getElementById('sideHighlights'); if (sh) sh.style.display = 'none';

  window.scrollTo({ top: 0, behavior: 'instant' });

}

// Legacy alias

function showDashboardSection(section) { showSection(section); }

function openPythonHandbook() {

  // Hide main dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = 'none';

  if (dashGrid) dashGrid.style.display = 'none';

  if (dashBottom) dashBottom.style.display = 'none';

  // Hide all sections first

  hideAllSections();

      if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  // Show Python details section

  const pythonSection = document.getElementById('pythonDetailSection');

  if (pythonSection) {

    pythonSection.style.display = 'block';

  }

  // Update header text to breadcrumbs

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft) {

    if (!topbarLeft.dataset.originalHtml) {

      topbarLeft.dataset.originalHtml = topbarLeft.innerHTML;

    }

    topbarLeft.innerHTML = `

      <div class="breadcrumbs" style="font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;display:flex;align-items:center;">

        <span onclick="closePythonHandbook()" style="cursor:pointer;color:var(--muted);transition:color 0.2s;">Home</span>

        <span style="color:var(--muted);margin:0 8px;">&gt;</span>

        <span style="color:var(--navy);font-weight:700;">Python for Data Professionals</span>

      </div>

    `;

  }

  // Scroll to top

  window.scrollTo({ top: 0, behavior: 'smooth' });

}

function closePythonHandbook() {

  // Restore dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = 'grid';

  if (dashGrid) dashGrid.style.display = 'grid';

  if (dashBottom) dashBottom.style.display = 'grid';

  // Hide Python details section

  const pythonSection = document.getElementById('pythonDetailSection');

  if (pythonSection) {

    pythonSection.style.display = 'none';

  }

  // Restore original header content

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft && topbarLeft.dataset.originalHtml) {

    topbarLeft.innerHTML = topbarLeft.dataset.originalHtml;

  }

  // Set Dashboard nav active

  document.querySelectorAll('.dashboard-nav-item').forEach(item => item.classList.remove('active'));

  const dashBtn = Array.from(document.querySelectorAll('.dashboard-nav-item'))

    .find(item => item.textContent.includes('Dashboard'));

  if (dashBtn) dashBtn.classList.add('active');

  // Scroll to top

  window.scrollTo({ top: 0, behavior: 'smooth' });

}

function openMathHandbook() {

  // Hide main dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = 'none';

  if (dashGrid) dashGrid.style.display = 'none';

  if (dashBottom) dashBottom.style.display = 'none';

  // Hide all sections first

  hideAllSections();

      if (document.getElementById('pythonDetailSection')?.style.display === 'block') {
    closePythonHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  // Show Math details section

  const mathSection = document.getElementById('mathDetailSection');

  if (mathSection) {

    mathSection.style.display = 'block';

  }

  // Update header text to breadcrumbs

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft) {

    if (!topbarLeft.dataset.originalHtml) {

      topbarLeft.dataset.originalHtml = topbarLeft.innerHTML;

    }

    topbarLeft.innerHTML = `

      <div class="breadcrumbs" style="font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;display:flex;align-items:center;">

        <span onclick="closeMathHandbook()" style="cursor:pointer;color:var(--muted);transition:color 0.2s;">Home</span>

        <span style="color:var(--muted);margin:0 8px;">&gt;</span>

        <span style="color:var(--navy);font-weight:700;">Mathematics &amp; Statistics Handbook</span>

      </div>

    `;

  }

  // Scroll to top

  window.scrollTo({ top: 0, behavior: 'smooth' });

}

function closeMathHandbook() {

  // Restore dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = '';

  if (dashGrid) dashGrid.style.display = '';

  if (dashBottom) dashBottom.style.display = '';

  // Hide Math details section

  const mathSection = document.getElementById('mathDetailSection');

  if (mathSection) {

    mathSection.style.display = 'none';

  }

  // Restore original header content

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft && topbarLeft.dataset.originalHtml) {

    topbarLeft.innerHTML = topbarLeft.dataset.originalHtml;

  }

  // Set Dashboard nav active

  document.querySelectorAll('.dashboard-nav-item').forEach(item => item.classList.remove('active'));

  const dashBtn = Array.from(document.querySelectorAll('.dashboard-nav-item'))

    .find(item => item.textContent.includes('Dashboard'));

  if (dashBtn) dashBtn.classList.add('active');

  // Scroll to top

  window.scrollTo({ top: 0, behavior: 'smooth' });

}

function openMathDsHandbook() {
  // Hide main dashboard homepage elements
  const statsGrid = document.querySelector('.stats-grid');
  const dashGrid = document.querySelector('.dashboard-grid');
  const dashBottom = document.querySelector('.dashboard-bottom');
  if (statsGrid) statsGrid.style.display = 'none';
  if (dashGrid) dashGrid.style.display = 'none';
  if (dashBottom) dashBottom.style.display = 'none';
  
  // Hide all sections first
  hideAllSections();
  if (document.getElementById('pythonDetailSection')?.style.display === 'block') {
    closePythonHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  
  // Show Math DS details section
  const mathDsSection = document.getElementById('mathDsDetailSection');
  if (mathDsSection) {
    mathDsSection.style.display = 'block';
  }
  
  // Update header text to breadcrumbs
  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');
  if (topbarLeft) {
    if (!topbarLeft.dataset.originalHtml) {
      topbarLeft.dataset.originalHtml = topbarLeft.innerHTML;
    }
    topbarLeft.innerHTML = `
      <div class="breadcrumbs" style="font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;display:flex;align-items:center;">
        <span onclick="closeMathDsHandbook()" style="cursor:pointer;color:var(--muted);transition:color 0.2s;">Home</span>
        <span style="color:var(--muted);margin:0 8px;">&gt;</span>
        <span style="color:var(--navy);font-weight:700;">Mathematics &amp; Statistics For Data Science Handbook</span>
      </div>
    `;
  }
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeMathDsHandbook() {
  // Restore dashboard homepage elements
  const statsGrid = document.querySelector('.stats-grid');
  const dashGrid = document.querySelector('.dashboard-grid');
  const dashBottom = document.querySelector('.dashboard-bottom');
  if (statsGrid) statsGrid.style.display = '';
  if (dashGrid) dashGrid.style.display = '';
  if (dashBottom) dashBottom.style.display = '';
  
  // Hide Math DS details section
  const mathDsSection = document.getElementById('mathDsDetailSection');
  if (mathDsSection) {
    mathDsSection.style.display = 'none';
  }
  
  // Restore original header content
  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');
  if (topbarLeft && topbarLeft.dataset.originalHtml) {
    topbarLeft.innerHTML = topbarLeft.dataset.originalHtml;
  }
  
  // Set Dashboard nav active
  document.querySelectorAll('.dashboard-nav-item').forEach(item => item.classList.remove('active'));
  const dashBtn = Array.from(document.querySelectorAll('.dashboard-nav-item'))
    .find(item => item.textContent.includes('Dashboard'));
  if (dashBtn) dashBtn.classList.add('active');
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openSqlHandbook() {

  // Hide main dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = 'none';

  if (dashGrid) dashGrid.style.display = 'none';

  if (dashBottom) dashBottom.style.display = 'none';

  // Hide all sections first

  hideAllSections();

      if (document.getElementById('pythonDetailSection')?.style.display === 'block') {
    closePythonHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  // Show SQL details section

  const sqlSection = document.getElementById('sqlDetailSection');

  if (sqlSection) {

    sqlSection.style.display = 'block';

  }

  // Update header text to breadcrumbs

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft) {

    if (!topbarLeft.dataset.originalHtml) {

      topbarLeft.dataset.originalHtml = topbarLeft.innerHTML;

    }

    topbarLeft.innerHTML = `

      <div class="breadcrumbs" style="font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;display:flex;align-items:center;">

        <span onclick="closeSqlHandbook()" style="cursor:pointer;color:var(--muted);transition:color 0.2s;">Home</span>

        <span style="color:var(--muted);margin:0 8px;">&gt;</span>

        <span style="color:var(--navy);font-weight:700;">SQL &amp; Databases Handbook</span>

      </div>

    `;

  }

  // Scroll to top

  window.scrollTo({ top: 0, behavior: 'smooth' });

}

function closeSqlHandbook() {

  // Restore dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = '';

  if (dashGrid) dashGrid.style.display = '';

  if (dashBottom) dashBottom.style.display = '';

  // Hide SQL details section

  const sqlSection = document.getElementById('sqlDetailSection');

  if (sqlSection) {

    sqlSection.style.display = 'none';

  }

  // Restore original header content

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft && topbarLeft.dataset.originalHtml) {

    topbarLeft.innerHTML = topbarLeft.dataset.originalHtml;

  }

  // Set Dashboard nav active

  document.querySelectorAll('.dashboard-nav-item').forEach(item => item.classList.remove('active'));

  const dashBtn = Array.from(document.querySelectorAll('.dashboard-nav-item'))

    .find(item => item.textContent.includes('Dashboard'));

  if (dashBtn) dashBtn.classList.add('active');

  // Scroll to top

  window.scrollTo({ top: 0, behavior: 'smooth' });

}

function openBiHandbook() {

  // Hide main dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = 'none';

  if (dashGrid) dashGrid.style.display = 'none';

  if (dashBottom) dashBottom.style.display = 'none';

  // Hide all sections first

  hideAllSections();

      if (document.getElementById('pythonDetailSection')?.style.display === 'block') {
    closePythonHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  // Show BI details section

  const biSection = document.getElementById('biDetailSection');

  if (biSection) {

    biSection.style.display = 'block';

  }

  // Update header text to breadcrumbs

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft) {

    if (!topbarLeft.dataset.originalHtml) {

      topbarLeft.dataset.originalHtml = topbarLeft.innerHTML;

    }

    topbarLeft.innerHTML = `

      <div class="breadcrumbs" style="font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;display:flex;align-items:center;">

        <span onclick="closeBiHandbook()" style="cursor:pointer;color:var(--muted);transition:color 0.2s;">Home</span>

        <span style="color:var(--muted);margin:0 8px;">&gt;</span>

        <span style="color:var(--navy);font-weight:700;">Business Intelligence &amp; Dashboards Handbook</span>

      </div>

    `;

  }

  // Scroll to top

  window.scrollTo({ top: 0, behavior: 'smooth' });

}

function closeBiHandbook() {

  // Restore dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = '';

  if (dashGrid) dashGrid.style.display = '';

  if (dashBottom) dashBottom.style.display = '';

  // Hide BI details section

  const biSection = document.getElementById('biDetailSection');

  if (biSection) {

    biSection.style.display = 'none';

  }

  // Restore original header content

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft && topbarLeft.dataset.originalHtml) {

    topbarLeft.innerHTML = topbarLeft.dataset.originalHtml;

  }

  // Set Dashboard nav active

  document.querySelectorAll('.dashboard-nav-item').forEach(item => item.classList.remove('active'));

  const dashBtn = Array.from(document.querySelectorAll('.dashboard-nav-item'))

    .find(item => item.textContent.includes('Dashboard'));

  if (dashBtn) dashBtn.classList.add('active');

  // Scroll to top

  window.scrollTo({ top: 0, behavior: 'smooth' });

}

function openDeHandbook() {

  // Hide main dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = 'none';

  if (dashGrid) dashGrid.style.display = 'none';

  if (dashBottom) dashBottom.style.display = 'none';

  // Hide all sections first

  hideAllSections();

      if (document.getElementById('pythonDetailSection')?.style.display === 'block') {
    closePythonHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  // Show DE details section

  const deSection = document.getElementById('deDetailSection');

  if (deSection) {

    deSection.style.display = 'block';

  }

  // Update header text to breadcrumbs

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft) {

    if (!topbarLeft.dataset.originalHtml) {

      topbarLeft.dataset.originalHtml = topbarLeft.innerHTML;

    }

    topbarLeft.innerHTML = `

      <div class="breadcrumbs" style="font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;display:flex;align-items:center;">

        <span onclick="closeDeHandbook()" style="cursor:pointer;color:var(--muted);transition:color 0.2s;">Home</span>

        <span style="color:var(--muted);margin:0 8px;">&gt;</span>

        <span style="color:var(--navy);font-weight:700;">Data Engineering Fundamentals Handbook</span>

      </div>

    `;

  }

  // Scroll to top

  window.scrollTo({ top: 0, behavior: 'smooth' });

}

function closeDeHandbook() {

  // Restore dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = '';

  if (dashGrid) dashGrid.style.display = '';

  if (dashBottom) dashBottom.style.display = '';

  // Hide DE details section

  const deSection = document.getElementById('deDetailSection');

  if (deSection) {

    deSection.style.display = 'none';

  }

  // Restore original header content

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft && topbarLeft.dataset.originalHtml) {

    topbarLeft.innerHTML = topbarLeft.dataset.originalHtml;

  }

  // Set Dashboard nav active

  document.querySelectorAll('.dashboard-nav-item').forEach(item => item.classList.remove('active'));

  const dashBtn = Array.from(document.querySelectorAll('.dashboard-nav-item'))

    .find(item => item.textContent.includes('Dashboard'));

  if (dashBtn) dashBtn.classList.add('active');

  // Scroll to top

  window.scrollTo({ top: 0, behavior: 'smooth' });

}

function openDomainHandbook() {

  // Hide main dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = 'none';

  if (dashGrid) dashGrid.style.display = 'none';

  if (dashBottom) dashBottom.style.display = 'none';

  // Hide all sections first

  hideAllSections();

      if (document.getElementById('pythonDetailSection')?.style.display === 'block') {
    closePythonHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  // Show Domain details section

  const domainSection = document.getElementById('domainDetailSection');

  if (domainSection) {

    domainSection.style.display = 'block';

  }

  // Update header text to breadcrumbs

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft) {

    if (!topbarLeft.dataset.originalHtml) {

      topbarLeft.dataset.originalHtml = topbarLeft.innerHTML;

    }

    topbarLeft.innerHTML = `

      <div class="breadcrumbs" style="font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;display:flex;align-items:center;">

        <span onclick="closeDomainHandbook()" style="cursor:pointer;color:var(--muted);transition:color 0.2s;">Home</span>

        <span style="color:var(--muted);margin:0 8px;">&gt;</span>

        <span style="color:var(--navy);font-weight:700;">Storytelling, Communication &amp; Domain Knowledge Handbook</span>

      </div>

    `;

  }

  // Scroll to top

  window.scrollTo({ top: 0, behavior: 'smooth' });

}

function closeDomainHandbook() {

  // Restore dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = '';

  if (dashGrid) dashGrid.style.display = '';

  if (dashBottom) dashBottom.style.display = '';

  // Hide Domain details section

  const domainSection = document.getElementById('domainDetailSection');

  if (domainSection) {

    domainSection.style.display = 'none';

  }

  // Restore original header content

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft && topbarLeft.dataset.originalHtml) {

    topbarLeft.innerHTML = topbarLeft.dataset.originalHtml;

  }

  // Set Dashboard nav active

  document.querySelectorAll('.dashboard-nav-item').forEach(item => item.classList.remove('active'));

  const dashBtn = Array.from(document.querySelectorAll('.dashboard-nav-item'))

    .find(item => item.textContent.includes('Dashboard'));

  if (dashBtn) dashBtn.classList.add('active');

  // Scroll to top

  window.scrollTo({ top: 0, behavior: 'smooth' });

}

function openAiHandbook() {

  // Hide main dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = 'none';

  if (dashGrid) dashGrid.style.display = 'none';

  if (dashBottom) dashBottom.style.display = 'none';

  // Hide all sections first

  hideAllSections();

      if (document.getElementById('pythonDetailSection')?.style.display === 'block') {
    closePythonHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  // Show AI details section

  const aiSection = document.getElementById('aiDetailSection');

  if (aiSection) {

    aiSection.style.display = 'block';

  }

  // Update header text to breadcrumbs

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft) {

    if (!topbarLeft.dataset.originalHtml) {

      topbarLeft.dataset.originalHtml = topbarLeft.innerHTML;

    }

    topbarLeft.innerHTML = `

      <div class="breadcrumbs" style="font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;display:flex;align-items:center;">

        <span onclick="closeAiHandbook()" style="cursor:pointer;color:var(--muted);transition:color 0.2s;">Home</span>

        <span style="color:var(--muted);margin:0 8px;">&gt;</span>

        <span style="color:var(--navy);font-weight:700;">AI-Era Analytics Handbook</span>

      </div>

    `;

  }

  // Scroll to top

  window.scrollTo({ top: 0, behavior: 'smooth' });

}

function closeAiHandbook() {

  // Restore dashboard homepage elements

  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = '';

  if (dashGrid) dashGrid.style.display = '';

  if (dashBottom) dashBottom.style.display = '';

  // Hide AI details section

  const aiSection = document.getElementById('aiDetailSection');

  if (aiSection) {

    aiSection.style.display = 'none';

  }

  // Restore original header content

  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');

  if (topbarLeft && topbarLeft.dataset.originalHtml) {

    topbarLeft.innerHTML = topbarLeft.dataset.originalHtml;

  }

  // Set Dashboard nav active

  document.querySelectorAll('.dashboard-nav-item').forEach(item => item.classList.remove('active'));

  const dashBtn = Array.from(document.querySelectorAll('.dashboard-nav-item'))

    .find(item => item.textContent.includes('Dashboard'));

  if (dashBtn) dashBtn.classList.add('active');

  // Scroll to top

  window.scrollTo({ top: 0, behavior: 'smooth' });

}

function openExcelHandbook() {
  // Hide main dashboard homepage elements
  const statsGrid = document.querySelector('.stats-grid');
  const dashGrid = document.querySelector('.dashboard-grid');
  const dashBottom = document.querySelector('.dashboard-bottom');
  if (statsGrid) statsGrid.style.display = 'none';
  if (dashGrid) dashGrid.style.display = 'none';
  if (dashBottom) dashBottom.style.display = 'none';
  
  // Hide all sections first
  hideAllSections();
    if (document.getElementById('pythonDetailSection')?.style.display === 'block') {
    closePythonHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  
  // Show Excel details section
  const excelSection = document.getElementById('excelDetailSection');
  if (excelSection) {
    excelSection.style.display = 'block';
  }
  
  // Update header text to breadcrumbs
  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');
  if (topbarLeft) {
    if (!topbarLeft.dataset.originalHtml) {
      topbarLeft.dataset.originalHtml = topbarLeft.innerHTML;
    }
    topbarLeft.innerHTML = `
      <div class="breadcrumbs" style="font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;display:flex;align-items:center;">
        <span onclick="closeExcelHandbook()" style="cursor:pointer;color:var(--muted);transition:color 0.2s;">Home</span>
        <span style="color:var(--muted);margin:0 8px;">&gt;</span>
        <span style="color:var(--navy);font-weight:700;">Excel &amp; Google Sheets Handbook</span>
      </div>
    `;
  }
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeExcelHandbook() {
  // Restore dashboard homepage elements
  const statsGrid = document.querySelector('.stats-grid');
  const dashGrid = document.querySelector('.dashboard-grid');
  const dashBottom = document.querySelector('.dashboard-bottom');
  if (statsGrid) statsGrid.style.display = '';
  if (dashGrid) dashGrid.style.display = '';
  if (dashBottom) dashBottom.style.display = '';
  
  // Hide Excel details section
  const excelSection = document.getElementById('excelDetailSection');
  if (excelSection) {
    excelSection.style.display = 'none';
  }
  
  // Restore original header content
  const topbarLeft = document.querySelector('.dashboard-topbar > div:first-child');
  if (topbarLeft && topbarLeft.dataset.originalHtml) {
    topbarLeft.innerHTML = topbarLeft.dataset.originalHtml;
  }
  
  // Set Dashboard nav active
  document.querySelectorAll('.dashboard-nav-item').forEach(item => item.classList.remove('active'));
  const dashBtn = Array.from(document.querySelectorAll('.dashboard-nav-item'))
    .find(item => item.textContent.includes('Dashboard'));
  if (dashBtn) dashBtn.classList.add('active');
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleAllPythonModules() {

  const modules = ['py-mod1', 'py-mod2', 'py-mod3', 'py-mod4', 'py-mod5', 'py-mod6'];

  const btn = document.getElementById('toggleAllModulesBtn');

  if (!btn) return;

  const isExpand = btn.textContent.includes('Expand');

  modules.forEach(id => {

    const card = document.getElementById(id);

    if (card) {

      if (isExpand) {

        card.classList.add('open');

      } else {

        card.classList.remove('open');

      }

    }

  });

  btn.textContent = isExpand ? 'Collapse All' : 'Expand All';

}

function togglePhase(id) {

  const card = document.getElementById(id);

  card.classList.toggle('open');

}

// Scroll to a phase card and open it (triggered from subject-map chips)

function scrollToPhase(id) {

  const card = document.getElementById(id);

  if (!card) return;

  if (!card.classList.contains('open')) {

    card.classList.add('open');

  }

  card.scrollIntoView({ behavior: 'smooth', block: 'center' });

}

// ── FREE HANDBOOK MODAL LOGIC ──

let currentModalConfig = {

  title: "Get Free SQL Handbook",

  sub: "Enter your details below &mdash; we will send the handbook directly to your inbox. No spam, we promise.",

  successMsg: "We just sent the free handbook directly to your inbox (check your spam folder just in case!).",

  downloadText: "📄 Download Free SQL Handbook Now",

  fileLink: "https://drive.google.com/file/d/1tg1D9w3WbXnH8scho_HbKwbqV6SG8tq0/view?usp=sharing",

  subject: "📄 Your Free SQL Database Handbook — Learnlytics.handbook",

  emailTitle: "Free SQL Database Handbook"

};

function openModal(type) {

  const baseLink = window.location.origin;

  if (type === 'sql-questions') {

    currentModalConfig = {

      title: "Get Free SQL Questions Set",

      sub: "Enter your details below &mdash; we will send the sample questions directly to your inbox. No spam, we promise.",

      successMsg: "We just sent the free sample questions directly to your inbox (check your spam folder just in case!).",

      downloadText: "📄 Download Free SQL Questions Now",

      fileLink: "https://drive.google.com/file/d/1tg1D9w3WbXnH8scho_HbKwbqV6SG8tq0/view?usp=sharing",

      subject: "📄 Your Free SQL Questions Set — Learnlytics.handbook",

      emailTitle: "Free SQL Questions Set"

    };

  } else if (type === 'ds-handbook') {

    currentModalConfig = {

      title: "Get Free Machine Learning Handbook",

      sub: "Enter your details below &mdash; we will send the handbook preview directly to your inbox.",

      successMsg: "We just sent the free handbook preview directly to your inbox (check your spam folder just in case!).",

      downloadText: "📄 Download ML Part-01 Handbook Now",

      fileLink: baseLink + "/pdfs/ML-part01-handbook.pdf",

      subject: "📄 Your Free Machine Learning Handbook Sample — Learnlytics.handbook",

      emailTitle: "Free Machine Learning Handbook Sample"

    };

  } else if (type === 'ds-questions') {

    currentModalConfig = {

      title: "Get Free Machine Learning Questions Set",

      sub: "Enter your details below &mdash; we will send the sample questions directly to your inbox.",

      successMsg: "We just sent the free sample questions directly to your inbox (check your spam folder just in case!).",

      downloadText: "📄 Download ML Questions Sample Now",

      fileLink: baseLink + "/pdfs/ML-part01-que-handook.pdf",

      subject: "📄 Your Free Machine Learning Questions Sample — Learnlytics.handbook",

      emailTitle: "Free Machine Learning Questions Sample"

    };

  } else {

    // Default: sql-handbook

    currentModalConfig = {

      title: "Get Free SQL Handbook",

      sub: "Enter your details below &mdash; we will send the handbook directly to your inbox. No spam, we promise.",

      successMsg: "We just sent the free handbook directly to your inbox (check your spam folder just in case!).",

      downloadText: "📄 Download Free SQL Handbook Now",

      fileLink: "https://drive.google.com/file/d/1tg1D9w3WbXnH8scho_HbKwbqV6SG8tq0/view?usp=sharing",

      subject: "📄 Your Free SQL Database Handbook — Learnlytics.handbook",

      emailTitle: "Free SQL Database Handbook"

    };

  }

  // Swap modal DOM values

  document.getElementById('modal-title').innerText = currentModalConfig.title;

  document.getElementById('modal-sub').innerHTML = currentModalConfig.sub;

  document.getElementById('modal-success-msg').innerText = currentModalConfig.successMsg;

  const dlBtn = document.getElementById('modal-download-btn');

  dlBtn.href = currentModalConfig.fileLink;

  dlBtn.innerText = currentModalConfig.downloadText;

  // Update bonus message based on type (DA = SQL, DS = ML)

  var bonusMsg = document.getElementById('modal-bonus-msg');

  if (bonusMsg) {

    if (type === 'ds-handbook' || type === 'ds-questions') {

      bonusMsg.textContent = 'Want Machine Learning Part 01 Interview Question Set? Message us on WhatsApp to get it instantly.';

    } else {

      bonusMsg.textContent = 'Want our SQL Interview Question Set? Message us on WhatsApp to get it instantly.';

    }

  }

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

  const scriptURL = 'https://script.google.com/macros/s/AKfycbxl9TB50_VHlU_H6r6yCs33NNuzWU0VBqhWG5yXBbe7jwR4jMyd9zWbSj8AMGPRKgMy/exec';

  const formData = new URLSearchParams();

  formData.append('name', name);

  formData.append('email', email);

  formData.append('phone', wa);

  formData.append('fileLink', currentModalConfig.fileLink);

  formData.append('subject', currentModalConfig.subject);

  formData.append('emailTitle', currentModalConfig.emailTitle);

  fetch(scriptURL, {

    method: 'POST',

    body: formData

  })

  .then(response => {

    if (!response.ok) throw new Error('Server error');

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

  const scriptURL = 'https://script.google.com/macros/s/AKfycbxl9TB50_VHlU_H6r6yCs33NNuzWU0VBqhWG5yXBbe7jwR4jMyd9zWbSj8AMGPRKgMy/exec';

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

    if (!response.ok) throw new Error('Server error');

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

    } else if (document.getElementById('coursesMenuSection')?.style.display === 'block') {

      closeCoursesMenu();

    } else if (detailView.classList.contains('open')) {

      closeDetail();

    }

  }

  // FIX: added review-modal and coursesMenuSection to guard — previously arrow keys could navigate slides while modal was open

  const reviewModal = document.getElementById('review-modal');

  const coursesSection = document.getElementById('coursesMenuSection');

  const isCoursesOpen = coursesSection && coursesSection.style.display === 'block';

  if (detailView.classList.contains('open') || document.getElementById('modal').classList.contains('open') || isCoursesOpen || (reviewModal && reviewModal.classList.contains('open'))) return;

  if (!track) return;

  if (e.key === 'ArrowDown') goTo(current + 1);

  if (e.key === 'ArrowUp') goTo(current - 1);

});

const REGIONAL_CHECKOUT = {

  dataAnalyst: {

    asia: {

      handbook: 'https://rzp.io/rzp/7gKjrQ1R',

      interview: 'https://rzp.io/rzp/BnUho1gl',

      bundle: 'https://rzp.io/rzp/S2y4eZ3'

    },

    international: {

      handbook: 'https://rzp.io/rzp/D7r6WGq',

      interview: 'https://rzp.io/rzp/kGokl24y',

      bundle: 'https://rzp.io/rzp/ro1v8df'

    }

  },

  dataScience: {

    asia: 'https://rzp.io/rzp/43PikTXQ',

    international: 'https://rzp.io/rzp/jJvaGhJy'

  }

};

const EUROPE_COUNTRY_CODES = new Set([

  'AL', 'AD', 'AT', 'BY', 'BE', 'BA', 'BG', 'HR', 'CY', 'CZ', 'DK',

  'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'XK', 'LV',

  'LI', 'LT', 'LU', 'MT', 'MD', 'MC', 'ME', 'NL', 'MK', 'NO', 'PL',

  'PT', 'RO', 'RU', 'SM', 'RS', 'SK', 'SI', 'ES', 'SE', 'CH', 'TR',

  'UA', 'GB', 'VA'

]);

const ASIA_COUNTRY_CODES = new Set([

  'AF', 'AM', 'AZ', 'BH', 'BD', 'BT', 'BN', 'KH', 'CN', 'GE', 'HK',

  'IN', 'ID', 'IR', 'IQ', 'IL', 'JP', 'JO', 'KZ', 'KW', 'KG', 'LA',

  'LB', 'MO', 'MY', 'MV', 'MN', 'MM', 'NP', 'KP', 'OM', 'PK', 'PS',

  'PH', 'QA', 'SA', 'SG', 'KR', 'LK', 'SY', 'TW', 'TJ', 'TH', 'TL',

  'TM', 'AE', 'UZ', 'VN', 'YE'

]);

function getCourseRoots(courseIds) {

  return courseIds

    .map(id => document.getElementById(id))

    .filter(Boolean);

}

function updateWithin(roots, selector, update) {

  roots.forEach(root => root.querySelectorAll(selector).forEach(update));

}

function replacePaymentLink(oldUrl, newUrl) {

  document.querySelectorAll(`a[href="${oldUrl}"]`).forEach(link => {

    link.href = newUrl;

  });

}

function applyDataAnalystMarket(useInternationalCheckout) {

  if (!useInternationalCheckout) return;

  const analystRoots = getCourseRoots([

    'course-data-analyst',

    'course-data-analyst-questions'

  ]);

  updateWithin(analystRoots, '.price-basic', el => el.textContent = '$19');

  updateWithin(analystRoots, '.price-bundle', el => el.textContent = '$29');

  updateWithin(analystRoots, '.strike-basic', el => el.textContent = '$39');

  updateWithin(analystRoots, '.strike-bundle', el => el.textContent = '$79');

  updateWithin(analystRoots, '.conversion-callout span', el => {

    el.textContent = 'Market Value: $79. Launch Price: $29.';

  });

  const heroOffer = document.querySelector('.conversion-copy span');

  if (heroOffer) {

    heroOffer.textContent = 'Market Value: $79. Launch Price: $29.';

  }

  replacePaymentLink(

    REGIONAL_CHECKOUT.dataAnalyst.asia.handbook,

    REGIONAL_CHECKOUT.dataAnalyst.international.handbook

  );

  replacePaymentLink(

    REGIONAL_CHECKOUT.dataAnalyst.asia.interview,

    REGIONAL_CHECKOUT.dataAnalyst.international.interview

  );

  replacePaymentLink(

    REGIONAL_CHECKOUT.dataAnalyst.asia.bundle,

    REGIONAL_CHECKOUT.dataAnalyst.international.bundle

  );

}

function applyDataScienceMarket(useAsianCheckout) {

  const scienceRoots = getCourseRoots([

    'course-data-science',

    'course-data-science-questions'

  ]);

  if (useAsianCheckout) {

    updateWithin(scienceRoots, '.price-basic', el => el.textContent = '\u20B9399');

    updateWithin(scienceRoots, '.price-bundle', el => el.textContent = '\u20B9899');

    updateWithin(scienceRoots, '.strike-bundle', el => el.textContent = '\u20B93,500');

  } else {

    updateWithin(scienceRoots, '.price-basic', el => el.textContent = '$29');

    updateWithin(scienceRoots, '.price-bundle', el => el.textContent = '$39');

    updateWithin(scienceRoots, '.strike-basic', el => el.textContent = '$49');

    updateWithin(scienceRoots, '.strike-bundle', el => el.textContent = '$99');

    replacePaymentLink(

      REGIONAL_CHECKOUT.dataScience.asia,

      REGIONAL_CHECKOUT.dataScience.international

    );

  }

}

async function detectCountryCode() {

  const providers = [

    {

      url: 'https://ipapi.co/json/',

      readCountry: data => data.country_code

    },

    {

      url: 'https://api.country.is/',

      readCountry: data => data.country

    }

  ];

  for (const provider of providers) {

    try {

      const response = await fetch(provider.url);

      if (!response.ok) continue;

      const data = await response.json();

      const countryCode = String(provider.readCountry(data) || '').toUpperCase();

      if (/^[A-Z]{2}$/.test(countryCode)) return countryCode;

    } catch (error) {

      // Try the next provider.

    }

  }

  return '';

}

function getLocalCountryOverride() {

  const localHosts = new Set(['localhost', '127.0.0.1', '::1']);

  if (!localHosts.has(window.location.hostname)) return '';

  const countryCode = new URLSearchParams(window.location.search)

    .get('test-country')

    ?.toUpperCase();

  return /^[A-Z]{2}$/.test(countryCode || '') ? countryCode : '';

}

async function localizePrices() {

  const countryCode = getLocalCountryOverride() || await detectCountryCode();

  // A failed lookup keeps the safer INR defaults and existing Asian links.

  if (!countryCode) return;

  const useInternationalAnalystCheckout =

    countryCode === 'US' || EUROPE_COUNTRY_CODES.has(countryCode);

  const useAsianScienceCheckout = ASIA_COUNTRY_CODES.has(countryCode);

  applyDataAnalystMarket(useInternationalAnalystCheckout);

  applyDataScienceMarket(useAsianScienceCheckout);

}

// Combined initialization: deep-link routing + price localization

window.addEventListener('DOMContentLoaded', () => {

  // Make direct shared links work

  if (window.location.hash) {

    const hashId = window.location.hash.substring(1);

    if (document.getElementById('course-' + hashId)) {

      openDetail(hashId);

    }

  }

  // Detect location and swap currency

  localizePrices();

});

// --- EXPLORE ALL HANDBOOKS LOGIC ---

const popularityOrder = ['hb-math', 'hb-math-ds', 'hb-python', 'hb-ml', 'hb-dl', 'hb-genai', 'hb-sql', 'hb-mlops', 'hb-bi', 'hb-de', 'hb-ai', 'hb-domain', 'hb-eda', 'hb-model', 'hb-excel'];

const analyticsOrder = ['hb-math', 'hb-excel', 'hb-sql', 'hb-python', 'hb-bi', 'hb-de', 'hb-domain', 'hb-ai'];

const scienceOrder = ['hb-math-ds', 'hb-python', 'hb-eda', 'hb-ml', 'hb-model', 'hb-dl', 'hb-mlops', 'hb-genai'];

function filterHandbooks() {

  const filter = document.getElementById('explore-sort-select').value;

  const container = document.getElementById('explore-grid-container');

  if (!container) return;

  const cards = Array.from(container.getElementsByClassName('explore-card'));

  let orderArray = popularityOrder;

  if (filter === 'analytics') orderArray = analyticsOrder;

  else if (filter === 'science') orderArray = scienceOrder;

  // Hide all first

  cards.forEach(c => c.style.display = 'none');

  // Update count text

  document.getElementById('explore-showing-text').textContent = `1-${orderArray.length} of ${orderArray.length}`;

  // Reorder and show

  orderArray.forEach((id, index) => {

    const card = document.getElementById(id);

    if (card) {

      card.style.display = 'block';

      // Update the number tag

      const numSpan = card.querySelector('.explore-num');

      if (numSpan) numSpan.textContent = (index + 1).toString().padStart(2, '0');

      container.appendChild(card); // Moves to end

    }

  });

}

function openExploreAllHandbooks() {

      if (document.getElementById('pythonDetailSection')?.style.display === 'block') {
    closePythonHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('mathDsDetailSection')?.style.display === 'block') {
    closeMathDsHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  if (document.getElementById('mathDetailSection')?.style.display === 'block') {
    closeMathHandbook();
  }
  if (document.getElementById('sqlDetailSection')?.style.display === 'block') {
    closeSqlHandbook();
  }
  if (document.getElementById('biDetailSection')?.style.display === 'block') {
    closeBiHandbook();
  }
  if (document.getElementById('deDetailSection')?.style.display === 'block') {
    closeDeHandbook();
  }
  if (document.getElementById('domainDetailSection')?.style.display === 'block') {
    closeDomainHandbook();
  }
  if (document.getElementById('aiDetailSection')?.style.display === 'block') {
    closeAiHandbook();
  }
  if (document.getElementById('excelDetailSection')?.style.display === 'block') {
    closeExcelHandbook();
  }
  const statsGrid = document.querySelector('.stats-grid');

  const dashGrid = document.querySelector('.dashboard-grid');

  const dashBottom = document.querySelector('.dashboard-bottom');

  if (statsGrid) statsGrid.style.display = 'none';

  if (dashGrid) dashGrid.style.display = 'none';

  if (dashBottom) dashBottom.style.display = 'none';

  hideAllSections();

  const eah = document.getElementById('exploreAllHandbooksSection');

  if (eah) {

    eah.style.display = 'block';

    document.getElementById('explore-sort-select').value = 'popularity';

    filterHandbooks();

  }

  document.querySelectorAll('.dashboard-nav-item').forEach(item => item.classList.remove('active'));

}

