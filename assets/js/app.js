/**
 * CREATE AND ARISE - Interactive Application Logic
 * Studio: Create and Arise (Philippines)
 * Features: Live PHT Business Hours Checker, Cost Estimator, Portfolio Filter, Lightbox Modal, Theme Toggle
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveBusinessHours();
  initThemeToggle();
  initNavigation();
  initPortfolio();
  initCostCalculator();
  initFaqAccordion();
  initContactForm();
  initModals();
});

/* --------------------------------------------------------------------------
   1. Live Philippine Time & Business Hours Status (Mon-Fri 8am-6pm PHT)
   -------------------------------------------------------------------------- */
function initLiveBusinessHours() {
  const statusBadge = document.getElementById('liveStatusBadge');
  const clockElement = document.getElementById('philippineClock');

  function updateHoursStatus() {
    // Obtain current time in Philippines (Asia/Manila GMT+8)
    const options = { timeZone: 'Asia/Manila', hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const phtDateStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' });
    const phtDate = new Date(phtDateStr);

    const day = phtDate.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    const hour24 = phtDate.getHours();
    const minutes = phtDate.getMinutes();
    const timeFormatted = phtDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

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
   3. Header Navigation & Mobile Drawer
   -------------------------------------------------------------------------- */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const menuToggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-link');

  // Sticky header blur effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      menuToggle.innerHTML = isOpen ? '&times;' : '&#9776;';
    });

    // Close when clicking nav items
    navItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        if (menuToggle) menuToggle.innerHTML = '&#9776;';
      });
    });
  }

  // Active scrollspy
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
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
      <div class="portfolio-card" data-id="${item.id}" data-category="${item.category}">
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
    <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1rem;">
      <span class="section-tag" style="margin-bottom: 0;">${item.category.toUpperCase()}</span>
      <span style="color: #10b981; font-weight: 700; font-size: 0.95rem;">${item.metrics}</span>
    </div>
    <h2 style="font-size: 1.75rem; margin-bottom: 0.5rem;">${item.title}</h2>
    <p style="color: var(--text-gold); font-weight: 600; font-size: 0.9rem; margin-bottom: 1.25rem;">Client: ${item.client}</p>
    <p style="color: var(--text-muted); line-height: 1.7; margin-bottom: 1.5rem;">${item.desc}</p>
    
    <div style="background: var(--bg-surface-elevated); padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border-subtle); margin-bottom: 1.75rem;">
      <h4 style="font-size: 1rem; margin-bottom: 0.75rem; color: var(--text-main);">Included Deliverables:</h4>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;">
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
  }
};

/* --------------------------------------------------------------------------
   5. Interactive Project Cost & Package Estimator
   -------------------------------------------------------------------------- */
function initCostCalculator() {
  const serviceCheckboxes = document.querySelectorAll('.calc-service-checkbox');
  const timelineRadios = document.querySelectorAll('input[name="calc_timeline"]');
  const currencySelect = document.getElementById('calcCurrency');
  const estAmountEl = document.getElementById('estAmount');
  const selectedListEl = document.getElementById('selectedServicesList');
  const applyEstimateBtn = document.getElementById('applyEstimateBtn');

  const exchangeRates = {
    USD: { symbol: '$', rate: 1, suffix: 'USD' },
    PHP: { symbol: '₱', rate: 58, suffix: 'PHP' },
    AUD: { symbol: 'A$', rate: 1.55, suffix: 'AUD' },
    EUR: { symbol: '€', rate: 0.92, suffix: 'EUR' },
    GBP: { symbol: '£', rate: 0.78, suffix: 'GBP' }
  };

  const serviceBasePrices = {
    graphics: { name: 'Graphic Design & Brand Identity', usd: 450 },
    web: { name: 'Web Design & Responsive Development', usd: 750 },
    reels: { name: 'Video Reels & Motion Graphics', usd: 400 },
    ads: { name: 'Digital Ads & Campaign Marketing', usd: 500 },
    social: { name: 'Social Media Content Management', usd: 450 }
  };

  const timelineMultipliers = {
    standard: { multiplier: 1.0, label: 'Standard (2–3 Weeks)' },
    express: { multiplier: 1.3, label: 'Express Priority (7 Days)' },
    retainer: { multiplier: 0.9, label: 'Monthly Creative Retainer (-10%)' }
  };

  function calculate() {
    let baseUsd = 0;
    let selectedItems = [];

    serviceCheckboxes.forEach(cb => {
      const card = cb.closest('.calc-option-card');
      if (cb.checked) {
        card.classList.add('selected');
        const sKey = cb.value;
        const sObj = serviceBasePrices[sKey];
        if (sObj) {
          baseUsd += sObj.usd;
          selectedItems.push(sObj);
        }
      } else {
        card.classList.remove('selected');
      }
    });

    let selectedTimeline = 'standard';
    timelineRadios.forEach(r => {
      const card = r.closest('.calc-option-card');
      if (r.checked) {
        card.classList.add('selected');
        selectedTimeline = r.value;
      } else {
        card.classList.remove('selected');
      }
    });

    const curr = currencySelect ? currencySelect.value : 'USD';
    const rateInfo = exchangeRates[curr] || exchangeRates.USD;
    const timelineInfo = timelineMultipliers[selectedTimeline] || timelineMultipliers.standard;

    const totalUsd = Math.round(baseUsd * timelineInfo.multiplier);
    const convertedTotal = Math.round(totalUsd * rateInfo.rate);

    // Update UI
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
  }

  serviceCheckboxes.forEach(cb => cb.addEventListener('change', calculate));
  timelineRadios.forEach(r => r.addEventListener('change', calculate));
  if (currencySelect) currencySelect.addEventListener('change', calculate);

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
        contactMsg.value = `Hello! I used your Interactive Project Estimator for:\n- Services: ${selectedServices.join(', ')}\n- Estimated Package: ~${amountText} (${rateInfo.suffix})\n\nI would love to get a formal quote and discuss next steps!`;
      }

      // Check corresponding checkboxes in contact form if present
      document.querySelectorAll('.contact-service-check').forEach(chk => {
        if (selectedServices.some(s => s.toLowerCase().includes(chk.value.toLowerCase()))) {
          chk.checked = true;
        }
      });

      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        showToast('✨ Custom package transferred to contact form!');
      }
    });
  }

  // Initial calculation
  calculate();
}

/* --------------------------------------------------------------------------
   6. FAQ Accordion
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
   7. Contact Form & Toast Feedback
   -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('mainContactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName')?.value.trim();
    const email = document.getElementById('contactEmail')?.value.trim();
    const message = document.getElementById('contactMessage')?.value.trim();

    if (!name || !email || !message) {
      showToast('Please fill out all required fields.');
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Submitting Inquiry...</span>`;
    submitBtn.disabled = true;

    // Simulate sending inquiry
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      contactForm.reset();
      
      // Open success modal
      const successModal = document.getElementById('successModal');
      if (successModal) {
        successModal.classList.add('active');
      } else {
        showToast('🎉 Thank you! Your inquiry has been received with thanks.');
      }
    }, 1200);
  });
}

/* --------------------------------------------------------------------------
   8. Modals Management
   -------------------------------------------------------------------------- */
function initModals() {
  window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
    }
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

/* --------------------------------------------------------------------------
   9. Helper Toast Notification
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
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
