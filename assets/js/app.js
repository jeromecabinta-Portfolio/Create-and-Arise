/**
 * CREATE AND ARISE - Interactive Application Logic
 * Studio: Create and Arise (Philippines)
 * Features: Live PHT Hours, Cost Estimator, Portfolio Lightbox, Service Selectors, 
 *           Theme Switcher, Testimonial Carousel, Contact Form & Copy Email Handlers
 */

/* --------------------------------------------------------------------------
   FORM ENDPOINT CONFIGURATION (Formspree / FormSubmit / Custom)
   "Connect your form to our form endpoint and we'll email you the submissions."
   -------------------------------------------------------------------------- */
window.CAA_FORM_CONFIG = {
  // If you use Formspree, paste your Formspree Form ID (e.g. 'mqkvbzwq') or full URL (e.g. 'https://formspree.io/f/mqkvbzwq') below:
  formspreeId: '',

  // Fallback endpoint:
  fallbackEndpoint: 'https://formsubmit.co/ajax/createandarise05@gmail.com',

  getEndpoint() {
    if (this.formspreeId && this.formspreeId.trim()) {
      const id = this.formspreeId.trim();
      if (id.startsWith('http://') || id.startsWith('https://')) {
        return id;
      }
      return `https://formspree.io/f/${id}`;
    }
    return this.fallbackEndpoint;
  }
};

window.openModal = function (modalId) {
  if (typeof window.closeMobileNav === 'function') {
    window.closeMobileNav();
  }
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    const card = modal.querySelector('.modal-card');
    if (card) card.scrollTop = 0;
  }
};

window.closeModal = function (modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
  if (!document.querySelector('.modal-overlay.active')) {
    document.body.classList.remove('modal-open');
  }
};

window.openEstimateModal = function () {
  let scope = null;
  if (typeof window.getCalculatedScope === 'function') {
    try {
      scope = window.getCalculatedScope();
    } catch (e) {
      console.warn('Could not get calculated scope via helper:', e);
    }
  }

  // Fallback if calculator scope is not ready or has no services selected
  if (!scope || !scope.services || scope.services.length === 0) {
    const serviceNamesMap = {
      graphics: 'Graphic Design & Brand Identity',
      web: 'Web Design & Responsive Development',
      ads: 'Digital Ads & Campaign Marketing',
      social: 'Social Media Content Management'
    };
    const checkedBoxes = Array.from(document.querySelectorAll('.calc-service-checkbox:checked'));
    const services = checkedBoxes.map(cb => serviceNamesMap[cb.value] || cb.value);
    const finalServices = services.length > 0 ? services : ['Graphic Design & Brand Identity', 'Web Design & Responsive Development'];

    let selectedTimeline = 'Standard Delivery (2–3 Weeks)';
    const checkedRadio = document.querySelector('input[name="calc_timeline"]:checked');
    if (checkedRadio) {
      if (checkedRadio.value === 'express') selectedTimeline = 'Express Priority (7 Days)';
      else if (checkedRadio.value === 'retainer') selectedTimeline = 'Monthly Creative Retainer (-10%)';
    }

    const estAmountEl = document.getElementById('estAmount');
    const amountText = (estAmountEl && estAmountEl.textContent.trim()) ? estAmountEl.textContent.trim() : '$1,200';
    const currSelect = document.getElementById('calcCurrency');
    const currCode = currSelect ? currSelect.value : 'USD';

    scope = {
      services: finalServices,
      timeline: { label: selectedTimeline },
      currency: { suffix: currCode, code: currCode },
      amountText: amountText
    };
  }

  const modalAmount = document.getElementById('modalEstAmount');
  const modalServices = document.getElementById('modalEstServices');
  const modalPacing = document.getElementById('modalEstPacing');
  const notesField = document.getElementById('estClientNotes');
  const subjectField = document.getElementById('estimateFormSubject');
  const modalWa = document.getElementById('modalWaQuickBtn');
  const modalMail = document.getElementById('modalMailQuickBtn');

  if (modalAmount) modalAmount.textContent = scope.amountText;
  if (modalServices) modalServices.textContent = scope.services.join(', ');
  if (modalPacing) modalPacing.textContent = scope.timeline.label;
  if (subjectField) {
    subjectField.value = `🧮 [COST ESTIMATE] Custom Package Inquiry: ${scope.services.join(', ')} (~${scope.amountText})`;
  }

  if (notesField && (!notesField.value || notesField.dataset.userEdited !== 'true')) {
    notesField.value = `I configured this custom package using your Cost Estimator:\n• Services: ${scope.services.join(', ')}\n• Delivery Pacing: ${scope.timeline.label}\n• Estimated Investment: ~${scope.amountText} (${scope.currency.suffix || 'USD'})\n\nPlease email my itemized proposal and let's discuss details!`;
  }

  if (modalWa) {
    modalWa.href = `https://wa.me/639274682635?text=${encodeURIComponent(`Hi Jerome & Create and Arise! I configured a custom package with your Cost Estimator: ${scope.services.join(', ')} (~${scope.amountText}, ${scope.timeline.label}). I would love to connect!`)}`;
  }
  if (modalMail) {
    modalMail.href = `mailto:createandarise05@gmail.com?subject=${encodeURIComponent(`[Estimate Inquiry] ${scope.services.join(', ')} (${scope.amountText})`)}&body=${encodeURIComponent(`Hi Jerome & Create and Arise Team,\n\nI just configured an estimate using your Cost Estimator:\n• Services: ${scope.services.join(', ')}\n• Timeline Pacing: ${scope.timeline.label}\n• Estimated Investment: ~${scope.amountText} (${scope.currency.suffix || 'USD'})\n\nPlease email my formal proposal and let's get started!\n\nBest regards,`)}`;
  }

  if (typeof window.openModal === 'function') {
    window.openModal('estimateModal');
  } else {
    const m = document.getElementById('estimateModal');
    if (m) {
      m.classList.add('active');
      document.body.classList.add('modal-open');
    }
  }

  // Scroll modal card to top for mobile viewports
  const modalElem = document.getElementById('estimateModal');
  const cardElem = modalElem ? modalElem.querySelector('.modal-card') : null;
  if (cardElem) cardElem.scrollTop = 0;
};

// Global standalone alias for inline onclick
function openEstimateModal() {
  if (typeof window.openEstimateModal === 'function') {
    window.openEstimateModal();
  }
}

window.sendFormSubmission = async function (payload) {
  // Ensure _replyto is always present for instant Gmail replies
  if (payload.email && !payload._replyto) {
    payload._replyto = payload.email;
  }
  if (!payload._autoresponse) {
    payload._autoresponse = "Thank you for reaching out to Create and Arise! ✨ We have safely received your creative inquiry. Jerome Cabinta and our creative team will review your project details and respond within 24 weekday business hours (Mon–Fri 8AM–6PM PHT). WhatsApp: +63 927 468 2635 | createandarise05@gmail.com";
  }
  if (!payload._captcha) payload._captcha = 'false';
  if (!payload._template) payload._template = 'table';

  // 1. Try local server relay endpoint first if available (logs to data/messages.json & relays to FormSubmit backend-to-backend)
  try {
    const localRes = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (localRes.ok) {
      const data = await localRes.json();
      console.log('Submission successfully logged and dispatched via server relay:', data);
      return true;
    }
  } catch (localErr) {
    // If running statically or server is unreachable, smoothly fallback to direct client FormSubmit dispatch
  }

  // 2. Direct client-side dispatch to FormSubmit
  const endpoint = window.CAA_FORM_CONFIG ? window.CAA_FORM_CONFIG.getEndpoint() : 'https://formsubmit.co/ajax/createandarise05@gmail.com';
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (err) {
    console.warn('Form endpoint dispatch fallback:', err);
    return false;
  }
};

function syncFormActions() {
  const endpoint = window.CAA_FORM_CONFIG ? window.CAA_FORM_CONFIG.getEndpoint() : '';
  if (!endpoint) return;
  const forms = [
    document.getElementById('mainContactForm'),
    document.getElementById('estimateInquiryForm'),
    document.getElementById('bookCallForm'),
    document.getElementById('auditForm'),
    document.getElementById('feedbackForm')
  ];
  forms.forEach(f => {
    if (f) {
      f.setAttribute('action', endpoint);
      f.setAttribute('method', 'POST');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  syncFormActions();
  initLiveBusinessHours();
  initThemeToggle();
  initNavigation();
  initPortfolio();
  initCostCalculator();
  initServicesDirectory();
  initTestimonialCarousel();
  initFaqAccordion();
  initContactForm();
  initBookCallModal();
  initAuditModal();
  initModals();
  initGlobalInteractions();
});

/* --------------------------------------------------------------------------
   1. Live Philippine Time & Business Hours Status (Mon-Fri 8am-6pm PHT)
   -------------------------------------------------------------------------- */
function initLiveBusinessHours() {
  const statusBadge = document.getElementById('liveStatusBadge');
  const clockElement = document.getElementById('philippineClock');

  function updateHoursStatus() {
    // Current time in Philippines (Asia/Manila GMT+8)
    const phtDateStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' });
    const phtDate = new Date(phtDateStr);

    const day = phtDate.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    const hour24 = phtDate.getHours();
    const timeFormatted = phtDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });

    if (clockElement) {
      clockElement.innerHTML = `<span class="hide-mobile">PHT (GMT+8): </span><span class="show-mobile-inline">PHT: </span>${timeFormatted}`;
    }

    // Business Schedule: Monday (1) to Friday (5), 8:00 AM to 6:00 PM (18:00)
    const isWeekday = day >= 1 && day <= 5;
    const isWorkingHour = hour24 >= 8 && hour24 < 18;

    if (statusBadge) {
      if (isWeekday && isWorkingHour) {
        statusBadge.innerHTML = `
          <span class="status-dot online"></span>
          <span><strong>Open Now</strong> <span class="hide-mobile">&bull; Creative Studio Active</span> (Mon&ndash;Fri 8AM&ndash;6PM PHT)</span>
        `;
      } else if (!isWeekday) {
        statusBadge.innerHTML = `
          <span class="status-dot offline"></span>
          <span><strong>Studio Resting</strong> &bull; Weekend Rest <span class="hide-mobile">&bull; Opens Monday 8:00 AM PHT</span></span>
        `;
      } else {
        statusBadge.innerHTML = `
          <span class="status-dot offline"></span>
          <span><strong>Closed for Evening</strong> &bull; Opens tomorrow 8:00 AM PHT</span>
        `;
      }
    }
  }

  updateHoursStatus();
  setInterval(updateHoursStatus, 1000);
}

/* --------------------------------------------------------------------------
   2. Theme Switcher (Obsidian Dark / Pearl Light)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('caa_theme') || 'dark';

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('caa_theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Obsidian Gold Dark' : 'Pearl Clean Light'} theme`);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    if (theme === 'light') {
      themeToggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
      themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
    } else {
      themeToggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
      themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
    }
  }
}

/* --------------------------------------------------------------------------
   3. Tab View Navigation Controller (Single-Screen Web App / Zero Page Scroll)
   -------------------------------------------------------------------------- */
window.openMobileNav = function () {
  const navLinks = document.getElementById('navLinks');
  const menuToggle = document.getElementById('mobileMenuToggle');
  const backdrop = document.getElementById('mobileNavBackdrop');
  if (navLinks) navLinks.classList.add('open');
  if (menuToggle) {
    menuToggle.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
  }
  if (backdrop) backdrop.classList.add('open');
  document.body.classList.add('mobile-nav-locked');
};

window.closeMobileNav = function () {
  const navLinks = document.getElementById('navLinks');
  const menuToggle = document.getElementById('mobileMenuToggle');
  const backdrop = document.getElementById('mobileNavBackdrop');
  if (navLinks) navLinks.classList.remove('open');
  if (menuToggle) {
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
  if (backdrop) backdrop.classList.remove('open');
  document.body.classList.remove('mobile-nav-locked');

  // Close accordion dropdown inside mobile drawer
  const dropdownWrap = document.querySelector('.nav-link-dropdown-wrap');
  if (dropdownWrap) dropdownWrap.classList.remove('open');
  const triggerBtn = document.getElementById('servicesDropdownBtn');
  if (triggerBtn) triggerBtn.setAttribute('aria-expanded', 'false');
};

window.toggleMobileNav = function () {
  const navLinks = document.getElementById('navLinks');
  if (navLinks && navLinks.classList.contains('open')) {
    window.closeMobileNav();
  } else {
    window.openMobileNav();
  }
};

window.switchTab = function (tabName) {
  if (!tabName) tabName = 'home';
  tabName = tabName.replace('#', '').replace('view-', '').toLowerCase();

  // Route 'about' to 'mission' or 'about'
  if (tabName === 'about') tabName = 'mission';

  // Route 'testimonials' or 'reviews' to unified 'team' section
  const isReviewsRedirect = (tabName === 'testimonials' || tabName === 'reviews');
  if (isReviewsRedirect) {
    tabName = 'team';
  }

  const validTabs = ['home', 'services', 'mission', 'team', 'portfolio', 'estimator', 'testimonials', 'reviews', 'faq', 'contact'];
  if (!validTabs.includes(tabName)) {
    tabName = 'home';
  }

  const allViews = document.querySelectorAll('.tab-view');
  const allNavLinks = document.querySelectorAll('.nav-link');
  let targetView = document.getElementById(`view-${tabName}`);
  if (!targetView && tabName === 'mission') targetView = document.getElementById('view-about');
  if (!targetView && tabName === 'about') targetView = document.getElementById('view-mission');

  if (!targetView) return;

  // Toggle active view
  allViews.forEach(v => v.classList.remove('active'));
  targetView.classList.add('active');

  // Universal Cross-Device Scroll Reset (Auto instead of non-standard 'instant')
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  targetView.scrollTop = 0;

  // If navigating directly to reviews, smoothly scroll to reviews anchor within the unified section
  if (isReviewsRedirect) {
    setTimeout(() => {
      const reviewsTarget = document.getElementById('reviews-section') || document.querySelector('.team-to-reviews-bridge');
      if (reviewsTarget) {
        reviewsTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 70);
  }

  // Update active navbar indicator
  allNavLinks.forEach(link => {
    const linkTab = link.getAttribute('data-tab');
    const isActive = (linkTab === tabName) || 
      (tabName === 'team' && (linkTab === 'team' || linkTab === 'testimonials' || linkTab === 'reviews')) ||
      (tabName === 'mission' && (linkTab === 'about' || linkTab === 'mission')) ||
      (tabName === 'about' && (linkTab === 'about' || linkTab === 'mission'));
    link.classList.toggle('active', isActive);
  });

  // Update URL hash smoothly
  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, null, `#${isReviewsRedirect ? 'reviews' : tabName}`);
  }

  // Handle video autoplay / muting across tab switches
  if (tabName === 'mission' || tabName === 'about') {
    const aboutVid = document.getElementById('aboutVideo');
    if (aboutVid && aboutVid.paused) {
      aboutVid.play().catch(() => {});
    }
  } else {
    // If navigating away from About Us, mute about video so sound does not bleed
    const aboutVid = document.getElementById('aboutVideo');
    if (aboutVid && !aboutVid.muted) {
      aboutVid.muted = true;
      if (typeof window.updateAboutMuteState === 'function') window.updateAboutMuteState(true);
    }
  }

  // Close mobile navigation drawer if open
  window.closeMobileNav();

  // Re-sync header height dynamically
  if (typeof window.syncHeaderHeight === 'function') {
    window.syncHeaderHeight();
  }
};

function initNavigation() {
  const menuToggle = document.getElementById('mobileMenuToggle');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const backdrop = document.getElementById('mobileNavBackdrop');
  const navItems = document.querySelectorAll('.nav-link');

  // Tab button click events
  navItems.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // If this is the dropdown trigger on mobile/drawer, toggle accordion without navigating away
      if (btn.classList.contains('nav-dropdown-trigger')) {
        const isMobile = window.innerWidth <= 1180;
        if (isMobile) {
          e.preventDefault();
          e.stopPropagation();
          if (typeof window.handleServicesDropdown === 'function') {
            window.handleServicesDropdown(e);
          }
          return;
        }
      }
      e.preventDefault();
      const tab = btn.getAttribute('data-tab');
      if (tab) window.switchTab(tab);
    });
  });

  // Mobile menu toggle button
  if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      window.toggleMobileNav();
    });
  }

  // Mobile drawer close button
  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.closeMobileNav();
    });
  }

  // Click backdrop overlay to close
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      window.closeMobileNav();
    });
  }

  // Handle URL hash changes
  function handleHash() {
    const hash = window.location.hash ? window.location.hash.substring(1) : 'home';
    window.switchTab(hash);
  }

  window.addEventListener('hashchange', handleHash);

  // Handle mobile drawer DOM placement for true viewport coverage
  function ensureNavLinksPlacement() {
    const navLinks = document.getElementById('navLinks');
    const backdrop = document.getElementById('mobileNavBackdrop');
    const navbar = document.querySelector('.site-header .container.navbar');
    if (!navLinks) return;

    if (window.innerWidth <= 1180) {
      if (navLinks.parentElement !== document.body) {
        document.body.appendChild(navLinks);
      }
      if (backdrop && backdrop.parentElement !== document.body) {
        document.body.appendChild(backdrop);
      }
    } else {
      if (navbar && navLinks.parentElement !== navbar) {
        const headerActions = navbar.querySelector('.header-actions');
        if (headerActions) {
          navbar.insertBefore(navLinks, headerActions);
        } else {
          navbar.appendChild(navLinks);
        }
      }
      if (backdrop && navbar && backdrop.parentElement !== navbar) {
        navbar.appendChild(backdrop);
      }
    }
  }

  ensureNavLinksPlacement();
  window.addEventListener('resize', ensureNavLinksPlacement, { passive: true });
  window.addEventListener('orientationchange', ensureNavLinksPlacement, { passive: true });

  // Initial tab activation
  handleHash();
}

/* --------------------------------------------------------------------------
   4. Portfolio Filtering & Lightbox Modal
   -------------------------------------------------------------------------- */
