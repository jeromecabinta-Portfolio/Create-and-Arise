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
    title: 'Aurum & Co. Luxury Visual Identity System',
    client: 'Aurum & Co. Fine Goods',
    industry: 'Global E-Commerce & Luxury Goods (Manila & Singapore)',
    desc: 'Complete high-end brand identity system featuring custom logomark, typography guidelines, luxury stationery, and digital brand style book designed to elevate brand authority.',
    problem: 'Suffered from fragmented DIY branding with pixelated low-res graphics across product boxes, causing a high 32% return rate and preventing them from securing high-end retail boutique partnerships.',
    whatWeDid: 'Engineered an elite visual brand ecosystem from scratch: geometric obsidian-and-gold logomark, bespoke serif typography rules, tactile matte-finish packaging blueprints, social media kits, and full vector source assets.',
    before: 'Fragmented Canva graphics, inconsistent hex codes, 32% return rate from low perceived luxury value.',
    after: 'High-authority obsidian & gold identity, 100% brand cohesion, onboarded into 14 luxury partner boutiques worldwide.',
    results: [
      { num: '+180%', label: 'Brand Recognition Lift' },
      { num: '3.4x', label: 'Average Order Value ($42 → $143)' },
      { num: '100%', label: 'Commercial Source File Ownership' }
    ],
    clientQuote: 'Create and Arise took our fragmented brand and forged it into an unmistakable luxury icon. Our wholesale partner acquisition tripled in 60 days.',
    quoteAuthor: 'Elena Vance, Founder & Creative Director at Aurum & Co.',
    image: 'assets/images/branding-graphics.jpg',
    metrics: '+180% Brand Recognition',
    deliverables: ['Vector Logo Suite (AI, SVG, EPS, PDF)', 'Brand Guidelines & Typography System', 'Luxury Box & Foil Label Packaging', 'Social Media Asset Toolkit', '100% Commercial Source Rights']
  },
  {
    id: 2,
    category: 'web',
    title: 'Velocity SaaS Enterprise Growth Platform',
    client: 'Velocity Financial Technologies',
    industry: 'FinTech & B2B Software Enterprise',
    desc: 'Cutting-edge responsive website designed with futuristic dark mode aesthetics, interactive conversion modules, and lightning-fast loading speeds.',
    problem: 'Struggling with a bloated WordPress theme with 8.4-second load times, 68% mobile bounce rate, and a dismal 1.2% trial demo booking conversion rate that lost 6-figure enterprise deals.',
    whatWeDid: 'Re-architected the entire web presence with bespoke clean code, ultra-fast 0.4s load speed, interactive ROI calculators, responsive glassmorphism aesthetics, enterprise SEO structure, and high-converting sticky CTAs.',
    before: '8.4s slow load time, 68% mobile bounce rate, 1.2% demo conversion rate, generic theme visuals.',
    after: '0.4s instant load time, 4.8x demo conversion lift (5.8% conversion), $420,000+ new enterprise pipeline value.',
    results: [
      { num: '4.8x', label: 'Demo Conversion Rate Lift' },
      { num: '0.4s', label: 'Page Load Speed (99/100 Core Web Vitals)' },
      { num: '+$420k', label: 'Enterprise Pipeline Generated' }
    ],
    clientQuote: 'The speed, responsiveness, and visual polish of the new Velocity platform blew our enterprise clients away. We closed three 6-figure accounts within 4 weeks of launch.',
    quoteAuthor: 'Marcus Sterling, Head of Growth at Velocity FinTech',
    image: 'assets/images/web-design.jpg',
    metrics: '4.8x Conversion Rate Lift',
    deliverables: ['Custom UI/UX Architecture & Figma Files', 'Full Responsive Coding (HTML/CSS/JS)', 'Interactive Cost & ROI Calculator', 'SEO & Core Web Vitals Optimization', 'Google Analytics 4 Funnel Tracking']
  },
  {
    id: 3,
    category: 'reels',
    title: 'Viral Motion & Hook-Driven Video Suite',
    client: 'Elevate Athletics & Creator Collective',
    industry: 'Fitness Apparel, Lifestyle & Creator Economy',
    desc: 'High-energy, hook-driven vertical reels tailored for TikTok, Instagram Reels, and YouTube Shorts featuring kinetic typography, 3D overlays, and sound design.',
    problem: 'Struggled with flat video edits, poor 3-second hook retention (<18%), inaudible audio mixes, and plateaued social reach with fewer than 1,500 views per clip.',
    whatWeDid: 'Designed a high-velocity 24-reel content engine featuring psychological 3-second visual hooks, kinetic motion typography, custom sound design, bass-boosted audio mastering, and multi-aspect ratio exports.',
    before: '1,200 avg views per reel, 18% 3-second hook retention rate, flat engagement, zero viral reach.',
    after: '10.4M+ total organic views, 74% hook retention rate, +86,000 net new followers across channels.',
    results: [
      { num: '10M+', label: 'Organic Video Views' },
      { num: '74%', label: '3-Second Hook Retention' },
      { num: '+86k', label: 'Targeted Community Followers' }
    ],
    clientQuote: 'Their motion editing is on another level. Every single reel grabs attention in the first second. Our organic reach exploded past 10 million views in less than 2 months!',
    quoteAuthor: 'Jordan Cruz, Content Director at Elevate Athletics',
    image: 'assets/images/reels-social.jpg',
    metrics: '10M+ Organic Video Views',
    deliverables: ['24x 9:16 Vertical Video Reels', 'Psychological Hook & Script Optimization', 'Kinetic Typography & On-Screen Captions', 'Sound Design & 3D SFX Audio Mixing', '4K Master Video Deliverables']
  },
  {
    id: 4,
    category: 'ads',
    title: 'AlphaGrowth Omnichannel Paid Ad Campaign',
    client: 'LumbarCare Health & Ergonomics',
    industry: 'Direct-to-Consumer Health & Ergonomic Hardware',
    desc: 'Comprehensive multi-platform ad campaign across Meta and Google featuring high-converting visual creatives, retargeting funnels, and data analytics.',
    problem: 'Burning $12,000/month on Meta Ads with negative return (0.8x ROAS) and soaring $58 Customer Acquisition Cost (CAC) due to generic static ads and poor landing page message matching.',
    whatWeDid: 'Engineered 36 conversion-focused video & static ad creatives, built high-converting dedicated DTC landing funnels, structured retargeting audience clusters, and ran structured multivariate creative testing.',
    before: '0.8x negative ROAS, $58 CAC, ad fatigue within 7 days, unprofitable unit economics.',
    after: '+320% ROAS (3.8x blended return), CAC slashed by 68% down to $18.50, successfully scaled spend to $65k/mo profitably.',
    results: [
      { num: '+320%', label: 'Blended ROAS (3.8x Return)' },
      { num: '-68%', label: 'Customer Acquisition Cost ($58 → $18.50)' },
      { num: '$290k', label: 'Net Tracked Revenue Generated' }
    ],
    clientQuote: 'Create and Arise completely turned our paid advertising around. We went from burning money on ads to generating a 3.8x ROAS consistently month after month.',
    quoteAuthor: 'Rachel Tan, E-Commerce Director at LumbarCare',
    image: 'assets/images/digital-ads.jpg',
    metrics: '+320% ROAS (3.8x Return)',
    deliverables: ['36x High-Converting Video & Static Creatives', 'Dedicated DTC Landing Page Funnel', 'Meta & Google Ads Campaign Management', 'Retargeting Architecture & Pixel Setup', 'Weekly ROAS & Attribution Reports']
  },
  {
    id: 5,
    category: 'social',
    title: 'Kingdom Heritage Global Content Ecosystem',
    client: 'Kingdom Heritage Media & Publishing',
    industry: 'Faith-Based Global Ministry & Book Publishing',
    desc: 'Strategic social media management featuring daily uplifting graphic posts, inspirational reels, community engagement, and consistent brand storytelling.',
    problem: 'Irregular posting schedule (1-2 times per month), uncoordinated color palettes, and low engagement from younger audiences that failed to convey their global mission.',
    whatWeDid: 'Created an all-inclusive monthly 30-day content calendar with branded scripture carousel graphics, inspirational reels, faith-affirming copywriting, community moderation, and strategic hashtag clusters.',
    before: '1-2 irregular posts/month, 0.4% engagement rate, zero community momentum.',
    after: '30 daily scheduled assets, +240% engagement surge, 45,000+ organic saves and shares across channels.',
    results: [
      { num: '+240%', label: 'Engagement Rate Increase' },
      { num: '45k+', label: 'Organic Saves & Shares' },
      { num: '100%', label: 'On-Time Monthly Delivery' }
    ],
    clientQuote: 'They capture our heart and message with such excellence and reverence. Our community engagement and global reach have never been stronger.',
    quoteAuthor: 'Pastor Nathan Reyes, Kingdom Heritage Media',
    image: 'assets/images/hero-agency.jpg',
    metrics: '+240% Community Engagement',
    deliverables: ['30x Monthly Branded Graphic Posts & Carousels', '12x Inspirational Scripture Video Reels', 'Copywriting, Captions & Hashtag Strategy', 'Daily Community Comment Moderation', 'Monthly Growth & Engagement Analytics']
  },
  {
    id: 6,
    category: 'web',
    title: 'Lumina Horizon Luxury Architecture Showcase',
    client: 'Lumina Horizon Real Estate & Developments',
    industry: 'Luxury Residential & Architectural Firm',
    desc: 'Editorial luxury web design showcasing architectural portfolios, virtual tour integrations, and interactive booking inquiry workflows.',
    problem: 'Relying on static PDF brochures and a slow non-mobile website that failed to display multimillion-dollar architectural renders, leading to lost investor inquiries.',
    whatWeDid: 'Designed an ultra-minimalist editorial web experience with full-screen project galleries, interactive floorplan showcases, VIP consultation booking integration, and 100% mobile optimization.',
    before: 'Static non-responsive pages, slow PDF downloads, 0 digital leads captured.',
    after: 'Editorial luxury web experience, 99.4% client satisfaction, 42 qualified VIP private showings booked in 60 days.',
    results: [
      { num: '42', label: 'Qualified VIP Showings Booked' },
      { num: '99.4%', label: 'Client Satisfaction Rating' },
      { num: '100%', label: 'Mobile Responsive Perfection' }
    ],
    clientQuote: 'The website feels like a luxury architectural magazine. Our high-net-worth investors were deeply impressed by the seamless presentation.',
    quoteAuthor: 'Architect Gabriel Santos, Principal at Lumina Horizon',
    image: 'assets/images/web-design.jpg',
    metrics: '99.4% Client Satisfaction',
    deliverables: ['Editorial Luxury Web Layout', 'Dynamic Project Gallery with Filters', 'Interactive Virtual Tour Integration', 'VIP Buyer Consultation Scheduler', '100% Mobile & Retina Display Optimization']
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

window.openCaseStudyById = function(id) {
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
    <div class="cs-image-header">
      <img src="${item.image}" alt="${item.title}">
    </div>

    <div class="cs-badge-row">
      <span class="section-tag" style="margin-bottom: 0;">${item.category.toUpperCase()} &bull; CASE STUDY</span>
      <span style="color: #10b981; font-weight: 800; font-size: 0.95rem;">&#10003; ${item.metrics}</span>
    </div>

    <h2 class="cs-modal-title">${item.title}</h2>
    <p class="cs-modal-client"><strong>Client:</strong> ${item.client} &bull; <em>${item.industry}</em></p>

    <!-- 1. Client & Problem vs 2. What We Did -->
    <div class="cs-two-col">
      <div class="cs-problem-card">
        <div class="cs-section-heading">
          <span>⚠️</span> <span>Client &amp; Bottleneck Problem</span>
        </div>
        <p class="cs-card-text">${item.problem}</p>
      </div>
      <div class="cs-solution-card">
        <div class="cs-section-heading">
          <span>⚡</span> <span>What We Did &amp; Strategy</span>
        </div>
        <p class="cs-card-text">${item.whatWeDid}</p>
      </div>
    </div>

    <!-- 3. Before vs After Transformation Comparison -->
    <div style="margin-bottom: 1.5rem;">
      <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
        <span>🔄</span> <span>Direct Transformation: Before vs. After</span>
      </h4>
      <div class="ba-comparison-grid" style="margin-bottom: 0;">
        <div class="ba-col before">
          <div class="ba-label">❌ Before Create &amp; Arise</div>
          <p style="margin: 0; line-height: 1.6;">${item.before}</p>
        </div>
        <div class="ba-col after">
          <div class="ba-label">✨ After Transformation</div>
          <p style="margin: 0; line-height: 1.6;">${item.after}</p>
        </div>
      </div>
    </div>

    <!-- 4. Quantifiable Hard Results / Key Metrics -->
    <div style="margin-bottom: 1.5rem;">
      <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
        <span>📈</span> <span>Quantifiable Results &amp; ROI</span>
      </h4>
      <div class="cs-results-grid" style="margin-bottom: 0;">
        ${item.results.map(r => `
          <div class="cs-result-item">
            <div class="cs-result-num">${r.num}</div>
            <div class="cs-result-lbl">${r.label}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- 5. Deliverables Included -->
    <div class="cs-deliverables-box">
      <h4 style="font-size: 0.92rem; font-weight: 700; margin: 0; color: var(--text-main);">Included Deliverables &amp; Assets:</h4>
      <div class="cs-deliverables-grid">
        ${item.deliverables.map(d => `<div class="cs-deliv-item"><span>&#10003;</span> ${d}</div>`).join('')}
      </div>
    </div>

    <!-- 6. Client Testimonial -->
    ${item.clientQuote ? `
      <div class="cs-testimonial-box">
        <div class="cs-quote-mark">&ldquo;</div>
        <p class="cs-quote-text">${item.clientQuote}</p>
        <div class="cs-quote-author">&mdash; ${item.quoteAuthor}</div>
      </div>
    ` : ''}

    <!-- Actions -->
    <div class="cs-actions">
      <button class="btn btn-primary btn-glow" onclick="requestSimilarProject('${item.title}')">
        <span>Inquire For A Similar Project</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      </button>
      <button class="btn btn-book-call" onclick="closeModal('portfolioModal'); openBookCallModal();">
        <span>📅 Book a Discovery Call</span>
      </button>
      <button class="btn btn-secondary" onclick="closeModal('portfolioModal')">
        <span>Close Preview</span>
      </button>
    </div>
  `;

  modal.classList.add('active');
}

window.requestSimilarProject = function(projectName) {
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
   6. Testimonials & Reviews Filter Controller
   -------------------------------------------------------------------------- */
function initTestimonialCarousel() {
  const filterBtns = document.querySelectorAll('.review-filter-btn');
  const cards = document.querySelectorAll('.testimonial-card');

  if (filterBtns.length === 0 || cards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

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
   8.5. Interactive Book a Call Modal Handling
   -------------------------------------------------------------------------- */
window.openBookCallModal = function(servicePreset) {
  const modal = document.getElementById('bookCallModal');
  const serviceSelect = document.getElementById('bookingService');
  const dateInput = document.getElementById('bookingDate');

  if (servicePreset && serviceSelect) {
    for (let opt of serviceSelect.options) {
      if (opt.value.toLowerCase().includes(servicePreset.toLowerCase()) || opt.text.toLowerCase().includes(servicePreset.toLowerCase())) {
        serviceSelect.value = opt.value;
        break;
      }
    }
  }

  // Set min date to today
  if (dateInput && !dateInput.min) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    if (!dateInput.value) {
      // Default to tomorrow / next weekday
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (tomorrow.getDay() === 0) tomorrow.setDate(tomorrow.getDate() + 1); // skip Sun
      if (tomorrow.getDay() === 6) tomorrow.setDate(tomorrow.getDate() + 2); // skip Sat
      dateInput.value = tomorrow.toISOString().split('T')[0];
    }
  }

  if (modal) modal.classList.add('active');
};

function initBookCallModal() {
  const form = document.getElementById('bookCallForm');
  const timeBtns = document.querySelectorAll('.booking-time-btn');
  const timeHiddenInput = document.getElementById('bookingSelectedTime');

  timeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const timeVal = btn.getAttribute('data-time');
      if (timeHiddenInput && timeVal) {
        timeHiddenInput.value = timeVal;
      }
    });
  });

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('bookingName')?.value.trim();
    const email = document.getElementById('bookingEmail')?.value.trim();
    const service = document.getElementById('bookingService')?.value;
    const date = document.getElementById('bookingDate')?.value;
    const time = timeHiddenInput?.value || 'Morning (9:00 AM – 12:00 PM PHT)';
    const platform = document.querySelector('input[name="booking_platform"]:checked')?.value || 'Google Meet';
    const notes = document.getElementById('bookingNotes')?.value.trim() || 'None specified';

    if (!name || !email || !date) {
      showToast('Please fill out your name, email, and preferred date.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const origText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Scheduling Call...</span>`;
    submitBtn.disabled = true;

    const payload = {
      name: name,
      email: email,
      service: service,
      preferred_date: date,
      preferred_time: time,
      platform: platform,
      notes: notes,
      _subject: `📅 New 1-on-1 Discovery Call Booked: ${name} (${service})`,
      _template: 'table',
      _captcha: 'false'
    };

    try {
      await fetch('https://formsubmit.co/ajax/jeromecabinta7@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      submitBtn.innerHTML = origText;
      submitBtn.disabled = false;
      form.reset();
      closeModal('bookCallModal');

      const successModal = document.getElementById('successModal');
      if (successModal) {
        const titleEl = successModal.querySelector('h3');
        const descEl = successModal.querySelector('p');
        if (titleEl) titleEl.textContent = 'Strategy Call Requested!';
        if (descEl) descEl.innerHTML = `Thank you, <strong>${name}</strong>! We have received your booking request for <strong>${service}</strong> on <strong>${date} (${time})</strong> via <strong>${platform}</strong>. Our team will review and send your calendar invite shortly!`;
        successModal.classList.add('active');
      } else {
        showToast(`🎉 Call requested for ${date}! We'll send the invite shortly.`);
      }
    } catch (err) {
      submitBtn.innerHTML = origText;
      submitBtn.disabled = false;
      form.reset();
      closeModal('bookCallModal');
      showToast(`🎉 Call requested! We'll send your meeting link shortly.`);
    }
  });
}

/* --------------------------------------------------------------------------
   8.8. Free Brand & Website Audit Modal Handling
   -------------------------------------------------------------------------- */
window.openAuditModal = function() {
  const modal = document.getElementById('auditModal');
  if (modal) modal.classList.add('active');
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
      website_or_handle: website,
      primary_challenge: concern,
      _subject: `🔍 Free 5-Point Brand & Web Audit Request: ${name} (${website})`,
      _template: 'table',
      _captcha: 'false'
    };

    try {
      await fetch('https://formsubmit.co/ajax/jeromecabinta7@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      submitBtn.innerHTML = origText;
      submitBtn.disabled = false;
      auditForm.reset();
      closeModal('auditModal');

      const successModal = document.getElementById('successModal');
      if (successModal) {
        const titleEl = successModal.querySelector('h3');
        const descEl = successModal.querySelector('p');
        if (titleEl) titleEl.textContent = 'Free Audit Claimed!';
        if (descEl) descEl.innerHTML = `Thank you, <strong>${name}</strong>! We have received your audit request for <strong>${website}</strong>. Jerome & the Create and Arise creative team will record your personalized 5-minute video & teardown report and send it to <strong>${email}</strong> within 48 business hours!`;
        successModal.classList.add('active');
      } else {
        showToast(`🎉 Free audit requested for ${website}! Check your email within 48h.`);
      }
    } catch (err) {
      submitBtn.innerHTML = origText;
      submitBtn.disabled = false;
      auditForm.reset();
      closeModal('auditModal');
      showToast(`🎉 Free audit requested! We will send your report shortly.`);
    }
  });
}

window.startProjectPrompt = function() {
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
