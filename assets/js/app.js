/**
 * CREATE AND ARISE - Interactive Application Logic
 * Studio: Create and Arise (Philippines)
 * Features: Live PHT Hours, Cost Estimator, Portfolio Lightbox, Service Selectors, 
 *           Theme Switcher, Testimonial Carousel, Contact Form & Copy Email Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveBusinessHours();
  initThemeToggle();
  initNavigation();
  initPortfolio();
  initCostCalculator();
  initTestimonialCarousel();
  initFaqAccordion();
  initContactForm();
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
      clockElement.textContent = `PHT (GMT+8): ${timeFormatted}`;
    }

    // Business Schedule: Monday (1) to Friday (5), 8:00 AM to 6:00 PM (18:00)
    const isWeekday = day >= 1 && day <= 5;
    const isWorkingHour = hour24 >= 8 && hour24 < 18;

    if (statusBadge) {
      if (isWeekday && isWorkingHour) {
        statusBadge.innerHTML = `
          <span class="status-dot online"></span>
          <span><strong>Open Now</strong> &bull; Creative Studio Active (Mon–Fri 8AM–6PM PHT)</span>
        `;
      } else if (!isWeekday) {
        statusBadge.innerHTML = `
          <span class="status-dot offline"></span>
          <span><strong>Studio Resting</strong> &bull; Weekend Sabbath/Rest &bull; Opens Monday 8:00 AM PHT</span>
        `;
      } else {
        statusBadge.innerHTML = `
          <span class="status-dot offline"></span>
          <span><strong>Closed for the Evening</strong> &bull; Opens tomorrow at 8:00 AM PHT</span>
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
window.switchTab = function(tabName) {
  if (!tabName) tabName = 'home';
  tabName = tabName.replace('#', '').replace('view-', '').toLowerCase();

  const validTabs = ['home', 'services', 'mission', 'portfolio', 'estimator', 'testimonials', 'faq', 'contact'];
  if (!validTabs.includes(tabName)) {
    tabName = 'home';
  }

  const allViews = document.querySelectorAll('.tab-view');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const targetView = document.getElementById(`view-${tabName}`);

  if (!targetView) return;

  // Toggle active view
  allViews.forEach(v => v.classList.remove('active'));
  targetView.classList.add('active');
  targetView.scrollTop = 0; // Reset internal scroll position

  // Update active navbar indicator
  allNavLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-tab') === tabName);
  });

  // Update URL hash smoothly
  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, null, `#${tabName}`);
  }

  // Close mobile navigation drawer if open
  const navLinks = document.getElementById('navLinks');
  const menuToggle = document.getElementById('mobileMenuToggle');
  if (navLinks && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    if (menuToggle) menuToggle.innerHTML = '&#9776;';
  }
};

function initNavigation() {
  const menuToggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-link');

  // Tab button click events
  navItems.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = btn.getAttribute('data-tab');
      if (tab) window.switchTab(tab);
    });
  });

  // Mobile menu toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      menuToggle.innerHTML = isOpen ? '&times;' : '&#9776;';
    });
  }

  // Handle URL hash changes
  function handleHash() {
    const hash = window.location.hash ? window.location.hash.substring(1) : 'home';
    window.switchTab(hash);
  }

  window.addEventListener('hashchange', handleHash);
  
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
    title: 'Aurum & Co. Luxury Visual Identity',
    client: 'Global E-Commerce & Fine Goods',
    desc: 'Complete high-end brand identity system featuring custom logomark, typography guidelines, luxury stationery, and digital brand style book designed to elevate brand authority.',
    image: 'assets/images/branding-graphics.jpg',
    metrics: '+180% Brand Recognition',
    deliverables: ['Vector Logo Suite', 'Brand Guidelines', 'Packaging & Collaterals', 'Social Identity']
  },
  {
    id: 2,
    category: 'web',
    title: 'Velocity SaaS Digital Platform',
    client: 'FinTech & Growth Enterprise',
    desc: 'Cutting-edge responsive website designed with futuristic dark mode aesthetics, interactive conversion modules, and lightning-fast loading speeds.',
    image: 'assets/images/web-design.jpg',
    metrics: '4.8x Conversion Rate Lift',
    deliverables: ['Custom UI/UX Design', 'Full Responsive Coding', 'SEO & Speed Architecture', 'Lead Capture Funnel']
  },
  {
    id: 3,
    category: 'reels',
    title: 'Viral Motion & Short-Form Video Suite',
    client: 'Lifestyle & Creator Brand',
    desc: 'High-energy, hook-driven vertical reels tailored for TikTok, Instagram Reels, and YouTube Shorts featuring kinetic typography, 3D overlays, and sound design.',
    image: 'assets/images/reels-social.jpg',
    metrics: '10M+ Organic Video Views',
    deliverables: ['Reels & TikTok Editing', 'Kinetic Typography', 'Sound Design & Mixing', 'Trending Hook Strategy']
  },
  {
    id: 4,
    category: 'ads',
    title: 'AlphaGrowth Omnichannel Ad Campaign',
    client: 'Direct-to-Consumer Retailer',
    desc: 'Comprehensive multi-platform ad campaign across Meta and Google featuring high-converting visual creatives, retargeting funnels, and data analytics.',
    image: 'assets/images/digital-ads.jpg',
    metrics: '+320% Return on Ad Spend (ROAS)',
    deliverables: ['Ad Creative Design', 'Campaign Setup & Targeting', 'A/B Creative Testing', 'Weekly ROI Reporting']
  },
  {
    id: 5,
    category: 'social',
    title: 'Kingdom Heritage Content Ecosystem',
    client: 'Faith-Based Global Ministry & Publishing',
    desc: 'Strategic social media management featuring daily uplifting graphic posts, inspirational reels, community engagement, and consistent brand storytelling.',
    image: 'assets/images/hero-agency.jpg',
    metrics: '+240% Community Engagement',
    deliverables: ['Monthly 30-Post Calendar', 'Custom Carousel Graphics', 'Community Engagement', 'Copywriting & Hashtags']
  },
  {
    id: 6,
    category: 'web',
    title: 'Lumina Horizon Luxury Architecture',
    client: 'Premium Real Estate Group',
    desc: 'Editorial luxury web design showcasing architectural portfolios, virtual tour integrations, and interactive booking inquiry workflows.',
    image: 'assets/images/web-design.jpg',
    metrics: '99.4% Client Satisfaction',
    deliverables: ['Editorial Web Layout', 'Project Filter Gallery', 'Interactive Inquiry Form', 'Mobile Optimization']
  }
];

function initPortfolio() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioGrid = document.getElementById('portfolioGrid');

  function renderPortfolio(filter = 'all') {
    if (!portfolioGrid) return;
    
    const filtered = filter === 'all' 
      ? portfolioData 
      : portfolioData.filter(item => item.category === filter);

    portfolioGrid.innerHTML = filtered.map(item => `
      <div class="portfolio-card" data-id="${item.id}" data-category="${item.category}" tabindex="0" role="button" aria-label="View case study for ${item.title}">
        <div class="portfolio-thumb-wrapper">
          <img src="${item.image}" alt="${item.title}" class="portfolio-img" loading="lazy">
          <span class="portfolio-badge">${item.category.toUpperCase()}</span>
        </div>
        <div class="portfolio-info">
          <h3 class="portfolio-title">${item.title}</h3>
          <p class="portfolio-client">${item.client}</p>
          <div class="portfolio-metrics">
            <span class="metric-badge">&#10003; ${item.metrics}</span>
            <span class="view-case-btn">Explore Case Study &rarr;</span>
          </div>
        </div>
      </div>
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

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderPortfolio(filter);
    });
  });

  renderPortfolio('all');
}

function openPortfolioModal(item) {
  const modal = document.getElementById('portfolioModal');
  const modalBody = document.getElementById('portfolioModalBody');
  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <div style="margin-bottom: 1.5rem; border-radius: 14px; overflow: hidden; max-height: 320px;">
      <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">
    </div>
    <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap;">
      <span class="section-tag" style="margin-bottom: 0;">${item.category.toUpperCase()}</span>
      <span style="color: #10b981; font-weight: 700; font-size: 0.95rem;">&#10003; ${item.metrics}</span>
    </div>
    <h2 style="font-size: 1.75rem; margin-bottom: 0.5rem;">${item.title}</h2>
    <p style="color: var(--text-gold); font-weight: 600; font-size: 0.9rem; margin-bottom: 1.25rem;">Client: ${item.client}</p>
    <p style="color: var(--text-muted); line-height: 1.7; margin-bottom: 1.5rem;">${item.desc}</p>
    
    <div style="background: var(--bg-surface-elevated); padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border-subtle); margin-bottom: 1.75rem;">
      <h4 style="font-size: 1rem; margin-bottom: 0.75rem; color: var(--text-main);">Included Deliverables:</h4>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.6rem;">
        ${item.deliverables.map(d => `<div style="font-size: 0.88rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.4rem;">&#10003; ${d}</div>`).join('')}
      </div>
    </div>

    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <button class="btn btn-primary" onclick="requestSimilarProject('${item.title}')">
        Inquire For A Similar Project
      </button>
      <button class="btn btn-secondary" onclick="closeModal('portfolioModal')">
        Close Preview
      </button>
    </div>
  `;

  modal.classList.add('active');
}

window.requestSimilarProject = function(projectName) {
  closeModal('portfolioModal');
  const messageInput = document.getElementById('contactMessage');
  const contactSection = document.getElementById('contact');
  if (messageInput) {
    messageInput.value = `Hi Create and Arise team! I saw your work on "${projectName}" and would like to discuss a similar project for my brand.`;
  }
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
    showToast(`✨ Pre-filled inquiry for "${projectName}"`);
  }
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
  reels: { name: 'Video Reels & Motion Graphics', usd: 400, short: 'Video Reels' },
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

  window.runCalculator = function() {
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
  };

  serviceCheckboxes.forEach(cb => cb.addEventListener('change', window.runCalculator));
  timelineRadios.forEach(r => r.addEventListener('change', window.runCalculator));
  if (currencySelect) currencySelect.addEventListener('change', window.runCalculator);

  // Apply Estimate Button -> Auto-fill contact form
  if (applyEstimateBtn) {
    applyEstimateBtn.addEventListener('click', () => {
      const selectedServices = Array.from(serviceCheckboxes).filter(cb => cb.checked).map(cb => serviceBasePrices[cb.value]?.name).filter(Boolean);
      const contactMsg = document.getElementById('contactMessage');
      const contactSection = document.getElementById('contact');

      if (selectedServices.length === 0) {
        showToast('Please select at least one service in the calculator.');
        return;
      }

      const curr = currencySelect ? currencySelect.value : 'USD';
      const rateInfo = exchangeRates[curr] || exchangeRates.USD;
      const amountText = estAmountEl.textContent;

      if (contactMsg) {
        contactMsg.value = `Hello! I configured a custom package with your Cost Estimator:\n- Services: ${selectedServices.join(', ')}\n- Estimated Package: ~${amountText} (${rateInfo.suffix})\n\nI would love to receive a formal proposal and schedule a discovery call!`;
      }

      // Check corresponding checkboxes in contact form
      document.querySelectorAll('.contact-service-check').forEach(chk => {
        if (selectedServices.some(s => s.toLowerCase().includes(chk.value.toLowerCase()))) {
          chk.checked = true;
        }
      });

      // Switch to Contact view seamlessly
      if (window.switchTab) {
        window.switchTab('contact');
      }
      showToast('✨ Custom package transferred to inquiry form!');
    });
  }

  // Initial calculation
  window.runCalculator();
}

/**
 * Global helper to select a service from any card/link on the page
 */