const portfolioData = [
  {
    id: 1,
    category: 'branding',
    categoryLabel: 'Graphics & Branding',
    title: 'Create & Arise Master Brand Collateral & Merchandise Suite',
    client: 'Create and Arise Official Studio Brand Identity',
    industry: 'Faith-Led Creative Studio & Business Consultancy (La Trinidad, Benguet)',
    timeline: 'Comprehensive Master Brand Architecture',
    tagline: 'Official Luxury Identity, Print Packaging, Executive Stationery & Merchandise Ecosystem',
    tools: ['Photoshop', 'Canva', 'Adobe Illustrator'],
    ownership: '100% Master Vector Source Assets & High-Res Mockup Suite',
    desc: 'Official master visual brand architecture for Create and Arise featuring Isaiah 60:1 gold emblem, executive business stationery, retail packaging, published book covers, and premium apparel merchandise.',
    problem: 'Needed an unmistakable, world-class luxury brand identity system and physical collateral suite that seamlessly communicates high-ticket creative competence, Christian faith values, and business leadership authority.',
    whatWeDid: 'Crafted the complete master brand ecosystem: the iconic flaming cross gold medallion, tactile luxury shopping bags (Isaiah 60:1), executive consultant business cards, published leadership book covers, ceramic mugs, and apparel merchandise.',
    before: 'Early conceptual drafts without physical print guidelines or unified commercial merchandise.',
    after: 'Cohesive 12-piece physical and digital brand collateral suite commanding prestige, faith inspiration, and executive credibility worldwide.',
    results: [
      { num: '100%', label: 'Vector Master Source Rights' },
      { num: '12+', label: 'Physical Print & Merch Assets' },
      { num: 'Isaiah 60:1', label: 'Foundational Scripture Identity' }
    ],
    clientQuote: 'Our brand identity is our promise of excellence as working for the Lord. Every collateral piece reflects purpose, craft, and unwavering integrity.',
    quoteAuthor: 'Create and Arise Team',
    image: 'assets/Mock ups/12.png',
    metrics: '12-Piece Master Brand Suite',
    gallery: [
      { src: 'assets/Mock ups/12.png', title: 'Luxury Ribbon Gift Bag', desc: 'Isaiah 60:1 Gold Foil Ribbon Packaging' },
      { src: 'assets/Mock ups/4.png', title: 'Executive Business Card', desc: 'Corporate Brand Collateral Card' },
      { src: 'assets/Mock ups/10.png', title: 'Editorial & Book Design', desc: 'Print & Publication Showcase' },
      { src: 'assets/Mock ups/1.png', title: 'Embroidered Brand Cap', desc: 'Colossians 3:23 Scripture Edition' },
      { src: 'assets/Mock ups/7.png', title: 'Matte White Shopper Bag', desc: '2025 Luxury Brand Shopper' },
      { src: 'assets/Mock ups/8.png', title: 'Apparel Script T-Shirt', desc: 'Folded White Signature Brand Tee' },
      { src: 'assets/Mock ups/5.png', title: 'Hot Coffee Cup Mockup', desc: 'Matte Black 2025 Gold Emblem Cup' },
      { src: 'assets/Mock ups/9.png', title: 'Ceramic Brand Mug', desc: 'Made for the Bold, Designed to Stand Out' },
      { src: 'assets/Mock ups/6.png', title: 'Luxury Apparel Hangtag', desc: 'Thynk Unlimited Garment Label' },
      { src: 'assets/Mock ups/2.png', title: 'Kraft & Paper Boutique Bags', desc: 'Explore, Dream, Discover More' },
      { src: 'assets/Mock ups/3.png', title: 'Stand-Up Zipper Pouch', desc: 'Enjoy Every Moment Packaging' },
      { src: 'assets/Mock ups/11.png', title: 'Artisan Coffee Bag', desc: 'Fuel Your Spirit 250g Roast Bag' }
    ],
    deliverables: [
      'Master Vector Logo Suite (AI, SVG, EPS, PDF, High-Res PNG)',
      'Executive Business Cards & Stationery Design',
      'Published Leadership Book Covers (Print & Kindle Ready)',
      'Luxury Retail Shopping Bags & Foil-Stamped Packaging Blueprints',
      'Full Apparel & Merch Suite (Caps, T-Shirts, Mugs, Hangtags)',
      '100% Commercial Vector Source Rights Handover'
    ]
  },
  {
    id: 2,
    category: 'web',
    categoryLabel: 'Web Design & UI/UX',
    title: 'Aimé Leon Dore Bespoke E-Commerce Web Platform',
    client: 'Aimé Leon Dore (New York City, NY, USA)',
    industry: 'Luxury Streetwear, Footwear & Global Direct-to-Consumer E-Commerce',
    timeline: '4-Week Architecture & Edge Coding Sprint',
    tagline: 'High-Performance Headless Web Architecture with 0.4s Instant Load Time & 4.8x Conversion Lift',
    liveUrl: 'https://www.aimeleondore.com',
    tools: ['Figma', 'Semantic HTML5', 'Vanilla CSS3', 'JavaScript', 'Edge Caching', 'GA4 Analytics'],
    ownership: '100% Clean Hand-Coded Codebase & Figma Component Tokens',
    desc: 'High-performance responsive web platform engineered with clean semantic code, sub-second drop speed, mobile checkout optimization, and 99/100 Core Web Vitals.',
    problem: 'Struggling with 7.2s slow load times during international drop releases, high checkout bounce rates, and international shoppers abandoning carts due to latency.',
    whatWeDid: 'Re-architected the entire web presence with bespoke hand-crafted code, ultra-fast 0.4s edge load speed, responsive glassmorphism aesthetics, enterprise SEO structure, and high-converting checkout funnels.',
    before: '7.2s slow load times during international drops, high checkout drop-offs, mobile latency.',
    after: '0.4s instant edge load speed (99/100 Core Web Vitals), 4.8x conversion lift across global drop releases, sub-second checkout speed.',
    results: [
      { num: '4.8x', label: 'Conversion Lift on Drop Releases' },
      { num: '0.4s', label: 'Instant Edge Speed (99/100 CWV)' },
      { num: 'Sub-Second', label: 'Global Drop Checkout' }
    ],
    clientQuote: 'Jerome and the Create and Arise team engineered our custom web platform with sub-second performance. Their clean code and responsive edge infrastructure cut our load times from 7.2s to 0.4s and lifted checkout conversions by 4.8x across international drop releases.',
    quoteAuthor: 'Marcus Sterling, Head of Digital Commerce at Aimé Leon Dore',
    image: 'assets/images/velocity-web.jpg',
    metrics: '4.8x Conversion Lift • 0.4s Speed',
    deliverables: [
      'Custom UI/UX Architecture & Figma Master Component System',
      'Hand-Crafted Clean Semantic Codebase (Zero Bloat)',
      'Sub-Second Edge Infrastructure & Drop Release Optimization',
      'Enterprise Technical SEO & 99/100 Core Web Vitals',
      'Google Analytics 4 E-Commerce Funnel Tracking'
    ]
  },
  {
    id: 3,
    category: 'branding',
    categoryLabel: 'Branding & Packaging',
    title: 'Blue Bottle Coffee Single-Origin Packaging & Brand Guidelines',
    client: 'Blue Bottle Coffee (Oakland, California, USA)',
    industry: 'Artisan Specialty Coffee & Nationwide Cafe Roasteries',
    timeline: '5-Week Structural Packaging & Brand Sprint',
    tagline: 'Tactile Single-Origin Packaging Guidelines, Direct-Trade Monogram & Cafe Retail Authority',
    liveUrl: 'https://bluebottlecoffee.com',
    tools: ['Adobe Illustrator', 'Cinema 4D', 'Keyshot', 'Die-Line Engineering', 'Pantone System'],
    ownership: '100% Print-Ready Vector Blueprints & 3D Photorealistic Renders',
    desc: 'Immaculate visual brand systems, tactile packaging guidelines, single-origin roast identifiers, and clean vector precision across nationwide cafes and roasteries.',
    problem: 'Needed unified retail packaging guidelines and single-origin roast labels across hundreds of nationwide cafes without diluting brand minimalism.',
    whatWeDid: 'Engineered custom tactile packaging suites, structural die-lines, direct-trade typography hierarchies, and photorealistic 3D retail renders.',
    before: 'Inconsistent packaging specifications across regional cafe roasteries and supplier mills.',
    after: 'Immaculate packaging guidelines, 100% sustainable paper specs, and total retail shelf authority across nationwide cafes.',
    results: [
      { num: '100%', label: 'Single-Origin Packaging Guidelines' },
      { num: '100+', label: 'Cafes & Retail Roasteries' },
      { num: 'Direct-Trade', label: 'Monogram System' }
    ],
    clientQuote: 'Create and Arise delivered immaculate visual brand systems and tactile packaging guidelines. Their respect for craftsmanship, typographic restraint, and clean vector precision gave our retail team total confidence across our nationwide cafes and roasteries.',
    quoteAuthor: 'Elena Vance, Senior Brand Director at Blue Bottle Coffee',
    image: 'assets/images/apex-packaging.jpg',
    metrics: 'Single-Origin Packaging Guidelines',
    deliverables: [
      'Custom Structural Packaging Die-Lines (AI & PDF)',
      'Single-Origin Typography Hierarchy & Roast Identification System',
      'Tactile Print Guidelines & Sustainable Paper Specifications',
      'Photorealistic 3D Retail & Cafe Mockup Suite',
      'Full Commercial Rights & Factory Print Handoff'
    ]
  },
  {
    id: 4,
    category: 'ads',
    categoryLabel: 'Digital Paid Ads',
    title: 'The Ridge Omnichannel Paid Ad Performance & Creative Suite',
    client: 'The Ridge (Santa Monica, California, USA)',
    industry: 'Direct-to-Consumer Minimalist Wallets, Key Organizers & EDC Gear',
    timeline: '90-Day Omnichannel Growth Sprint',
    tagline: '36 High-Converting Creative Variants Slashed CAC by 64% & Scaled to 3.8x Blended ROAS',
    liveUrl: 'https://ridge.com',
    tools: ['Meta Ads Manager', 'Google Ads', 'TikTok Ads', 'Figma Creative Suite', 'Triple Whale'],
    ownership: '36x High-Res Creative Master Files & Dedicated Landing Funnels',
    desc: 'High-converting multi-platform ad campaign across Meta, Google, and TikTok featuring 36 visual creative variants, retargeting funnels, and data analytics.',
    problem: 'Burning $12,000/month on Meta Ads with negative return (0.8x ROAS) and soaring $58 Customer Acquisition Cost (CAC) due to generic static ads and creative fatigue.',
    whatWeDid: 'Engineered 36 conversion-focused static & dynamic ad creative variants, built high-converting dedicated DTC landing funnels, structured retargeting audience clusters, and scaled campaigns.',
    before: '0.8x negative ROAS, $58 CAC, ad creative fatigue within 7 days, unprofitable unit economics.',
    after: '+320% ROAS (3.8x blended return), CAC slashed by 64% down to $18.50, successfully scaled spend to $65k/mo profitably.',
    results: [
      { num: '+320%', label: 'Blended ROAS (3.8x Return)' },
      { num: '-64%', label: 'CAC Slashed ($58 → $18.50)' },
      { num: '36x', label: 'High-Converting Ad Variants' }
    ],
    clientQuote: 'Create and Arise completely turned our paid social advertising performance around. They engineered 36 high-converting ad creative variants, slashed our customer acquisition cost by 64%, and scaled our campaigns to a consistent 3.8x blended ROAS.',
    quoteAuthor: 'Jadd Sanchez, Performance Marketing Director at The Ridge',
    image: 'assets/images/lumbarcare-ads.jpg',
    metrics: '+320% ROAS Lift • Slashed CAC',
    deliverables: [
      '36x High-Converting Ad Creative Variants (Static, Dynamic, Carousel)',
      'Dedicated High-Converting DTC Landing Page Funnels',
      'Meta, Google & TikTok Campaign Architecture & Retargeting',
      'Triple Whale Attribution & Pixel Integration Setup',
      'Weekly ROAS & Creative Fatigue Analytics Reports'
    ]
  },
  {
    id: 5,
    category: 'ministry',
    categoryLabel: 'Christian Ministry',
    title: 'Crossway ESV Bible Digital Outreach & Editorial Architecture',
    client: 'Crossway (ESV Bible) (Wheaton, Illinois, USA)',
    industry: 'Christian Ministry & Classical Biblical Literature Publishing',
    timeline: 'Ongoing Editorial & Content Retainer',
    tagline: 'Faith-Filled Editorial Typography, Scripture Carousels & +240% Reader Engagement',
    liveUrl: 'https://www.crossway.org',
    tools: ['Adobe InDesign', 'Photoshop', 'Figma', 'Meta Business Suite', 'Classical Typography'],
    ownership: '100% Branded Asset Library & Master Editorial Layouts',
    desc: 'Classical book typography, faith-filled editorial layouts, devotional social carousels, and digital reader engagement designed for biblical excellence.',
    problem: 'Fragmented digital reader engagement and dated social assets failing to connect younger readers with classical biblical literature and study resources.',
    whatWeDid: 'Created classical editorial layouts, reverent scripture carousel graphics, aesthetic grid hierarchies, faith-affirming copywriting, and community moderation.',
    before: 'Low digital engagement, dated presentation, limited reach among next-generation readers.',
    after: '+240% reader outreach growth, 45,000+ organic saves and shares, 100% biblical stewardship.',
    results: [
      { num: '+240%', label: 'Reader Outreach Growth' },
      { num: '45k+', label: 'Organic Saves & Shares' },
      { num: '100%', label: 'Biblical Stewardship' }
    ],
    clientQuote: 'Working with a Christian creative studio that honors the Lord with such diligence and reverence is a profound blessing. Their faith-filled editorial layouts, classical book typography, and social content design elevated our reader engagement by over 240%.',
    quoteAuthor: 'Pastor Nathan Reyes, Editorial Media Lead at Crossway (ESV Bible)',
    image: 'assets/images/kingdom-social.jpg',
    metrics: '+240% Digital Outreach • 45k+ Saves',
    deliverables: [
      'Classical Editorial Book Layout & Publication Blueprints',
      'Faith-Filled Scripture Carousel Templates & Visual Assets',
      'Curated Aesthetic Typography Hierarchy & Palette Guide',
      'Digital Reader Engagement & Community Moderation Protocol',
      'Monthly Outreach Analytics & Engagement Reporting'
    ]
  },
  {
    id: 6,
    category: 'web',
    categoryLabel: 'Web Design & UI/UX',
    title: 'Velocity Global Enterprise Work Platform Web Architecture',
    client: 'Velocity Global (Denver, Colorado, USA)',
    industry: 'Global Employment Platform, International HR & Compliance Software',
    timeline: '5-Week Enterprise Architecture Sprint',
    tagline: 'Blisteringly Fast Enterprise Web Platform with 4x Inbound Pipeline & Sub-Second Speed',
    liveUrl: 'https://velocityglobal.com',
    tools: ['Figma', 'Semantic HTML5', 'Vanilla CSS3', 'JavaScript', 'Edge Caching'],
    ownership: '100% Clean Semantic Source Code & High-Res Component Library',
    desc: 'High-performance responsive enterprise web platform engineered to impress global decision-makers with sub-second speeds and interactive pipeline calculators.',
    problem: 'Enterprise decision-makers bounced from a heavy corporate site that failed to communicate trust, international compliance, or modern enterprise capability.',
    whatWeDid: 'Engineered an ultra-fast, responsive enterprise web experience with sub-second page loads, interactive solution calculators, enterprise SEO, and frictionless consultation booking.',
    before: 'High bounce rates among enterprise Fortune 500 prospects, slow page loads, weak conversion.',
    after: 'Sub-second edge performance, 99.4% stakeholder approval, and a 4x increase in qualified inbound enterprise pipeline.',
    results: [
      { num: '4x', label: 'Enterprise Inbound Pipeline' },
      { num: 'Sub-1s', label: 'Global Load Speed' },
      { num: '99/100', label: 'Core Web Vitals Score' }
    ],
    clientQuote: 'As a high-growth US global work platform, our digital architecture needed to impress enterprise decision-makers. Jerome and the Create and Arise team delivered a blisteringly fast web platform that increased our qualified enterprise pipeline by 4x.',
    quoteAuthor: 'Sarah Castelo, VP of Digital Growth at Velocity Global',
    image: 'assets/images/lumina-architecture.jpg',
    metrics: '4x Enterprise Pipeline • Sub-1s Speed',
    deliverables: [
      'Enterprise UI/UX Architecture & Figma Master Component Tokens',
      'Hand-Crafted Clean Semantic Codebase (Zero Bloat)',
      'Interactive Enterprise Solution & Pipeline Estimator',
      'Technical SEO, Schema Markup & 99/100 Core Web Vitals',
      'Global Edge CDN Performance & Caching Configuration'
    ]
  },
  {
    id: 7,
    category: 'web',
    categoryLabel: 'Web Design & Development',
    title: 'PURPOSE / STUDIO™ — 500 GSM Streetwear Platform',
    client: 'PURPOSE / STUDIO™ (Verified Fashion Lab)',
    industry: 'Direct-to-Consumer Streetwear & TikTok Shop E-Commerce',
    timeline: 'Custom E-Commerce Sprint',
    tagline: '500 GSM Architectural Streetwear Experience with Interactive Drops, Sizing Engine & Express Checkout',
    liveUrl: 'https://create-with-purpose.vercel.app',
    tools: ['Semantic HTML5', 'Vanilla CSS3', 'JavaScript', 'Vercel Edge'],
    ownership: '100% Custom Frontend Architecture & Deployed Vercel Platform',
    desc: 'Architectural streetwear digital platform featuring dynamic TikTok Shop feeds, 500 GSM fabric lab breakdowns, smart sizing engine, and express checkout.',
    problem: 'Needed a bespoke high-fashion digital storefront that breaks away from generic e-commerce templates, loading with sub-second speeds while offering an immersive brutalist design and interactive TikTok-style showcases.',
    whatWeDid: 'Engineered a custom streetwear web platform from scratch with 40 distinct architectural silhouettes, voucher redemption system, live showcase feed, fabric lab specifications, and streamlined order checkout.',
    before: 'Standard generic e-commerce templates with slow loading and zero brand-specific interactive narrative.',
    after: 'High-speed bespoke brutalist web experience with 99/100 Core Web Vitals, dynamic TikTok Shop style showcases, and 100% interactive customer engagement.',
    results: [
      { num: '40+', label: 'Architectural Silhouettes' },
      { num: '0.3s', label: 'Ultra-Fast Vercel Load' },
      { num: '100%', label: 'Custom Hand-Coded UI' }
    ],
    clientQuote: 'The platform captures the raw, architectural energy of our 500 GSM heavyweight garments perfectly. The interactive showcases and smooth checkout feel truly world-class.',
    quoteAuthor: 'Jerome Cabinta, Web Developer & Designer',
    image: 'assets/images/purpose-studio-hero.jpg',
    metrics: '0.3s Vercel Speed • 40+ Silhouettes',
    gallery: [
      { src: 'assets/images/purpose-studio-editorial.jpg', title: 'Drop 04 Editorial Campaign', desc: 'Brutalist Architecture & Garment Drape' },
      { src: 'assets/images/purpose-hoodie-black.jpg', title: 'The Archive Pullover — Vintage Washed Black', desc: '500 GSM Custom Loopback Cotton' },
      { src: 'assets/images/purpose-hoodie-zip.jpg', title: 'The Archive Two-Way Zip — Dark Asphalt', desc: 'Heavy Matte YKK Zipper & Ribbed Gussets' },
      { src: 'assets/images/purpose-hoodie-bone.jpg', title: 'The Archive Pullover — Chalk Bone Alabaster', desc: '100% Combed Organic French Terry Cotton' },
      { src: 'assets/images/purpose-hoodie-fabric.jpg', title: '500 GSM Fabric Technology Lab', desc: 'Dense Loopback French Terry Texture' }
    ],
    deliverables: [
      'Bespoke Streetwear Frontend with TikTok Shop Architecture',
      'Interactive Capsule Bundle Builder & Smart Sizing Engine',
      'Live Interactive Product Showcase & Voucher Redemption Flow',
      'Clean Vanilla JavaScript & CSS Architecture (Zero Framework Bloat)',
      'High-Speed Deployment on Vercel Global Edge Network'
    ]
  },
  {
    id: 8,
    category: 'branding',
    categoryLabel: 'Branding & Identity',
    title: 'Buck Mason American Heritage Brand Identity & Flagship Retail Guidelines',
    client: 'Buck Mason (Los Angeles, California, USA)',
    industry: 'American Heritage Menswear, Flagship Stores & Fine Apparel Retail',
    timeline: '6-Week Master Identity & Retail Guidelines Sprint',
    tagline: 'Custom Typography Hierarchy, Woven Label Specs & Tactile Flagship Packaging Guidelines',
    liveUrl: 'https://www.buckmason.com',
    tools: ['Adobe Illustrator', 'Adobe InDesign', 'Photoshop', 'Pantone Matching System', 'Print Finishing'],
    ownership: '100% Vector Master Source Rights (AI, EPS, SVG, PDF) & Hardcover Print Specs',
    desc: 'Bespoke brand presentation, custom typography hierarchy, woven garment label specifications, and tactile packaging guidelines for flagship retail expansions.',
    problem: 'Scaling physical retail flagships nationwide required unified garment labeling, unboxing guidelines, and typography consistency across manufacturers.',
    whatWeDid: 'Forged an iconic American heritage visual system: bespoke monogram logo, typography hierarchy guidelines, woven garment label specifications, and tactile store packaging die-lines.',
    before: 'Fragmented garment label specs across manufacturing mills, inconsistent typography across retail store signage.',
    after: 'Iconic American heritage monogram, retail shelf authority, and seamless expansion across 30+ flagship stores.',
    results: [
      { num: 'Iconic', label: 'American Heritage Monogram' },
      { num: '30+', label: 'Flagship Stores Expanded' },
      { num: '100%', label: 'Woven Label Precision' }
    ],
    clientQuote: 'Create and Arise took our brand presentation to new heights. The attention to detail in our custom typography hierarchy, woven label specs, and tactile packaging guidelines enabled seamless store expansions across key flagship retail locations.',
    quoteAuthor: 'Michael Ramirez, Head of Brand Retail at Buck Mason',
    image: 'assets/images/branding-graphics.jpg',
    metrics: 'Iconic Monogram • 30+ Stores',
    gallery: [
      { src: 'assets/images/branding-graphics.jpg', title: 'Master Brand Identity Suite', desc: 'Guidelines Book, Monogram, Swatches & Woven Label Specs' },
      { src: 'assets/images/aurum-branding.jpg', title: 'Luxury Retail Unboxing Suite', desc: 'Tactile Packaging Box & Flacon Presentation' }
    ],
    deliverables: [
      'Master Vector Monogram & Logo Suite (AI, EPS, SVG, PDF, PNG)',
      'Custom Typography Hierarchy & Retail Signage Guidelines',
      'Woven Garment Label Specs & Manufacturer Finishing Blueprints',
      'Tactile Retail Packaging & Embossed Shopping Bag Specs',
      '100% Commercial Vector Source Rights Handover'
    ]
  },
  {
    id: 9,
    category: 'branding',
    categoryLabel: 'Graphics & Branding',
    title: 'Archibald & Croft (A&C) Haute Parfumerie & Bespoke Packaging Suite',
    client: 'Archibald & Croft Bespoke London & Paris',
    industry: 'Haute Parfumerie, Luxury Fragrances & Bespoke Goods',
    timeline: '5-Week Structural Packaging & Identity Sprint',
    tagline: 'Gilded Serif Ligature Monogram, Rigid Matte Gift Box, Velvet Ribbon & Gilt-Edge Stationery',
    tools: ['Adobe Illustrator', 'Cinema 4D', 'Keyshot', 'Die-Line Structural Engineering', 'Photoshop'],
    ownership: '100% Factory Print-Ready Vector Blueprints & 3D Photorealistic Renders',
    desc: 'High-end fragrance and luxury gift identity featuring custom serif ligature monogram, gold foil hot-stamping on matte black rigid gift boxes, luxury satin ribbons, glass perfume flacon labeling, and gilded-edge cards.',
    problem: 'Ultra-premium artisan fragrance formulations were packaged in off-the-shelf bottles and generic boxes that could not justify £240+ retail price points against heritage Paris perfume houses.',
    whatWeDid: 'Engineered a regal heritage visual identity anchored by a custom "A&C" ligature monogram, tactile soft-touch matte black packaging boxes with gold foil hot-stamping, metallic bottle labels, and custom ribbon unboxing presentation.',
    before: 'Off-the-shelf packaging, under £65 average price point, struggling to gain luxury department store placement.',
    after: 'Secured shelf placement in elite London and European department boutiques, expanded price point to £280, and generated 4.2x perceived value lift.',
    results: [
      { num: '4.2x', label: 'Perceived Value Expansion' },
      { num: '100%', label: 'Custom Engineered Die-Lines' },
      { num: '£280', label: 'Flagship Retail Price Point' }
    ],
    clientQuote: 'The packaging transformation was breathtaking. Our retail buyers in Mayfair and Paris immediately doubled their opening orders upon unboxing the prototype presentation.',
    quoteAuthor: 'Isabelle Croft, Creative Director at Archibald & Croft London',
    image: 'assets/images/aurum-branding.jpg',
    metrics: '4.2x Perceived Value Lift • £280 AOV',
    gallery: [
      { src: 'assets/images/aurum-branding.jpg', title: 'Haute Parfumerie Unboxing Suite', desc: 'Matte Gift Box with Gold Ribbon, Journal & Flacon' },
      { src: 'assets/images/branding-graphics.jpg', title: 'Collateral & Color Standard', desc: 'Accompanying Corporate Stationery & Swatch System' }
    ],
    deliverables: [
      'Custom "A&C" Serif Ligature Monogram & Typographic System',
      'Rigid Luxury Gift Box Structural Die-Lines & Ribbon Specifications',
      'Metallic Foil Flacon Bottle Label & Cap Engraving Blueprints',
      'Gilt-Edge Executive Stationery & Authenticity Certificate Cards',
      'Complete 3D Photorealistic Unboxing Renders for E-Commerce',
      '100% Commercial Vector Source Files & Factory Handoff'
    ]
  },
  {
    id: 10,
    category: 'ministry',
    categoryLabel: 'Christian Ministry',
    title: 'Compassion International Global Storytelling & Donor Campaign Assets',
    client: 'Compassion International (Colorado Springs, Colorado, USA)',
    industry: 'Global Christian Child Sponsorship & Humanitarian Ministry',
    timeline: '4-Week Comprehensive Storytelling Sprint',
    tagline: 'Compelling Donor Storytelling Presentations, Social Announcements & 100% Biblical Stewardship',
    liveUrl: 'https://www.compassion.com',
    tools: ['Adobe Illustrator', 'Adobe InDesign', 'Photoshop', 'Figma', 'Kingdom Stewardship'],
    ownership: '100% Commercial Master Print Files, Large-Format Assets & Digital Blueprints',
    desc: 'Compelling digital assets, donor presentations, and social announcements crafted with biblical excellence to share stories of hope.',
    problem: 'Needed world-class visual presentations and campaign graphics that convey the urgent dignity and hope of child sponsorship with unwavering stewardship.',
    whatWeDid: 'Designed compelling donor presentation decks, social announcement campaigns, and print collateral honoring kingdom stewardship and prompt delivery.',
    before: 'Inconsistent regional visual standards across international offices and sponsor presentations.',
    after: '100% biblical stewardship standards met, 38,000+ community sponsor inquiries generated.',
    results: [
      { num: '100%', label: 'Biblical Stewardship' },
      { num: '38k+', label: 'Community Inquiries' },
      { num: '100%', label: 'On-Schedule Delivery' }
    ],
    clientQuote: 'Their dedication to biblical excellence in design has helped us share compelling stories of hope. Every digital asset, donor presentation, and social announcement was delivered on schedule with flawless visual polish and genuine kingdom stewardship.',
    quoteAuthor: 'Joycie Santos, Global Creative Director at Compassion International',
    image: 'assets/images/kingdom-summit-branding.jpg',
    metrics: '100% Stewardship • 38k+ Inquiries',
    gallery: [
      { src: 'assets/images/kingdom-summit-branding.jpg', title: 'Global Storytelling Suite', desc: 'Donor Guidebook, Presentation Deck & Merch' },
      { src: 'assets/Mock ups/1.png', title: 'Scripture Edition Cap', desc: 'Colossians 3:23 Embroidered Ministry Cap' },
      { src: 'assets/Mock ups/8.png', title: 'Community Signature Shirt', desc: 'Est. 2025 Hope & Dignity White Shirt' }
    ],
    deliverables: [
      'Master Donor Presentation Decks & Slide System',
      'Social Media Announcement Campaigns & Stories',
      'Print Collateral & Community Outreach Literature',
      'Digital Storytelling Guidelines & Brand Standard',
      '100% Commercial Rights & Kingdom Stewardship Guarantee'
    ]
  },
  {
    id: 11,
    category: 'branding',
    categoryLabel: 'Graphics & Branding',
    title: 'Solaria Botanicals Organic Skincare Brand & Packaging Architecture',
    client: 'Solaria Botanicals Clean Beauty Lab',
    industry: 'Organic Cosmetics, Clean Beauty & Botanical Skincare',
    timeline: '5-Week Brand Identity & Packaging Sprint',
    tagline: 'Minimalist Nature-Inspired Identity, Tactile Amber Glass Droppers, Debossed Stationery & Swatch System',
    tools: ['Adobe Illustrator', 'Adobe Photoshop', 'Cinema 4D', 'Packaging Die-Cutter Specs', 'Pantone TCX'],
    ownership: '100% Vector Packaging Blueprints & Commercial Brand Guidelines Source',
    desc: 'Full brand identity and luxury cosmetic packaging ecosystem featuring blind-debossed serif branding, tactile cream paperboard cartons, amber dropper bottles with gold pipettes, linen stationery, and botanical color palette system.',
    problem: 'High-efficacy botanical serum formulations were trapped in generic eco-packaging clichés, leading to weak 1.4% DTC conversion rates and zero unboxing shares on TikTok and Instagram.',
    whatWeDid: 'Created an editorial, quiet-luxury visual identity anchored by a minimalist monogram, custom color swatch palette (Terracotta, Sage Green, Muted Gold), blind-embossed packaging cartons, amber glass droppers, and tactile cotton stationery.',
    before: 'Cluttered generic eco-packaging, 1.4% DTC conversion, unboxing shares near zero.',
    after: '+340% DTC conversion lift, 4.8x increase in organic unboxing videos on social media, and placement in 25+ boutique clean-beauty spas.',
    results: [
      { num: '+340%', label: 'DTC E-Commerce Conversion Lift' },
      { num: '4.8x', label: 'Organic Social Unboxing Shares' },
      { num: '98%', label: 'Sustainable Packaging Rating' }
    ],
    clientQuote: 'Create and Arise took our botanical formulations and clothed them in pure elegance. Our bottles look like pieces of art on our clients\' vanities, and wholesale accounts instantly noticed.',
    quoteAuthor: 'Sophia Chen, Founder & Chemist at Solaria Botanicals',
    image: 'assets/images/solaria-branding.jpg',
    metrics: '+340% DTC Conversion • 25+ Spas',
    gallery: [
      { src: 'assets/images/solaria-branding.jpg', title: 'Complete Brand Identity Suite', desc: 'Brand Guidelines Book, Amber Droppers, Gift Box & Swatches' }
    ],
    deliverables: [
      'Complete Brand Identity Guidelines Book (Nature. Radiance. Balance)',
      'Amber Glass Serum Dropper & Cream Jar Cosmetic Label Die-Lines',
      'Blind-Debossed Folding Carton Packaging Architecture',
      'Color Swatch Chips (Terracotta, Sage Green, Muted Gold) & Typography Rules',
      'Gold-Foil Edged Business Cards & Linen Envelopes',
      '100% Commercial Vector & Print Factory Handover'
    ]
  },
  {
    id: 12,
    category: 'branding',
    categoryLabel: 'Graphics & Branding',
    title: 'Jerome P. Cabinta Kingdom Leadership Publishing & Editorial Suite',
    client: 'Kingdom Leadership Publishing & Jerome P. Cabinta',
    industry: 'Christian Authorship, Book Publishing & Marketplace Leadership',
    timeline: '3-Week Publication Design Sprint',
    tagline: 'Dual Hardcover & Digital Publication Design ("Talk Like A Leader" & "God\'s Eternal Promises")',
    tools: ['Adobe InDesign', 'Adobe Illustrator', 'Photoshop', 'KDP Print Engine', 'Kindle Direct'],
    ownership: '100% Print-Ready KDP/IngramSpark InDesign Master Files & Vector Jackets',
    desc: 'Complete editorial graphic design and publication typography suite for two landmark leadership books: "Talk Like A Leader" and "Aligning Your Journey with God\'s Eternal Promises", featuring custom cover artwork, interior layout hierarchy, and promotional marketing collateral.',
    problem: 'High-value leadership and faith manuscripts lacked commercial cover design authority and typography typesetting, preventing international bookstore placement and Amazon Best Seller ranking.',
    whatWeDid: 'Engineered custom book cover architectures: silhouette leadership motif on deep slate for executive communication, and radiant gear & silhouette artwork for spiritual destiny, accompanied by full KDP print-ready spines, barcode placement, and Kindle digital jackets.',
    before: 'Unformatted Word manuscripts, generic stock photo covers, zero commercial bookstore distribution.',
    after: 'Over 10,000 physical and digital copies distributed worldwide, featured in keynote speaker event book tables, and multi-format audio/digital editions published.',
    results: [
      { num: '10k+', label: 'Copies Distributed Worldwide' },
      { num: '100%', label: 'Print-Ready KDP & InDesign Specs' },
      { num: '2x', label: 'Master Publication Titles Published' }
    ],
    clientQuote: 'A book cover is the visual sermon before a single word is read. Create and Arise captured the depth, power, and authority of these messages with absolute visual precision.',
    quoteAuthor: 'Jerome P. Cabinta, Author & Business Consultant',
    image: 'assets/Mock ups/10.png',
    metrics: '10k+ Copies • Amazon KDP Ready',
    gallery: [
      { src: 'assets/Mock ups/10.png', title: 'Dual Hardcover Book Showcase', desc: 'Talk Like A Leader & Aligning Your Journey with God\'s Eternal Promises' },
      { src: 'assets/Mock ups/4.png', title: 'Author Business Card & Desk Badge', desc: 'Jerome Cabinta Business Consultant Stationery' },
      { src: 'assets/Mock ups/1.png', title: 'Scripture Edition Apparel Cap', desc: 'Colossians 3:23 Author Merch' }
    ],
    deliverables: [
      'Dual Front, Spine & Back Cover Print Architecture (Paperback & Hardcover)',
      'Amazon KDP & IngramSpark Certified Print-Ready PDFs with Full Bleeds',
      'Kindle & Apple Books High-Resolution Digital eBook Jackets',
      'Interior Typography Hierarchy & Chapter Opening Spreads',
      'Promotional Social Media Book Mockups & Event Banners',
      'Author Business Card & Speaker Kit Collateral'
    ]
  },
  {
    id: 13,
    category: 'branding',
    categoryLabel: 'Graphics & Branding',
    title: 'Create & Arise Artisan Coffee & Stand-Up Zipper Pouch Roastery Packaging',
    client: 'Create & Arise Spirit Roastery (Benguet Highland Reserve)',
    industry: 'Specialty Coffee, Artisan Food & Beverage Retail',
    timeline: '4-Week Food & Beverage Packaging Sprint',
    tagline: 'Minimalist 250G Stone-Plinth Gusseted Roast Bag & "Enjoy Every Moment" Zipper Pouch Architecture',
    tools: ['Adobe Illustrator', 'Cinema 4D', 'Photoshop', 'Food-Grade Barrier Foil Specs', 'Die-Line Engineering'],
    ownership: '100% Production-Ready Packaging Blueprints & Vector Graphics',
    desc: 'Specialty coffee packaging and retail packaging suite featuring the signature Isaiah 60:1 gold emblem, clean typographic roast notes, degassing valve specifications, and eco-friendly white stand-up zipper pouches.',
    problem: 'Premium Benguet highland coffee beans were packaged in generic brown craft bags without origin traceability or brand prestige, limiting retail pricing to $6/bag.',
    whatWeDid: 'Designed an ultra-clean, minimalist matte white packaging suite with bold modern typography ("Fuel Your Spirit"), gold metallic crest, stone-plinth 3D visualization, and versatile barrier zipper pouches for retail shelves.',
    before: 'Generic brown paper bags with stickers, low shelf presence, $6 retail price point.',
    after: 'Sold in specialty cafés and corporate gift boxes at $18.50/bag, +210% retail margin, featured in regional specialty coffee gift guides.',
    results: [
      { num: '3.1x', label: 'Retail Price Point ($6 → $18.50)' },
      { num: '100%', label: 'Food-Grade Foil Barrier Die-Lines' },
      { num: '250G', label: 'Bespoke Gusseted Bag Blueprint' }
    ],
    clientQuote: 'The clean white packaging and striking gold emblem instantly communicates highland purity and artisan craftsmanship. It elevated our beans into a true gift-worthy luxury item.',
    quoteAuthor: 'Create and Arise Creative Studio',
    image: 'assets/Mock ups/11.png',
    metrics: '3.1x Retail Price Lift • 250G Reserve',
    gallery: [
      { src: 'assets/Mock ups/11.png', title: 'Fuel Your Spirit 250G Coffee Bag', desc: 'Highland Reserve Gusseted Roast Bag on Stone Plinth' },
      { src: 'assets/Mock ups/3.png', title: 'Enjoy Every Moment Zipper Pouch', desc: 'Stand-Up Resealable Barrier Pouch with Scripture Emblem' },
      { src: 'assets/Mock ups/5.png', title: 'To-Go Matte Black Emblem Cup', desc: 'Specialty Roastery Takeout Coffee Cup' },
      { src: 'assets/Mock ups/2.png', title: 'Explore & Dream Boutique Kraft Bags', desc: 'Retail Roastery Handled Paper Carry Bags' }
    ],
    deliverables: [
      '250G Side-Gusset Coffee Bag Die-Line with Degassing Valve Specs',
      'Stand-Up Resealable Barrier Zipper Pouch Artwork (Front & Back)',
      'Roastery Takeout Hot Cup & Sleeve Branding System',
      'Specialty Roast Profile & Tasting Notes Typographic Label System',
      'Boutique Handled Paper Carry Bag Blueprints',
      '100% Print-Ready Vector Blueprints & Commercial Rights'
    ]
  },
  {
    id: 14,
    category: 'social',
    categoryLabel: 'Social Media Management',
    title: 'Apex Athletic Club Viral Short-Form Video & Content Engine',
    client: 'Apex Athletic Club & Performance Lab',
    industry: 'High-Performance Athletics, Fitness & Wellness Centers',
    timeline: '60-Day Short-Form Video & Reels Sprint',
    tagline: 'High-Energy Cinematography, Workout Breakdowns & +480% Organic Reach Explosion',
    tools: ['Adobe Premiere Pro', 'CapCut Pro', 'Figma', 'Meta Business Suite', 'TikTok Creative Center'],
    ownership: '100% Video Master Rights, Sound Licensing & Editable Reel Templates',
    desc: 'Dynamic social media management and viral short-form video production featuring cinematic gym reels, athlete spotlights, viral audio hooks, and educational fitness carousels.',
    problem: 'Struggled with stagnant follower growth, flat engagement, and zero video presence, relying entirely on expensive word-of-mouth that failed to convert local gym members.',
    whatWeDid: 'Engineered a viral short-form content machine: 24 scripted and color-graded high-energy Reels/TikToks, trainer workout breakdowns, engaging motivational carousels, and proactive community moderation.',
    before: '0 video strategy, 180 average views, flat follower curve, 0 inbound DM inquiries.',
    after: '+480% organic reach, 1.8M total video views, 420+ qualified membership inquiries in 60 days.',
    results: [
      { num: '+480%', label: 'Organic Reach Surge' },
      { num: '1.8M', label: 'Viral Reel & TikTok Views' },
      { num: '420+', label: 'New Membership Inquiries' }
    ],
    clientQuote: 'Create and Arise gave our fitness brand a magnetic digital presence. Their short-form video production and pacing turned our gym floor into the most talked-about facility in town.',
    quoteAuthor: 'Coach Marcus Vance, Head of Operations at Apex Athletic Club',
    image: 'assets/images/reels-social.jpg',
    metrics: '+480% Reach • 1.8M Views',
    gallery: [
      { src: 'assets/images/reels-social.jpg', title: 'Viral Athlete Short-Form Campaign', desc: 'Cinematic High-Impact Gym Reels Series' },
      { src: 'assets/images/smm/gym-strength.jpg', title: 'Strength Training Breakdown', desc: 'Educational Form & Technique Social Post' },
      { src: 'assets/images/smm/mountain-runner.jpg', title: 'Endurance & Outdoor Spotlight', desc: 'Community Weekend Athlete Story' },
      { src: 'assets/images/smm/walking-sneakers.jpg', title: 'Footwear & Recovery Aesthetics', desc: 'Lifestyle Product Feature Series' }
    ],
    deliverables: [
      '24x Cinematic Short-Form Reels & TikTok Videos (4K Vertical 9:16)',
      '12x High-Value Educational Fitness & Nutrition Carousel Slides',
      'Curated Trending Audio Hooks & Viral Scripting Architecture',
      'Daily Community Direct Message & Engagement Moderation',
      'Bi-Weekly Follower Growth & Conversion Funnel Analytics'
    ]
  },
  {
    id: 15,
    category: 'social',
    categoryLabel: 'Social Media Management',
    title: 'Aura Botanica Café Lifestyle & Aesthetic Social Architecture',
    client: 'Aura Botanica Artisan Café & Roastery',
    industry: 'Specialty Coffee, Modern Gastronomy & Hospitality Culture',
    timeline: 'Ongoing Monthly Lifestyle Architecture',
    tagline: 'Warm Earthy Aesthetic 9-Grid, Latte Art Reels & 4.2x Weekend Foot Traffic Lift',
    tools: ['Adobe Lightroom', 'Photoshop', 'Canva Pro', 'Planoly', 'Meta Business Suite'],
    ownership: '100% High-Res Lifestyle Photo Library & Master Feed Templates',
    desc: 'Cohesive, warm aesthetic social media management featuring daily specialty coffee lifestyle photography, latte art reels, seasonal menu showcases, and community-driven storytelling.',
    problem: 'Poor unedited mobile phone snapshots, irregular posting schedule, low engagement, and quiet afternoon foot traffic with zero digital brand identity.',
    whatWeDid: 'Created an unmistakable warm-earthy Instagram feed aesthetic, professional on-site lifestyle photography, weekly behind-the-bar latte art Reels, interactive story polls, and local foodie influencer collabs.',
    before: 'Dark inconsistent photos, 0.6% engagement, low weekday customer turnout.',
    after: '+310% follower surge in 90 days, 4.2x weekend line foot traffic, featured on 8 regional coffee blogs.',
    results: [
      { num: '+310%', label: 'Organic Follower Surge' },
      { num: '4.2x', label: 'Weekend Foot Traffic Lift' },
      { num: '98%', label: 'Positive Brand Sentiment' }
    ],
    clientQuote: 'Our Instagram feed now feels like a warm, inviting magazine spread. Customers regularly walk in holding up their phones pointing directly to our posts to order!',
    quoteAuthor: 'Elena Ross, Co-Founder at Aura Botanica Café',
    image: 'assets/images/smm/coffee-reel.jpg',
    metrics: '+310% Followers • 4.2x Foot Traffic',
    gallery: [
      { src: 'assets/images/smm/matcha-latte.jpg', title: 'Ceremonial Matcha Social Feature', desc: 'Curated Clean Lifestyle Still Life' },
      { src: 'assets/images/smm/coffee-reel.jpg', title: 'Pour-Over & Latte Art Reel', desc: 'Sensory ASMR Brew Series' },
      { src: 'assets/images/smm/healthy-bowl.jpg', title: 'Botanical Brunch Bowl Menu', desc: 'Seasonal Organic Culinary Post' },
      { src: 'assets/images/smm/productivity-desk.jpg', title: 'Remote Work & Coffee Vibes', desc: 'Digital Nomad Community Story' }
    ],
    deliverables: [
      '30x Monthly Curated Warm-Aesthetic Feed Posts & Carousels',
      '8x High-Resolution Sensory Coffee & Barista Process Reels',
      'Daily Interactive Instagram Story Sequences & Polls',
      'Influencer Gifting & Micro-Creator Outreach Framework',
      'Local Geo-Targeted Hashtags & Google Business Profile Sync'
    ]
  },
  {
    id: 16,
    category: 'social',
    categoryLabel: 'Social Media Management',
    title: 'Verve Workspace B2B Thought Leadership & Creative Hub Engine',
    client: 'Verve Modular Coworking & Creator Hub',
    industry: 'Modern Coworking, Startup Hubs & Remote Tech Workspaces',
    timeline: '45-Day B2B Social Repositioning Sprint',
    tagline: 'High-Value Productivity Carousels, Founder Spotlights & +520% Inbound Leads',
    tools: ['Figma', 'Photoshop', 'LinkedIn Creator Studio', 'Buffer', 'Brand Typography'],
    ownership: '100% Branded Carousel System & Reusable Canva/Figma Templates',
    desc: 'B2B social media strategy and thought leadership content ecosystem tailored for tech founders, creative brands, and modern hybrid professionals across LinkedIn and Instagram.',
    problem: 'Stale corporate posts about empty desks that sounded like generic real estate listings, failing to attract high-paying tech startup teams or private studio memberships.',
    whatWeDid: 'Transformed their feed into a hub for startup productivity: crisp dark-mode typography carousels, founder spotlight video clips, remote-work workflow tips, and targeted community event promos.',
    before: 'Generic empty office photos, zero corporate inquiries via social, 12 likes/post.',
    after: '+520% inbound private office desk inquiries, 85k monthly social impressions, 98% occupancy reached.',
    results: [
      { num: '+520%', label: 'Inbound Private Desk Inquiries' },
      { num: '85k', label: 'Monthly Social Impressions' },
      { num: '98%', label: 'Hub Occupancy Achieved' }
    ],
    clientQuote: 'Create and Arise positioned Verve as the premier Silicon Valley-tier creator space in our city. We filled our private offices and event spaces within weeks.',
    quoteAuthor: 'Christian Del Rosario, General Manager at Verve Hub',
    image: 'assets/images/smm/laptop-workspace.jpg',
    metrics: '+520% Inbound Leads • 85k Impressions',
    gallery: [
      { src: 'assets/images/smm/laptop-workspace.jpg', title: 'Executive Ergonomic Desk Suite', desc: 'Modern High-Focus Workspace Feature' },
      { src: 'assets/images/smm/productivity-desk.jpg', title: 'Deep Work Habit Carousel', desc: 'Viral Slide Deck for Startup Founders' },
      { src: 'assets/images/smm/hands-coffee.jpg', title: 'Creator Collaboration Moments', desc: 'Networking & Community Culture Asset' }
    ],
    deliverables: [
      '20x Monthly Executive LinkedIn & Instagram Infographic Carousels',
      'Resident Tech Founder Spotlight Video Snippets & Quotes',
      'Branded Notion & Productivity Template Freebies for Lead Capture',
      'Daily Strategic B2B Commenting & Tech Community Outreach',
      'Monthly Inbound Lead Attribution & Pipeline Tracking'
    ]
  },
  {
    id: 17,
    category: 'ads',
    categoryLabel: 'Digital Ads Marketing',
    title: 'Solaria Clean Skincare Multi-Channel Paid Acquisition Suite',
    client: 'Solaria Clean Skincare Direct-to-Consumer',
    industry: 'Direct-to-Consumer Clean Cosmetics & Botanical Beauty',
    timeline: '60-Day Paid Acquisition & Funnel Sprint',
    tagline: 'Hook-Driven UGC Video Ad Variations, Split-Testing Engine & 4.6x Blended ROAS',
    tools: ['Meta Ads Manager', 'TikTok Ads Manager', 'Figma', 'Triple Whale', 'Shopify Plus'],
    ownership: '100% Commercial Video Ad Masters, Raw Cuts & Hook Variations',
    desc: 'High-converting omnichannel paid advertising campaign across Meta, TikTok, and Google featuring 24 video ad variations, before/after comparison statics, and landing page message matching.',
    problem: 'Rising customer acquisition cost ($64 CAC) on Facebook ads due to severe creative fatigue, generic static graphics, and weak 1.1x ROAS eating into profit margins.',
    whatWeDid: 'Produced 24 thumb-stopping UGC video ad concepts with psychological hook testing, designed comparison carousel ads, optimized mobile landing pages, and restructured ad account bid strategies.',
    before: '$64 CAC, 1.1x unprofitable ROAS, ad fatigue in under 10 days.',
    after: '4.6x blended ROAS, CAC reduced by 54% down to $29.40, +$180,000 net Q4 revenue generated.',
    results: [
      { num: '4.6x', label: 'Blended Paid ROAS' },
      { num: '-54%', label: 'CAC Reduction ($64 → $29)' },
      { num: '+$180k', label: 'Net Tracked Ad Revenue' }
    ],
    clientQuote: 'Their ad creatives completely revived our paid advertising. We saw our cost per acquisition plummet by half in the very first three weeks of running their creative test variants.',
    quoteAuthor: 'Sophia Chen, Founder at Solaria Skincare',
    image: 'assets/images/digital-ads.jpg',
    metrics: '4.6x ROAS • -54% CAC Reduction',
    gallery: [
      { src: 'assets/images/digital-ads.jpg', title: 'Omnichannel Paid Campaign Suite', desc: 'Multi-Device High-ROAS Ad Creative Architecture' },
      { src: 'assets/images/solaria-branding.jpg', title: 'Packaging & Product Visuals', desc: 'E-Commerce Hero Assets for Retargeting' }
    ],
    deliverables: [
      '24x Hook-Driven Paid Video Creative Variations (Static & Motion)',
      'High-Converting Mobile DTC Advertorial & Landing Page Design',
      'Meta & TikTok Campaign Setup, Audience Segmentation & Scaling',
      'Creative Fatigue Heatmap & Weekly Spend Efficiency Reports',
      '100% Master Creative Files Handover'
    ]
  },
  {
    id: 18,
    category: 'web',
    categoryLabel: 'Web Design & Development',
    title: 'Apex Global Capital Investor Relations & Venture Platform',
    client: 'Apex Global Private Equity & Venture Capital',
    industry: 'Institutional Venture Capital & Private Equity Portfolio',
    timeline: '6-Week Bespoke Web Architecture Sprint',
    tagline: 'Zero-Bloat Institutional Web Platform with 0.3s Global Edge Load & Dark Mode Glassmorphism',
    tools: ['Figma', 'Semantic HTML5', 'Vanilla CSS3', 'JavaScript', 'Cloudflare Edge'],
    ownership: '100% Clean Semantic Source Code & Master Figma UI Tokens',
    desc: 'High-security editorial web platform engineered for an international venture capital firm, featuring interactive portfolio investments filtering, LP investor portal login, and sub-second load times.',
    problem: 'Stuck with a sluggish WordPress site taking 7.2s to load, failing institutional security checks, and delivering a disjointed mobile experience to high-net-worth investors.',
    whatWeDid: 'Engineered a bespoke, hand-coded frontend architecture with 0.3s edge loading, sleek obsidian dark-mode glassmorphism, dynamic portfolio filtering, and institutional compliance standards.',
    before: '7.2s slow load, bloated plugins, poor mobile presentation for tier-1 fund managers.',
    after: '0.3s sub-second edge load, 100/100 Core Web Vitals, 38 qualified institutional investor calls booked.',
    results: [
      { num: '0.3s', label: 'Global Edge Load Speed' },
      { num: '100/100', label: 'Lighthouse Performance Score' },
      { num: '38', label: 'Institutional LP Calls Booked' }
    ],
    clientQuote: 'The speed and architectural precision of our new web platform perfectly mirrors our investment standard. Our partners and institutional LPs were blown away.',
    quoteAuthor: 'Arthur Pendelton, Managing Partner at Apex Global Capital',
    image: 'assets/images/web-design.jpg',
    metrics: '0.3s Speed • 100/100 Lighthouse',
    gallery: [
      { src: 'assets/images/web-design.jpg', title: 'Institutional Venture Desktop Experience', desc: 'Editorial Dark Mode Typography & Clean Glassmorphism' },
      { src: 'assets/images/velocity-web.jpg', title: 'Portfolio Analytics Interface', desc: 'Interactive Venture Metric Dashboards' }
    ],
    deliverables: [
      'Custom Bespoke Web Architecture (Zero Framework Bloat)',
      'Interactive Venture Capital Portfolio Filtering Engine',
      'Institutional SEO, OpenGraph Protocols & Security Hardening',
      'Figma Master Component Library & Design Token System',
      'Global Edge CDN Deployment with 100/100 Lighthouse Score'
    ]
  },
  {
    id: 19,
    category: 'web',
    categoryLabel: 'Web Design & Development',
    title: 'Kinetics AI Enterprise Machine Learning Platform & Interface',
    client: 'Kinetics Intelligence Lab (San Francisco • Tokyo)',
    industry: 'Enterprise Artificial Intelligence & Neural Compute SaaS',
    timeline: '5-Week Architecture & Frontend Sprint',
    tagline: 'Ultra-Low Latency Neural Sandbox with 0.28s Vercel Edge Speed & Dark Mode Glassmorphism',
    tools: ['Figma', 'Semantic HTML5', 'Vanilla CSS3', 'WebSockets', 'Vercel Edge Network'],
    ownership: '100% Hand-Coded Web Architecture & Component Design System',
    desc: 'High-throughput enterprise AI web application featuring real-time neural sandbox playground, API documentation suite, ARR pricing calculators, and sub-second edge deployment.',
    problem: 'Bloated React framework template was dragging load speeds past 6.8 seconds, causing 52% bounce rates among senior engineers and CTOs evaluating their AI API.',
    whatWeDid: 'Engineered an ultra-fast vanilla frontend with zero runtime bloat, interactive model latency testing widget, dark obsidian cyber-gold theme, and streamlined enterprise trial booking flows.',
    before: '6.8s slow load time, 52% technical evaluation bounce rate, complicated navigation.',
    after: '0.28s instant edge load speed (99/100 Core Web Vitals), 3.8x lift in developer API signups, $2.4M new enterprise ARR pipeline.',
    results: [
      { num: '0.28s', label: 'Global Edge Load Speed' },
      { num: '3.8x', label: 'Developer Sign-Up Lift' },
      { num: '+$2.4M', label: 'Enterprise ARR Pipeline' }
    ],
    clientQuote: 'Engineers love speed. Create and Arise delivered a blistering fast, aesthetically flawless developer platform that established our authority with Silicon Valley CTOs immediately.',
    quoteAuthor: 'Dr. Kenji Sato, VP of Engineering at Kinetics Intelligence',
    image: 'assets/images/promo-saas-ai.jpg',
    metrics: '0.28s Edge Speed • 3.8x Signups',
    gallery: [
      { src: 'assets/images/promo-saas-ai.jpg', title: 'Neural Compute Dashboard', desc: 'Real-Time Telemetry & Throughput Monitor' },
      { src: 'assets/images/web-design.jpg', title: 'Developer Documentation Portal', desc: 'Clean Minimalist API Reference Architecture' }
    ],
    deliverables: [
      'Bespoke Hand-Coded Frontend Architecture (Zero Framework Bloat)',
      'Interactive Live Machine Learning Sandbox Widget',
      'Technical Developer Documentation & Code Playground Layout',
      'Full Dark Mode Glassmorphism & Enterprise UI Design Tokens',
      'Global Vercel Edge Deployment with 99/100 Core Web Vitals'
    ]
  },
  {
    id: 20,
    category: 'ads',
    categoryLabel: 'Digital Ads Marketing',
    title: 'Chrono Swiss Precision Horology Multi-Channel Direct-Response Campaign',
    client: 'Chrono Swiss Luxury Horology Atelier (Geneva)',
    industry: 'Haute Horlogerie, Mechanical Chronographs & Luxury Timepieces',
    timeline: '60-Day High-Ticket Acquisition Sprint',
    tagline: 'High-Net-Worth Meta & Google Search Funnel Drove $580K in Direct Mechanical Timepiece Sales at 4.85x Blended ROAS',
    tools: ['Meta Ads Manager', 'Google Search Ads', 'Figma', 'Klaviyo', 'Triple Whale'],
    ownership: '100% Commercial Ad Assets, High-Ticket Funnel Scripts & Retargeting Blueprint',
    desc: 'High-converting luxury performance campaign targeting high-net-worth collectors with cinematic watch movement macros, Swiss heritage copywriting, and white-glove concierge checkout funnels.',
    problem: 'Struggling to sell $2,400+ luxury automatic watches online through generic product carousel ads, suffering from high cost per click and zero luxury prestige differentiation.',
    whatWeDid: 'Engineered an ultra-premium direct response funnel: captured macro movement escapement mechanics, wrote prestige-driven founder copy, and built private VIP concierge scheduling landing pages.',
    before: '$480 CAC, 1.1x ROAS, high bounce rate on generic Shopify store.',
    after: '$580,000 in tracked luxury watch sales, blended ROAS climbed to 4.85x, and average order value increased to $2,850.',
    results: [
      { num: '$580K', label: 'Tracked Direct Sales' },
      { num: '4.85x', label: 'Blended Ad Spend ROAS' },
      { num: '$2,850', label: 'Average Order Value' }
    ],
    clientQuote: 'Create and Arise proved that fine Swiss mechanical watches can be successfully acquired through direct digital ads without degrading our luxury prestige.',
    quoteAuthor: 'Philippe Mercier, Managing Director at Chrono Swiss',
    image: 'assets/images/luxury-watch.jpg',
    metrics: '$580K Sales • 4.85x Blended ROAS',
    gallery: [
      { src: 'assets/images/luxury-watch.jpg', title: 'Chronograph Macro Video Ad', desc: 'Swiss Movement Escapement & Sapphire Crystal Macro' },
      { src: 'assets/images/digital-ads.jpg', title: 'High-Net-Worth Retargeting Matrix', desc: 'Multi-Variant Luxury Private Client Ad Suite' }
    ],
    deliverables: [
      '16x High-Ticket Watch Movement Cinematography Ad Creatives',
      'Prestige Copywriting Matrix for High-Net-Worth Collectors',
      'Google Search Exact-Match Luxury Watch Intent Campaigns',
      'Private VIP Concierge Checkout Funnel Architecture',
      'Triple Whale First-Party Attribution & ROAS Dashboard'
    ]
  },
  {
    id: 21,
    category: 'ministry',
    categoryLabel: 'Social Media Management',
    title: 'The Gospel Coalition (TGC) Scripture Outreach & Video Reels Series',
    client: 'The Gospel Coalition (Austin, Texas, USA)',
    industry: 'Christian Ministry, Theological Publishing & Digital Discipleship',
    timeline: 'Ongoing Monthly Social Architecture Retainer',
    tagline: 'Theologically Rich Scripture Carousels, Video Reels & +280% Social Engagement Surge',
    liveUrl: 'https://thegospelcoalition.org',
    tools: ['Adobe Lightroom', 'Photoshop', 'Canva Pro', 'CapCut Pro', 'Meta Business Suite'],
    ownership: '100% Curated Photo Asset Library & Master Instagram Templates',
    desc: 'Scripture carousel designs, theological video reels, and devotional graphics crafted with theological depth and visual beauty for digital discipleship.',
    problem: 'Struggling to engage next-generation Christians with thoughtful theology without resorting to superficial clickbait or fragmented visuals.',
    whatWeDid: 'Directed and designed high-retention scripture carousels, theological quote cards, and devotional reels paired with deep biblical commentary and aesthetic layouts.',
    before: 'Stagnant digital engagement, low traction with younger believers, irregular schedule.',
    after: '+280% social engagement surge, 4x community inquiries, and expanding monthly reach across platforms.',
    results: [
      { num: '+280%', label: 'Social Engagement Surge' },
      { num: '4x', label: 'Community Inquiries' },
      { num: '100%', label: 'Theological Precision' }
    ],
    clientQuote: 'Their social media creative direction transformed our digital outreach to young Christians. Every scripture carousel, video reel, and devotional graphic is crafted with theological depth and immense visual beauty. Our monthly reach surged by 280%.',
    quoteAuthor: 'Rev. Jordan Cruz, Digital Content Strategist at The Gospel Coalition',
    image: 'assets/images/smm/gym-weights.jpg',
    metrics: '+280% Social Reach • 4x Inquiries',
    gallery: [
      { src: 'assets/images/smm/gym-weights.jpg', title: 'Theological Precision Series', desc: 'Devotional Carousel & Scripture Typography' },
      { src: 'assets/images/smm/walking-sneakers.jpg', title: 'Community Outreach Feed', desc: 'Clean Minimalist Aesthetic Social Asset' }
    ],
    deliverables: [
      '24x Monthly Curated Editorial Feed Assets & Scripture Carousels',
      '6x High-Retention Devotional Video Reels',
      'Daily Story Announcements & Theological Q&A Templates',
      'Hashtag Clustering & Discipleship Outreach Strategy',
      'Monthly Community Growth & Follower Conversion Analytics'
    ]
  },
  {
    id: 22,
    category: 'branding',
    categoryLabel: 'Graphics & Branding',
    title: 'Vanguard Roasters Reserve Single-Origin Packaging & Merch Ecosystem',
    client: 'Vanguard Specialty Roasters (Melbourne • Baguio)',
    industry: 'Artisan Specialty Coffee, Retail Food & Wholesale Distribution',
    timeline: '4-Week Comprehensive Brand & Packaging Sprint',
    tagline: 'Embossed Foil Retail Shopping Bags, Roasted Bean Pouches & 3.5x Retail Perceived Value',
    tools: ['Adobe Illustrator', 'Photoshop', 'Cinema 4D', 'Die-Line Engineering', 'Print Finishing'],
    ownership: '100% Vector Packaging Blueprints & Commercial Master Rights',
    desc: 'Artisan roastery visual identity and physical packaging suite featuring custom typography, gold-embossed matte paper carry bags, degassing-valve coffee pouches, and merchandise caps.',
    problem: 'Exceptional highland specialty coffee beans were held back by standard brown generic bags with paper stickers, limiting wholesale café adoption and retail shelf pricing to $7.',
    whatWeDid: 'Crafted a bespoke luxury roastery identity: custom serif crest emblem, tactile matte white and black foil shopping bags, origin-certified roast labels, and premium embroidered barista caps.',
    before: 'Generic packaging, uninspired branding, unable to secure high-end café accounts.',
    after: 'Onboarded into 24 premium partner cafés across two regions, raised retail bag price to $24.50 (3.5x lift), +280% holiday gift sales.',
    results: [
      { num: '3.5x', label: 'Retail Price Point ($7 → $24.50)' },
      { num: '24', label: 'Partner Cafés Onboarded' },
      { num: '100%', label: 'Vector Production Blueprints' }
    ],
    clientQuote: 'Our packaging now matches the world-class quality of our roast. Wholesale café owners immediately took our brand seriously as a top-shelf luxury option.',
    quoteAuthor: 'Liam Thorne, Head Roaster at Vanguard Specialty',
    image: 'assets/Mock ups/7.png',
    metrics: '3.5x Retail Lift • 24 Partner Cafés',
    gallery: [
      { src: 'assets/Mock ups/7.png', title: 'Matte White Luxury Shopper Bag', desc: 'Gold Foil Stamped Roastery Carry Bag' },
      { src: 'assets/Mock ups/5.png', title: 'Takeout Emblem Hot Cup', desc: 'Matte Black 2025 Gold Monogram Cup' },
      { src: 'assets/Mock ups/2.png', title: 'Kraft Handled Boutique Bags', desc: 'Artisan Retail Merchandise Packaging' }
    ],
    deliverables: [
      'Master Roastery Crest & Monogram Suite (AI, SVG, EPS, PDF)',
      'Custom Gusseted Coffee Bag Die-Lines with Degassing Valve Specs',
      'Matte Foil-Stamped Retail Shopping Bags & Carry Packs',
      'Barista Merchandise Suite (Embroidered Caps, Aprons, Mugs)',
      '100% Print-Ready Vector Blueprints for Factory Production'
    ]
  },
  {
    id: 23,
    category: 'web',
    categoryLabel: 'Web Design & Development',
    title: 'Estate Prime High-Net-Worth Private Real Estate Portal',
    client: 'Estate Prime Luxury Properties (Zurich • Bali)',
    industry: 'Ultra-Luxury Residential Real Estate & Private Island Sales',
    timeline: '5-Week Editorial Web Architecture Sprint',
    tagline: 'Full-Screen Architectural Cinematic Tours, Private VIP Inquiry Engine & 0.35s Speed',
    tools: ['Figma', 'Semantic HTML5', 'Vanilla CSS3', 'JavaScript', 'Cloudflare CDN'],
    ownership: '100% Hand-Coded Frontend Codebase & Master Component UI Kit',
    desc: 'Editorial luxury real estate digital platform showcasing multimillion-dollar villas and estates with cinematic full-screen galleries, interactive floorplan viewer, and encrypted VIP buyer consultation scheduling.',
    problem: 'Outdated, sluggish real estate template burdened by slow MLS plugins that crashed on mobile and failed to impress international ultra-high-net-worth property buyers.',
    whatWeDid: 'Engineered a bespoke editorial showcase with 0.35s instant loading, full-bleed retina photography grids, interactive property feature sliders, and discrete private showing booking flows.',
    before: 'Slow 7.5s load time, clunky mobile browsing, 0 digital international buyer inquiries.',
    after: '0.35s sub-second edge load, 99.8% mobile responsiveness score, €14.5M in qualified private showing inquiries generated in 90 days.',
    results: [
      { num: '0.35s', label: 'Sub-Second Global Edge Load' },
      { num: '€14.5M', label: 'Qualified Buyer Pipeline' },
      { num: '99.8%', label: 'Mobile Performance Score' }
    ],
    clientQuote: 'The website exudes the quiet luxury our clientele expects. It functions like an elite private architectural catalog, creating instant trust with multi-million euro investors.',
    quoteAuthor: 'Dominic Van Der Bilt, Managing Director at Estate Prime',
    image: 'assets/images/luxury-estate.jpg',
    metrics: '0.35s Load • €14.5M Pipeline',
    gallery: [
      { src: 'assets/images/luxury-estate.jpg', title: 'Luxury Villa Architectural Showcase', desc: 'Full-Bleed Modernist Editorial Web Layout' },
      { src: 'assets/images/web-design.jpg', title: 'Private Buyer Inquiry Portal', desc: 'Secure High-Net-Worth VIP Booking Interface' }
    ],
    deliverables: [
      'Custom Editorial Real Estate Web Architecture (Zero Bloat)',
      'Dynamic High-Resolution Property Showcase & Filter Engine',
      'Interactive 3D Spatial Floorplan & Feature Highlights',
      'Encrypted Private VIP Buyer Consultation Scheduling Flow',
      '100% Mobile & Retina Display Global Optimization'
    ]
  },
  {
    id: 24,
    category: 'ads',
    categoryLabel: 'Digital Ads Marketing',
    title: 'OuraCore Biometric Smart Ring Omnichannel Meta & Google Performance Sprint',
    client: 'OuraCore Biometric Wearables & Health Tech',
    industry: 'Health Tech, Biometric Smart Rings & Sleep Optimization Hardware',
    timeline: '90-Day Omnichannel Scale Campaign',
    tagline: 'Dual Meta & Google Ad Funnel Generated 8,200 Hardware Orders at 4.42x ROAS with -$32 CPA Reduction',
    tools: ['Meta Ads Manager', 'Google Ads Performance Max', 'TikTok Ads', 'Figma', 'Triple Whale'],
    ownership: '100% Commercial Ad Assets, Video Hooks & Landing Page Frameworks',
    desc: 'High-velocity digital advertising campaign scaling direct hardware sales across Meta, Google PMax, and YouTube Shorts through scientific proof and biohacker creator hooks.',
    problem: 'Entering a hardware market dominated by venture-backed incumbents, struggling with a prohibitive $110 customer acquisition cost that made scaling impossible.',
    whatWeDid: 'Rebuilt the acquisition engine around circadian health benefits: produced split-screen sleep score comparison creatives, launched titanium durability stress tests, and deployed dynamic sizing kit quiz funnels.',
    before: '$110 CPA, negative cashflow on paid ads, low click-through rate (0.9%).',
    after: '8,200 units sold in 90 days, CPA reduced by $32 to $78, achieving a sustained 4.42x blended ROAS across all channels.',
    results: [
      { num: '8,200', label: 'Smart Rings Sold' },
      { num: '4.42x', label: 'Blended Ad ROAS' },
      { num: '-$32', label: 'CPA Reduction' }
    ],
    clientQuote: 'The ad creatives were scientific yet deeply emotionally compelling. We scaled our hardware shipments by 300% without seeing any drop in ROAS.',
    quoteAuthor: 'Dr. Aris Thorne, CEO & Co-Founder of OuraCore',
    image: 'assets/images/smart-ring.jpg',
    metrics: '8.2K Units • 4.42x Blended ROAS',
    gallery: [
      { src: 'assets/images/smart-ring.jpg', title: 'Titanium Smart Ring Hero Ad', desc: 'Biometric Sleep & HRV Tracking Creative' },
      { src: 'assets/images/digital-ads.jpg', title: 'Omnichannel Performance Blueprint', desc: 'Multi-Variant Meta & Google PMax Funnel Matrix' }
    ],
    deliverables: [
      '24x High-Converting Hardware Video Ad Variations',
      'Interactive Ring Sizing Quiz Funnel Page Architecture',
      'Google Performance Max Feed Optimization & Assets',
      'Circadian Biohacking UGC Creator Scripting Matrix',
      'First-Party Server-Side Conversion API Setup'
    ]
  },
  {
    id: 25,
    category: 'social',
    categoryLabel: 'Social Media Management',
    title: 'Harvest & Hearth Farm-to-Table Culinary Social Ecosystem',
    client: 'Harvest & Hearth Organic Culinary Collective',
    industry: 'Farm-to-Table Gastronomy, Organic Produce & Artisanal Dining',
    timeline: 'Ongoing Monthly Social Architecture',
    tagline: 'Sensory Culinary ASMR Reels, Chef Process Storytelling & +280% Table Reservation Surge',
    tools: ['Adobe Premiere Pro', 'Lightroom', 'CapCut Pro', 'Meta Business Suite', 'OpenTable Sync'],
    ownership: '100% Curated Food Photography Library & Master Reel Assets',
    desc: 'Artisanal culinary social media management featuring daily farm-to-table behind-the-scenes reels, plating tutorials, seasonal harvest announcements, and direct table reservation integrations.',
    problem: 'Relying solely on word-of-mouth with a neglected social profile featuring blurry customer reposts, resulting in sluggish weekday dinner reservations and low brand awareness.',
    whatWeDid: 'Produced a weekly schedule of ASMR sizzle and harvest video reels, clean rustic photography of signature seasonal dishes, chef commentary, and an integrated reservation booking link in bio.',
    before: 'Neglected feed, 0.5% engagement, empty Tuesday-Thursday dinner tables.',
    after: '+280% reservation surge, 65,000+ organic video shares, fully booked weekend seatings 4 weeks in advance.',
    results: [
      { num: '+280%', label: 'Table Reservation Lift' },
      { num: '65k+', label: 'Organic Video Shares' },
      { num: '99%', label: 'Weekend Seating Occupancy' }
    ],
    clientQuote: 'Our social media transformed into our primary booking engine. Guests fly in from across the region specifically citing our seasonal harvest videos on Instagram.',
    quoteAuthor: 'Chef Mateo Alcantara, Executive Chef at Harvest & Hearth',
    image: 'assets/images/smm/healthy-bowl.jpg',
    metrics: '+280% Bookings • 65k Shares',
    gallery: [
      { src: 'assets/images/smm/healthy-bowl.jpg', title: 'Farm-Fresh Culinary Showcase', desc: 'Organic Superfood Plating Social Post' },
      { src: 'assets/images/smm/coffee-reel.jpg', title: 'Artisanal Beverage Craft', desc: 'Behind-The-Counter Sensory Social Reel' },
      { src: 'assets/images/smm/productivity-desk.jpg', title: 'Morning Kitchen Prep Story', desc: 'Chef Recipe Philosophy & Harvest Notes' }
    ],
    deliverables: [
      '24x Monthly High-Definition Food & Farm Lifestyle Feed Assets',
      '8x Cinematic ASMR Kitchen Preparation & Plating Reels',
      'Daily Stories Featuring Daily Specials & Producer Spotlights',
      'OpenTable & Google Business Reservation Flow Optimization',
      'Monthly Dining Demographic & Reservation Conversion Reporting'
    ]
  },
  {
    id: 26,
    category: 'branding',
    categoryLabel: 'Graphics & Branding',
    title: 'Thynk Unlimited Luxury Apparel Identity & Garment Merch Suite',
    client: 'Thynk Unlimited Heavyweight Streetwear Lab',
    industry: 'Premium Streetwear, Heavyweight Garments & Textile Design',
    timeline: '4-Week Comprehensive Garment Identity Sprint',
    tagline: 'Debossed Heavyweight Garment Hangtags, Woven Neck Labels & 100% Vector Blueprint Handover',
    tools: ['Adobe Illustrator', 'Photoshop', 'Textile Die-Line Specs', 'Pantone TCX', 'Screenprint Vectors'],
    ownership: '100% Commercial Vector Source Rights (AI, SVG, PDF) & Factory Specs',
    desc: 'Complete garment branding and physical merchandise identity for an architectural streetwear label, featuring blind-debossed hangtags, woven damask neck labels, silicone patch specs, and typography systems.',
    problem: 'Premium 500 GSM heavyweight garments were undermined by generic off-the-shelf paper tags and cheap thermal stickers that damaged the perceived value of $140 hoodies.',
    whatWeDid: 'Engineered a bespoke garment trim package: thick 800 GSM black core hangtags with metallic bronze eyelets, custom woven damask neck labels, laser-etched silicone badges, and polybag packaging graphics.',
    before: 'Cheap stock tags, low perceived quality, return rate of 18% due to unboxing letdown.',
    after: 'Sold out 12,000 units on launch day, unboxing return rate dropped below 2%, average order value expanded by 45%.',
    results: [
      { num: '12k', label: 'Units Sold on Launch Day' },
      { num: '<2%', label: 'Unboxing Return Rate' },
      { num: '100%', label: 'Factory-Certified Blueprints' }
    ],
    clientQuote: 'The garment trim package made our pieces feel like Balenciaga or Fear of God. Every hangtag, neck label, and care tag screamed obsessive high fashion craftsmanship.',
    quoteAuthor: 'Marcus Sterling, Founder & Creative Director at Thynk Unlimited',
    image: 'assets/Mock ups/6.png',
    metrics: '12k Units Sold • 100% Vector Rights',
    gallery: [
      { src: 'assets/Mock ups/6.png', title: 'Luxury Apparel Hangtag Suite', desc: '800 GSM Heavyweight Matte Garment Tag with Bronze Eyelet' },
      { src: 'assets/Mock ups/8.png', title: 'Apparel Signature Tee Packaging', desc: 'Folded Branded T-Shirt Presentation' },
      { src: 'assets/Mock ups/1.png', title: 'Embroidered Scripture Merch Cap', desc: 'High-Density Stitching Textile Specification' }
    ],
    deliverables: [
      'Master Streetwear Logo & Monogram Vector Suite (AI, EPS, SVG, PDF)',
      '800 GSM Custom Die-Cut Hangtag Specifications with Foil Finishes',
      'High-Density Woven Damask Neck Label & Wash Care Label Blueprints',
      'Silicone & Laser-Cut Patch Artwork for Heavyweight Fleece',
      'Full Commercial Rights & Factory-Ready Print Handoff'
    ]
  },
  {
    id: 27,
    category: 'web',
    categoryLabel: 'Web Design & Development',
    title: 'Nexus Web3 DeFi Institutional Protocol Interface & Portal',
    client: 'Nexus Decentralized Protocol & Venture Labs',
    industry: 'Decentralized Finance, Blockchain Infrastructure & Web3 Security',
    timeline: '6-Week High-Security Frontend & Design Sprint',
    tagline: 'Ultra-Secure Clean Frontend, Live WebSockets Pricing Feeds & 0.32s Edge Performance',
    tools: ['Figma', 'Semantic HTML5', 'Vanilla CSS3', 'JavaScript', 'WebSockets API'],
    ownership: '100% Hand-Crafted Codebase & Figma Design Tokens (Zero Bloat)',
    desc: 'Institutional-grade Web3 decentralized application interface engineered with lightning-fast vanilla code, featuring live liquidity pool monitors, wallet connect workflows, and real-time order routing.',
    problem: 'Previous Web3 template was bloated with 14MB of redundant npm packages, lagging on mobile browsers and suffering from wallet connection timeouts that lost institutional liquidity providers.',
    whatWeDid: 'Rebuilt the interface from the ground up using ultra-lean semantic HTML5 and vanilla JavaScript, integrated sub-second WebSockets price feeds, dark cyberpunk glassmorphism, and seamless wallet onboarding.',
    before: '14MB bloated bundle, 6.4s load time, high drop-off during wallet connection.',
    after: '0.32s instant edge load speed, zero runtime framework latency, $45M in total value locked (TVL) onboarded in 60 days.',
    results: [
      { num: '0.32s', label: 'Edge Load Speed' },
      { num: '$45M', label: 'Total Value Locked (TVL)' },
      { num: '99/100', label: 'Lighthouse Security & Speed' }
    ],
    clientQuote: 'Web3 users demand instantaneous response times. Create and Arise delivered a blazing fast, institutional-grade interface that handled millions in transaction volume flawlessly.',
    quoteAuthor: 'Viktor Reznov, Lead Core Developer at Nexus Protocol',
    image: 'assets/images/hero-agency.jpg',
    metrics: '0.32s Speed • $45M TVL Onboarded',
    gallery: [
      { src: 'assets/images/hero-agency.jpg', title: 'Protocol Interface Overview', desc: 'Dark Cyberpunk Glassmorphism & High-Security UI' },
      { src: 'assets/images/velocity-web.jpg', title: 'Real-Time Telemetry Interface', desc: 'WebSockets Liquidity Pool Visualizer' }
    ],
    deliverables: [
      'Ultra-Lean Frontend Architecture with Zero Framework Overhead',
      'Real-Time WebSockets Financial Ticker & Liquidity Monitor',
      'Web3 Wallet Connection Integration (MetaMask, WalletConnect)',
      'Figma Master Component Library & Institutional Design System',
      'Global Edge CDN Deployment with 99/100 Core Web Vitals'
    ]
  },
  {
    id: 28,
    category: 'ads',
    categoryLabel: 'Digital Ads Marketing',
    title: 'Strata Cloud B2B Enterprise LinkedIn & Search Acquisition',
    client: 'Strata Cloud Workflow & Automation Suite',
    industry: 'Enterprise B2B SaaS, Cloud Automation & DevOps Tools',
    timeline: '60-Day Enterprise Lead Generation Sprint',
    tagline: 'High-Intent B2B Retargeting Funnel Generated 180+ Enterprise Demo Bookings at 3.9x Pipeline ROAS',
    tools: ['LinkedIn Campaign Manager', 'Google Search Ads', 'Figma', 'HubSpot CRM', 'Leadfeeder'],
    ownership: '100% Commercial Ad Assets, Copy Matrix & Lead Funnel Blueprints',
    desc: 'Targeted B2B performance advertising campaign across LinkedIn Sponsored Content and Google Search intent keywords, driving C-level tech decision makers into high-converting product demo funnels.',
    problem: 'Wasting $24,000/month on generic broad-match Google ads with low intent, resulting in an unsustainable $280 cost per qualified sales demo and zero Fortune 500 engagement.',
    whatWeDid: 'Restructured the B2B acquisition funnel: designed compelling statistic-backed carousel ads for LinkedIn, wrote exact-match search ad copy targeting enterprise pain points, and engineered interactive ROI calculator landing pages.',
    before: '$280 cost per demo, poor lead qualification, low sales pipeline velocity.',
    after: '180+ qualified enterprise demo bookings in 60 days, cost per demo reduced to $94, generating 3.9x tracked sales pipeline return.',
    results: [
      { num: '180+', label: 'Enterprise Demos Booked' },
      { num: '-66%', label: 'Cost Per Demo ($280 → $94)' },
      { num: '3.9x', label: 'Pipeline ROAS Return' }
    ],
    clientQuote: 'Create and Arise transformed our B2B lead generation. We went from chasing unqualified clicks to speaking directly with CTOs and enterprise directors every single week.',
    quoteAuthor: 'Samantha Wei, VP of Demand Generation at Strata Cloud',
    image: 'assets/images/smm/productivity-desk.jpg',
    metrics: '180+ Demos • 3.9x Pipeline ROAS',
    gallery: [
      { src: 'assets/images/smm/productivity-desk.jpg', title: 'Executive Workflow Ad Suite', desc: 'High-Intent Enterprise Productivity Creative' },
      { src: 'assets/images/digital-ads.jpg', title: 'Multi-Variant B2B Funnel Matrix', desc: 'LinkedIn Carousel & Search Ad Architecture' }
    ],
    deliverables: [
      '24x B2B Carousel & Static LinkedIn Ad Creative Sets',
      'Exact-Match Google Search Campaign Keyword & Ad Copy Matrix',
      'Interactive ARR & Cloud ROI Calculator Landing Funnel Layout',
      'HubSpot CRM & Lead Attribution Tracking Architecture',
      'Weekly Pipeline Velocity & Qualified Opportunity Reports'
    ]
  },
  {
    id: 29,
    category: 'social',
    categoryLabel: 'Social Media Management',
    title: 'Ceremony Kyoto Matcha Bar Viral TikTok & Aesthetic Reels Curation',
    client: 'Ceremony Kyoto Matcha Bar & Botanical Tea Guild',
    industry: 'Specialty Japanese Tea, Ceremonial Grade Matcha & Lifestyle Cafe',
    timeline: '90-Day Organic Viral Content Sprint',
    tagline: 'Sensory Micro-Pour Reels & ASMR Whisking Generated 4.2M Organic Impressions & Daily 45-Minute Cafe Queues',
    tools: ['Instagram Reels', 'TikTok', 'CapCut Pro', 'Canva Pro', 'Figma', 'Meta Business Suite'],
    ownership: '100% Commercial Source Rights Handover & Video Assets',
    desc: 'Bespoke short-form video strategy highlighting ceremonial grade tea rituals, calming ASMR whisking audio, and minimalist Japanese cafe aesthetics.',
    problem: 'Opening a specialty matcha bar in a competitive urban neighborhood with slow initial customer footfall and zero organic TikTok traction despite high-grade artisanal tea.',
    whatWeDid: 'Crafted a sensory short-form video strategy: filmed 4K macro whisking ASMR reels, launched daily latte art transition videos, scripted educational matcha grading guides, and designed a cohesive sage-green Instagram feed.',
    before: 'Under 500 impressions/week, empty morning hours, stagnant follower growth.',
    after: '4.2M+ viral TikTok & Instagram impressions, 45-minute daily lines outside the cafe, +380% walk-in beverage sales.',
    results: [
      { num: '4.2M+', label: 'Organic Video Views' },
      { num: '+380%', label: 'Walk-In Beverage Sales' },
      { num: '19.4%', label: 'Average Save & Share Rate' }
    ],
    clientQuote: 'Create and Arise captured our craft with such reverence and artistry. Our reels went completely viral, and people travel across cities just to visit our matcha bar.',
    quoteAuthor: 'Kenji & Mei Takahashi, Founders of Ceremony Matcha',
    image: 'assets/images/smm/matcha-latte.jpg',
    metrics: '4.2M Views • +380% Footfall',
    gallery: [
      { src: 'assets/images/smm/matcha-latte.jpg', title: 'Ceremonial Whisking ASMR', desc: '4K Macro Pour & Micro-Foam Texture Reel' },
      { src: 'assets/images/smm/coffee-reel.jpg', title: 'Cafe Aesthetics 9-Grid', desc: 'Minimalist Sage & Earth Feed Curation' }
    ],
    deliverables: [
      '24x High-Definition Short-Form TikTok & Instagram Reels',
      'Curated Wabi-Sabi Aesthetic 9-Grid Feed Blueprint',
      'Viral Hook Scripting & Trend Audio Syncing Matrix',
      'Daily Community Engagement & DM Customer Service',
      'Monthly Viral Analytics & Retention Growth Reports'
    ]
  },
  {
    id: 30,
    category: 'social',
    categoryLabel: 'Social Media Management',
    title: 'Aethel Minimalist Workspace Daily Creator Content & Desk Reels',
    client: 'Aethel Workspace Gear & Desk Setup Laboratory',
    industry: 'Minimalist Ergonomics, Mechanical Keyboards & Creator Workspaces',
    timeline: '60-Day Tech Creator Growth Retainer',
    tagline: 'Clean Desk Aesthetic Carousels & Sound-Design Reels Drove 120K New Followers & 8.4x Bio Link Clicks',
    tools: ['Instagram Reels', 'TikTok', 'CapCut Pro', 'Lightroom Mobile', 'Figma', 'Notion'],
    ownership: '100% Commercial Source Rights Handover & Video Assets',
    desc: 'High-production desk setup transformations, mechanical keyboard sound checks, and minimalist productivity carousels positioning Aethel as the premier workspace brand.',
    problem: 'Selling premium $180 desk mats and aluminum laptop stands with standard commercial product photos that generated near-zero engagement on Instagram and TikTok.',
    whatWeDid: 'Transformed their feed into a digital sanctuary for creators: filmed satisfying ASMR keyboard typing reels, curated minimalist dual-monitor desk transformations, and designed carousel guides on deep-work routines.',
    before: 'Low engagement rate (0.8%), high ad dependency, flat organic website traffic.',
    after: '120K+ new organic tech followers, 8.4x increase in bio link store clicks, and 3 sold-out desk mat collection drops.',
    results: [
      { num: '120K+', label: 'Organic Tech Followers' },
      { num: '8.4x', label: 'Bio Link Store Clicks' },
      { num: '1.2M', label: 'Average Monthly Reach' }
    ],
    clientQuote: 'The aesthetic quality is mind-blowing. Create and Arise understood our community culture down to the exact typing sounds and golden hour lighting.',
    quoteAuthor: 'Marcus Vance, Product Lead at Aethel Workspace',
    image: 'assets/images/smm/desk_laptop_coffee_1791823735947.jpg',
    metrics: '120K Followers • 8.4x Bio Clicks',
    gallery: [
      { src: 'assets/images/smm/desk_laptop_coffee_1791823735947.jpg', title: 'Workspace ASMR Routine', desc: 'Mechanical Keyboard Typing & Coffee Flow' },
      { src: 'assets/images/smm/productivity-desk.jpg', title: 'Deep Work Carousel Guide', desc: 'Educational 10-Slide Focus Routine' }
    ],
    deliverables: [
      '20x 4K Cinematic Desk Setup Video Reels & Sound Bites',
      '10x High-Save Educational Ergonomic Carousels',
      'Weekly Instagram Story Interactive AMA & Desk Polls',
      'Custom Aesthetic Filter & Color Grading LUT Package',
      'Affiliate Creator Outreach & Content Collaboration Briefs'
    ]
  },
  {
    id: 31,
    category: 'social',
    categoryLabel: 'Social Media Management',
    title: 'Summit Athletics High-Altitude Trail & Outdoor Reels Series',
    client: 'Summit Athletics & High-Altitude Trail Collective',
    industry: 'Outdoor Technical Apparel, Mountain Trail Running & Adventure Gear',
    timeline: '4-Month Mountain Content Campaign',
    tagline: 'Cinematographic Mountain Trail Short-Form Content Positioned Brand as Top Mountain Gear Community',
    tools: ['GoPro Hero12', 'CapCut Pro', 'Instagram Reels', 'TikTok', 'Figma', 'Sprout Social'],
    ownership: '100% Commercial Source Rights Handover & Video Assets',
    desc: 'Rugged high-altitude running reels, waterproof gear stress-test clips, and inspiring mountain athlete stories building an elite outdoor community.',
    problem: 'Struggling to stand out against incumbent mega-brands in trail running without spending hundreds of thousands in traditional billboard advertising.',
    whatWeDid: 'Produced high-adrenaline vertical video campaigns on ridge trails, captured waterproof gear torture tests in mountain rainfall, and curated user-generated summit photos.',
    before: 'Fragmented brand voice, low community participation, stagnant reels view counts.',
    after: '3.2M organic impressions across outdoor runner hashtags, +92K community members, and a 94% positive community sentiment score.',
    results: [
      { num: '3.2M', label: 'Mountain Trail Views' },
      { num: '+92K', label: 'Active Trail Community' },
      { num: '94%', label: 'Positive Brand Sentiment' }
    ],
    clientQuote: 'Every video makes you want to lace up and climb a mountain. Create and Arise gave Summit Athletics an authentic, rugged soul online.',
    quoteAuthor: 'Christian Thorne, Founder of Summit Athletics',
    image: 'assets/images/smm/mountain-runner.jpg',
    metrics: '+92K Community • 3.2M Reach',
    gallery: [
      { src: 'assets/images/smm/mountain-runner.jpg', title: 'Alpine Ridge Sprint POV', desc: 'Cinematic High-Altitude Trail Run Video' },
      { src: 'assets/images/smm/walking-sneakers.jpg', title: 'Vibram Grip Breakdown Carousel', desc: 'Technical Mountain Footwear Review' }
    ],
    deliverables: [
      '16x High-Adrenaline Vertical Mountain Trail Clips',
      '8x Multi-Slide Technical Gear Anatomy Carousels',
      'Bi-Weekly Community Trail Challenge Story Prompts',
      'Curated User-Generated Content Repost Engine',
      'Audience Demographics & Elevation Engagement Metrics'
    ]
  },
  {
    id: 32,
    category: 'social',
    categoryLabel: 'Social Media Management',
    title: 'Strada Urban Footwear Drops & Street-Style Community Grid',
    client: 'Strada Footwear Co. (Contemporary Sneaker Brand)',
    industry: 'Sustainable Lifestyle Sneakers & Contemporary Streetwear Footwear',
    timeline: '90-Day Sneaker Drop Launch Retainer',
    tagline: 'Street-Style POV Reels & Sneaker Styling Carousels Drove 3 Sold-Out Seasonal Launches in Under 24h',
    tools: ['Instagram Reels', 'TikTok', 'CapCut Pro', 'Lightroom Mobile', 'Canva Pro', 'Later'],
    ownership: '100% Commercial Source Rights Handover & Video Assets',
    desc: 'Urban pavement walk cycles, on-foot styling carousels, and minimalist sneaker unboxings driving massive organic hype for seasonal footwear drops.',
    problem: 'Launching a new sustainable sneaker line with intense competition from fast-fashion brands and zero established social proof.',
    whatWeDid: 'Engineered a street-style video framework: filmed low-angle pavement walk tests, created 7-day outfit styling guides, and orchestrated limited drop countdown stories with VIP DM links.',
    before: 'Overlooked product launches, low follower retention, high refund inquiries.',
    after: '3 consecutive seasonal drops sold out in under 24 hours, average reel engagement climbed to 14.8%, and gained +65K Gen-Z followers.',
    results: [
      { num: '3x', label: 'Sold-Out Launches (<24h)' },
      { num: '14.8%', label: 'Average Reel Engagement' },
      { num: '+65K', label: 'Gen-Z Footwear Followers' }
    ],
    clientQuote: 'Our sneaker drops feel like cultural moments now. The styling reels are effortlessly cool and directly converted into instant sell-outs.',
    quoteAuthor: 'Elena Cruz, Creative Director at Strada Footwear',
    image: 'assets/images/smm/walking-sneakers.jpg',
    metrics: '3 Sold-Out Drops • 14.8% Engagement',
    gallery: [
      { src: 'assets/images/smm/walking-sneakers.jpg', title: 'Street-Level Pavement Walk', desc: 'Low-Angle Sneaker Movement & Flexibility' },
      { src: 'assets/images/smm/desk_productivity_journal_1791823682257.jpg', title: 'Recycled Box Unboxing ASMR', desc: 'Eco-Craft Packaging Reveal Video' }
    ],
    deliverables: [
      '24x Street-Level On-Foot Video Reels & Transitions',
      '12x 7-Day Outfit Styling Carousels for Sneakerheads',
      'Interactive VIP Drop Countdown Story Sequences',
      'Influencer Gifting Social Briefs & Repost Management',
      'Drop Conversion Tracking & Viral Audio Trend Analysis'
    ]
  },
  {
    id: 33,
    category: 'social',
    categoryLabel: 'Social Media Management',
    title: 'Hydra Core Functional Hydration TikTok Challenge & UGC Engine',
    client: 'Hydra Core Performance Hydration & Flasks',
    industry: 'Eco-Friendly Insulated Flasks & Daily Functional Wellness',
    timeline: '60-Day TikTok Viral Challenge',
    tagline: 'Viral #HydrateDaily TikTok Trend Drove 8.7M Hashtag Views & Scaled Monthly DTC Flask Orders by +245%',
    tools: ['TikTok', 'Instagram Reels', 'CapCut Pro', 'Canva Pro', 'Figma', 'Hootsuite'],
    ownership: '100% Commercial Source Rights Handover & Video Assets',
    desc: 'High-impact temperature ice-drop experiments, aesthetic gym-bag essentials reels, and community hydration tracking challenges.',
    problem: 'Selling durable stainless steel flasks that looked like dozens of competitors on Amazon, generating zero emotional brand affinity or viral interest.',
    whatWeDid: 'Launched the #HydrateDaily challenge: created dynamic ice-cube drop test videos, daily water habit carousels, and partnered with fitness micro-creators for authentic day-in-the-life features.',
    before: 'Flat DTC sales, Amazon price war pressure, near-zero branded hashtag usage.',
    after: '8.7M hashtag impressions on TikTok, +245% jump in direct DTC bottle sales, and over 42,000 user-submitted stitch videos.',
    results: [
      { num: '8.7M', label: 'TikTok Hashtag Impressions' },
      { num: '+245%', label: 'Direct DTC Online Orders' },
      { num: '42K', label: 'User Stitch Submissions' }
    ],
    clientQuote: 'Our bottles became an everyday fashion accessory on TikTok. Create and Arise turned a simple water bottle into a viral lifestyle phenomenon.',
    quoteAuthor: 'Liam Gallagher, Co-Founder of Hydra Core',
    image: 'assets/images/smm/water-bottle.jpg',
    metrics: '8.7M #Tag Views • +245% Orders',
    gallery: [
      { src: 'assets/images/smm/water-bottle.jpg', title: 'Ice-Drop Thermal Test Reel', desc: '24-Hour Ice Retention Proof Video' },
      { src: 'assets/images/smm/gym-weights.jpg', title: 'Everyday Gym Carry Carousel', desc: 'Color-Matched Hydration & Fitness Gear' }
    ],
    deliverables: [
      '18x High-Retention TikTok Video Shorts & Ice Tests',
      'Official #HydrateDaily Brand Challenge Creative Assets',
      '8x Educational Hydration Science Infographic Carousels',
      'Daily TikTok Comment Moderation & Duet Reposts',
      'DTC Order Attribution & Viral Audio Licensing Guide'
    ]
  },
  {
    id: 34,
    category: 'social',
    categoryLabel: 'Social Media Management',
    title: 'Iron & Oak Functional Strength Gym Community & PR Transformation Clips',
    client: 'Iron & Oak Athletic Club (Strength & Conditioning Facility)',
    industry: 'Strength Conditioning, Olympic Weightlifting & Gym Community',
    timeline: '6-Month Organic Club Retainer',
    tagline: 'High-Energy Barbell PR Reels & Member Spotlights Increased In-Person Gym Memberships by +175%',
    tools: ['Instagram Reels', 'TikTok', 'CapCut Pro', 'Lightroom Mobile', 'Figma', 'Meta Suite'],
    ownership: '100% Commercial Source Rights Handover & Video Assets',
    desc: 'Cinematic slow-motion barbell lifts, chalk-dust explosion reels, and member transformation spotlights building a tight-knit fitness powerhouse.',
    problem: 'Local gym had premium Eleiko equipment and expert coaches but an inactive Instagram that looked like an abandoned facility, losing memberships to big commercial chains.',
    whatWeDid: 'Built an authentic community media hub: filmed member personal record celebrations with dramatic lighting, created technique coaching carousels, and ran weekly transformation stories.',
    before: 'Empty social feed, 12 average post likes, reliant on expensive printed flyers.',
    after: '2.6M local reel reach, +175% increase in paid recurring memberships, and 410+ monthly direct message gym inquiries.',
    results: [
      { num: '+175%', label: 'New Gym Memberships' },
      { num: '2.6M', label: 'Local Reel Impressions' },
      { num: '410+', label: 'Monthly DM Inquiries' }
    ],
    clientQuote: 'Our gym floor has never been more vibrant. Prospective members walk in every day saying they saw our lifters on Instagram and had to join.',
    quoteAuthor: 'Coach David Miller, Head Strength Coach at Iron & Oak',
    image: 'assets/images/smm/gym-strength.jpg',
    metrics: '+175% Memberships • 2.6M Reach',
    gallery: [
      { src: 'assets/images/smm/gym-strength.jpg', title: 'Deadlift PR Cinematic Reel', desc: 'Chalk Dust & 4K High-Frame Rate Lift' },
      { src: 'assets/images/smm/gym-weights.jpg', title: 'Barbell Form Breakdown Carousel', desc: 'Step-by-Step Biomechanics Guide' }
    ],
    deliverables: [
      '24x Cinematic Heavy Lift & Technique Reels',
      '12x Biomechanics & Lifting Safety Educational Carousels',
      'Weekly Member Spotlight Story Takeovers & Q&As',
      'Local Geo-Targeted Hashtag Optimization Strategy',
      'Monthly Lead Generation & Direct Message Conversion Audits'
    ]
  },
  {
    id: 35,
    category: 'social',
    categoryLabel: 'Social Media Management',
    title: 'Artisan Cupping Lab Pour-Over ASMR & Morning Routine Content',
    client: 'Origin Roast Lab & Artisan Espresso Guild',
    industry: 'Specialty Third-Wave Coffee, Subscriptions & Barista Training',
    timeline: '90-Day Sensory Content Sprint',
    tagline: 'Crisp ASMR Grind & Pour-Over Reels Converted 5,400 Monthly Coffee Bean Subscription Boxes',
    tools: ['Instagram Reels', 'TikTok', 'CapCut Pro', 'Figma', 'Canva Pro', 'Later'],
    ownership: '100% Commercial Source Rights Handover & Video Assets',
    desc: 'Warm golden-hour coffee brewing reels, barista kettle pour-overs, and sensory flavor wheel carousels that made specialty coffee accessible and irresistible.',
    problem: 'Third-wave coffee roastery had incredible single-origin beans but seemed intimidating to everyday coffee drinkers, causing low online bean subscription sales.',
    whatWeDid: 'Demystified specialty coffee with soothing ASMR reels: kettle water pouring, bean grinding sounds, brew ratio carousels, and beginner-friendly home barista tips.',
    before: 'Technical jargon that alienated beginners, under 200 monthly subscriptions.',
    after: '5,400 active monthly coffee subscriptions, 9.2% average post engagement rate, and +320% jump in website referral traffic.',
    results: [
      { num: '5,400', label: 'Monthly Subscriptions' },
      { num: '9.2%', label: 'Average Post Engagement' },
      { num: '+320%', label: 'Website Referral Traffic' }
    ],
    clientQuote: 'They made specialty coffee feel warm, welcoming, and deeply satisfying. Our bean subscription program exploded as a direct result of their content.',
    quoteAuthor: 'Mateo Rossi, Master Roaster at Origin Roast Lab',
    image: 'assets/images/smm/hands-coffee.jpg',
    metrics: '5.4K Subscriptions • 9.2% Engagement',
    gallery: [
      { src: 'assets/images/smm/hands-coffee.jpg', title: 'Gooseneck Kettle ASMR Bloom', desc: 'Golden Hour Specialty Brew Capture' },
      { src: 'assets/images/smm/coffee-reel.jpg', title: 'Barista Latte Art Swan Reel', desc: 'Precision Milk Frothing Technique' }
    ],
    deliverables: [
      '20x Golden-Hour Pour-Over & Latte Art Video Reels',
      '10x Home Barista Brew Ratio & Grind Size Carousels',
      'Weekly Instagram Coffee Q&A Story Highlight Architecture',
      'Sensory Sound Design & Royalty-Free Audio Syncing',
      'Subscription Box Unboxing Campaign Coordination'
    ]
  },
  {
    id: 36,
    category: 'social',
    categoryLabel: 'Social Media Management',
    title: 'Maison Pierre Artisan French Patisserie & Sourdough Bakery Reels',
    client: 'Maison Pierre Artisan Boulangerie & Patisserie',
    industry: 'Artisan French Bakery, Slow-Fermented Sourdough & Laminated Pastry',
    timeline: '90-Day Sensory Content Sprint',
    tagline: 'Hypnotic Croissant Flake ASMR & Sourdough Crumb Reveal Reels Generated 5.8M Views & Sold Out Morning Bakes Daily',
    tools: ['Instagram Reels', 'TikTok', 'CapCut Pro', 'Lightroom Mobile', 'Meta Business Suite'],
    ownership: '100% Commercial Source Rights Handover & Video Assets',
    desc: 'Sensory slow-motion croissant flaking, oven spring bread expansion timelapses, and golden-hour French bakery aesthetics driving viral foodie queues.',
    problem: 'Artisan bakery waking up at 3:00 AM to bake world-class pastries but posting dark, blurry phone photos, leaving afternoon pastry cases unsold.',
    whatWeDid: 'Captured the tactile magic of French baking: produced crisp ASMR reels of croissant dough lamination, filmed steaming sourdough crust cracks, and launched 7:00 AM daily fresh-bake countdown stories.',
    before: 'Stagnant local reach, 30% leftover pastries at closing time, flat morning foot traffic.',
    after: '5.8M viral views across TikTok and Reels, bakery sells out completely by 11:30 AM every single day, and catering pre-orders booked 2 months in advance.',
    results: [
      { num: '5.8M', label: 'Viral Bakery Views' },
      { num: '100%', label: 'Daily Sellout by 11:30 AM' },
      { num: '24.2%', label: 'Average Save & Share Rate' }
    ],
    clientQuote: 'People arrive before we even unlock our doors with their phones open showing our croissant reels. Create and Arise turned our humble bakery into a culinary destination.',
    quoteAuthor: 'Chef Pierre Laurent, Master Baker at Maison Pierre',
    image: 'assets/images/smm/artisan-bakery.jpg',
    metrics: '5.8M Views • 100% Daily Sellout',
    gallery: [
      { src: 'assets/images/smm/artisan-bakery.jpg', title: 'Golden Croissant & Sourdough Counter', desc: 'Artisan Display & Morning Sunlight ASMR Reel' },
      { src: 'assets/images/smm/coffee-reel.jpg', title: 'Morning Cafe & Pastry Pairing', desc: 'Cappuccino & Viennoiserie Aesthetic Reel' }
    ],
    deliverables: [
      '24x Crisp Dough Lamination & Sourdough Crumb ASMR Reels',
      'Daily 7:00 AM Fresh-Out-Of-The-Oven Instagram Story Alerts',
      'Artisan French Aesthetic 9-Grid Photography Feed Blueprint',
      'Local Foodie & Travel Influencer Tasting Event Series',
      'Weekend Special Pastry Pre-Order DM Automation Flow'
    ]
  },
  {
    id: 37,
    category: 'social',
    categoryLabel: 'Social Media Management',
    title: 'Deep Work Journal Productivity Systems & Mindset Carousels',
    client: 'Deep Work Publishing & Daily Journal Lab',
    industry: 'Executive Productivity, Cognitive Habit Tracking & Stationery',
    timeline: '60-Day Habit Content Sprint',
    tagline: 'Clean Aesthetic Journaling Reels & Time-Blocking Visual Guides Drove $160K in DTC Q4 Planner Sales',
    tools: ['Instagram Reels', 'TikTok', 'CapCut Pro', 'Figma', 'Notion', 'Buffer'],
    ownership: '100% Commercial Source Rights Handover & Video Assets',
    desc: 'Satisfying fountain-pen journaling clips, morning time-blocking guides, and science-backed cognitive focus carousels that made planners an executive essential.',
    problem: 'Launching a premium $42 linen-bound daily planner entering the crowded Q4 new-year planning season with zero brand differentiation.',
    whatWeDid: 'Positioned the journal as a cognitive performance tool: created aesthetic 60-second morning routine videos, designed step-by-step time-blocking carousels, and shared real executives’ weekly reviews.',
    before: 'Zero social presence, no pre-orders, high customer skepticism regarding price.',
    after: '$160,000 in direct DTC Q4 planner sales, 4.8M hashtag reach across productivity feeds, and a 28.5% story link click-through rate.',
    results: [
      { num: '$160K', label: 'Direct DTC Planner Sales' },
      { num: '4.8M', label: 'Productivity Hashtag Reach' },
      { num: '28.5%', label: 'Story Link CTR' }
    ],
    clientQuote: 'They did not just showcase a journal; they sold a high-performance lifestyle. Create and Arise sold out our entire first print run in 6 weeks.',
    quoteAuthor: 'Alexander Hayes, Author & Founder of Deep Work Lab',
    image: 'assets/images/smm/desk_productivity_journal_1791823682257.jpg',
    metrics: '$160K Q4 Sales • 4.8M Impressions',
    gallery: [
      { src: 'assets/images/smm/desk_productivity_journal_1791823682257.jpg', title: 'Morning Planning Routine Reel', desc: 'Fountain Pen Habit Log & Timer ASMR' },
      { src: 'assets/images/smm/laptop-workspace.jpg', title: '5 Time-Blocking Rules Carousel', desc: 'High-Retention Executive Carousel' }
    ],
    deliverables: [
      '18x Aesthetic Morning Routine & Habit Tracking Reels',
      '10x Cognitive Science Productivity Infographic Carousels',
      'Daily Motivational Quote Story Layouts & Wallpapers',
      'Interactive Goal-Setting Notion Template Social Teasers',
      'Q4 Holiday Launch Countdown Story Strategy'
    ]
  },
  {
    id: 38,
    category: 'social',
    categoryLabel: 'Social Media Management',
    title: 'PURPOSE / STUDIO™ TikTok Fashion Feeds & Streetwear Runway Cuts',
    client: 'PURPOSE / STUDIO™ (Verified Fashion Lab)',
    industry: 'Luxury Heavyweight Streetwear, Drop Culture & Digital Lookbooks',
    timeline: 'Ongoing Drop Content Retainer',
    tagline: 'Raw Brutalist Aesthetic Reels & Behind-The-Scenes 500 GSM Cut-and-Sew Drove 100K Viral Shares',
    tools: ['TikTok Shop', 'Instagram Reels', 'CapCut Pro', 'Figma', 'Premiere Pro', 'Later'],
    ownership: '100% Commercial Source Rights Handover & Video Assets',
    desc: 'Architectural streetwear garment zooms, Tokyo night lookbooks, and 500 GSM heavyweight cotton drop teasers engineered for viral TikTok reach.',
    problem: 'Fashion brand relied on static e-commerce lookbooks that failed to convey the premium tactile heft and architectural silhouette of 500 GSM cotton.',
    whatWeDid: 'Pioneered an industrial brutalist vertical video format: filmed macro texture cuts of custom metal zippers, runway walk transitions, and interactive sizing guides for TikTok Shop.',
    before: 'Slow drop sellouts, low engagement on static posts, lack of viral community shares.',
    after: '100K+ viral video shares across TikTok and Reels, 4.8M impressions, and an 88% waitlist conversion rate on Drop 03.',
    results: [
      { num: '100K+', label: 'Viral Reel & TikTok Shares' },
      { num: '4.8M', label: 'Organic Streetwear Reach' },
      { num: '88%', label: 'Drop Waitlist Conversion' }
    ],
    clientQuote: 'Create and Arise gave our clothing the cinematic gravitas it deserves. The tactile macro videos made our 500 GSM fabric impossible to ignore.',
    quoteAuthor: 'Jerome & The PURPOSE / STUDIO™ Lab Team',
    image: 'assets/images/purpose-hoodie-black.jpg',
    metrics: '100K Viral Shares • 4.8M Views',
    gallery: [
      { src: 'assets/images/purpose-hoodie-black.jpg', title: 'Vintage Washed Black Pullover', desc: '500 GSM Custom Heavyweight Loopback Cotton' },
      { src: 'assets/images/purpose-studio-editorial.jpg', title: 'Architectural Runway Campaign', desc: 'Heavyweight Streetwear Silhouette & Drape' }
    ],
    deliverables: [
      '20x Cinematic Heavyweight Streetwear Lookbook Reels',
      '8x Fabric Science & 500 GSM Sizing Carousels',
      'TikTok Shop Live Shopping Video Overlays & Sounds',
      'Brutalist Monospaced Instagram Story Drop Sequences',
      'Exclusive Drop Waitlist Telegram & DM Automation Links'
    ]
  },
  {
    id: 39,
    category: 'social',
    categoryLabel: 'Social Media Management',
    title: 'Aura Glow Clean Clinical Skincare Community & Ingredient Deep Dives',
    client: 'Aura Glow Dermaceuticals & Skin Lab',
    industry: 'Clean Dermatological Skincare & Barrier Repair Formulas',
    timeline: '90-Day Skin Education Retainer',
    tagline: 'Dermatologist-Approved Micro-Educational Carousels & Routine Reels Reduced Customer Acquisition Cost by 48%',
    tools: ['Instagram Reels', 'TikTok', 'CapCut Pro', 'Canva Pro', 'Figma', 'Planoly'],
    ownership: '100% Commercial Source Rights Handover & Video Assets',
    desc: 'Glass-skin routine reels, pipet dropper texture ASMR, and science-backed barrier repair carousels educating skincare enthusiasts.',
    problem: 'Skincare market overwhelmed by empty influencer claims, leading to consumer distrust and skyrocketing Facebook ad acquisition costs.',
    whatWeDid: 'Shifted focus to transparent science: created macro dropper texture videos, busted viral skincare myths with cosmetic chemistry facts, and documented 30-day barrier repair trials.',
    before: 'Skyrocketing $42 CAC on paid ads, low organic trust, high cart abandonment.',
    after: '48% reduction in organic blended customer acquisition cost, 1.9M educational video views, and 38,000 skincare routine saves.',
    results: [
      { num: '-48%', label: 'Customer Acquisition Cost' },
      { num: '1.9M', label: 'Educational Video Views' },
      { num: '38K', label: 'Routine Bookmark Saves' }
    ],
    clientQuote: 'They established us as dermatological authorities rather than just another beauty brand. Our organic sales have never been healthier.',
    quoteAuthor: 'Dr. Evelyn Ward, Lead Chemist at Aura Glow',
    image: 'assets/images/smm/skincare-serum.jpg',
    metrics: '-48% CAC • 1.9M Video Views',
    gallery: [
      { src: 'assets/images/smm/skincare-serum.jpg', title: 'Ceramide Barrier Texture Video', desc: 'Dropper Dispenser & Glass Skin Proof' },
      { src: 'assets/images/smm/desk_laptop_coffee_1791823735947.jpg', title: 'Ingredient Mythbusting Carousel', desc: 'Niacinamide vs Vitamin C Guide' }
    ],
    deliverables: [
      '22x Macro Skincare Application & Dropper Texture Reels',
      '12x Cosmetic Science & Ingredient Breakdown Carousels',
      'Weekly "Ask a Cosmetic Chemist" Interactive Stories',
      'UGC Dermatologist Review Aggregation & Reels Compilation',
      'Organic Skin Profile Quiz Instagram Link Integration'
    ]
  },
  {
    id: 40,
    category: 'social',
    categoryLabel: 'Social Media Management',
    title: 'Verdant Living Sustainable Home Essentials & Aesthetic Unboxings',
    client: 'Verdant Living Eco-Home Goods & Botanicals',
    industry: 'Zero-Waste Homeware, Linen Textiles & Botanical Living',
    timeline: '60-Day Green Lifestyle Sprint',
    tagline: 'Calming Earth-Tone Video Aesthetics & Unboxing Reels Generated 1.4M Views and $82K In First-Quarter Revenue',
    tools: ['Instagram Reels', 'TikTok', 'CapCut Pro', 'Lightroom Mobile', 'Figma', 'Later'],
    ownership: '100% Commercial Source Rights Handover & Video Assets',
    desc: 'Linen bedding sunlight timelapses, plant-care carousels, and plastic-free unboxings inspiring sustainable mindful home spaces.',
    problem: 'Eco-friendly homeware products perceived as bland or unrefined, leading to low repeat purchases and lackluster Instagram aesthetic.',
    whatWeDid: 'Crafted a serene earth-tone social aesthetic: filmed sunlit linen bedroom routines, designed botanical care carousels, and highlighted plastic-free kraft packaging unboxings.',
    before: 'Mismatched feed colors, low emotional engagement, $14K quarterly social sales.',
    after: '1.4M earth-tone aesthetic impressions, $82,000 in tracked first-quarter social revenue, and a 12.4% follower-to-buyer conversion rate.',
    results: [
      { num: '$82K', label: 'Tracked Social Revenue' },
      { num: '1.4M', label: 'Earth-Tone Impressions' },
      { num: '12.4%', label: 'Follower-to-Buyer Rate' }
    ],
    clientQuote: 'Create and Arise made sustainable living feel luxurious, peaceful, and desirable. Our sales skyrocketed while staying true to our eco values.',
    quoteAuthor: 'Hannah Lindqvist, Co-Founder of Verdant Living',
    image: 'assets/Mock ups/2.png',
    metrics: '$82K Revenue • 1.4M Views',
    gallery: [
      { src: 'assets/Mock ups/2.png', title: 'Zero-Waste Kraft Bag Unboxing', desc: '100% Recycled Packaging Showcase' },
      { src: 'assets/images/smm/healthy-bowl.jpg', title: 'Eco Kitchen Routine Reel', desc: 'Linen Napkin & Sustainable Storage' }
    ],
    deliverables: [
      '18x Sunlit Home Routine & Textile Movement Reels',
      '8x Botanical Care & Non-Toxic Cleaning Carousels',
      'Aesthetic Earth-Tone Color Palette Curation Guide',
      'Zero-Waste Packaging ASMR Unboxing Reel Series',
      'Monthly E-Commerce Checkout Attribution Analytics'
    ]
  },
  {
    id: 41,
    category: 'social',
    categoryLabel: 'Social Media Management',
    title: 'Komorebi Pottery Studio Artisanal Clay ASMR & Workshop Reels',
    client: 'Komorebi Ceramic Arts & Workshop Studio',
    industry: 'Handcrafted Ceramics, Wheel Throwing Classes & Home Decor',
    timeline: '4-Month Cultural & Class Retainer',
    tagline: 'Hypnotic Wheel-Throwing Reels & Glaze Kiln Reveals Booked Out 6 Months of Private Pottery Classes',
    tools: ['Instagram Reels', 'TikTok', 'CapCut Pro', 'Lightroom Mobile', 'Canva Pro', 'Figma'],
    ownership: '100% Commercial Source Rights Handover & Video Assets',
    desc: 'Hypnotic wheel-spinning ASMR, clay trimming ribbon curls, and kiln opening reveals captivating millions of craft enthusiasts worldwide.',
    problem: 'Pottery studio struggled to fill weekday wheel-throwing workshops, relying on unpredictable walk-ins and local word of mouth.',
    whatWeDid: 'Captured the meditative beauty of ceramic craft: produced soothing wheel-throwing ASMR reels, filmed kiln-opening reaction videos, and built an automated DM booking workflow for weekend workshops.',
    before: '50% empty studio benches, irregular social updates, low workshop pre-bookings.',
    after: '6 consecutive months of sold-out private and group pottery classes, 3.4M viral ASMR views, and over 22,000 direct booking inquiries.',
    results: [
      { num: '6 Mo.', label: 'Sold-Out Classes Advance' },
      { num: '3.4M', label: 'Clay Craft ASMR Views' },
      { num: '22K+', label: 'Direct Booking Inquiries' }
    ],
    clientQuote: 'Our pottery wheels have never stopped spinning. People watch our soothing reels and immediately book workshops for dates, birthdays, and gifts.',
    quoteAuthor: 'Sora Tanaka, Ceramic Artist at Komorebi Studio',
    image: 'assets/Mock ups/9.png',
    metrics: '6 Mos Booked • 3.4M Views',
    gallery: [
      { src: 'assets/Mock ups/9.png', title: 'Signature Glazed Ceramic Mug', desc: 'Kiln Unloading ASMR & Golden Hour Cup' },
      { src: 'assets/Mock ups/5.png', title: 'Clay Trimming Close-Up Video', desc: 'Spun Clay Ribbon Shaving Macro' }
    ],
    deliverables: [
      '20x Meditative Clay Wheel & Trimming ASMR Reels',
      '10x Glazing & Kiln Reveal Multi-Slide Carousel Posts',
      'Automated ManyChat DM Class Booking Response System',
      'Weekly Student Creation Showcase Stories & Tags',
      'High-Resolution Studio Ceramic Photography Catalog'
    ]
  },
  {
    id: 42,
    category: 'social',
    categoryLabel: 'Social Media Management',
    title: 'Volt Urban Electric Mobility & Micro-Transit Reels',
    client: 'Volt Mobility Lab (Electric Commuter & Micro-Transit)',
    industry: 'Clean Tech, Electric Micro-Mobility & Urban E-Bikes',
    timeline: '90-Day City Commute Campaign',
    tagline: 'POV City Commuter Reels & Carbon-Offset Graphic Carousels Drove 1,800 Pre-Orders for Generation II E-Commuter',
    tools: ['Instagram Reels', 'TikTok', 'CapCut Pro', 'GoPro Hero12', 'Figma', 'Hootsuite'],
    ownership: '100% Commercial Source Rights Handover & Video Assets',
    desc: 'Fast-paced first-person urban commute reels, bypass-the-traffic timelapses, and sleek electric micro-mobility hardware reels built for metropolitan professionals.',
    problem: 'Launching a premium $1,600 electric commuter bike struggling to stand out from cheap imported scooters, with zero organic video presence.',
    whatWeDid: 'Positioned Volt as the modern professional’s commute superpower: filmed side-by-side subway vs. e-bike race videos, created battery range stress tests, and showcased seamless minimalist folding mechanisms.',
    before: 'Low brand credibility, under 1,000 views per post, high pre-order hesitation.',
    after: '1,800 paid pre-orders secured, 3.8M organic reel views across metropolitan commuter hashtags, and 420+ dealer test-ride bookings.',
    results: [
      { num: '1,800', label: 'Paid Pre-Orders' },
      { num: '3.8M', label: 'Commuter Video Views' },
      { num: '420+', label: 'Dealer Test Rides' }
    ],
    clientQuote: 'The subway vs. e-bike race reel was genius and went completely viral in three major cities. Create and Arise made urban mobility look exhilarating and essential.',
    quoteAuthor: 'Julian Sterling, Founder & Lead Engineer at Volt Mobility',
    image: 'assets/images/urban-mobility.jpg',
    metrics: '1.8K Pre-Orders • 3.8M Views',
    gallery: [
      { src: 'assets/images/urban-mobility.jpg', title: 'Urban Commuter POV Ride', desc: 'Bypassing Rush Hour Traffic in 4K 60fps' },
      { src: 'assets/images/smm/mountain-runner.jpg', title: 'Weatherproof Rain Test Reel', desc: 'IP67 Waterproof Electronics Proof' }
    ],
    deliverables: [
      '20x Fast-Paced Metropolitan Commute POV Reels',
      '8x Commute Cost vs Subway Savings Educational Carousels',
      'Interactive City Commute Time Calculator Stories',
      'Local Urban Bike Shop Partner Repost & Co-Marketing Hub',
      'Pre-Order Milestone Countdown & Backer Update Social Kit'
    ]
  },
  {
    id: 43,
    category: 'social',
    categoryLabel: 'Social Media Management',
    title: 'Atelier Lumière Fine Jewelry & Diamond Studio Macro Reels',
    client: 'Atelier Lumière Fine Jewelry & Haute Joaillerie',
    industry: 'Bespoke Solid Gold Jewelry, Conflict-Free Diamonds & Heirloom Craft',
    timeline: '4-Month Luxury Artisan Retainer',
    tagline: 'Macro Diamond Facet Sparkle Reels & Hand-Engraving Videos Generated $340K in Custom Engagement Ring Commissions',
    tools: ['Instagram Reels', 'TikTok', 'CapCut Pro', 'Macro Lens Rig', 'Figma', 'Later'],
    ownership: '100% Commercial Source Rights Handover & Video Assets',
    desc: '4K microscopic diamond prong setting, liquid gold melting crucibles, and bespoke heirloom engagement ring reveals captivating luxury buyers worldwide.',
    problem: 'Independent master jeweler creating museum-grade engagement rings but relying solely on referrals, with no modern digital presence to attract affluent millennials.',
    whatWeDid: 'Captured the hypnotic intimacy of high jewelry: filmed 100x macro diamond facet light refractions, documented custom wax carving for bespoke clients, and built a private VIP DM consultation concierge.',
    before: 'Only 2-3 custom orders/month, 80 followers on Instagram, invisible to international buyers.',
    after: '$340,000 in custom engagement ring commissions in 4 months, 4.6M views on hand-engraving reels, and a 6-month bespoke design waiting list.',
    results: [
      { num: '$340K', label: 'Custom Ring Commissions' },
      { num: '4.6M', label: 'Macro Jewelry Views' },
      { num: '6 Mo.', label: 'Custom Commission Waitlist' }
    ],
    clientQuote: 'The macro sparkle and craftsmanship they captured took our breath away. Clients now fly across the country and message us on Instagram to craft their forever rings.',
    quoteAuthor: 'Claire & Antoine Delacroix, Master Jewelers at Atelier Lumière',
    image: 'assets/images/smm/luxury-jewelry.jpg',
    metrics: '$340K Commissions • 4.6M Views',
    gallery: [
      { src: 'assets/images/smm/luxury-jewelry.jpg', title: 'Diamond Solitaire Light Refraction', desc: '4K Macro Facet Sparkle & Solid Gold Band' },
      { src: 'assets/Mock ups/12.png', title: 'Luxury Velvet Box Presentation', desc: 'Heirloom Packaging & Wax Seal Certificate' }
    ],
    deliverables: [
      '24x Micro-Macro Diamond Prong Setting & Gemstone Sparkle Reels',
      '12x Conflict-Free Diamond Grading & Gold Carat Guides',
      'Private VIP Direct Message Consultation Booking Workflow',
      'Luxury Velvet & Golden Light Editorial 9-Grid Layout Strategy',
      'Custom Wedding Band Pairings & Story Highlight Archive'
    ]
  }
];

