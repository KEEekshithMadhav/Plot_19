// ============================================================
// GOOGLE SHEETS CONFIGURATION
// ============================================================
const GOOGLE_SHEET_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxE8vcLXP-g7HcNpqNf8Wv7bd0F-VKYazImo8BDd79VAgIoo4RrzZfVFDmd1mjQCKvo/exec';

// ============================================================
// SEND LEAD DATA TO GOOGLE SHEETS
// Supports both URLSearchParams (e.parameter) & JSON (e.postData)
// ============================================================
async function sendLeadToGoogleSheet(data) {
  if (
    !GOOGLE_SHEET_SCRIPT_URL ||
    GOOGLE_SHEET_SCRIPT_URL.includes('PUT_YOUR_SCRIPT_ID_HERE')
  ) {
    console.error('Google Sheets Web App URL is not configured.');
    console.log('Payload:', data);
    return false;
  }

  try {
    console.log('Submitting lead payload to Google Sheets:', data);

    // Build URLSearchParams so Google Apps Script e.parameter is populated
    const params = new URLSearchParams();
    params.append('date', data.date || new Date().toLocaleString());
    params.append('sourceForm', data.sourceForm || 'Website Lead');
    params.append('name', data.name || '');
    params.append('phone', data.phone || '');
    params.append('email', data.email || '');
    params.append('residenceType', data.residenceType || '');
    params.append('message', data.message || '');

    // Post data to Google Apps Script Web App
    await fetch(GOOGLE_SHEET_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    console.log('Lead submitted to Google Sheets successfully.');
    return true;
  } catch (error) {
    console.error('Error posting to Google Sheets:', error);
    return false;
  }
}

// ============================================================
// CONTROLLER MAIN ENTRY POINT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. PRELOADER FADE OUT
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('fade-out');
    }, 600);
  }

  // 2. SCROLL PROGRESS + STICKY HEADER
  const progressBar = document.querySelector('.scroll-progress-bar');
  const header = document.querySelector('.site-header');

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${scrolled}%`;
    }

    if (window.scrollY > 70) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // 3. MOBILE DRAWER NAVIGATION
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');

  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    siteNav?.classList.toggle('active');
    document.body.style.overflow = siteNav?.classList.contains('active') ? 'hidden' : '';
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle?.classList.remove('active');
      siteNav?.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // 4. REVEAL ANIMATIONS
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

  // 5. ARCHITECTURAL STATISTICS COUNTER
  const statNumbers = document.querySelectorAll('.stat-number');
  let animatedStats = false;
  const statsSection = document.querySelector('.stats-bar');

  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !animatedStats) {
        animatedStats = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target') || '0', 10);
          if (isNaN(target) || target === 0) return;

          let count = 0;
          const speed = Math.max(20, Math.floor(2000 / target));
          const timer = setInterval(() => {
            count += Math.ceil(target / 40);
            if (count >= target) {
              stat.textContent = target.toLocaleString();
              clearInterval(timer);
            } else {
              stat.textContent = count.toLocaleString();
            }
          }, speed);
        });
      }
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  // 6. MASTERPLAN ZOOM + LIGHTBOX
  const btnZoomMasterplan = document.getElementById('btnZoomMasterplan');
  const masterplanImg = document.getElementById('masterplanImg');

  if (btnZoomMasterplan && masterplanImg) {
    btnZoomMasterplan.addEventListener('click', () => {
      openLightbox(masterplanImg.src, 'Neopolis — Architectural Master Site Plan Board');
    });
    masterplanImg.parentElement?.addEventListener('click', () => {
      openLightbox(masterplanImg.src, 'Neopolis — Architectural Master Site Plan Board');
    });
  }

  // 7. LIGHTBOX MODAL
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, captionText) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = captionText || '';
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('.gallery-caption')?.childNodes[0]?.textContent?.trim() || 'Neopolis Render';
      if (img) openLightbox(img.src, caption);
    });
  });

  // 8. FLOOR PLAN UNLOCK MODAL
  const unlockModal = document.getElementById('unlockModal');
  const modalCloseBtns = document.querySelectorAll('.modal-close');
  const floorplanUnlockBtns = document.querySelectorAll('.btn-unlock-floorplan');
  const unlockForm = document.getElementById('unlockForm');
  let currentPlanName = 'Tower Residence';

  floorplanUnlockBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      currentPlanName = btn.getAttribute('data-plan') || 'Tower Residence';
      const modalPlanTitle = document.getElementById('modalPlanTitle');
      if (modalPlanTitle) {
        modalPlanTitle.textContent = `Unlock ${currentPlanName} Layout`;
      }
      unlockModal?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      unlockModal?.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  unlockModal?.addEventListener('click', (e) => {
    if (e.target === unlockModal) {
      unlockModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // 9. FLOOR PLAN UNLOCK FORM SUBMISSION
  unlockForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = unlockForm.querySelector('button[type="submit"]');
    const origText = submitBtn ? submitBtn.textContent : 'Unlock HD Floor Plan';

    if (submitBtn) {
      submitBtn.textContent = 'Unlocking Residence Layout...';
      submitBtn.disabled = true;
    }

    const inputs = unlockForm.querySelectorAll('input');
    const name = inputs[0]?.value.trim() || '';
    const phone = inputs[1]?.value.trim() || '';
    const email = inputs[2]?.value.trim() || '';

    const payload = {
      date: new Date().toLocaleString(),
      sourceForm: 'Floor Plan Unlock Modal',
      name: name,
      phone: phone,
      email: email,
      residenceType: currentPlanName,
      message: 'Unlocked HD Floor Plan schematic'
    };

    await sendLeadToGoogleSheet(payload);

    unlockModal?.classList.remove('active');
    document.body.style.overflow = '';

    document.querySelectorAll('.floorplan-image-wrapper img').forEach(img => {
      img.style.filter = 'none';
    });

    document.querySelectorAll('.floorplan-gate-overlay').forEach(overlay => {
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
    });

    alert('Floor Plan unlocked successfully. High-definition architectural schematics are now viewable.');
    unlockForm.reset();

    if (submitBtn) {
      submitBtn.textContent = origText;
      submitBtn.disabled = false;
    }
  });

  // 10. CONTACT ENQUIRY FORM SUBMISSION
  const contactForm = document.getElementById('contactForm');

  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = btn ? btn.textContent : 'Request Private Consultation';

    if (btn) {
      btn.textContent = 'Registering Private Request...';
      btn.disabled = true;
    }

    const fields = contactForm.querySelectorAll('.form-input');
    const name = fields[0]?.value.trim() || '';
    const phone = fields[1]?.value.trim() || '';
    const email = fields[2]?.value.trim() || '';
    const residenceType = fields[3]?.value.trim() || 'General Consultation';
    const message = fields[4]?.value.trim() || '';

    const payload = {
      date: new Date().toLocaleString(),
      sourceForm: 'Private Consultation Form',
      name: name,
      phone: phone,
      email: email,
      residenceType: residenceType,
      message: message
    };

    await sendLeadToGoogleSheet(payload);

    alert('Thank you for registering your interest in Neopolis. Our executive concierge will contact you directly.');
    contactForm.reset();

    if (btn) {
      btn.textContent = originalButtonText;
      btn.disabled = false;
    }
  });
});