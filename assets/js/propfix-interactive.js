/**
 * CREATE AND ARISE - PropFix Interactive Logic
 * Powers the multi-step Quote Quiz, modal popups, and smooth section interactions
 */

(function () {
  'use strict';

  function initPropfixQuizzes() {
    const quizContainers = document.querySelectorAll('.pf-quiz-container');

    quizContainers.forEach(container => {
      let currentStep = 1;
      let selectedService = '';
      let selectedTimeline = '';

      const progressBar = container.querySelector('.pf-quiz-progress-fill');
      const stepLabel = container.querySelector('.pf-step-label');

      const step1 = container.querySelector('.pf-step-1');
      const step2 = container.querySelector('.pf-step-2');
      const step3 = container.querySelector('.pf-step-3');

      const serviceCards = container.querySelectorAll('.pf-service-option-card');
      const timelinePills = container.querySelectorAll('.pf-pill-option');

      const btnBackStep2 = container.querySelector('.pf-back-to-step-1');
      const btnBackStep3 = container.querySelector('.pf-back-to-step-2');

      const quizForm = container.querySelector('.pf-quiz-form');
      const hiddenServiceInput = container.querySelector('input[name="service"]');
      const hiddenTimelineInput = container.querySelector('input[name="timeline"]');

      function goToStep(step) {
        currentStep = step;

        if (step1) step1.style.display = step === 1 ? 'block' : 'none';
        if (step2) step2.style.display = step === 2 ? 'block' : 'none';
        if (step3) step3.style.display = step === 3 ? 'block' : 'none';

        if (progressBar) {
          if (step === 1) progressBar.style.width = '33.33%';
          else if (step === 2) progressBar.style.width = '66.66%';
          else if (step === 3) progressBar.style.width = '100%';
        }

        if (stepLabel) {
          if (step === 1) stepLabel.textContent = 'Step 1 of 3: What service do you require?';
          else if (step === 2) stepLabel.textContent = 'Step 2 of 3: When would you like the work done?';
          else if (step === 3) stepLabel.textContent = 'Step 3 of 3: Tell us about your project & contact info';
        }
      }

      // Step 1: Click service card -> advance to step 2
      serviceCards.forEach(card => {
        card.addEventListener('click', function () {
          serviceCards.forEach(c => c.classList.remove('selected'));
          this.classList.add('selected');
          selectedService = this.getAttribute('data-service') || this.querySelector('.pf-service-opt-name').textContent.trim();
          if (hiddenServiceInput) hiddenServiceInput.value = selectedService;

          // Smooth advance
          setTimeout(() => {
            goToStep(2);
          }, 180);
        });
      });

      // Step 2: Click timeline pill -> advance to step 3
      timelinePills.forEach(pill => {
        pill.addEventListener('click', function () {
          timelinePills.forEach(p => p.classList.remove('selected'));
          this.classList.add('selected');
          selectedTimeline = this.getAttribute('data-timeline') || this.textContent.trim();
          if (hiddenTimelineInput) hiddenTimelineInput.value = selectedTimeline;

          // Smooth advance
          setTimeout(() => {
            goToStep(3);
          }, 180);
        });
      });

      // Back buttons
      if (btnBackStep2) {
        btnBackStep2.addEventListener('click', (e) => {
          e.preventDefault();
          goToStep(1);
        });
      }
      if (btnBackStep3) {
        btnBackStep3.addEventListener('click', (e) => {
          e.preventDefault();
          goToStep(2);
        });
      }

      // Submission
      if (quizForm) {
        quizForm.addEventListener('submit', async function (e) {
          e.preventDefault();
          const submitBtn = quizForm.querySelector('.pf-btn-submit');
          const originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'Get Free Quote';

          const formData = new FormData(quizForm);
          const fname = formData.get('first_name') || '';
          const lname = formData.get('last_name') || '';
          const email = formData.get('email') || '';
          const phone = formData.get('phone') || '';
          const notes = formData.get('details') || '';

          const payload = {
            name: `${fname} ${lname}`.trim(),
            email: email,
            phone: phone,
            service: selectedService || 'Web Design & Creative Suite',
            timeline: selectedTimeline || 'ASAP',
            message: notes,
            _subject: `⚡ New Instant Quote Inquiry: ${selectedService} (${selectedTimeline})`,
            inquiry_type: 'Instant Quote Quiz (PropFix Style)'
          };

          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Sending Quote Request...</span> <span class="spinner-border spinner-border-sm" role="status"></span>`;
          }

          try {
            let success = false;
            if (typeof window.sendFormSubmission === 'function') {
              success = await window.sendFormSubmission(payload);
            } else {
              // Direct FormSubmit fallback
              const res = await fetch('https://formsubmit.co/ajax/createandarise05@gmail.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(payload)
              });
              success = res.ok;
            }

            // Close popup if inside one
            const popup = container.closest('.pf-popup-overlay');
            if (popup) {
              popup.classList.remove('show-popup');
            }

            // Trigger success modal
            const successModal = document.getElementById('successModal');
            if (successModal) {
              const desc = document.getElementById('successModalDesc');
              if (desc) {
                desc.innerHTML = `Thank you <strong>${payload.name || 'there'}</strong>! Your quote request for <strong>${payload.service}</strong> (${payload.timeline}) has been submitted to Jerome Cabinta and the studio. We will prepare your custom proposal and reply within 24 weekday business hours.`;
              }
              const detailsBox = document.getElementById('successModalDetails');
              if (detailsBox) {
                detailsBox.style.display = 'block';
                detailsBox.innerHTML = `
                  <div style="font-weight:700; margin-bottom: 0.35rem; color: var(--color-primary);">📋 Quote Specifications:</div>
                  <div>&bull; <strong>Service:</strong> ${payload.service}</div>
                  <div>&bull; <strong>Timeline:</strong> ${payload.timeline}</div>
                  <div>&bull; <strong>Email:</strong> ${payload.email}</div>
                  ${payload.phone ? `<div>&bull; <strong>Phone / WhatsApp:</strong> ${payload.phone}</div>` : ''}
                `;
              }
              if (typeof window.openModal === 'function') {
                window.openModal('successModal');
              } else {
                successModal.classList.add('active');
              }
            } else {
              alert('Thank you! Your quote request has been submitted successfully.');
            }

            quizForm.reset();
            goToStep(1);
          } catch (err) {
            console.error('Quiz submission error:', err);
            alert('There was an issue sending your quote. Please email us directly at createandarise05@gmail.com');
          } finally {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalBtnHtml;
            }
          }
        });
      }

      // Initial state
      goToStep(1);

      // Expose preselection helper on container
      container.selectServiceAndGo = function (serviceKey) {
        serviceCards.forEach(c => {
          if (c.getAttribute('data-service') === serviceKey || c.textContent.toLowerCase().includes(serviceKey.toLowerCase())) {
            c.classList.add('selected');
            selectedService = c.getAttribute('data-service') || c.querySelector('.pf-service-opt-name').textContent.trim();
            if (hiddenServiceInput) hiddenServiceInput.value = selectedService;
          } else {
            c.classList.remove('selected');
          }
        });
        goToStep(2);
      };
    });
  }

  // Popup Modal Helpers (Safely redirecting any legacy calls to Cost Estimator)
  window.openQuotePopup = function (serviceName) {
    if (typeof window.switchTab === 'function') {
      window.switchTab('estimator');
    }
  };

  window.closeQuotePopup = function () {
    // Pop-out modal removed
  };

  function initPopupTriggers() {
    // Legacy quote triggers safely redirect to Cost Estimator
    document.querySelectorAll('[data-popup-target="#getquote"], .open-quote-popup, a[href="#getquote"]').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (typeof window.switchTab === 'function') {
          window.switchTab('estimator');
        }
      });
    });
  }

  // Dynamic Fixed Header Height sync to prevent any content overlap or shifts
  function syncHeaderHeight() {
    const headerMaster = document.getElementById('siteHeaderMaster') || document.querySelector('.site-header-master');
    if (headerMaster) {
      const height = headerMaster.offsetHeight;
      if (height > 0) {
        document.documentElement.style.setProperty('--site-header-height', `${height}px`);
      }
    }
  }

  window.syncHeaderHeight = syncHeaderHeight;
  window.addEventListener('resize', syncHeaderHeight, { passive: true });
  window.addEventListener('orientationchange', syncHeaderHeight, { passive: true });
  window.addEventListener('load', syncHeaderHeight);
  document.addEventListener('DOMContentLoaded', syncHeaderHeight);

  // ResizeObserver for zero-lag responsiveness across mobile orientation & layout shifts
  try {
    if (typeof ResizeObserver !== 'undefined') {
      const roHeader = new ResizeObserver(() => {
        syncHeaderHeight();
      });
      const headerEl = document.getElementById('siteHeaderMaster') || document.querySelector('.site-header-master');
      if (headerEl) roHeader.observe(headerEl);
    }
  } catch (err) {}

  // Smooth scroll helper for landing page anchors
  window.scrollToSection = function (sectionId) {
    if (typeof window.switchTab === 'function') {
      window.switchTab('home');
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        const headerMaster = document.getElementById('siteHeaderMaster') || document.querySelector('.site-header-master');
        const headerOffset = headerMaster ? headerMaster.offsetHeight + 16 : 124;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });
      }
    }, 50);
  };

  // Services Dropdown interactive handler for touch & desktop
  window.handleServicesDropdown = function (e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const dropdownWrap = document.querySelector('.nav-link-dropdown-wrap');
    if (!dropdownWrap) return;
    const triggerBtn = document.getElementById('servicesDropdownBtn');
    const isMobile = window.innerWidth <= 1180;

    if (isMobile) {
      // Accordion toggle inside mobile drawer
      const isOpen = dropdownWrap.classList.toggle('open');
      if (triggerBtn) {
        triggerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
    } else {
      // Desktop: toggle menu or navigate to services catalog
      if (dropdownWrap.classList.contains('open')) {
        dropdownWrap.classList.remove('open');
        if (triggerBtn) triggerBtn.setAttribute('aria-expanded', 'false');
        if (typeof window.switchTab === 'function') {
          window.switchTab('services');
        }
      } else {
        dropdownWrap.classList.add('open');
        if (triggerBtn) triggerBtn.setAttribute('aria-expanded', 'true');
      }
    }
  };

  window.filterServicesCatalog = function (category) {
    const dropdownWrap = document.querySelector('.nav-link-dropdown-wrap');
    if (dropdownWrap) dropdownWrap.classList.remove('open');

    if (typeof window.switchTab === 'function') {
      window.switchTab('services');
    }

    // Close mobile nav drawer if open
    if (typeof window.closeMobileNav === 'function') {
      window.closeMobileNav();
    }

    setTimeout(() => {
      const searchInput = document.getElementById('serviceSearchInput');
      if (searchInput) {
        if (!category || category === 'all') {
          searchInput.value = '';
        } else if (category === 'web') {
          searchInput.value = 'web';
        } else if (category === 'graphics') {
          searchInput.value = 'graphic';
        } else if (category === 'ads') {
          searchInput.value = 'ads';
        } else if (category === 'social') {
          searchInput.value = 'social';
        }
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 120);
  };

  function initDropdownMenu() {
    const dropdownWrap = document.querySelector('.nav-link-dropdown-wrap');
    if (!dropdownWrap) return;
    const triggerBtn = document.getElementById('servicesDropdownBtn') || dropdownWrap.querySelector('[data-tab="services"]');

    // Desktop hover behavior
    dropdownWrap.addEventListener('mouseenter', () => {
      if (window.innerWidth > 1180) {
        dropdownWrap.classList.add('open');
        if (triggerBtn) triggerBtn.setAttribute('aria-expanded', 'true');
      }
    });

    dropdownWrap.addEventListener('mouseleave', () => {
      if (window.innerWidth > 1180) {
        dropdownWrap.classList.remove('open');
        if (triggerBtn) triggerBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!dropdownWrap.contains(e.target)) {
        dropdownWrap.classList.remove('open');
        if (triggerBtn) triggerBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dropdownWrap.classList.contains('open')) {
        dropdownWrap.classList.remove('open');
        if (triggerBtn) triggerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    syncHeaderHeight();
    initPropfixQuizzes();
    initPopupTriggers();
    initDropdownMenu();
  });
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    syncHeaderHeight();
    initDropdownMenu();
  }
})();