function initPortfolio() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioGrid = document.getElementById('portfolioGrid');
  const matrixContainer = document.getElementById('portfolioMatrixView');
  const viewModeBtns = document.querySelectorAll('.view-mode-btn');
  const searchInput = document.getElementById('portfolioSearchInput');
  const searchClear = document.getElementById('portfolioSearchClear');
  const countText = document.getElementById('portfolioCountText');
  const resetFilterBtn = document.getElementById('portfolioResetFilterBtn');
  const quickTagChips = document.querySelectorAll('.quick-tag-chip');
  const dropdownBox = document.getElementById('portfolioDropdown');
  const dropdownTrigger = document.getElementById('portfolioDropdownTrigger');
  const dropdownTriggerIcon = document.getElementById('dropdownTriggerIcon');
  const dropdownTriggerText = document.getElementById('dropdownTriggerText');
  const dropdownTriggerCount = document.getElementById('dropdownTriggerCount');

  let currentFilter = 'all';
  let currentSearchQuery = '';
  let currentViewMode = 'grid'; // 'grid' or 'matrix'

  function openCategoryDropdown() {
    if (dropdownBox) {
      dropdownBox.classList.add('is-open');
      dropdownTrigger?.setAttribute('aria-expanded', 'true');
    }
  }

  function closeCategoryDropdown() {
    if (dropdownBox) {
      dropdownBox.classList.remove('is-open');
      dropdownTrigger?.setAttribute('aria-expanded', 'false');
    }
  }

  function toggleCategoryDropdown() {
    if (dropdownBox && dropdownBox.classList.contains('is-open')) {
      closeCategoryDropdown();
    } else {
      openCategoryDropdown();
    }
  }

  function syncDropdownTrigger(filterVal) {
    const targetItem = document.querySelector(`.portfolio-dropdown-item[data-filter="${filterVal}"]`);
    if (targetItem) {
      const icon = targetItem.querySelector('.filter-icon')?.textContent || '✦';
      const label = targetItem.querySelector('.dropdown-item-label')?.textContent || 'All Work';
      const count = targetItem.querySelector('.filter-count')?.textContent || portfolioData.length;

      if (dropdownTriggerIcon) dropdownTriggerIcon.textContent = icon;
      if (dropdownTriggerText) dropdownTriggerText.textContent = label;
      if (dropdownTriggerCount) dropdownTriggerCount.textContent = count;
    }
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  function getFilteredData() {
    return portfolioData.filter(item => {
      const matchesCategory = currentFilter === 'all' || item.category === currentFilter;
      if (!matchesCategory) return false;

      if (!currentSearchQuery) return true;

      const q = currentSearchQuery.toLowerCase().trim();
      const matchInTitle = item.title && item.title.toLowerCase().includes(q);
      const matchInClient = item.client && item.client.toLowerCase().includes(q);
      const matchInIndustry = item.industry && item.industry.toLowerCase().includes(q);
      const matchInDesc = item.desc && item.desc.toLowerCase().includes(q);
      const matchInTagline = item.tagline && item.tagline.toLowerCase().includes(q);
      const matchInMetrics = item.metrics && item.metrics.toLowerCase().includes(q);
      const matchInTools = item.tools && item.tools.some(t => t.toLowerCase().includes(q));
      const matchInCategory = item.categoryLabel && item.categoryLabel.toLowerCase().includes(q);

      return matchInTitle || matchInClient || matchInIndustry || matchInDesc || matchInTagline || matchInMetrics || matchInTools || matchInCategory;
    });
  }

  function resetAllFilters() {
    currentFilter = 'all';
    currentSearchQuery = '';
    if (searchInput) searchInput.value = '';
    if (searchClear) searchClear.style.display = 'none';

    filterBtns.forEach(b => {
      const isAll = b.getAttribute('data-filter') === 'all';
      b.classList.toggle('active', isAll);
      b.setAttribute('aria-selected', isAll ? 'true' : 'false');
    });

    syncDropdownTrigger('all');
    closeCategoryDropdown();

    quickTagChips.forEach(c => c.classList.remove('active'));
    renderPortfolio();
  }

  function updateStatusFeedback(totalShown) {
    if (countText) {
      if (currentSearchQuery) {
        countText.innerHTML = `Found <strong>${totalShown}</strong> project${totalShown === 1 ? '' : 's'} matching "<em>${escapeHTML(currentSearchQuery)}</em>"`;
      } else if (currentFilter !== 'all') {
        const catMap = {
          branding: 'Graphics &amp; Branding',
          web: 'Web Design &amp; Dev',
          ads: 'Digital Ads',
          social: 'Social Media'
        };
        const catName = catMap[currentFilter] || currentFilter;
        countText.innerHTML = `Showing <strong>${totalShown}</strong> in <strong>${catName}</strong>`;
      } else {
        countText.innerHTML = `Showing <strong>${totalShown}</strong> verified case studies`;
      }
    }

    if (resetFilterBtn) {
      if (currentFilter !== 'all' || currentSearchQuery !== '') {
        resetFilterBtn.style.display = 'inline-flex';
      } else {
        resetFilterBtn.style.display = 'none';
      }
    }

    quickTagChips.forEach(chip => {
      const tag = chip.getAttribute('data-tag');
      if (tag && currentSearchQuery.toLowerCase() === tag.toLowerCase()) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  function renderPortfolio() {
    if (!portfolioGrid) return;

    const filtered = getFilteredData();
    updateStatusFeedback(filtered.length);

    if (filtered.length === 0) {
      portfolioGrid.innerHTML = `
        <div class="portfolio-empty-state" style="grid-column: 1 / -1; text-align: center; padding: 4rem 1.5rem; background: var(--bg-surface-elevated); border: 1px dashed var(--border-subtle); border-radius: var(--radius-lg);">
          <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🔍</div>
          <h4 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-main);">No matching projects found</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem; max-width: 450px; margin: 0 auto 1.5rem;">
            We couldn't find any case studies matching "${escapeHTML(currentSearchQuery)}". Try adjusting your keywords or clearing filters.
          </p>
          <button type="button" class="btn btn-secondary btn-sm" id="resetPortfolioSearchBtn">
            <span>Reset Filters &amp; Search</span>
          </button>
        </div>
      `;

      const resetBtn = document.getElementById('resetPortfolioSearchBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', resetAllFilters);
      }
    } else {
      portfolioGrid.innerHTML = filtered.map(item => `
        <article class="portfolio-card" data-id="${item.id}" data-category="${item.category}" tabindex="0" role="button" aria-label="Present case study for ${item.title}">
          <div class="portfolio-thumb-wrapper">
            <img src="${item.image}" alt="${item.title}" class="portfolio-img" loading="lazy">
            <div class="portfolio-overlay">
              ${item.liveUrl ? `
                <a href="${item.liveUrl}" target="_blank" rel="noopener noreferrer" class="portfolio-quick-live-btn" onclick="event.stopPropagation();" title="Visit live website in new tab">
                  <span>🚀 Visit Website ↗</span>
                </a>
              ` : ''}
            </div>
            <div class="portfolio-badges-top">
              <span class="portfolio-badge">${item.categoryLabel || item.category.toUpperCase()}</span>
              ${item.liveUrl ? `
                <span class="portfolio-live-chip"><span class="pulse-dot"></span> Live Project</span>
              ` : `
                <span class="portfolio-timeline-badge">${item.timeline}</span>
              `}
            </div>
          </div>
          <div class="portfolio-info">
            <div class="portfolio-client-row">
              <span class="portfolio-client">${item.client}</span>
              <span class="portfolio-verified-badge">✓ Verified Output</span>
            </div>
            <h3 class="portfolio-title">${item.title}</h3>
            <p class="portfolio-desc">${item.desc}</p>

            ${item.clientQuote ? `
              <div class="portfolio-client-review-snip">
                <span class="review-quote-star">★ 5.0 Client Review</span>
                <span class="review-quote-snippet">&ldquo;${escapeHTML(item.clientQuote.length > 95 ? item.clientQuote.slice(0, 92) + '...' : item.clientQuote)}&rdquo;</span>
                <span class="review-quote-by">&mdash; ${escapeHTML(item.quoteAuthor)}</span>
              </div>
            ` : ''}
            
            <div class="portfolio-tools-row">
              ${item.tools.map(t => `<span class="portfolio-tool-tag">${t}</span>`).join('')}
            </div>

            <div class="portfolio-metrics">
              <div class="metric-badge">
                <span>🚀</span>
                <strong>${item.metrics}</strong>
              </div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                ${item.liveUrl ? `
                  <a href="${item.liveUrl}" target="_blank" rel="noopener noreferrer" class="card-inline-live-link" onclick="event.stopPropagation();" title="Visit live website">
                    <span>Live ↗</span>
                  </a>
                ` : ''}
                <span class="view-case-btn">Deep Dive &rarr;</span>
              </div>
            </div>
          </div>
        </article>
      `).join('');

      // Attach click listeners to cards
      document.querySelectorAll('.portfolio-card').forEach(card => {
        card.addEventListener('click', () => {
          const id = parseInt(card.getAttribute('data-id'));
          const item = portfolioData.find(p => p.id === id);
          if (item) openPortfolioModal(item);
        });
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const id = parseInt(card.getAttribute('data-id'));
            const item = portfolioData.find(p => p.id === id);
            if (item) openPortfolioModal(item);
          }
        });
      });
    }

    renderMatrixTable(filtered);
  }

  function renderMatrixTable(items) {
    if (!matrixContainer) return;
    if (items.length === 0) {
      matrixContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem 1.5rem; color: var(--text-muted);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔍</div>
          <p style="margin-bottom: 1rem;">No case studies match the current search criteria in Table View.</p>
          <button type="button" class="btn btn-secondary btn-sm" id="matrixResetBtn">
            <span>Reset Filters</span>
          </button>
        </div>
      `;
      const mReset = document.getElementById('matrixResetBtn');
      if (mReset) mReset.addEventListener('click', resetAllFilters);
      return;
    }

    matrixContainer.innerHTML = `
      <div class="matrix-banner">
        <div class="matrix-banner-text">
          <span class="matrix-banner-icon">📋</span>
          <div>
            <strong>Executive ROI &amp; Scope Matrix</strong>
            <p>Comparing client starting bottlenecks, studio execution, and commercial results side-by-side.</p>
          </div>
        </div>
        <button type="button" class="btn btn-secondary btn-sm" id="matrixBackToGridBtn">
          <span>⊞ Switch to Visual Gallery</span>
        </button>
      </div>
      <div class="matrix-table-wrapper">
        <table class="matrix-table">
          <thead>
            <tr>
              <th>Client &amp; Scope</th>
              <th>Discipline</th>
              <th>Starting Bottleneck</th>
              <th>Create &amp; Arise Execution</th>
              <th>Commercial ROI Result</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td>
                  <strong>${item.client}</strong>
                  <div style="font-size: 0.78rem; color: var(--text-subtle); margin-top: 0.2rem;">${item.timeline}</div>
                </td>
                <td>
                  <span class="portfolio-badge" style="position: static; display: inline-block;">${item.categoryLabel}</span>
                </td>
                <td style="max-width: 220px; font-size: 0.82rem; color: var(--text-muted);">
                  ${item.problem}
                </td>
                <td style="max-width: 250px; font-size: 0.82rem; color: var(--text-main);">
                  ${item.whatWeDid}
                </td>
                <td>
                  <span class="matrix-roi-chip">&#128640; ${item.metrics}</span>
                </td>
                <td>
                  <div style="display: flex; gap: 0.35rem; align-items: center;">
                    <button type="button" class="btn btn-secondary btn-sm" onclick="openCaseStudyById(${item.id})">
                      <span>Present</span>
                    </button>
                    ${item.liveUrl ? `
                      <a href="${item.liveUrl}" target="_blank" rel="noopener noreferrer" class="card-inline-live-link" title="Visit live website">
                        <span>Live ↗</span>
                      </a>
                    ` : ''}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    const backToGridBtn = document.getElementById('matrixBackToGridBtn');
    if (backToGridBtn) {
      backToGridBtn.addEventListener('click', () => {
        const gridBtn = document.querySelector('.view-mode-btn[data-view="grid"]');
        if (gridBtn) gridBtn.click();
      });
    }
  }

  // Filter Category Dropdown Trigger Toggle
  if (dropdownTrigger) {
    dropdownTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleCategoryDropdown();
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (dropdownBox && !dropdownBox.contains(e.target)) {
      closeCategoryDropdown();
    }
  });

  // Close dropdown on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCategoryDropdown();
    }
  });

  // Filter Category Buttons (Dropdown Options)
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      currentFilter = btn.getAttribute('data-filter') || 'all';

      syncDropdownTrigger(currentFilter);
      closeCategoryDropdown();
      renderPortfolio();
    });

    // Arrow navigation support
    btn.addEventListener('keydown', (e) => {
      const items = Array.from(filterBtns);
      const index = items.indexOf(btn);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = items[(index + 1) % items.length];
        next.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = items[(index - 1 + items.length) % items.length];
        prev.focus();
      }
    });
  });

  // Reset Button
  if (resetFilterBtn) {
    resetFilterBtn.addEventListener('click', resetAllFilters);
  }

  // Quick Discovery Tags
  quickTagChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const tag = chip.getAttribute('data-tag');
      if (!tag) return;
      if (currentSearchQuery.toLowerCase() === tag.toLowerCase()) {
        // Toggle off
        currentSearchQuery = '';
        if (searchInput) searchInput.value = '';
        if (searchClear) searchClear.style.display = 'none';
      } else {
        currentSearchQuery = tag;
        if (searchInput) searchInput.value = tag;
        if (searchClear) searchClear.style.display = 'block';
      }
      renderPortfolio();
    });
  });

  // Real-time Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      if (searchClear) {
        searchClear.style.display = currentSearchQuery.length > 0 ? 'block' : 'none';
      }
      renderPortfolio();
    });
  }

  // Search Clear Button
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      currentSearchQuery = '';
      searchClear.style.display = 'none';
      if (searchInput) searchInput.focus();
      renderPortfolio();
    });
  }

  // View Mode Switcher (Grid vs Matrix)
  viewModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewModeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentViewMode = btn.getAttribute('data-view');

      if (currentViewMode === 'matrix') {
        if (portfolioGrid) portfolioGrid.style.display = 'none';
        if (matrixContainer) matrixContainer.style.display = 'block';
      } else {
        if (portfolioGrid) portfolioGrid.style.display = 'grid';
        if (matrixContainer) matrixContainer.style.display = 'none';
      }
    });
  });

  // Dynamically update filter count chips based on actual data
  filterBtns.forEach(btn => {
    const f = btn.getAttribute('data-filter');
    const countEl = btn.querySelector('.filter-count');
    if (countEl) {
      if (f === 'all') {
        countEl.textContent = portfolioData.length;
      } else {
        countEl.textContent = portfolioData.filter(p => p.category === f).length;
      }
    }
  });

  syncDropdownTrigger(currentFilter);

  renderPortfolio();
}