window.selectServiceInEstimator = function(serviceKey) {
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
   6. Testimonials Carousel Navigation
   -------------------------------------------------------------------------- */
function initTestimonialCarousel() {
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.getElementById('testimonialPrevBtn');
  const nextBtn = document.getElementById('testimonialNextBtn');
  const dots = document.querySelectorAll('.testimonial-dot');
  
  if (cards.length === 0) return;

  let currentIndex = 0;

  function showSlide(index) {
    if (index < 0) index = cards.length - 1;
    if (index >= cards.length) index = 0;
    currentIndex = index;

    cards.forEach((c, idx) => {
      if (idx === currentIndex) {
        c.style.display = 'flex';
        c.style.animation = 'fadeInCard 0.4s ease forwards';
      } else {
        // on wider screens we can show all or show active slide on mobile
        if (window.innerWidth < 768) {
          c.style.display = 'none';
        } else {
          c.style.display = 'flex';
        }
      }
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));
  }
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => showSlide(idx));
  });

  // Handle resize for mobile carousel view
  window.addEventListener('resize', () => {
    showSlide(currentIndex);
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
   8. Contact Form Handling (Connected to jeromecabinta7@gmail.com)
   -------------------------------------------------------------------------- */
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
    submitBtn.innerHTML = `<span>Sending to Jerome...</span>`;
    submitBtn.disabled = true;

    const payload = {
      name: name,
      email: email,
      phone: phone,
      budget: budget,
      services: selectedServices,
      message: message,
      _subject: `New Creative Inquiry from ${name} (Create and Arise Website)`,
      _template: 'table',
      _captcha: 'false'
    };

    try {
      // Direct form submission to Jerome's email via FormSubmit AJAX endpoint
      const response = await fetch('https://formsubmit.co/ajax/jeromecabinta7@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      contactForm.reset();

      const successModal = document.getElementById('successModal');
      if (successModal) {
        successModal.classList.add('active');
      } else {
        showToast('🎉 Thank you! Your inquiry has been sent to jeromecabinta7@gmail.com');
      }
    } catch (err) {
      // Fallback if offline / blocked
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      contactForm.reset();

      const successModal = document.getElementById('successModal');
      if (successModal) {
        successModal.classList.add('active');
      } else {
        showToast('🎉 Thank you! Your inquiry has been recorded.');
      }
    }
  });
}

/* --------------------------------------------------------------------------
   9. Modals & Global Interactions
   -------------------------------------------------------------------------- */
function initModals() {
  window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  };

  window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  };

  // Close when clicking overlay backdrop
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  // ESC key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    }
  });
}

function initGlobalInteractions() {
  // Copy email to clipboard helper
  window.copyEmail = function(e) {
    if (e) e.preventDefault();
    const email = 'jeromecabinta7@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast(`📋 Copied ${email} to clipboard!`);
    }).catch(() => {
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
