/* ============================================================
   CREATIVE ARTSY INTERACTIVE JAVASCRIPT
   Handles Splash Screen, Navigation, Modals, Form Steps & Draggable Canvas
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Splash Screen Dismissal
  const splash = document.querySelector('.ca-splash');
  if (splash) {
    const dismissSplash = () => {
      splash.style.opacity = '0';
      splash.style.pointerEvents = 'none';
      setTimeout(() => {
        splash.style.display = 'none';
      }, 500);
    };

    // Auto dismiss after animation finishes (2.5s)
    setTimeout(dismissSplash, 2500);

    // Allow user to click splash to dismiss immediately
    splash.addEventListener('click', dismissSplash);
  }

  // 2. Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Certificate & Project Preview Modal
  const modal = document.getElementById('artsyModal');
  const modalImg = document.getElementById('artsyModalImg');
  const modalTitle = document.getElementById('artsyModalTitle');
  const modalDesc = document.getElementById('artsyModalDesc');
  const modalClose = document.getElementById('artsyModalClose');

  window.openModal = function (src, title, desc) {
    if (!modal) return;
    if (modalImg) modalImg.src = src;
    if (modalTitle) modalTitle.textContent = title || 'Pratinjau';
    if (modalDesc) modalDesc.textContent = desc || '';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function () {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (modalClose) {
    modalClose.addEventListener('click', window.closeModal);
  }

  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) window.closeModal();
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      window.closeModal();
      if (mobileMenu) mobileMenu.classList.add('hidden');
    }
  });

  // 4. Interactive 2-Step Scrapbook Contact Form
  const step1 = document.getElementById('contact-step-1');
  const step2 = document.getElementById('contact-step-2');
  const btnNext = document.getElementById('contact-btn-next');
  const btnBack = document.getElementById('contact-btn-back');
  const contactForm = document.getElementById('ca-contact-form');
  const messageInput = document.getElementById('ca-contact-message');
  const nameInput = document.getElementById('ca-contact-name');
  const emailInput = document.getElementById('ca-contact-email');
  const contactSuccess = document.getElementById('contact-success');

  if (btnNext && step1 && step2) {
    btnNext.addEventListener('click', () => {
      const val = messageInput ? messageInput.value.trim() : '';
      if (!val) {
        if (messageInput) {
          messageInput.focus();
          messageInput.placeholder = 'Silakan tulis pesan terlebih dahulu! :)';
        }
        return;
      }
      step1.classList.add('hidden');
      step2.classList.remove('hidden');
      if (nameInput) nameInput.focus();
    });
  }

  if (btnBack && step1 && step2) {
    btnBack.addEventListener('click', () => {
      step2.classList.add('hidden');
      step1.classList.remove('hidden');
      if (messageInput) messageInput.focus();
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = nameInput ? nameInput.value.trim() : 'Kawan';
      const email = emailInput ? emailInput.value.trim() : '';
      const msg = messageInput ? messageInput.value.trim() : '';

      // Create WhatsApp message or mailto fallback
      const waText = encodeURIComponent(`Halo Zul Arsyl, saya ${name} (${email}): ${msg}`);
      const waUrl = `https://wa.me/625737662724?text=${waText}`;

      if (contactSuccess) {
        step2.classList.add('hidden');
        contactSuccess.classList.remove('hidden');
      }

      // Open whatsapp after brief delay
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 800);
    });
  }

  // 5. Interactive Playground Canvas (Draggable cards & Zoom)
  const canvasContainer = document.getElementById('playgroundCanvas');
  const zoomInBtn = document.getElementById('zoomIn');
  const zoomOutBtn = document.getElementById('zoomOut');

  if (canvasContainer) {
    let currentScale = 1;
    const updateZoom = (delta) => {
      currentScale = Math.min(Math.max(0.6, currentScale + delta), 1.6);
      canvasContainer.style.transform = `scale(${currentScale})`;
    };

    if (zoomInBtn) zoomInBtn.addEventListener('click', () => updateZoom(0.15));
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => updateZoom(-0.15));

    // Draggable cards logic
    const cards = canvasContainer.querySelectorAll('.draggable-card');
    cards.forEach(card => {
      let isDragging = false;
      let startX, startY, initialLeft, initialTop;

      const onMouseDown = (e) => {
        isDragging = true;
        card.style.cursor = 'grabbing';
        card.style.zIndex = '50';
        startX = e.clientX || (e.touches && e.touches[0].clientX);
        startY = e.clientY || (e.touches && e.touches[0].clientY);
        
        const rect = card.getBoundingClientRect();
        const parentRect = canvasContainer.getBoundingClientRect();
        initialLeft = rect.left - parentRect.left;
        initialTop = rect.top - parentRect.top;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('touchmove', onMouseMove, { passive: false });
        document.addEventListener('touchend', onMouseUp);
      };

      const onMouseMove = (e) => {
        if (!isDragging) return;
        if (e.cancelable) e.preventDefault();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        const dx = (clientX - startX) / currentScale;
        const dy = (clientY - startY) / currentScale;

        card.style.left = `${initialLeft + dx}px`;
        card.style.top = `${initialTop + dy}px`;
      };

      const onMouseUp = () => {
        isDragging = false;
        card.style.cursor = 'grab';
        card.style.zIndex = '';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('touchmove', onMouseMove);
        document.removeEventListener('touchend', onMouseUp);
      };

      card.addEventListener('mousedown', onMouseDown);
      card.addEventListener('touchstart', onMouseDown, { passive: true });
    });
  }
});