window.openCaseStudyById = function (id) {
  const item = portfolioData.find(p => p.id === parseInt(id));
  if (item) {
    openPortfolioModal(item);
  }
};

function openPortfolioModal(item) {
  const modal = document.getElementById('portfolioModal');
  const modalBody = document.getElementById('portfolioModalBody');
  const modalCard = modal ? modal.querySelector('.modal-card') : null;
  if (!modal || !modalBody) return;

  if (modalCard) {
    modalCard.classList.add('modal-case-study');
  }

  modalBody.innerHTML = `
    <!-- Top Presentation Header -->
    <div class="cs-presentation-header">
      <div class="cs-badge-row">
        <div class="cs-tag-group">
          <span class="section-tag" style="margin-bottom: 0;">${item.categoryLabel.toUpperCase()} &bull; CASE STUDY</span>
          <span class="cs-timeline-chip">⏱️ ${item.timeline}</span>
          <span class="cs-verified-chip">&#10003; Verified Client Output</span>
          ${item.liveUrl ? `
            <a href="${item.liveUrl}" target="_blank" rel="noopener noreferrer" class="cs-live-url-chip" title="Open Live Website">
              <span class="pulse-dot"></span>
              <span>Live: <strong>${item.liveUrl.replace('https://', '')}</strong></span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          ` : ''}
        </div>
        <span class="cs-top-metric-chip">&#128640; ${item.metrics}</span>
      </div>

      <h2 class="cs-modal-title">${item.title}</h2>
      <p class="cs-modal-client"><strong>Client:</strong> ${item.client} &bull; <em>${item.industry}</em></p>
    </div>

    <!-- High-Definition Hero Showcase Banner -->
    <div class="cs-image-header">
      <div class="cs-image-stage">
        <img id="csModalHeroImg" src="${item.image}" alt="${item.title}">
      </div>
      <div class="cs-image-tagline">
        <span id="csModalHeroCaption">${item.tagline}</span>
        <span class="cs-ownership-badge">&#128274; 100% Commercial Source Rights Handover</span>
      </div>
    </div>

    <!-- 3-Pill Executive ROI Metric Counters -->
    <div class="cs-results-grid">
      ${item.results.map(r => `
        <div class="cs-result-item">
          <div class="cs-result-num">${r.num}</div>
          <div class="cs-result-lbl">${r.label}</div>
        </div>
      `).join('')}
    </div>

    <!-- 1. Client Problem vs 2. What We Executed -->
    <div class="cs-two-col">
      <div class="cs-problem-card">
        <div class="cs-section-heading">
          <span>⚠️</span> <span>Client Bottleneck &amp; Problem</span>
        </div>
        <p class="cs-card-text">${item.problem}</p>
      </div>
      <div class="cs-solution-card">
        <div class="cs-section-heading">
          <span>⚡</span> <span>Create &amp; Arise Strategic Execution</span>
        </div>
        <p class="cs-card-text">${item.whatWeDid}</p>
      </div>
    </div>

    <!-- 3. Before vs After Direct Comparison -->
    <div class="cs-ba-box">
      <h4 class="cs-box-title">
        <span>🔄</span> <span>Direct Transformation: Pre-Partnership vs. Post-Launch</span>
      </h4>
      <div class="ba-comparison-grid" style="margin-bottom: 0;">
        <div class="ba-col before">
          <div class="ba-label">❌ Pre-Partnership Bottlenecks</div>
          <p style="margin: 0; line-height: 1.6;">${item.before}</p>
        </div>
        <div class="ba-col after">
          <div class="ba-label">✨ Post-Launch Commercial Outcomes</div>
          <p style="margin: 0; line-height: 1.6;">${item.after}</p>
        </div>
      </div>
    </div>

    <!-- 4. Deliverables & Tool Stack -->
    <div class="cs-deliverables-box">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
        <h4 class="cs-box-title" style="margin-bottom: 0;">
          <span>📦</span> <span>Deliverables Handed Over:</span>
        </h4>
        <div class="cs-tools-pills">
          ${item.tools.map(t => `<span class="cs-tool-badge">${t}</span>`).join('')}
        </div>
      </div>
      <div class="cs-deliverables-grid">
        ${item.deliverables.map(d => `<div class="cs-deliv-item"><span>&#10003;</span> ${d}</div>`).join('')}
      </div>
    </div>

    <!-- 4.5. Multi-Asset Brand Mockup Gallery (When available) -->
    ${item.gallery && item.gallery.length ? `
      <div class="cs-gallery-box">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.85rem;">
          <h4 class="cs-box-title" style="margin-bottom: 0;">
            <span>🎨</span> <span>Brand Collateral &amp; Physical Mockups Suite (${item.gallery.length} Assets)</span>
          </h4>
          <span style="font-size: 0.75rem; color: var(--text-gold); font-weight: 600;">✨ Click any asset to preview</span>
        </div>
        <div class="cs-mockup-gallery-grid">
          ${item.gallery.map(g => `
            <div class="cs-mockup-item" onclick="swapModalHeroImage('${g.src}', '${g.title.replace(/'/g, "\\'")}')" role="button" tabindex="0" title="Click to view ${g.title}">
              <div class="cs-mockup-thumb">
                <img src="${g.src}" alt="${g.title}" loading="lazy">
              </div>
              <div class="cs-mockup-meta">
                <strong>${g.title}</strong>
                <span>${g.desc}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <!-- 5. Verified Client Testimonial -->
    ${item.clientQuote ? `
      <div class="cs-testimonial-box">
        <div class="cs-quote-header">
          <div class="cs-quote-stars">&#9733;&#9733;&#9733;&#9733;&#9733; 5.0 Verified Review</div>
          <span class="cs-quote-chip">&#10003; Verified Stakeholder</span>
        </div>
        <p class="cs-quote-text">&ldquo;${item.clientQuote}&rdquo;</p>
        <div class="cs-quote-author">&mdash; ${item.quoteAuthor}</div>
      </div>
    ` : ''}

    <!-- Modal Presentation Action Ribbons -->
    <div class="cs-actions">
      ${item.liveUrl ? `
        <a href="${item.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-glow cs-live-cta-btn">
          <span>🚀 Launch Live Platform (${item.liveUrl.replace('https://', '')})</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
      ` : ''}
      <button class="btn ${item.liveUrl ? 'btn-secondary' : 'btn-primary btn-glow'}" onclick="requestSimilarProject('${item.title.replace(/'/g, "\\'")}')">
        <span>Inquire For A Similar Project</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      </button>
      <button class="btn btn-book-call" onclick="closeModal('portfolioModal'); openBookCallModal();">
        <span>📅 Book a Free Strategy Call</span>
      </button>
      <button class="btn btn-secondary" onclick="closeModal('portfolioModal')">
        <span>Close Presentation</span>
      </button>
    </div>
  `;

  modal.classList.add('active');
}

window.swapModalHeroImage = function (src, title) {
  const heroImg = document.getElementById('csModalHeroImg') || document.querySelector('.cs-image-header img');
  const taglineSpan = document.getElementById('csModalHeroCaption') || document.querySelector('.cs-image-tagline span:first-child');
  if (heroImg) {
    heroImg.style.opacity = '0.3';
    setTimeout(() => {
      heroImg.src = src;
      heroImg.alt = title;
      heroImg.style.opacity = '1';
    }, 120);
    const stage = document.querySelector('.cs-image-stage');
    if (stage) stage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  if (taglineSpan && title) {
    taglineSpan.textContent = `Viewing: ${title}`;
  }
  showToast(`🔍 Previewing ${title}`);
};

window.requestSimilarProject = function (projectName) {
  closeModal('portfolioModal');
  const messageInput = document.getElementById('contactMessage');
  if (messageInput) {
    messageInput.value = `Hi Create and Arise team! I saw your case study on "${projectName}" and would like to discuss a similar project for my brand.`;
  }
  if (window.switchTab) {
    window.switchTab('contact');
  }
  showToast(`✨ Pre-filled inquiry for "${projectName}"`);
};

/* --------------------------------------------------------------------------
   5. Interactive Project Cost & Package Estimator
   -------------------------------------------------------------------------- */
const exchangeRates = {
  USD: { symbol: '$', rate: 1, suffix: 'USD' },
  PHP: { symbol: '₱', rate: 58, suffix: 'PHP' },
  AUD: { symbol: 'A$', rate: 1.55, suffix: 'AUD' },
  EUR: { symbol: '€', rate: 0.92, suffix: 'EUR' },
  GBP: { symbol: '£', rate: 0.78, suffix: 'GBP' }
};

const serviceBasePrices = {
  graphics: { name: 'Graphic Design & Brand Identity', usd: 450, short: 'Graphics' },
  web: { name: 'Web Design & Responsive Development', usd: 750, short: 'Web Design' },
  ads: { name: 'Digital Ads & Campaign Marketing', usd: 500, short: 'Digital Ads' },
  social: { name: 'Social Media Content Management', usd: 450, short: 'Social Media' }
};

const timelineMultipliers = {
  standard: { multiplier: 1.0, label: 'Standard (2–3 Weeks)' },
  express: { multiplier: 1.3, label: 'Express Priority (7 Days)' },
  retainer: { multiplier: 0.9, label: 'Monthly Creative Retainer (-10%)' }
};

function initCostCalculator() {
  const serviceCheckboxes = document.querySelectorAll('.calc-service-checkbox');
  const timelineRadios = document.querySelectorAll('input[name="calc_timeline"]');
  const currencySelect = document.getElementById('calcCurrency');
  const estAmountEl = document.getElementById('estAmount');
  const selectedListEl = document.getElementById('selectedServicesList');
  const applyEstimateBtn = document.getElementById('applyEstimateBtn');

  window.runCalculator = function () {
    let baseUsd = 0;
    let selectedItems = [];

    serviceCheckboxes.forEach(cb => {
      const card = cb.closest('.calc-option-card');
      if (cb.checked) {
        if (card) card.classList.add('selected');
        const sKey = cb.value;
        const sObj = serviceBasePrices[sKey];
        if (sObj) {
          baseUsd += sObj.usd;
          selectedItems.push(sObj);
        }
      } else {
        if (card) card.classList.remove('selected');
      }
    });

    let selectedTimeline = 'standard';
    timelineRadios.forEach(r => {
      const card = r.closest('.calc-option-card');
      if (r.checked) {
        if (card) card.classList.add('selected');
        selectedTimeline = r.value;
      } else {
        if (card) card.classList.remove('selected');
      }
    });

    const curr = currencySelect ? currencySelect.value : 'USD';
    const rateInfo = exchangeRates[curr] || exchangeRates.USD;
    const timelineInfo = timelineMultipliers[selectedTimeline] || timelineMultipliers.standard;

    const totalUsd = Math.round(baseUsd * timelineInfo.multiplier);
    const convertedTotal = Math.round(totalUsd * rateInfo.rate);

    if (estAmountEl) {
      if (totalUsd === 0) {
        estAmountEl.textContent = `${rateInfo.symbol}0`;
      } else {
        estAmountEl.textContent = `${rateInfo.symbol}${convertedTotal.toLocaleString()}`;
      }
    }

    if (selectedListEl) {
      if (selectedItems.length === 0) {
        selectedListEl.innerHTML = '<p style="color: var(--text-subtle); font-size: 0.85rem; font-style: italic;">Select one or more services above to see itemized package...</p>';
      } else {
        selectedListEl.innerHTML = selectedItems.map(item => {
          const itemPrice = Math.round(item.usd * rateInfo.rate);
          return `
            <div class="selected-item-row">
              <span>&#10003; ${item.name}</span>
              <strong style="color: var(--text-main);">${rateInfo.symbol}${itemPrice.toLocaleString()}</strong>
            </div>
          `;
        }).join('') + `
          <div class="selected-item-row" style="border-top: 1px dashed var(--border-subtle); padding-top: 0.5rem; margin-top: 0.5rem; color: var(--color-primary);">
            <span>Pacing: ${timelineInfo.label}</span>
          </div>
        `;
      }
    }

    // Update One-Tap Mobile Direct Fast Track Buttons
    const quickWa = document.getElementById('calcQuickWaBtn');
    const quickMail = document.getElementById('calcQuickMailBtn');
    const serviceNames = selectedItems.map(s => s.name).join(', ') || 'Selected Creative Services';
    const finalAmountStr = estAmountEl ? estAmountEl.textContent : '$1,200';

    if (quickWa) {
      quickWa.href = `https://wa.me/639274682635?text=${encodeURIComponent(`Hi Jerome & Create and Arise! I configured a custom package with your Cost Estimator: ${serviceNames} (~${finalAmountStr}, ${timelineInfo.label}). I would love to connect!`)}`;
    }
    if (quickMail) {
      quickMail.href = `mailto:createandarise05@gmail.com?subject=${encodeURIComponent(`[Estimate Inquiry] ${serviceNames} (${finalAmountStr})`)}&body=${encodeURIComponent(`Hi Jerome & Create and Arise Team,\n\nI just configured an estimate using your Cost Estimator:\n• Services: ${serviceNames}\n• Timeline Pacing: ${timelineInfo.label}\n• Estimated Investment: ~${finalAmountStr} (${rateInfo.suffix})\n\nPlease email my formal proposal and let's get started!\n\nBest regards,`)}`;
    }
  };

  serviceCheckboxes.forEach(cb => {
    cb.addEventListener('change', window.runCalculator);
    cb.addEventListener('input', window.runCalculator);
  });
  timelineRadios.forEach(r => {
    r.addEventListener('change', window.runCalculator);
    r.addEventListener('input', window.runCalculator);
  });
  if (currencySelect) {
    currencySelect.addEventListener('change', window.runCalculator);
    currencySelect.addEventListener('input', window.runCalculator);
  }

  // Global helper to extract current calculated scope
  window.getCalculatedScope = function () {
    const selectedServices = Array.from(serviceCheckboxes).filter(cb => cb.checked).map(cb => serviceBasePrices[cb.value]?.name).filter(Boolean);
    let selectedTimeline = 'standard';
    timelineRadios.forEach(r => {
      if (r.checked) selectedTimeline = r.value;
    });
    const curr = currencySelect ? currencySelect.value : 'USD';
    const rateInfo = exchangeRates[curr] || exchangeRates.USD;
    const timelineInfo = timelineMultipliers[selectedTimeline] || timelineMultipliers.standard;
    const amountText = estAmountEl ? estAmountEl.textContent : '$1,200';
    return {
      services: selectedServices,
      timeline: timelineInfo,
      currency: { ...rateInfo, code: curr },
      amountText: amountText
    };
  };

  // Global handler to open estimate modal with configured scope
  window.openEstimateModal = function () {
    const scope = window.getCalculatedScope();
    if (!scope.services || scope.services.length === 0) {
      if (typeof showToast === 'function') {
        showToast('Please select at least one service in the calculator.');
      }
      return;
    }

    const modalAmount = document.getElementById('modalEstAmount');
    const modalServices = document.getElementById('modalEstServices');
    const modalPacing = document.getElementById('modalEstPacing');
    const notesField = document.getElementById('estClientNotes');
    const subjectField = document.getElementById('estimateFormSubject');
    const modalWa = document.getElementById('modalWaQuickBtn');
    const modalMail = document.getElementById('modalMailQuickBtn');

    if (modalAmount) modalAmount.textContent = scope.amountText;
    if (modalServices) modalServices.textContent = scope.services.join(', ');
    if (modalPacing) modalPacing.textContent = scope.timeline.label;
    if (subjectField) {
      subjectField.value = `🧮 [COST ESTIMATE] Custom Package Inquiry: ${scope.services.join(', ')} (~${scope.amountText})`;
    }

    if (notesField && (!notesField.value || notesField.dataset.userEdited !== 'true')) {
      notesField.value = `I configured this custom package using your Cost Estimator:\n• Services: ${scope.services.join(', ')}\n• Delivery Pacing: ${scope.timeline.label}\n• Estimated Investment: ~${scope.amountText} (${scope.currency.suffix || 'USD'})\n\nPlease email my itemized proposal and let's discuss details!`;
    }

    if (modalWa) {
      modalWa.href = `https://wa.me/639274682635?text=${encodeURIComponent(`Hi Jerome & Create and Arise! I configured a custom package with your Cost Estimator: ${scope.services.join(', ')} (~${scope.amountText}, ${scope.timeline.label}). I would love to connect!`)}`;
    }
    if (modalMail) {
      modalMail.href = `mailto:createandarise05@gmail.com?subject=${encodeURIComponent(`[Estimate Inquiry] ${scope.services.join(', ')} (${scope.amountText})`)}&body=${encodeURIComponent(`Hi Jerome & Create and Arise Team,\n\nI just configured an estimate using your Cost Estimator:\n• Services: ${scope.services.join(', ')}\n• Timeline Pacing: ${scope.timeline.label}\n• Estimated Investment: ~${scope.amountText} (${scope.currency.suffix || 'USD'})\n\nPlease email my formal proposal and let's get started!\n\nBest regards,`)}`;
    }

    if (typeof window.openModal === 'function') {
      window.openModal('estimateModal');
    } else {
      const m = document.getElementById('estimateModal');
      if (m) {
        m.classList.add('active');
        document.body.classList.add('modal-open');
      }
    }

    // Scroll modal card to top for mobile viewports
    const modalElem = document.getElementById('estimateModal');
    const cardElem = modalElem?.querySelector('.modal-card');
    if (cardElem) cardElem.scrollTop = 0;
  };

  // Global helper to transfer estimate into main contact form
  window.transferEstimateToContact = function () {
    const scope = window.getCalculatedScope();
    if (!scope.services || scope.services.length === 0) {
      if (typeof showToast === 'function') {
        showToast('Please select at least one service in the calculator.');
      }
      return;
    }

    const contactMsg = document.getElementById('contactMessage');
    const contactBudget = document.getElementById('contactBudget');

    if (contactMsg) {
      contactMsg.value = `Hello Jerome & Create and Arise Creative Team!\n\nI configured a custom package with your Cost Estimator:\n• Services: ${scope.services.join(', ')}\n• Delivery Pacing: ${scope.timeline.label}\n• Estimated Package: ~${scope.amountText} (${scope.currency.suffix || 'USD'})\n\nI would love to receive your formal proposal and schedule a discovery call!`;
    }

    // Auto-match budget select in contact form
    if (contactBudget) {
      const numMatch = scope.amountText.replace(/[^0-9]/g, '');
      const numVal = parseInt(numMatch, 10) || 1200;
      let approxUsd = numVal;
      const currCode = scope.currency.code || scope.currency.suffix || 'USD';
      if (currCode === 'PHP') approxUsd = Math.round(numVal / 58);
      else if (currCode === 'AUD') approxUsd = Math.round(numVal / 1.55);
      else if (currCode === 'EUR') approxUsd = Math.round(numVal / 0.92);
      else if (currCode === 'GBP') approxUsd = Math.round(numVal / 0.78);

      if (approxUsd <= 500) contactBudget.value = 'under500';
      else if (approxUsd <= 1500) contactBudget.value = '500-1500';
      else if (approxUsd <= 3000) contactBudget.value = '1500-3000';
      else contactBudget.value = '3000plus';
    }

    // Check corresponding checkboxes in contact form
    document.querySelectorAll('.contact-service-check').forEach(chk => {
      chk.checked = scope.services.some(s => s.toLowerCase().includes(chk.value.toLowerCase()));
    });

    if (typeof window.closeModal === 'function') window.closeModal('estimateModal');
    if (typeof window.switchTab === 'function') window.switchTab('contact');

    setTimeout(() => {
      const contactForm = document.getElementById('mainContactForm');
      if (contactForm) {
        const headerOffset = 100;
        const formPosition = contactForm.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: Math.max(0, formPosition - headerOffset),
          behavior: 'smooth'
        });
      }
    }, 180);

    if (typeof showToast === 'function') {
      showToast('✨ Custom package transferred to contact form!');
    }
  };

  // Bind event listeners for safety and fallback
  if (applyEstimateBtn) {
    applyEstimateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.openEstimateModal();
    });
  }

  const btnTransferDirect = document.getElementById('btnTransferToContactDirect');
  if (btnTransferDirect) {
    btnTransferDirect.addEventListener('click', (e) => {
      e.preventDefault();
      window.transferEstimateToContact();
    });
  }

  const modalTransferLink = document.getElementById('modalTransferLink');
  if (modalTransferLink) {
    modalTransferLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.transferEstimateToContact();
    });
  }

  // 3. Handle Direct Submission of Estimate Modal Form
  const estimateForm = document.getElementById('estimateInquiryForm');
  if (estimateForm) {
    const notesField = document.getElementById('estClientNotes');
    if (notesField) {
      notesField.addEventListener('input', () => { notesField.dataset.userEdited = 'true'; });
    }

    estimateForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('estClientName')?.value.trim();
      const email = document.getElementById('estClientEmail')?.value.trim();
      const phone = document.getElementById('estClientPhone')?.value.trim() || 'N/A';
      const company = document.getElementById('estClientCompany')?.value.trim() || 'N/A';
      const notes = document.getElementById('estClientNotes')?.value.trim() || '';

      if (!name || !email) {
        showToast('Please provide your name and email address.');
        return;
      }

      const scope = getCalculatedScope();
      const submitBtn = document.getElementById('btnSubmitEstimateInquiry');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Send Package Inquiry';

      if (submitBtn) {
        submitBtn.innerHTML = `<span>Submitting to createandarise05@gmail.com...</span>`;
        submitBtn.disabled = true;
      }

      const inquiryRef = 'EST-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);
      const autoresponseMsg = `Thank you for requesting a Cost Estimate with Create and Arise! ✨ (Ref: ${inquiryRef}). Jerome Cabinta and our creative team have received your package specifications (~${scope.amountText}) and will email your formal proposal within 24 weekday business hours (Mon–Fri 8AM–6PM PHT). WhatsApp: +63 927 468 2635 | createandarise05@gmail.com`;

      const payload = {
        name: name,
        email: email,
        _replyto: email,
        _autoresponse: autoresponseMsg,
        inquiryReference: inquiryRef,
        phone: phone,
        company: company,
        services: scope.services.join(', '),
        budget: scope.amountText,
        timeline: scope.timeline.label,
        message: notes,
        inquiry_type: 'Cost Estimator Package Inquiry',
        _subject: `🧮 [COST ESTIMATE] ${name} - ${scope.services.join(', ')} (${scope.amountText})`,
        _template: 'table',
        _captcha: 'false'
      };

      const nowStr = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Manila',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      const detailsHtml = `
        <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-md); padding: 1.15rem; margin-bottom: 0.5rem; text-align: left;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(16, 185, 129, 0.2); padding-bottom: 0.6rem; margin-bottom: 0.75rem;">
            <div style="font-weight: 700; color: #10b981; font-size: 0.88rem; display: flex; align-items: center; gap: 0.4rem;">
              <span>✓ OFFICIAL ESTIMATE CONFIRMATION</span>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-gold); font-weight: 700; background: rgba(245, 158, 11, 0.15); padding: 0.2rem 0.5rem; border-radius: 4px;">
              ${inquiryRef}
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.85rem; color: var(--text-main);">
            <div><strong>👤 Client:</strong> ${name} &bull; <span style="color: var(--color-primary);">${email}</span></div>
            <div><strong>🛠️ Selected Services:</strong> ${scope.services.join(', ')}</div>
            <div><strong>⏱️ Pacing / Timeline:</strong> ${scope.timeline.label}</div>
            <div><strong>💰 Estimated Investment:</strong> <span style="color: #10b981; font-weight: 700;">${scope.amountText}</span></div>
            ${phone && phone !== 'N/A' ? `<div><strong>📱 Phone / WhatsApp:</strong> ${phone}</div>` : ''}
            <div><strong>⏰ Received Timestamp:</strong> ${nowStr} (PHT)</div>
          </div>

          <div style="margin-top: 0.85rem; padding: 0.75rem; background: rgba(0, 0, 0, 0.25); border-radius: var(--radius-sm); font-size: 0.8rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.25rem;">
            <div style="color: #10b981; font-weight: 600;">📬 Delivered to Studio: createandarise05@gmail.com</div>
            <div>📨 <strong>Client Auto-Confirmation:</strong> Dispatched to <em>${email}</em></div>
            <div>⏱️ <strong>Guaranteed Studio Response:</strong> Within 24 weekday business hours (Mon–Fri 8AM–6PM PHT)</div>
          </div>
        </div>
      `;

      const whatsappMsg = `Hi Create and Arise! I'm ${name} (${email}). I just submitted an estimate inquiry (Ref: ${inquiryRef}) for ${scope.services.join(', ')} (Estimate: ~${scope.amountText}). Looking forward to your proposal!`;
      const mailtoSub = `Cost Estimate Inquiry (${inquiryRef}): ${name} - ${scope.services.join(', ')}`;
      const mailtoBody = `Hi Jerome & Create and Arise Creative Team,\n\nInquiry Ref: ${inquiryRef}\nName: ${name}\nEmail: ${email}\nServices: ${scope.services.join(', ')}\nEstimated Scope: ${scope.amountText}\nTimeline: ${scope.timeline.label}\n\nProject Notes:\n${notes}\n\nLooking forward to speaking soon!`;

      await window.sendFormSubmission(payload);

      if (submitBtn) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }

      if (window.closeModal) window.closeModal('estimateModal');
      estimateForm.reset();

      // Show inline confirmation in the calculator summary box
      const calcInline = document.getElementById('calcInlineConfirmation');
      const calcRef = document.getElementById('calcInlineRef');
      const calcNotice = document.getElementById('calcInlineNotice');
      const calcWa = document.getElementById('calcInlineWaLink');

      if (calcInline) {
        if (calcRef) calcRef.textContent = inquiryRef;
        if (calcNotice) {
          calcNotice.innerHTML = `Thank you, <strong>${name}</strong>! Your package inquiry (~<strong>${scope.amountText}</strong>) has been received by Jerome Cabinta at <strong style="color: var(--color-primary);">createandarise05@gmail.com</strong>. An automated confirmation copy has also been sent to <strong>${email}</strong>.`;
        }
        if (calcWa) {
          calcWa.href = `https://wa.me/639274682635?text=${encodeURIComponent(`Hi Jerome! I just submitted an estimate inquiry on Create and Arise (Ref: ${inquiryRef}, Amount: ${scope.amountText}). Looking forward to connecting!`)}`;
        }
        calcInline.style.display = 'block';
      }

      showRichSuccessModal({
        title: 'Custom Estimate Dispatched! 🎉',
        desc: `Thank you, <strong>${name}</strong>! Your customized estimate for <strong>${scope.services.join(', ')}</strong> (~<strong>${scope.amountText}</strong>) has been safely received by <strong>Jerome Cabinta</strong> at <strong style="color: var(--color-primary);">createandarise05@gmail.com</strong>. An official confirmation email with reference (<strong>${inquiryRef}</strong>) has been dispatched to <strong>${email}</strong>.`,
        detailsHtml: detailsHtml,
        whatsappMsg: whatsappMsg,
        mailtoSubject: mailtoSub,
        mailtoBody: mailtoBody,
        clientEmail: email
      });

      showToast(`🎉 Estimate sent to createandarise05@gmail.com! Check ${email}`);
    });
  }

  // Initial calculation
  window.runCalculator();
}

