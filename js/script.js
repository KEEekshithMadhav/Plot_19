/* ==========================================================================
   PLOT 19 NEOPOLIS BY NEXHOUZ - SENIOR UI/UX INTERACTION CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Preloader Fade-out
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('fade-out');
    }, 600);
  }

  // 2. Top Scroll Progress Indicator & Sticky Glass Dock Navbar Transition
  const progressBar = document.querySelector('.scroll-progress-bar');
  const header = document.querySelector('.site-header');

  window.addEventListener('scroll', () => {
    // Scroll progress bar calculation
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (progressBar) {
      progressBar.style.width = `${scrolled}%`;
    }

    // Sticky floating header dock transition
    if (window.scrollY > 70) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // 3. Mobile Drawer Navigation Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    siteNav?.classList.toggle('active');
    document.body.style.overflow = siteNav?.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile nav when clicking a link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle?.classList.remove('active');
      siteNav?.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // 4. Reveal Animations Observer
  const revealElements = document.querySelectorAll('.reveal');
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

  // 5. Architectural Statistics Counter Animation
  const statNumbers = document.querySelectorAll('.stat-number');
  let animatedStats = false;

  const statsSection = document.querySelector('.stats-bar');
  if (statsSection) {
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

  // 6. Masterplan Board Zoom & Lightbox
  const btnZoomMasterplan = document.getElementById('btnZoomMasterplan');
  const masterplanImg = document.getElementById('masterplanImg');
  
  if (btnZoomMasterplan && masterplanImg) {
    btnZoomMasterplan.addEventListener('click', () => {
      openLightbox(masterplanImg.src, 'Plot 19 Neopolis — Architectural Master Site Plan Board');
    });
    masterplanImg.parentElement?.addEventListener('click', () => {
      openLightbox(masterplanImg.src, 'Plot 19 Neopolis — Architectural Master Site Plan Board');
    });
  }

  // 7. Lightbox Modal Controller
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

  // Attach gallery items to lightbox
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('.gallery-caption')?.childNodes[0]?.textContent?.trim() || 'Plot 19 Neopolis Render';
      if (img) openLightbox(img.src, caption);
    });
  });

  // 8. Floor Plan Unlock Modal Logic
  const unlockModal = document.getElementById('unlockModal');
  const modalCloseBtns = document.querySelectorAll('.modal-close');
  const floorplanUnlockBtns = document.querySelectorAll('.btn-unlock-floorplan');
  const unlockForm = document.getElementById('unlockForm');

  floorplanUnlockBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const planName = btn.getAttribute('data-plan') || 'Residence';
      const modalPlanTitle = document.getElementById('modalPlanTitle');
      if (modalPlanTitle) modalPlanTitle.textContent = `Unlock ${planName} Layout`;
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

  unlockForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = unlockForm.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.textContent = 'Unlocking Residence Layout...';
    
    setTimeout(() => {
      unlockModal?.classList.remove('active');
      document.body.style.overflow = '';
      
      // Unblur floor plan images gracefully
      document.querySelectorAll('.floorplan-image-wrapper img').forEach(img => {
        img.style.filter = 'none';
      });
      document.querySelectorAll('.floorplan-gate-overlay').forEach(overlay => {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
      });

      alert('Floor Plan unlocked successfully. High-definition architectural schematics are now viewable.');
    }, 1200);
  });

  // 9. Contact Enquiry Form Submission
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    if (btn) btn.textContent = 'Registering Private Request...';
    
    setTimeout(() => {
      alert('Thank you for registering your interest in Plot 19 Neopolis. Our executive concierge will contact you directly.');
      contactForm.reset();
      if (btn) btn.textContent = 'Request Private Consultation';
    }, 1200);
  });
});