/**
 * Global helper to select a service from any card/link on the page
 */
window.selectServiceInEstimator = function (serviceKey) {
  const cb = document.querySelector(`.calc-service-checkbox[value="${serviceKey}"]`);
  if (cb) {
    // Uncheck all other checkboxes to highlight this selected service
    document.querySelectorAll('.calc-service-checkbox').forEach(c => c.checked = false);
    cb.checked = true;
    if (window.runCalculator) window.runCalculator();
  }

  if (window.switchTab) {
    window.switchTab('estimator');
  }

  const sObj = serviceBasePrices[serviceKey];
  showToast(`✨ Selected ${sObj ? sObj.name : 'Service'} in Cost Estimator`);
};

/* --------------------------------------------------------------------------
   5b. Hypermakarios Services Directory Filter & Search Controller
   -------------------------------------------------------------------------- */
function initServicesDirectory() {
  const searchInput = document.getElementById('serviceSearchInput');
  const clearBtn = document.getElementById('clearServiceSearch');
  const filterPills = document.querySelectorAll('.service-filter-pill');
  const cards = document.querySelectorAll('.service-offer');
  const countElem = document.getElementById('visibleCount');
  const totalElem = document.getElementById('totalCount');
  const emptyState = document.getElementById('servicesEmptyState');
  const querySpan = document.getElementById('emptyQueryText');

  if (!cards.length) return;

  let currentFilter = 'all';
  let currentSearch = '';

  function filterCards() {
    let visible = 0;
    const term = currentSearch.trim().toLowerCase();

    cards.forEach(card => {
      const title = (card.querySelector('.service-offer__title')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('.service-offer__description')?.textContent || '').toLowerCase();
      const company = (card.querySelector('.service-offer__company')?.textContent || '').toLowerCase();
      const features = (card.querySelector('.service-offer__features')?.textContent || '').toLowerCase();
      const cardTags = (card.getAttribute('data-tags') || '').toLowerCase().split(' ');
      const cardCompany = (card.getAttribute('data-company') || '').toLowerCase();

      // Check Category / Company Filter
      let matchesFilter = false;
      if (currentFilter === 'all') {
        matchesFilter = true;
      } else if (currentFilter === 'create-and-arise') {
        matchesFilter = cardCompany.includes('create-and-arise');
      } else if (currentFilter === 'anchorplan') {
        matchesFilter = cardCompany.includes('anchorplan');
      } else {
        matchesFilter = cardTags.includes(currentFilter) || cardTags.some(t => t.includes(currentFilter));
      }

      // Check Search Term
      let matchesSearch = true;
      if (term) {
        matchesSearch = title.includes(term) || desc.includes(term) || company.includes(term) || features.includes(term);
      }

      if (matchesFilter && matchesSearch) {
        card.style.display = 'flex';
        visible++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countElem) countElem.textContent = visible;
    if (totalElem) totalElem.textContent = cards.length;

    if (emptyState) {
      if (visible === 0) {
        emptyState.style.display = 'block';
        if (querySpan) querySpan.textContent = term || currentFilter;
      } else {
        emptyState.style.display = 'none';
      }
    }

    if (clearBtn) {
      clearBtn.style.display = term ? 'flex' : 'none';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      filterCards();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      currentSearch = '';
      filterCards();
      searchInput?.focus();
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.getAttribute('data-filter') || 'all';
      filterCards();
    });
  });

  window.resetServiceFilters = function () {
    if (searchInput) searchInput.value = '';
    currentSearch = '';
    currentFilter = 'all';
    filterPills.forEach(p => {
      if (p.getAttribute('data-filter') === 'all') p.classList.add('active');
      else p.classList.remove('active');
    });
    filterCards();
  };

  filterCards();
}

/* --------------------------------------------------------------------------
   6. Testimonials & Reviews Filter Controller
   -------------------------------------------------------------------------- */
function initTestimonialCarousel() {
  const filterBtns = document.querySelectorAll('.review-filter-btn');
  const cards = document.querySelectorAll('.testimonial-card');

  if (filterBtns.length === 0 || cards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      if (!filter) return;

      filterBtns.forEach(b => {
        if (b.hasAttribute('data-filter')) b.classList.remove('active');
      });
      btn.classList.add('active');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInCard 0.35s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close other items
        faqItems.forEach(other => other.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* --------------------------------------------------------------------------
   8. Contact Form Handling (Connected to createandarise05@gmail.com)
   -------------------------------------------------------------------------- */
function showRichSuccessModal({ title, desc, detailsHtml, whatsappMsg, mailtoSubject, mailtoBody, googleCalUrl, icsData, icsFilename, clientEmail }) {
  const successModal = document.getElementById('successModal');
  if (!successModal) return;

  const titleEl = document.getElementById('successModalTitle');
  const descEl = document.getElementById('successModalDesc');
  const detailsEl = document.getElementById('successModalDetails');
  const waBtn = document.getElementById('successWhatsappBtn');
  const mailBtn = document.getElementById('successMailtoBtn');
  const calActions = document.getElementById('successCalendarActions');
  const googleCalBtn = document.getElementById('successGoogleCalBtn');
  const icsBtn = document.getElementById('successIcsDownloadBtn');
  const checkEmailBtn = document.getElementById('successCheckEmailBtn');

  if (titleEl && title) titleEl.textContent = title;
  if (descEl && desc) descEl.innerHTML = desc;

  if (detailsEl) {
    if (detailsHtml) {
      detailsEl.innerHTML = detailsHtml;
      detailsEl.style.display = 'block';
    } else {
      detailsEl.style.display = 'none';
    }
  }

  // Handle Dynamic Email Confirmation Link
  if (checkEmailBtn) {
    if (clientEmail) {
      checkEmailBtn.style.display = 'inline-flex';
      const emailDomain = (clientEmail.split('@')[1] || '').toLowerCase();
      if (emailDomain.includes('gmail')) {
        checkEmailBtn.href = 'https://mail.google.com/';
        checkEmailBtn.innerHTML = `<span>📬 Check Gmail for Confirmation (${clientEmail})</span>`;
      } else if (emailDomain.includes('outlook') || emailDomain.includes('hotmail') || emailDomain.includes('live')) {
        checkEmailBtn.href = 'https://outlook.live.com/';
        checkEmailBtn.innerHTML = `<span>📬 Check Outlook for Confirmation (${clientEmail})</span>`;
      } else if (emailDomain.includes('yahoo')) {
        checkEmailBtn.href = 'https://mail.yahoo.com/';
        checkEmailBtn.innerHTML = `<span>📬 Check Yahoo Mail for Confirmation (${clientEmail})</span>`;
      } else {
        checkEmailBtn.href = `mailto:${clientEmail}`;
        checkEmailBtn.innerHTML = `<span>📬 Check Email for Confirmation (${clientEmail})</span>`;
      }
    } else {
      checkEmailBtn.style.display = 'none';
    }
  }

  // Handle Calendar Sync actions
  if (calActions) {
    if (googleCalUrl || icsData) {
      calActions.style.display = 'flex';

      if (googleCalBtn && googleCalUrl) {
        googleCalBtn.href = googleCalUrl;
        googleCalBtn.style.display = 'flex';
      } else if (googleCalBtn) {
        googleCalBtn.style.display = 'none';
      }

      if (icsBtn && icsData) {
        icsBtn.style.display = 'flex';
        icsBtn.onclick = () => {
          try {
            const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = icsFilename || 'Create-and-Arise-Discovery-Call.ics';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('🍏 Calendar file (.ics) downloaded!');
          } catch (err) {
            console.error('ICS download error:', err);
            showToast('Unable to generate ICS file automatically.');
          }
        };
      } else if (icsBtn) {
        icsBtn.style.display = 'none';
      }
    } else {
      calActions.style.display = 'none';
    }
  }

  if (waBtn) {
    const encodedWa = encodeURIComponent(whatsappMsg || 'Hi Create and Arise! I just submitted a consultation inquiry on the website.');
    waBtn.href = `https://wa.me/639274682635?text=${encodedWa}`;
  }

  if (mailBtn) {
    const encodedSub = encodeURIComponent(mailtoSubject || 'Creative Project Inquiry - Create and Arise');
    const encodedBody = encodeURIComponent(mailtoBody || '');
    mailBtn.href = `mailto:createandarise05@gmail.com?subject=${encodedSub}&body=${encodedBody}`;
  }

  if (typeof window.openModal === 'function') {
    window.openModal('successModal');
  } else if (successModal) {
    successModal.classList.add('active');
    document.body.classList.add('modal-open');
  }
}

function initContactForm() {
  const contactForm = document.getElementById('mainContactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName')?.value.trim();
    const email = document.getElementById('contactEmail')?.value.trim();
    const phone = document.getElementById('contactPhone')?.value.trim() || 'N/A';
    const budget = document.getElementById('contactBudget')?.value || 'Not specified';
    const message = document.getElementById('contactMessage')?.value.trim();

    const selectedServices = Array.from(document.querySelectorAll('.contact-service-check:checked'))
      .map(cb => cb.value)
      .join(', ') || 'General Creative Inquiry';

    if (!name || !email || !message) {
      showToast('Please fill out all required fields.');
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Submitting to Studio...</span>`;
    submitBtn.disabled = true;

    const inquiryRef = 'INQ-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);
    const autoresponseMsg = `Thank you for reaching out to Create and Arise! ✨ We have safely received your creative project inquiry (Ref: ${inquiryRef}). Jerome Cabinta and our creative team will review your specifications and reply within 24 weekday business hours (Mon–Fri 8AM–6PM PHT). If urgent, message us on WhatsApp: +63 927 468 2635 | createandarise05@gmail.com`;

    const payload = {
      name: name,
      email: email,
      _replyto: email,
      _autoresponse: autoresponseMsg,
      inquiryReference: inquiryRef,
      phone: phone,
      budget: budget,
      services: selectedServices,
      message: message,
      _subject: `🚀 [NEW INQUIRY] ${name} - ${selectedServices} (Ref: ${inquiryRef})`,
      _template: 'table',
      _captcha: 'false'
    };

    const nowStr = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Manila',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const detailsHtml = `
      <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-md); padding: 1.15rem; margin-bottom: 0.5rem; text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(16, 185, 129, 0.2); padding-bottom: 0.6rem; margin-bottom: 0.75rem;">
          <div style="font-weight: 700; color: #10b981; font-size: 0.88rem; display: flex; align-items: center; gap: 0.4rem;">
            <span>✓ OFFICIAL RECEIPT CONFIRMATION</span>
          </div>
          <div style="font-size: 0.75rem; color: var(--text-gold); font-weight: 700; background: rgba(245, 158, 11, 0.15); padding: 0.2rem 0.5rem; border-radius: 4px;">
            ${inquiryRef}
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.85rem; color: var(--text-main);">
          <div><strong>👤 Client:</strong> ${name} &bull; <span style="color: var(--color-primary);">${email}</span></div>
          <div><strong>🛠️ Selected Services:</strong> ${selectedServices}</div>
          <div><strong>💰 Budget Range:</strong> ${budget}</div>
          <div><strong>📱 Phone / WhatsApp:</strong> ${phone}</div>
          <div><strong>⏰ Received Timestamp:</strong> ${nowStr} (PHT)</div>
          <div style="margin-top: 0.35rem; padding-top: 0.45rem; border-top: 1px dashed var(--border-subtle); font-size: 0.8rem; color: var(--text-muted);">
            <strong>📝 Scope Preview:</strong> &ldquo;${message.length > 90 ? message.substring(0, 90) + '...' : message}&rdquo;
          </div>
        </div>

        <div style="margin-top: 0.85rem; padding: 0.75rem; background: rgba(0, 0, 0, 0.25); border-radius: var(--radius-sm); font-size: 0.8rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.25rem;">
          <div style="color: #10b981; font-weight: 600;">📬 Delivered to Studio: createandarise05@gmail.com</div>
          <div>📨 <strong>Client Auto-Confirmation:</strong> Dispatched to <em>${email}</em></div>
          <div>⏱️ <strong>Guaranteed Studio Response:</strong> Within 24 weekday business hours (Mon–Fri 8AM–6PM PHT)</div>
        </div>
      </div>
    `;

    const whatsappMsg = `Hi Create and Arise! I'm ${name} (${email}). I just submitted an inquiry (Ref: ${inquiryRef}) for ${selectedServices} (Budget: ${budget}). Here are my project notes: "${message}"`;
    const mailtoSub = `Project Inquiry (${inquiryRef}): ${name} - ${selectedServices}`;
    const mailtoBody = `Hi Jerome & Create and Arise Creative Team,\n\nInquiry Ref: ${inquiryRef}\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nServices: ${selectedServices}\nBudget: ${budget}\n\nProject Scope:\n${message}\n\nLooking forward to speaking soon!`;

    await window.sendFormSubmission(payload);

    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    contactForm.reset();

    // Show inline receipt banner on contact form
    const inlineCard = document.getElementById('contactInlineConfirmation');
    const inlineRef = document.getElementById('contactInlineRef');
    const inlineNotice = document.getElementById('contactInlineNotice');
    const inlineWa = document.getElementById('contactInlineWaLink');
    if (inlineCard) {
      if (inlineRef) inlineRef.textContent = inquiryRef;
      if (inlineNotice) {
        inlineNotice.innerHTML = `Thank you, <strong>${name}</strong>! Your inquiry (Ref: <strong>${inquiryRef}</strong>) has been safely received by Jerome Cabinta at <strong style="color: var(--color-primary);">createandarise05@gmail.com</strong>. An automated confirmation copy has also been dispatched to <strong>${email}</strong>.`;
      }
      if (inlineWa) {
        inlineWa.href = `https://wa.me/639274682635?text=${encodeURIComponent(`Hi Jerome! I just submitted an inquiry on Create and Arise (Ref: ${inquiryRef}). Looking forward to connecting!`)}`;
      }
      inlineCard.style.display = 'block';
    }

    showRichSuccessModal({
      title: 'Inquiry Received & Confirmed! 🎉',
      desc: `Thank you, <strong>${name}</strong>! Your project inquiry has been safely received by <strong>Jerome Cabinta</strong> and the <strong>Create and Arise</strong> creative team. An official confirmation email with your reference copy (<strong>${inquiryRef}</strong>) has been dispatched to <strong>${email}</strong>.`,
      detailsHtml: detailsHtml,
      whatsappMsg: whatsappMsg,
      mailtoSubject: mailtoSub,
      mailtoBody: mailtoBody,
      clientEmail: email
    });

    showToast(`🎉 Inquiry received & confirmed! Check ${email} for your receipt`);
  });
}

window.resetContactFormUI = function () {
  const form = document.getElementById('mainContactForm');
  const inline = document.getElementById('contactInlineConfirmation');
  if (form) form.reset();
  if (inline) inline.style.display = 'none';
  const submitBtn = document.getElementById('btnSubmitContact');
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.style.display = 'inline-flex';
  }
};

/* --------------------------------------------------------------------------
   8.5. Interactive Book a Call Modal Handling
   -------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------
   8.5. Interactive Book a Call Modal & Live Schedule Engine
   -------------------------------------------------------------------------- */
const PHT_TIME_SLOTS = [
  // Morning Sessions (PHT 9:00 AM – 12:00 PM)
  { id: 'm1', phtTime: '09:00 AM PHT', hour24: 9, min: 0, category: 'Morning', label: '09:00 AM' },
  { id: 'm2', phtTime: '09:45 AM PHT', hour24: 9, min: 45, category: 'Morning', label: '09:45 AM' },
  { id: 'm3', phtTime: '10:30 AM PHT', hour24: 10, min: 30, category: 'Morning', label: '10:30 AM' },
  { id: 'm4', phtTime: '11:15 AM PHT', hour24: 11, min: 15, category: 'Morning', label: '11:15 AM' },
  // Afternoon Sessions (PHT 1:30 PM – 5:00 PM)
  { id: 'a1', phtTime: '01:30 PM PHT', hour24: 13, min: 30, category: 'Afternoon', label: '01:30 PM' },
  { id: 'a2', phtTime: '02:15 PM PHT', hour24: 14, min: 15, category: 'Afternoon', label: '02:15 PM' },
  { id: 'a3', phtTime: '03:00 PM PHT', hour24: 15, min: 0, category: 'Afternoon', label: '03:00 PM' },
  { id: 'a4', phtTime: '03:45 PM PHT', hour24: 15, min: 45, category: 'Afternoon', label: '03:45 PM' },
  { id: 'a5', phtTime: '04:30 PM PHT', hour24: 16, min: 30, category: 'Afternoon', label: '04:30 PM' },
  // Evening Sessions (PHT 6:00 PM – 8:30 PM / Aligned to US & European Mornings)
  { id: 'e1', phtTime: '06:00 PM PHT', hour24: 18, min: 0, category: 'Evening / US', label: '06:00 PM' },
  { id: 'e2', phtTime: '06:45 PM PHT', hour24: 18, min: 45, category: 'Evening / US', label: '06:45 PM' },
  { id: 'e3', phtTime: '07:30 PM PHT', hour24: 19, min: 30, category: 'Evening / US', label: '07:30 PM' },
  { id: 'e4', phtTime: '08:15 PM PHT', hour24: 20, min: 15, category: 'Evening / US', label: '08:15 PM' }
];

let schedulerState = {
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth(), // 0-indexed
  selectedDate: null, // 'YYYY-MM-DD'
  selectedSlot: null, // Slot object
  bookedSlots: [],
  userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Manila',
  showStudioPhtPrimary: false
};

// Helper: Convert Date object to PHT representation
function getPhtTodayString() {
  const phtDateStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' });
  const phtDate = new Date(phtDateStr);
  const y = phtDate.getFullYear();
  const m = String(phtDate.getMonth() + 1).padStart(2, '0');
  const d = String(phtDate.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Helper: Get next valid weekday (Mon–Fri)
function getInitialSelectableDate() {
  const phtDateStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' });
  let dt = new Date(phtDateStr);
  const hour = dt.getHours();

  // If after 5:30 PM PHT or on weekend, push forward
  if (hour >= 18) {
    dt.setDate(dt.getDate() + 1);
  }

  // If Sunday (0), move to Monday (+1). If Saturday (6), move to Monday (+2).
  if (dt.getDay() === 0) dt.setDate(dt.getDate() + 1);
  if (dt.getDay() === 6) dt.setDate(dt.getDate() + 2);

  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const d = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Helper: Construct Date object for slot in PHT (GMT+8)
function getSlotDateObj(dateStr, slot) {
  const pad = n => String(n).padStart(2, '0');
  return new Date(`${dateStr}T${pad(slot.hour24)}:${pad(slot.min)}:00+08:00`);
}

// Helper: Load booked slots from server API and localStorage fallback
async function loadBookedSlots() {
  let serverBookings = [];
  try {
    const res = await fetch('/api/bookings');
    if (res.ok) {
      serverBookings = await res.json();
    }
  } catch (e) {
    // Graceful offline/local fallback
  }

  let localBookings = [];
  try {
    const raw = localStorage.getItem('caa_saved_bookings');
    if (raw) localBookings = JSON.parse(raw);
  } catch (e) { }

  const merged = [...serverBookings];
  localBookings.forEach(lb => {
    if (!merged.some(m => m.date === lb.date && m.timeSlot === lb.timeSlot)) {
      merged.push(lb);
    }
  });

  schedulerState.bookedSlots = merged;
}

window.openBookCallModal = function (servicePreset) {
  const modal = document.getElementById('bookCallModal');
  const serviceSelect = document.getElementById('bookingService');

  if (servicePreset && serviceSelect) {
    for (let opt of serviceSelect.options) {
      if (opt.value.toLowerCase().includes(servicePreset.toLowerCase()) || opt.text.toLowerCase().includes(servicePreset.toLowerCase())) {
        serviceSelect.value = opt.value;
        break;
      }
    }
  }

  // Reset to Step 1
  switchBookingStep(1);

  // Set initial selected date to next valid weekday
  if (!schedulerState.selectedDate) {
    schedulerState.selectedDate = getInitialSelectableDate();
  }

  const selParts = schedulerState.selectedDate.split('-');
  schedulerState.currentYear = parseInt(selParts[0], 10);
  schedulerState.currentMonth = parseInt(selParts[1], 10) - 1;

  // Load booked slots and render
  loadBookedSlots().then(() => {
    renderCalendar();
    renderTimeSlots(schedulerState.selectedDate);
    checkExistingBooking();
  });

  if (typeof window.openModal === 'function') {
    window.openModal('bookCallModal');
  } else if (modal) {
    modal.classList.add('active');
    document.body.classList.add('modal-open');
  }
};

function switchBookingStep(step) {
  const step1 = document.getElementById('bookingStep1');
  const step2 = document.getElementById('bookingStep2');
  const ind1 = document.getElementById('stepIndicator1');
  const ind2 = document.getElementById('stepIndicator2');

  if (step === 1) {
    if (step1) step1.style.display = 'block';
    if (step2) step2.style.display = 'none';
    if (ind1) {
      ind1.classList.add('active');
      ind1.classList.remove('completed');
    }
    if (ind2) {
      ind2.classList.remove('active', 'completed');
    }
  } else if (step === 2) {
    if (step1) step1.style.display = 'none';
    if (step2) step2.style.display = 'block';
    if (ind1) {
      ind1.classList.remove('active');
      ind1.classList.add('completed');
    }
    if (ind2) {
      ind2.classList.add('active');
    }
  }
}

function checkExistingBooking() {
  const noticeEl = document.getElementById('bookingExistingNotice');
  const titleEl = document.getElementById('existingBookingTitle');
  const detailsEl = document.getElementById('existingBookingDetails');
  const rescheduleBtn = document.getElementById('btnExistingReschedule');

  if (!noticeEl) return;

  try {
    const raw = localStorage.getItem('caa_active_booking');
    if (!raw) {
      noticeEl.style.display = 'none';
      return;
    }

    const booking = JSON.parse(raw);
    const todayPht = getPhtTodayString();

    if (booking.date >= todayPht) {
      noticeEl.style.display = 'flex';
      if (titleEl) titleEl.textContent = `Upcoming Call: ${booking.service || 'Strategy Session'}`;
      if (detailsEl) {
        detailsEl.innerHTML = `📅 <strong>${booking.date}</strong> &bull; ⏰ ${booking.timeSlot} (${booking.platform || 'Google Meet'})`;
      }

      if (rescheduleBtn) {
        rescheduleBtn.onclick = () => {
          noticeEl.style.display = 'none';
          showToast('Pick a new date and time slot to reschedule.');
        };
      }
    } else {
      noticeEl.style.display = 'none';
    }
  } catch (e) {
    noticeEl.style.display = 'none';
  }
}

function renderCalendar() {
  const monthTitle = document.getElementById('calMonthTitle');
  const grid = document.getElementById('calDaysGrid');
  const prevBtn = document.getElementById('calPrevMonthBtn');

  if (!grid || !monthTitle) return;

  const year = schedulerState.currentYear;
  const month = schedulerState.currentMonth;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  monthTitle.textContent = `${monthNames[month]} ${year}`;

  // Disable prev button if viewing previous to current month
  const now = new Date();
  const isPastMonth = year < now.getFullYear() || (year === now.getFullYear() && month <= now.getMonth());
  if (prevBtn) prevBtn.disabled = isPastMonth;

  grid.innerHTML = '';

  const firstDayObj = new Date(year, month, 1);
  // Convert Sunday=0 to Monday=0 format: (getDay() + 6) % 7
  const startDayOfWeek = (firstDayObj.getDay() + 6) % 7;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const todayPht = getPhtTodayString();

  // Previous month trailing days
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const cell = document.createElement('div');
    cell.className = 'calendar-day other-month disabled';
    cell.textContent = dayNum;
    grid.appendChild(cell);
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const pad = n => String(n).padStart(2, '0');
    const dateStr = `${year}-${pad(month + 1)}-${pad(d)}`;
    const dayDate = new Date(year, month, d);
    const dayOfWeek = dayDate.getDay(); // 0 = Sun, 6 = Sat

    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'calendar-day';
    cell.textContent = d;

    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    const isPast = (dateStr < todayPht);
    const isToday = (dateStr === todayPht);
    const isSelected = (dateStr === schedulerState.selectedDate);

    if (isToday) cell.classList.add('today');
    if (isSelected) cell.classList.add('selected');

    if (isWeekend) {
      cell.classList.add('weekend');
      cell.title = 'Weekend closed (Sabbath rest & renewal)';
      cell.disabled = true;
    } else if (isPast) {
      cell.classList.add('disabled');
      cell.disabled = true;
    } else {
      cell.title = `Available: ${monthNames[month]} ${d}, ${year}`;
      cell.addEventListener('click', () => {
        schedulerState.selectedDate = dateStr;
        schedulerState.selectedSlot = null;
        renderCalendar();
        renderTimeSlots(dateStr);
      });
    }

    grid.appendChild(cell);
  }
}

function renderTimeSlots(dateStr) {
  const displayDate = document.getElementById('slotsSelectedDateDisplay');
  const slotsArea = document.getElementById('slotsArea');
  const tzText = document.getElementById('slotsTzText');
  const continueBtn = document.getElementById('btnContinueToDetails');
  const statusEl = document.getElementById('slotSelectionStatus');

  if (!slotsArea) return;

  if (continueBtn) continueBtn.disabled = true;

  if (!dateStr) {
    if (displayDate) displayDate.textContent = 'Select a Date';
    slotsArea.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 2rem 0; font-size: 0.85rem;">Please select an open weekday (Mon–Fri) from the calendar.</div>`;
    return;
  }

  const dtObj = new Date(`${dateStr}T12:00:00`);
  const formattedDate = dtObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  if (displayDate) displayDate.textContent = formattedDate;

  if (tzText) {
    const tzLabel = schedulerState.showStudioPhtPrimary
      ? 'Studio Time (PHT GMT+8)'
      : `${schedulerState.userTimezone}`;
    tzText.textContent = tzLabel;
  }

  const todayPht = getPhtTodayString();
  const now = new Date();

  slotsArea.innerHTML = '';

  const categories = ['Morning', 'Afternoon', 'Evening / US'];

  categories.forEach(cat => {
    const slotsInCat = PHT_TIME_SLOTS.filter(s => s.category === cat);
    if (slotsInCat.length === 0) return;

    const catTitle = document.createElement('div');
    catTitle.className = 'slot-category-title';
    let catIcon = '🌅';
    if (cat === 'Afternoon') catIcon = '☀️';
    if (cat.includes('Evening')) catIcon = '🌙';
    catTitle.innerHTML = `<span>${catIcon} ${cat}</span>`;
    slotsArea.appendChild(catTitle);

    const pillsGrid = document.createElement('div');
    pillsGrid.className = 'slot-pills-grid';

    slotsInCat.forEach(slot => {
      const slotBtn = document.createElement('button');
      slotBtn.type = 'button';
      slotBtn.className = 'time-slot-pill';

      const slotDate = getSlotDateObj(dateStr, slot);
      const localTimeStr = slotDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

      // Check if slot is already booked for this date
      const isBooked = schedulerState.bookedSlots.some(b => b.date === dateStr && (b.timeSlot === slot.phtTime || b.timeSlot === slot.label));

      // Check if slot is in the past for today
      let isPastSlot = false;
      if (dateStr === todayPht) {
        // Compare with current actual time
        if (slotDate.getTime() <= (now.getTime() + 15 * 60 * 1000)) { // 15 min buffer
          isPastSlot = true;
        }
      }

      if (schedulerState.showStudioPhtPrimary) {
        slotBtn.innerHTML = `
          <div class="slot-pht-time">${slot.label} PHT</div>
          <div class="slot-local-sub">${localTimeStr} Local</div>
        `;
      } else {
        slotBtn.innerHTML = `
          <div class="slot-pht-time">${localTimeStr}</div>
          <div class="slot-local-sub">${slot.label} PHT</div>
        `;
      }

      if (isBooked) {
        slotBtn.classList.add('booked');
        slotBtn.disabled = true;
        slotBtn.title = 'Slot already booked';
      } else if (isPastSlot) {
        slotBtn.classList.add('booked');
        slotBtn.disabled = true;
        slotBtn.title = 'Time slot passed';
      } else {
        if (schedulerState.selectedSlot && schedulerState.selectedSlot.id === slot.id) {
          slotBtn.classList.add('active');
          if (continueBtn) continueBtn.disabled = false;
        }

        slotBtn.addEventListener('click', () => {
          document.querySelectorAll('.time-slot-pill').forEach(p => p.classList.remove('active'));
          slotBtn.classList.add('active');
          schedulerState.selectedSlot = {
            ...slot,
            localTimeStr: localTimeStr
          };

          if (continueBtn) continueBtn.disabled = false;
          if (statusEl) {
            statusEl.innerHTML = `Selected: <strong>${formattedDate}</strong> at <strong>${slot.phtTime}</strong> (${localTimeStr} your time)`;
          }
        });
      }

      pillsGrid.appendChild(slotBtn);
    });

    slotsArea.appendChild(pillsGrid);
  });
}

function initBookCallModal() {
  const form = document.getElementById('bookCallForm');
  const prevBtn = document.getElementById('calPrevMonthBtn');
  const nextBtn = document.getElementById('calNextMonthBtn');
  const tzChip = document.getElementById('slotsTzChip');
  const continueBtn = document.getElementById('btnContinueToDetails');
  const backBtn = document.getElementById('btnBackToCalendar');

  // Month navigation
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (schedulerState.currentMonth === 0) {
        schedulerState.currentMonth = 11;
        schedulerState.currentYear--;
      } else {
        schedulerState.currentMonth--;
      }
      renderCalendar();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (schedulerState.currentMonth === 11) {
        schedulerState.currentMonth = 0;
        schedulerState.currentYear++;
      } else {
        schedulerState.currentMonth++;
      }
      renderCalendar();
    });
  }

  // Timezone toggle
  if (tzChip) {
    tzChip.addEventListener('click', () => {
      schedulerState.showStudioPhtPrimary = !schedulerState.showStudioPhtPrimary;
      renderTimeSlots(schedulerState.selectedDate);
      showToast(schedulerState.showStudioPhtPrimary ? 'Showing Studio PHT (GMT+8) times primary' : 'Showing your detected local timezone primary');
    });
  }

  // Continue to Step 2
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      if (!schedulerState.selectedDate || !schedulerState.selectedSlot) {
        showToast('Please pick both a date and an available time slot.');
        return;
      }

      const dtObj = new Date(`${schedulerState.selectedDate}T12:00:00`);
      const formattedDate = dtObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
      const slot = schedulerState.selectedSlot;

      const summaryDateTime = document.getElementById('summaryDateTime');
      const summaryTz = document.getElementById('summaryTzNotice');

      if (summaryDateTime) {
        summaryDateTime.textContent = `${formattedDate} @ ${slot.phtTime}`;
      }
      if (summaryTz) {
        summaryTz.innerHTML = `Your Local Time: <strong>${slot.localTimeStr}</strong> (${schedulerState.userTimezone}) &bull; ⏱️ 20-Min Discovery Session`;
      }

      const hiddenDate = document.getElementById('bookingDate');
      const hiddenTime = document.getElementById('bookingSelectedTime');
      const hiddenLocal = document.getElementById('bookingTimeSlotLocal');
      const hiddenTz = document.getElementById('bookingClientTimezone');

      if (hiddenDate) hiddenDate.value = schedulerState.selectedDate;
      if (hiddenTime) hiddenTime.value = slot.phtTime;
      if (hiddenLocal) hiddenLocal.value = slot.localTimeStr;
      if (hiddenTz) hiddenTz.value = schedulerState.userTimezone;

      switchBookingStep(2);
    });
  }

  // Back to Step 1
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      switchBookingStep(1);
    });
  }

  if (!form) return;

  // Form submission handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('bookingName')?.value.trim();
    const email = document.getElementById('bookingEmail')?.value.trim();
    const service = document.getElementById('bookingService')?.value;
    const date = document.getElementById('bookingDate')?.value || schedulerState.selectedDate;
    const time = document.getElementById('bookingSelectedTime')?.value || (schedulerState.selectedSlot ? schedulerState.selectedSlot.phtTime : '09:00 AM PHT');
    const timeLocal = document.getElementById('bookingTimeSlotLocal')?.value || (schedulerState.selectedSlot ? schedulerState.selectedSlot.localTimeStr : time);
    const platform = document.querySelector('input[name="booking_platform"]:checked')?.value || 'Google Meet';
    const notes = document.getElementById('bookingNotes')?.value.trim() || 'None specified';

    if (!name || !email || !date || !time) {
      showToast('Please complete your name, email, and scheduled appointment slot.');
      return;
    }

    const submitBtn = document.getElementById('btnSubmitBooking') || form.querySelector('button[type="submit"]');
    const origHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Reserving Your Call...</span>`;
    submitBtn.disabled = true;

    const payload = {
      name: name,
      email: email,
      _replyto: email,
      service: service,
      date: date,
      timeSlot: time,
      timeSlotLocal: timeLocal,
      timezone: schedulerState.userTimezone,
      platform: platform,
      notes: notes,
      _subject: `📅 New 1-on-1 Discovery Call Booked: ${name} (${service})`,
      _template: 'table',
      _captcha: 'false'
    };

    let bookingId = 'CAA-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);

    // 1. Post to local server API endpoint /api/book-call
    try {
      const apiRes = await fetch('/api/book-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (apiRes.ok) {
        const json = await apiRes.json();
        if (json.booking && json.booking.id) {
          bookingId = json.booking.id;
        }
      } else if (apiRes.status === 409) {
        showToast('⚠️ That time slot was just booked by another client. Please choose another slot.');
        submitBtn.innerHTML = origHtml;
        submitBtn.disabled = false;
        switchBookingStep(1);
        await loadBookedSlots();
        renderTimeSlots(date);
        return;
      }
    } catch (apiErr) {
      console.log('Local booking endpoint fallback to localStorage');
    }

    // 2. Persist locally to localStorage
    const savedBookingRecord = {
      id: bookingId,
      name: name,
      email: email,
      service: service,
      date: date,
      timeSlot: time,
      timeSlotLocal: timeLocal,
      platform: platform,
      notes: notes,
      timezone: schedulerState.userTimezone,
      bookedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem('caa_active_booking', JSON.stringify(savedBookingRecord));
      let allBookings = [];
      const rawAll = localStorage.getItem('caa_saved_bookings');
      if (rawAll) allBookings = JSON.parse(rawAll);
      allBookings.push(savedBookingRecord);
      localStorage.setItem('caa_saved_bookings', JSON.stringify(allBookings));
    } catch (e) { }

    // 3. Asynchronously notify studio email via form endpoint
    window.sendFormSubmission(payload).catch(() => { });

    // 4. Generate Calendar Sync URLs (.ics & Google Calendar)
    const slotObj = schedulerState.selectedSlot || PHT_TIME_SLOTS[0];
    const slotStartDate = getSlotDateObj(date, slotObj);
    const slotEndDate = new Date(slotStartDate.getTime() + 30 * 60 * 1000); // 30-min duration

    const padIso = (n) => String(n).padStart(2, '0');
    const startIso = slotStartDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endIso = slotEndDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const gCalTitle = encodeURIComponent(`1-on-1 Discovery Call | Create and Arise`);
    const gCalDetails = encodeURIComponent(
      `Discovery & Strategy Call with Jerome Cabinta and the Create and Arise Creative Studio.\n\n` +
      `👤 Client: ${name} (${email})\n` +
      `🎯 Service: ${service}\n` +
      `💻 Platform: ${platform}\n` +
      `⏰ Philippine Time: ${time}\n` +
      `🌐 Client Local Time: ${timeLocal} (${schedulerState.userTimezone})\n` +
      `📝 Notes: ${notes}\n\n` +
      `Official Studio: Create and Arise (La Trinidad, Benguet / Serving Worldwide)\n` +
      `WhatsApp: +63 927 468 2635 | createandarise05@gmail.com`
    );
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${gCalTitle}&dates=${startIso}/${endIso}&details=${gCalDetails}&location=${encodeURIComponent(platform)}`;

    // Standard RFC-5545 iCalendar data
    const uid = `${bookingId}@createandarise.com`;
    const nowIso = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Create and Arise//Discovery Call Scheduler//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:REQUEST',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${nowIso}`,
      `DTSTART:${startIso}`,
      `DTEND:${endIso}`,
      `SUMMARY:1-on-1 Discovery Call | Create and Arise`,
      `DESCRIPTION:1-on-1 Strategy Session with Jerome Cabinta & the Create and Arise creative team.\\nPlatform: ${platform}\\nService: ${service}\\nBooking ID: ${bookingId}`,
      `LOCATION:${platform}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder: Create and Arise Discovery Call in 15 minutes',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const dtObj = new Date(`${date}T12:00:00`);
    const formattedDate = dtObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

    const detailsHtml = `
      <div style="display: flex; flex-direction: column; gap: 0.4rem; color: var(--text-main);">
        <div style="font-size: 0.8rem; color: var(--text-gold); font-weight: 700;">🔖 Booking Ref: ${bookingId}</div>
        <div><strong>👤 Client:</strong> ${name} &bull; <span style="color: var(--color-primary);">${email}</span></div>
        <div><strong>📅 Scheduled Date:</strong> ${formattedDate}</div>
        <div><strong>⏰ Scheduled Time:</strong> ${time} <span style="color: var(--text-muted); font-size: 0.8rem;">(${timeLocal} local)</span></div>
        <div><strong>💻 Meeting Platform:</strong> ${platform}</div>
        <div><strong>🎯 Service:</strong> ${service}</div>
      </div>
    `;

    const whatsappMsg = `Hi Create and Arise! I'm ${name} (${email}). I just scheduled a 1-on-1 strategy call for ${formattedDate} at ${time} via ${platform} (Ref: ${bookingId}). Looking forward to connecting!`;
    const mailtoSub = `Discovery Call Confirmed: ${name} - ${formattedDate} (${time})`;
    const mailtoBody = `Hi Create and Arise Creative Team,\n\nI have scheduled our 1-on-1 strategy call:\n\nBooking Ref: ${bookingId}\nDate: ${formattedDate}\nTime: ${time} (${timeLocal} local)\nPlatform: ${platform}\nService: ${service}\nNotes: ${notes}\n\nBest,\n${name}\n${email}`;

    submitBtn.innerHTML = origHtml;
    submitBtn.disabled = false;
    form.reset();
    closeModal('bookCallModal');
    switchBookingStep(1);

    showRichSuccessModal({
      title: 'Strategy Call Confirmed! 📅',
      desc: `Thank you, <strong>${name}</strong>! Your 1-on-1 discovery call is scheduled for <strong>${formattedDate}</strong> at <strong>${time}</strong> via <strong>${platform}</strong>. A calendar invite &amp; email confirmation copy have been sent to <strong>${email}</strong>!`,
      detailsHtml: detailsHtml,
      whatsappMsg: whatsappMsg,
      mailtoSubject: mailtoSub,
      mailtoBody: mailtoBody,
      googleCalUrl: googleCalUrl,
      icsData: icsContent,
      icsFilename: `Create-and-Arise-Discovery-Call-${date}.ics`,
      clientEmail: email
    });

    showToast(`🎉 Call scheduled for ${formattedDate}!`);

    // Reload booked slots to disable this slot in real-time
    loadBookedSlots().then(() => {
      renderCalendar();
      if (schedulerState.selectedDate) renderTimeSlots(schedulerState.selectedDate);
    });
  });
}

/* --------------------------------------------------------------------------
   8.8. Free Brand & Website Audit Modal Handling
   -------------------------------------------------------------------------- */
window.openAuditModal = function () {
  if (typeof window.openModal === 'function') {
    window.openModal('auditModal');
  } else {
    const modal = document.getElementById('auditModal');
    if (modal) modal.classList.add('active');
    document.body.classList.add('modal-open');
  }
};

function initAuditModal() {
  const auditForm = document.getElementById('auditForm');
  if (!auditForm) return;

  auditForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('auditName')?.value.trim();
    const email = document.getElementById('auditEmail')?.value.trim();
    const website = document.getElementById('auditWebsite')?.value.trim();
    const concern = document.getElementById('auditConcern')?.value || 'General Conversion & Brand Audit';

    if (!name || !email || !website) {
      showToast('Please fill out your name, email, and website/social link.');
      return;
    }

    const submitBtn = auditForm.querySelector('button[type="submit"]');
    const origText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Submitting Audit Request...</span>`;
    submitBtn.disabled = true;

    const payload = {
      name: name,
      email: email,
      _replyto: email,
      website_or_handle: website,
      primary_challenge: concern,
      _subject: `🔍 Free 5-Point Brand & Web Audit Request: ${name} (${website})`,
      _template: 'table',
      _captcha: 'false'
    };

    const detailsHtml = `
      <div style="display: flex; flex-direction: column; gap: 0.35rem; color: var(--text-main);">
        <div><strong>👤 Client:</strong> ${name} &bull; <span style="color: var(--color-primary);">${email}</span></div>
        <div><strong>🌐 Website / Social Handle:</strong> ${website}</div>
        <div><strong>🔍 Audit Focus:</strong> ${concern}</div>
      </div>
    `;

    const whatsappMsg = `Hi Create and Arise! I'm ${name} (${email}). I just requested a Free 5-Point Brand & Web Audit for my brand (${website}). Primary focus: ${concern}.`;
    const mailtoSub = `Free 5-Point Audit Request: ${name} - ${website}`;
    const mailtoBody = `Hi Create and Arise Team,\n\nI requested a free 5-point audit diagnostic for ${website}.\n\nName: ${name}\nEmail: ${email}\nFocus Area: ${concern}\n\nLooking forward to your 5-point brand & UX audit report!`;

    await window.sendFormSubmission(payload);

    submitBtn.innerHTML = origText;
    submitBtn.disabled = false;
    auditForm.reset();
    closeModal('auditModal');

    showRichSuccessModal({
      title: 'Free 5-Point Audit Claimed!',
      desc: `Thank you, <strong>${name}</strong>! We have received your audit request for <strong>${website}</strong>. The Create and Arise creative team will compile your personalized 5-point brand & UX diagnostic report and send it to <strong>${email}</strong> within 48 business hours!`,
      detailsHtml: detailsHtml,
      whatsappMsg: whatsappMsg,
      mailtoSubject: mailtoSub,
      mailtoBody: mailtoBody,
      clientEmail: email
    });

    showToast(`🎉 Free audit requested for ${website}! Check your email within 48h.`);
  });
}

window.startProjectPrompt = function () {
  if (window.switchTab) {
    window.switchTab('contact');
  }
  const msg = document.getElementById('contactMessage');
  if (msg && !msg.value) {
    msg.value = `Hi Create and Arise team! I'm ready to start our project right away. Let's discuss onboarding and delivery milestones for an upcoming sprint.`;
  }
  showToast('⚡ Jumped to Project Inquiry Form with Express Priority!');
};

/* --------------------------------------------------------------------------
   9. Modals & Global Interactions
   -------------------------------------------------------------------------- */
function initModals() {
  window.openModal = function (modalId) {
    if (typeof window.closeMobileNav === 'function') {
      window.closeMobileNav();
    }
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.classList.add('modal-open');
    }
  };

  window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
    if (!document.querySelector('.modal-overlay.active')) {
      document.body.classList.remove('modal-open');
    }
  };

  // Close when clicking overlay backdrop
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        if (!document.querySelector('.modal-overlay.active')) {
          document.body.classList.remove('modal-open');
        }
      }
    });
  });

  // ESC key closes modals & mobile drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (typeof window.closeMobileNav === 'function') {
        window.closeMobileNav();
      }
      document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
      document.body.classList.remove('modal-open');
    }
  });
}

function initGlobalInteractions() {
  // Copy email to clipboard helper with visual button feedback
  window.copyEmail = function (e) {
    if (e) e.preventDefault();
    const email = 'createandarise05@gmail.com';
    const btn = e && e.target ? e.target.closest('button') : null;
    const origText = btn ? btn.innerHTML : 'Copy';

    navigator.clipboard.writeText(email).then(() => {
      if (btn) {
        btn.innerHTML = 'Copied! ✓';
        btn.style.borderColor = '#10b981';
        btn.style.color = '#10b981';
        setTimeout(() => {
          btn.innerHTML = origText;
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 2500);
      }
      showToast(`📋 Copied ${email} to clipboard!`);
    }).catch(() => {
      if (btn) {
        btn.innerHTML = 'Copied! ✓';
        setTimeout(() => {
          btn.innerHTML = origText;
        }, 2500);
      }
      showToast(`Email: ${email}`);
    });
  };

  // Update dynamic footer year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* --------------------------------------------------------------------------
   10. Helper Toast Notification
   -------------------------------------------------------------------------- */
function showToast(message) {
  let toast = document.getElementById('siteToast');
  if (!toast) {
    const container = document.createElement('div');
    container.className = 'toast-container';
    container.innerHTML = `<div id="siteToast" class="toast"></div>`;
    document.body.appendChild(container);
    toast = document.getElementById('siteToast');
  }

  toast.textContent = message;
  toast.classList.add('show');

  if (window.toastTimeout) clearTimeout(window.toastTimeout);
  window.toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* --------------------------------------------------------------------------
   11. Website Feedback Modal
   -------------------------------------------------------------------------- */
let _feedbackRating = 0;
let _feedbackCategory = '';

function openFeedbackModal() {
  const modal = document.getElementById('feedbackModal');
  if (!modal) return;

  // Reset the form state
  const form = document.getElementById('feedbackForm');
  if (form) form.reset();

  // Reset stars
  _feedbackRating = 0;
  _feedbackCategory = '';
  document.querySelectorAll('.star-btn').forEach(btn => btn.classList.remove('active'));
  const label = document.getElementById('starRatingLabel');
  if (label) label.textContent = '';

  // Reset categories
  document.querySelectorAll('.feedback-category-btn').forEach(btn => btn.classList.remove('selected'));

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Wire star buttons
  document.querySelectorAll('.star-btn').forEach(btn => {
    btn.onclick = function () {
      const val = parseInt(this.dataset.star);
      _feedbackRating = val;
      const labels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent! ⭐'];
      const labelEl = document.getElementById('starRatingLabel');
      if (labelEl) labelEl.textContent = `${val} / 5 — ${labels[val]}`;
      const ratingInput = document.getElementById('feedbackRatingInput');
      if (ratingInput) ratingInput.value = `${val} / 5 (${labels[val]})`;
      document.querySelectorAll('.star-btn').forEach(s => {
        s.classList.toggle('active', parseInt(s.dataset.star) <= val);
      });
    };
  });

  // Wire category buttons
  document.querySelectorAll('.feedback-category-btn').forEach(btn => {
    btn.onclick = function () {
      _feedbackCategory = this.dataset.category;
      const catInput = document.getElementById('feedbackCategoryInput');
      if (catInput) catInput.value = this.dataset.category;
      document.querySelectorAll('.feedback-category-btn').forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
    };
  });

  // Wire form submit
  if (form) {
    form.onsubmit = function (e) {
      e.preventDefault();
      const message = document.getElementById('feedbackMessage').value.trim();
      if (!message) {
        showToast('⚠️ Please share your feedback before submitting.');
        return;
      }
      if (_feedbackRating === 0) {
        showToast('⭐ Please select a star rating.');
        return;
      }

      const name = document.getElementById('feedbackName').value.trim() || 'Anonymous';
      const email = document.getElementById('feedbackEmail').value.trim();
      const category = _feedbackCategory || 'General';
      const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

      const subject = encodeURIComponent(`[Website Feedback] ${_feedbackRating}★ ${ratingLabels[_feedbackRating]} — ${category}`);
      const body = encodeURIComponent(
        `Website Feedback Submission\n` +
        `===========================\n` +
        `From: ${name}${email ? ' (' + email + ')' : ''}\n` +
        `Rating: ${_feedbackRating}/5 — ${ratingLabels[_feedbackRating]}\n` +
        `Category: ${category}\n\n` +
        `Feedback:\n${message}\n\n` +
        `---\nSent from Create and Arise website`
      );

      // Send to active form endpoint (Formspree / fallback)
      window.sendFormSubmission({
        name: name,
        email: email || 'anonymous@visitor.com',
        rating: `${_feedbackRating}/5 (${ratingLabels[_feedbackRating]})`,
        category: category,
        feedback: message,
        _subject: `[Website Feedback] ${_feedbackRating}★ ${ratingLabels[_feedbackRating]} — ${category}`
      }).catch(() => { });

      closeModal('feedbackModal');
      showToast(`✅ Thank you${name !== 'Anonymous' ? ', ' + name : ''}! Your feedback has been sent directly to Jerome & the team.`);
    };
  }
}

/* --------------------------------------------------------------------------
   HERO VIDEO SHOWREEL CONTROLLER
   -------------------------------------------------------------------------- */
function initHeroVideo() {
  const vid = document.getElementById('heroVideo');
  const ambientVid = document.getElementById('heroVideoAmbient');
  const playPauseBtn = document.getElementById('heroVideoPlayPauseBtn');
  const muteBtn = document.getElementById('heroVideoMuteBtn');
  const fsBtn = document.getElementById('heroVideoFullscreenBtn');
  const soundText = document.getElementById('heroVideoSoundText');

  if (!vid) return;

  function updatePlayState(isPlaying) {
    if (!playPauseBtn) return;
    const pauseIcon = playPauseBtn.querySelector('.icon-pause');
    const playIcon = playPauseBtn.querySelector('.icon-play');
    if (pauseIcon && playIcon) {
      pauseIcon.style.display = isPlaying ? 'block' : 'none';
      playIcon.style.display = isPlaying ? 'none' : 'block';
    }
    playPauseBtn.setAttribute('aria-label', isPlaying ? 'Pause video' : 'Play video');
    playPauseBtn.setAttribute('title', isPlaying ? 'Pause Video' : 'Play Video');
    if (ambientVid) {
      if (isPlaying && ambientVid.paused) ambientVid.play().catch(() => {});
      else if (!isPlaying && !ambientVid.paused) ambientVid.pause();
    }
  }

  function updateMuteState(isMuted) {
    if (!muteBtn) return;
    const iconMuted = muteBtn.querySelector('.icon-muted');
    const iconUnmuted = muteBtn.querySelector('.icon-unmuted');
    if (iconMuted && iconUnmuted) {
      iconMuted.style.display = isMuted ? 'block' : 'none';
      iconUnmuted.style.display = isMuted ? 'none' : 'block';
    }
    if (soundText) {
      soundText.textContent = isMuted ? 'Sound Off' : 'Sound On';
    }
    muteBtn.setAttribute('title', isMuted ? 'Unmute Sound' : 'Mute Sound');
  }

  // Play / Pause Click
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (vid.paused) {
        vid.play().catch(() => {});
        updatePlayState(true);
      } else {
        vid.pause();
        updatePlayState(false);
      }
    });
  }

  // Click on video directly to toggle play/pause
  vid.addEventListener('click', () => {
    if (vid.paused) {
      vid.play().catch(() => {});
      updatePlayState(true);
    } else {
      vid.pause();
      updatePlayState(false);
    }
  });

  // Sound Toggle Click
  if (muteBtn) {
    muteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      vid.muted = !vid.muted;
      updateMuteState(vid.muted);
      if (!vid.muted && vid.paused) {
        vid.play().catch(() => {});
        updatePlayState(true);
      }
    });
  }

  // Fullscreen Click
  if (fsBtn) {
    fsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (vid.requestFullscreen) {
        vid.requestFullscreen();
      } else if (vid.webkitRequestFullscreen) {
        vid.webkitRequestFullscreen();
      } else if (vid.msRequestFullscreen) {
        vid.msRequestFullscreen();
      }
    });
  }

  // Video Events Sync
  vid.addEventListener('play', () => updatePlayState(true));
  vid.addEventListener('pause', () => updatePlayState(false));
  vid.addEventListener('volumechange', () => updateMuteState(vid.muted));
  vid.addEventListener('timeupdate', () => {
    if (ambientVid && Math.abs(ambientVid.currentTime - vid.currentTime) > 0.5) {
      ambientVid.currentTime = vid.currentTime;
    }
  });

  // Autoplay attempt
  const playPromise = vid.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      vid.muted = true;
      vid.play().catch(() => {});
    });
  }

  // Video initialized cleanly in borderless responsive format
}

// Switch between Desktop Widescreen Mockup and Mobile Phone Reel Mockup
window.setHeroMockupMode = function(mode) {
  const wrapper = document.getElementById('heroVisualWrapper');
  const btnDesktop = document.getElementById('btnModeDesktop');
  const btnPhone = document.getElementById('btnModePhone');
  const ambientVid = document.getElementById('heroVideoAmbient');

  if (!wrapper) return;

  const isPhone = (mode === 'phone');
  wrapper.classList.toggle('mode-phone', isPhone);

  if (btnDesktop) btnDesktop.classList.toggle('active', !isPhone);
  if (btnPhone) btnPhone.classList.toggle('active', isPhone);

  if (ambientVid) {
    if (isPhone) ambientVid.pause();
    else ambientVid.play().catch(() => {});
  }

  if (typeof showToast === 'function') {
    showToast(isPhone ? '📱 Switched to 9:16 Mobile Reel Mockup' : '💻 Switched to Widescreen Desktop Showcase');
  }
};

// Toggle between Fit (entire video visible) and Fill (zoomed to cover frame)
window.toggleHeroVideoFit = function() {
  const vid = document.getElementById('heroVideo');
  const fitText = document.getElementById('heroVideoFitText');
  if (!vid) return;

  const isContain = vid.classList.contains('fit-contain');
  if (isContain) {
    vid.classList.remove('fit-contain');
    vid.classList.add('fit-cover');
    if (fitText) fitText.textContent = 'Fill';
    if (typeof showToast === 'function') showToast('🔍 Video Fill mode (full bleed)');
  } else {
    vid.classList.remove('fit-cover');
    vid.classList.add('fit-contain');
    if (fitText) fitText.textContent = 'Fit';
    if (typeof showToast === 'function') showToast('📐 Video Fit mode (entire video visible)');
  }
};

window.focusHeroVideo = function () {
  const vid = document.getElementById('heroVideo');
  const frame = document.querySelector('.hero-browser-frame');
  if (vid) {
    vid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (vid.paused) {
      vid.play().catch(() => {});
    }
    vid.muted = false;
    const soundText = document.getElementById('heroVideoSoundText');
    const muteBtn = document.getElementById('heroVideoMuteBtn');
    if (muteBtn) {
      const iconMuted = muteBtn.querySelector('.icon-muted');
      const iconUnmuted = muteBtn.querySelector('.icon-unmuted');
      if (iconMuted) iconMuted.style.display = 'none';
      if (iconUnmuted) iconUnmuted.style.display = 'block';
    }
    if (soundText) soundText.textContent = 'Sound On';

    if (frame) {
      frame.classList.add('video-focused-glow');
      setTimeout(() => frame.classList.remove('video-focused-glow'), 2500);
    }
    if (typeof showToast === 'function') {
      showToast('🔊 Studio showreel playing with sound!');
    }
  }
};

// Initialize on DOM ready or immediately if already loaded
function initMediaPlayers() {
  initHeroVideo();
  initAboutVideo();
}

/* --------------------------------------------------------------------------
   ABOUT US ANIMATION VIDEO (Vid1) CONTROLLER
   -------------------------------------------------------------------------- */
function initAboutVideo() {
  const vid = document.getElementById('aboutVideo');
  const ambientVid = document.getElementById('aboutVideoAmbient');
  const playPauseBtn = document.getElementById('aboutVideoPlayPauseBtn');
  const muteBtn = document.getElementById('aboutVideoMuteBtn');
  const fsBtn = document.getElementById('aboutVideoFullscreenBtn');
  const soundText = document.getElementById('aboutVideoSoundText');
  const progressBar = document.getElementById('aboutVideoProgressBar');
  const progressWrap = document.getElementById('aboutVideoProgressWrap');
  const soundToggleBtn = document.getElementById('aboutAnimSoundToggleBtn');

  if (!vid) return;

  window.updateAboutPlayState = function (isPlaying) {
    if (!playPauseBtn) return;
    const pauseIcon = playPauseBtn.querySelector('.icon-pause');
    const playIcon = playPauseBtn.querySelector('.icon-play');
    if (pauseIcon && playIcon) {
      pauseIcon.style.display = isPlaying ? 'block' : 'none';
      playIcon.style.display = isPlaying ? 'none' : 'block';
    }
    playPauseBtn.setAttribute('aria-label', isPlaying ? 'Pause animation' : 'Play animation');
    playPauseBtn.setAttribute('title', isPlaying ? 'Pause Animation' : 'Play Animation');
    if (ambientVid) {
      if (isPlaying && ambientVid.paused) ambientVid.play().catch(() => {});
      else if (!isPlaying && !ambientVid.paused) ambientVid.pause();
    }
  };

  window.updateAboutMuteState = function (isMuted) {
    if (muteBtn) {
      const iconMuted = muteBtn.querySelector('.icon-muted');
      const iconUnmuted = muteBtn.querySelector('.icon-unmuted');
      if (iconMuted && iconUnmuted) {
        iconMuted.style.display = isMuted ? 'block' : 'none';
        iconUnmuted.style.display = isMuted ? 'none' : 'block';
      }
      muteBtn.setAttribute('title', isMuted ? 'Unmute Sound' : 'Mute Sound');
    }
    if (soundText) {
      soundText.textContent = isMuted ? 'Sound Off' : 'Sound On';
    }
    if (soundToggleBtn) {
      soundToggleBtn.innerHTML = isMuted ? '<span>🔊 Turn Sound On</span>' : '<span>🔇 Mute Sound</span>';
    }
  };

  // Play / Pause Click
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (vid.paused) {
        vid.play().catch(() => {});
        window.updateAboutPlayState(true);
      } else {
        vid.pause();
        window.updateAboutPlayState(false);
      }
    });
  }

  // Click on video directly to toggle play/pause
  vid.addEventListener('click', () => {
    if (vid.paused) {
      vid.play().catch(() => {});
      window.updateAboutPlayState(true);
    } else {
      vid.pause();
      window.updateAboutPlayState(false);
    }
  });

  // Sound Toggle Click
  if (muteBtn) {
    muteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      vid.muted = !vid.muted;
      window.updateAboutMuteState(vid.muted);
      if (!vid.muted && vid.paused) {
        vid.play().catch(() => {});
        window.updateAboutPlayState(true);
      }
      if (typeof showToast === 'function') {
        showToast(vid.muted ? '🔇 Animation audio muted' : '🔊 Animation audio playing!');
      }
    });
  }

  // Fullscreen Click
  if (fsBtn) {
    fsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (vid.requestFullscreen) {
        vid.requestFullscreen();
      } else if (vid.webkitRequestFullscreen) {
        vid.webkitRequestFullscreen();
      } else if (vid.msRequestFullscreen) {
        vid.msRequestFullscreen();
      }
    });
  }

  // Scrubber progress seek
  if (progressWrap) {
    progressWrap.addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = progressWrap.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      if (vid.duration) {
        vid.currentTime = pos * vid.duration;
      }
    });
  }

  // Video Events
  vid.addEventListener('play', () => window.updateAboutPlayState(true));
  vid.addEventListener('pause', () => window.updateAboutPlayState(false));
  vid.addEventListener('volumechange', () => window.updateAboutMuteState(vid.muted));
  vid.addEventListener('timeupdate', () => {
    if (vid.duration && progressBar) {
      const pct = (vid.currentTime / vid.duration) * 100;
      progressBar.style.width = pct + '%';
    }
    if (ambientVid && Math.abs(ambientVid.currentTime - vid.currentTime) > 0.4) {
      ambientVid.currentTime = vid.currentTime;
    }
  });

  // Autoplay attempt
  const playPromise = vid.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      vid.muted = true;
      vid.play().catch(() => {});
    });
  }
}

// Global actions for external buttons
window.replayAboutVideo = function () {
  const vid = document.getElementById('aboutVideo');
  if (vid) {
    vid.currentTime = 0;
    vid.play().catch(() => {});
    if (window.updateAboutPlayState) window.updateAboutPlayState(true);
    if (typeof showToast === 'function') showToast('🔄 Replaying Studio Animation');
  }
};

window.toggleAboutVideoSound = function () {
  const vid = document.getElementById('aboutVideo');
  if (vid) {
    vid.muted = !vid.muted;
    if (window.updateAboutMuteState) window.updateAboutMuteState(vid.muted);
    if (!vid.muted && vid.paused) {
      vid.play().catch(() => {});
      if (window.updateAboutPlayState) window.updateAboutPlayState(true);
    }
    if (typeof showToast === 'function') {
      showToast(vid.muted ? '🔇 Animation audio muted' : '🔊 Animation audio playing!');
    }
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMediaPlayers);
} else {
  initMediaPlayers();
}

/* --------------------------------------------------------------------------
   STRATEGIC ARTICLE READER & LEGAL MODAL CONTROLLERS
   -------------------------------------------------------------------------- */
const strategicArticles = [
  {
    id: 1,
    title: "Why Conversion-Driven Web Design Outperforms Generic Templates (And What to Do Instead)",
    category: "Web Design & CRO",
    date: "October 2026",
    readTime: "4 min read",
    author: "Jerome Cabinta",
    authorRole: "Founder & Lead Web Developer",
    authorAvatar: "JC",
    image: "assets/images/web-design.jpg",
    subtitle: "The hidden commercial cost of multi-purpose theme bloat, and the engineering principles that yield 4.8x conversion lifts.",
    highlights: [
      { num: "0.4s", label: "Custom Load Speed (vs 8.4s Template)" },
      { num: "4.8x", label: "Average Conversion Lift" },
      { num: "99/100", label: "Google Core Web Vitals" }
    ],
    sections: [
      {
        heading: "The Bloated Template Trap",
        text: "Off-the-shelf templates look attractive in previews, but they are built to cater to everyone at once. They bundle 150+ unused CSS/JS libraries, 18 font weights, and convoluted page-builder DOM structures that delay mobile First Contentful Paint (FCP) by 4 to 8 seconds. In real-world commerce, a 1-second delay reduces conversions by up to 27%."
      },
      {
        heading: "Engineered for Conversion Velocity",
        text: "Create and Arise builds websites from clean, hand-crafted semantic HTML, modular CSS, and purposeful vanilla JavaScript. By eliminating heavy dependencies, our web platforms consistently hit sub-500ms response times. We structure the layout around the natural 'F-Pattern' gaze path, placing high-contrast visual anchors and interactive quotation tools directly where prospective clients make decisions."
      },
      {
        heading: "5-Point Conversion Architecture Checklist",
        list: [
          "<strong>Speed Baseline:</strong> Total page payload under 1.5MB and mobile interactive time &lt; 1.0s.",
          "<strong>Single Primary Action:</strong> Clear above-the-fold value proposition with frictionless booking or quotation.",
          "<strong>Friction-Free Multi-Step Forms:</strong> Chunking form inputs into micro-steps increases completion rates by 42%.",
          "<strong>Contextual Social Proof:</strong> Placing verified metrics and client results right next to conversion triggers.",
          "<strong>Sticky Navigation Anchors:</strong> Seamless header controls that allow users to convert at any scroll depth."
        ]
      }
    ],
    ctaService: "Web Design & Development",
    ctaKey: "web"
  },
  {
    id: 2,
    title: "The Psychology of Visual Branding: How Cohesive Identity Builds Long-Term Customer Trust",
    category: "Brand Identity & Design Psychology",
    date: "October 2026",
    readTime: "5 min read",
    author: "Jerome Cabinta & Elijah Morales",
    authorRole: "Creative Directors, Create and Arise",
    authorAvatar: "CA",
    image: "assets/images/graphic_branding_showcase_1790782413205.jpg",
    subtitle: "Why consumers formulate commercial trust in under 50 milliseconds, and how color harmony signals premium valuation.",
    highlights: [
      { num: "50ms", label: "Subconscious First Impression Window" },
      { num: "3.4x", label: "Average Order Value with Bespoke Branding" },
      { num: "100%", label: "Commercial Vector & Source IP Rights" }
    ],
    sections: [
      {
        heading: "The Neuro-Aesthetics of Trust",
        text: "Human cognitive processing assesses visual hierarchy, balance, and color harmony within 50 milliseconds (0.05 seconds). When a potential buyer lands on your brand touchpoint, their subconscious immediately computes whether your business represents authority or amateurism before reading a single line of copy."
      },
      {
        heading: "The Peril of Fragmented Brand Collateral",
        text: "Using disjointed Canva templates, inconsistent typography, and low-resolution raster graphics causes 'brand cognitive dissonance.' When social ads look different from packaging, or when the website uses different fonts from the sales deck, customers perceive risk and demand discounts. A disciplined design system eliminates this friction."
      },
      {
        heading: "4 Pillars of an Enduring Brand Identity",
        list: [
          "<strong>Primary Monogram &amp; Iconography:</strong> A distinct, mathematically balanced symbol that scales from 16px favicon to outdoor billboard.",
          "<strong>Disciplined Color Tokens:</strong> Curated palette (Obsidian Dark for exclusivity, Amber Gold for warmth and excellence, Emerald for psychological trust).",
          "<strong>Typography Hierarchy:</strong> Clear distinction between editorial display serifs and clean, modern sans-serif body type.",
          "<strong>Full Commercial IP Handover:</strong> Vector source deliverables (AI, SVG, EPS, PDF, Figma) ensuring lifetime operational freedom."
        ]
      }
    ],
    ctaService: "Graphic Design & Brand Identity",
    ctaKey: "graphics"
  },
  {
    id: 3,
    title: "Why Ad Creatives Fatigue (And How Strategic Funnel Optimization Sustains 3x ROAS)",
    category: "Digital Paid Ads & ROAS",
    date: "October 2026",
    readTime: "4 min read",
    author: "Create and Arise Performance Marketing Team",
    authorRole: "Paid Ads & Growth Strategists",
    authorAvatar: "PA",
    image: "assets/images/digital-ads.jpg",
    subtitle: "How to escape rising CPA and ad exhaustion through modular creative testing and landing page congruence.",
    highlights: [
      { num: "3.8x", label: "Average Return on Ad Spend (ROAS)" },
      { num: "7-Day", label: "Iterative Creative Refresh Cadence" },
      { num: "-42%", label: "Reduction in Cost Per Acquisition (CPA)" }
    ],
    sections: [
      {
        heading: "The 14-Day Creative Fatigue Cliff",
        text: "In algorithmic ad platforms like Meta, TikTok, and Google, creative fatigue occurs when audience frequency surpasses 2.5 to 3.0. Click-Through Rates (CTR) drop sharply, while Cost Per Acquisition (CPA) spikes by 40% to 70%. Media buyers often blame targeting, when in reality the ad creative has simply lost its novelty."
      },
      {
        heading: "Dynamic Creative Testing (DCT) Engine",
        text: "We combat creative fatigue with modular sprint testing: 3 distinct emotional hooks (Pain Point, Positive Transformation, Counter-Intuitive Fact) multiplied by 2 visual formats (Clean Static Vector vs High-Energy Motion Reel) and 2 compelling CTAs. This systematically reveals breakout winners without wasting client ad budget."
      },
      {
        heading: "The Landing Page Congruence Rule",
        list: [
          "<strong>Visual &amp; Verbal Mirroring:</strong> The headline on the landing page must immediately echo the promise made in the ad creative.",
          "<strong>Eliminate Navigation Leaks:</strong> Paid traffic landing pages must minimize distracting outbound links to maximize the primary conversion.",
          "<strong>Mobile-First Load Speeds:</strong> Ad traffic bounces immediately if pages take longer than 1.5s to render.",
          "<strong>Social Proof Escalation:</strong> Retargeting ads must feature customer video testimonials and quantified business outcomes."
        ]
      }
    ],
    ctaService: "Digital Ads & Paid Campaigns",
    ctaKey: "ads"
  }
];

window.openArticleModal = function (articleId) {
  const article = strategicArticles.find(a => a.id === parseInt(articleId));
  if (!article) return;

  const modal = document.getElementById('articleModal');
  const body = document.getElementById('articleModalBody');
  if (!modal || !body) return;

  body.innerHTML = `
    <div class="article-reader-container">
      <!-- Article Header -->
      <div class="article-reader-header">
        <div class="article-reader-meta-row">
          <span class="section-tag" style="margin-bottom: 0;">${article.category}</span>
          <span class="article-reader-chip">⏱️ ${article.readTime}</span>
          <span class="article-reader-chip">📅 ${article.date}</span>
        </div>
        <h2 id="articleModalTitle" class="article-reader-title">${article.title}</h2>
        <p class="article-reader-subtitle">${article.subtitle}</p>

        <!-- Author Strip -->
        <div class="article-reader-author-strip">
          <div class="author-avatar">${article.authorAvatar}</div>
          <div class="author-details">
            <div class="author-name">${article.author}</div>
            <div class="author-role">${article.authorRole}</div>
          </div>
        </div>
      </div>

      <!-- Hero Image -->
      <div class="article-reader-media">
        <img src="${article.image}" alt="${article.title}" class="article-reader-img">
      </div>

      <!-- Key Metric Highlights -->
      <div class="article-reader-highlights">
        ${article.highlights.map(h => `
          <div class="article-highlight-box">
            <div class="highlight-num">${h.num}</div>
            <div class="highlight-lbl">${h.label}</div>
          </div>
        `).join('')}
      </div>

      <!-- Article Content Sections -->
      <div class="article-reader-content">
        ${article.sections.map(sec => `
          <div class="article-content-section">
            <h3 class="article-section-h3">${sec.heading}</h3>
            ${sec.text ? `<p class="article-paragraph">${sec.text}</p>` : ''}
            ${sec.list ? `
              <ul class="article-checklist">
                ${sec.list.map(li => `<li>${li}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        `).join('')}
      </div>

      <!-- Article Action Ribbons -->
      <div class="article-reader-footer-box">
        <div class="article-footer-left">
          <div style="font-weight: 700; color: #f8fafc; font-size: 1.05rem; margin-bottom: 0.25rem;">
            Ready to implement this strategy for your business?
          </div>
          <p style="color: var(--text-muted); font-size: 0.86rem; margin: 0;">
            Speak directly with Jerome Cabinta and our creative specialists.
          </p>
        </div>
        <div class="article-footer-actions">
          <button type="button" class="btn btn-primary btn-glow" onclick="closeModal('articleModal'); switchTab('estimator');">
            <span>Estimate ${article.ctaService.split('&')[0].trim()} Package</span>
          </button>
          <button type="button" class="btn btn-book-call" onclick="closeModal('articleModal'); openBookCallModal();">
            <span>📅 Book Free Call</span>
          </button>
          <button type="button" class="btn btn-secondary" onclick="closeModal('articleModal')">
            <span>Close Guide</span>
          </button>
        </div>
      </div>
    </div>
  `;

  if (typeof window.openModal === 'function') {
    window.openModal('articleModal');
  } else {
    modal.classList.add('active');
  }
};

/* --------------------------------------------------------------------------
   TRANSPARENT LEGAL & IP MODAL CONTROLLER
   -------------------------------------------------------------------------- */
const legalContent = {
  privacy: `
    <div class="legal-doc-wrap">
      <h4 class="legal-doc-title">Client Privacy &amp; Data Stewardship Policy</h4>
      <p class="legal-updated">Last Updated: October 2026 &bull; Compliant with Global Best Practices &amp; RA 10173</p>
      
      <div class="legal-doc-section">
        <h5>1. Purpose-Driven Data Stewardship</h5>
        <p>At Create and Arise, our Christian faith guides our business integrity. We collect only the information necessary to fulfill project requirements, communications, and bookings (client name, verified email, telephone/WhatsApp contact, and project specifications). We treat your data as a sacred trust.</p>
      </div>

      <div class="legal-doc-section">
        <h5>2. Absolute Zero Data Selling or Third-Party Disclosures</h5>
        <p>We do not sell, rent, monetize, or disclose client contact information or proprietary business materials to any advertising networks, third-party brokers, or data harvesters. All project communications remain strictly between your team and Create and Arise.</p>
      </div>

      <div class="legal-doc-section">
        <h5>3. Non-Disclosure &amp; Commercial Confidentiality</h5>
        <p>All brand assets, unreleased product ideas, pitch decks, sales figures, and proprietary codebase files shared with us during discovery calls or production sprints are held under strict commercial confidentiality. We are always willing to sign a bilateral mutual Non-Disclosure Agreement (NDA) prior to project kick-off.</p>
      </div>

      <div class="legal-doc-section">
        <h5>4. Data Erasure &amp; Portability Rights</h5>
        <p>Clients retain full rights to request complete deletion of their contact records, message history, and server logs at any time by emailing <strong>createandarise05@gmail.com</strong>. All verified erasure requests are executed within 48 business hours.</p>
      </div>
    </div>
  `,
  terms: `
    <div class="legal-doc-wrap">
      <h4 class="legal-doc-title">Terms of Service &amp; Project Engagements</h4>
      <p class="legal-updated">Last Updated: October 2026 &bull; Professional Creative Standard</p>
      
      <div class="legal-doc-section">
        <h5>1. Service Scope &amp; Structured Sprints</h5>
        <p>All graphic design, web design, paid ad management, and social media deliverables are outlined in a transparent written scope of work or itemized quotation before commencement. Production operates Monday to Friday, 8:00 AM to 6:00 PM PHT. Weekends are reserved for spiritual rest and family.</p>
      </div>

      <div class="legal-doc-section">
        <h5>2. Milestone Payment Model</h5>
        <p>Standard fixed-scope projects operate on a 50% initial commitment deposit to secure the studio sprint schedule, and 50% upon final client sign-off and before production source handover. Monthly retainer contracts are billed at the beginning of each 30-day cycle with no lock-in contracts.</p>
      </div>

      <div class="legal-doc-section">
        <h5>3. Revisions &amp; Quality Guarantee</h5>
        <p>We provide multiple dedicated revision rounds during active sprint phases to guarantee that the final deliverable matches your vision. Revisions must align with the approved creative brief. Significant structural pivots beyond the initial brief are accommodated via a clear, written change-order agreement.</p>
      </div>

      <div class="legal-doc-section">
        <h5>4. Cancellation &amp; Fair Settlement</h5>
        <p>Either party may terminate an engagement with written notice. In the event of early cancellation, the client is only billed for work successfully executed up to the date of notice, and all completed files are handed over promptly.</p>
      </div>
    </div>
  `,
  ip: `
    <div class="legal-doc-wrap">
      <h4 class="legal-doc-title">100% Intellectual Property Handover Guarantee</h4>
      <p class="legal-updated">Full Commercial Rights &bull; Zero Vendor Lock-In &bull; Lifetime Commercial Freedom</p>
      
      <div class="legal-doc-section">
        <h5>1. Complete Commercial Ownership Transfer</h5>
        <p>Upon settlement of the final project invoice, <strong>all intellectual property rights, trademarks, copyright ownership, and commercial exploitation rights</strong> for all finalized assets created specifically for your project transfer 100% to you (the Client).</p>
      </div>

      <div class="legal-doc-section">
        <h5>2. Unrestricted Source Asset Handover</h5>
        <p>Unlike agencies that withhold native working files to force expensive retainers, Create and Arise provides complete, organized source deliverables:
        <ul style="margin: 0.5rem 0 0.5rem 1.25rem; color: var(--text-main); font-size: 0.88rem; line-height: 1.6;">
          <li><strong>Graphic &amp; Brand Assets:</strong> Editable Adobe Illustrator (.AI), vector EPS, SVG, print-ready PDF, and high-res PNG/WebP exports.</li>
          <li><strong>Web Platforms:</strong> Fully unminified source code (HTML, CSS, JS), modular component files, and server configuration files with zero obfuscation.</li>
          <li><strong>Design Systems:</strong> Comprehensive Figma workspace links with full editing and component permissions.</li>
        </ul>
        </p>
      </div>

      <div class="legal-doc-section">
        <h5>3. Zero Royalty Claims &amp; No Vendor Lock-In</h5>
        <p>Create and Arise claims zero perpetual royalties, zero licensing fees, and zero vendor lock-in. You are free to modify, expand, commercialize, or re-license your assets forever.</p>
      </div>

      <div class="legal-doc-section">
        <h5>4. Portfolio Showcase Rights</h5>
        <p>Create and Arise reserves only the standard industry courtesy right to display non-confidential project snapshots in our creative portfolio, unless the client specifically requests a private white-label engagement under NDA.</p>
      </div>
    </div>
  `
};

window.openLegalModal = function (tabName) {
  if (!tabName) tabName = 'privacy';
  const modal = document.getElementById('legalModal');
  const body = document.getElementById('legalModalBody');
  if (!modal || !body) return;

  window.switchLegalTab(tabName);

  if (typeof window.openModal === 'function') {
    window.openModal('legalModal');
  } else {
    modal.classList.add('active');
  }
};

window.switchLegalTab = function (tabName, btnElem) {
  const body = document.getElementById('legalModalBody');
  if (!body) return;

  const content = legalContent[tabName] || legalContent.privacy;
  body.innerHTML = content;

  document.querySelectorAll('.legal-tab-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElem) {
    btnElem.classList.add('active');
  } else {
    const defaultBtn = document.getElementById(`legalTabBtn${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
    if (defaultBtn) defaultBtn.classList.add('active');
  }
};


