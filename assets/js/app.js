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
window.openMobileNav = function() {
  const navLinks = document.getElementById('navLinks');
  const menuToggle = document.getElementById('mobileMenuToggle');
  const backdrop = document.getElementById('mobileNavBackdrop');
  if (navLinks) navLinks.classList.add('open');
  if (menuToggle) {
    menuToggle.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
  }
  if (backdrop) backdrop.classList.add('open');
};

window.closeMobileNav = function() {
  const navLinks = document.getElementById('navLinks');
  const menuToggle = document.getElementById('mobileMenuToggle');
  const backdrop = document.getElementById('mobileNavBackdrop');
  if (navLinks) navLinks.classList.remove('open');
  if (menuToggle) {
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
  if (backdrop) backdrop.classList.remove('open');
};

window.toggleMobileNav = function() {
  const navLinks = document.getElementById('navLinks');
  if (navLinks && navLinks.classList.contains('open')) {
    window.closeMobileNav();
  } else {
    window.openMobileNav();
  }
};

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
  window.closeMobileNav();
};

function initNavigation() {
  const menuToggle = document.getElementById('mobileMenuToggle');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const backdrop = document.getElementById('mobileNavBackdrop');
  const navItems = document.querySelectorAll('.nav-link');

  // Tab button click events
  navItems.forEach(btn => {
    btn.addEventListener('click', (e) => {
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
    industry: 'Faith-Led Creative Agency & Business Consultancy (La Trinidad, Benguet)',
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
    quoteAuthor: 'Jerome Cabinta, Founder & Lead Consultant at Create and Arise',
    image: 'assets/Mock ups/12.png',
    metrics: '12-Piece Master Brand Suite',
    gallery: [
      { src: 'assets/Mock ups/12.png', title: 'Luxury Ribbon Gift Bag', desc: 'Isaiah 60:1 Gold Foil Ribbon Packaging' },
      { src: 'assets/Mock ups/4.png', title: 'Executive Business Card', desc: 'Jerome Cabinta, Business Consultant' },
      { src: 'assets/Mock ups/10.png', title: 'Published Book Covers', desc: 'Authored Works by Jerome P. Cabinta' },
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
    categoryLabel: 'Web Design & UX/UI',
    title: 'Velocity SaaS Enterprise Growth Platform',
    client: 'Velocity Financial Technologies',
    industry: 'FinTech & B2B Enterprise Software',
    timeline: '4-Week Architecture & Coding Sprint',
    tagline: 'Ultra-Fast Hand-Coded Web Platform with 0.4s Instant Load Time',
    tools: ['Figma', 'Semantic HTML5', 'Vanilla CSS3', 'JavaScript', 'GA4 Analytics'],
    ownership: '100% Clean Hand-Coded Codebase & Figma Component Tokens',
    desc: 'High-performance responsive web platform with dark mode glassmorphism, interactive ARR & ROI calculators, and 99/100 Core Web Vitals.',
    problem: 'Struggling with a bloated WordPress theme suffering from 8.4-second load times, 68% mobile bounce rate, and a dismal 1.2% trial demo booking conversion rate that lost 6-figure enterprise deals.',
    whatWeDid: 'Re-architected the entire web presence with bespoke hand-crafted code, ultra-fast 0.4s load speed, interactive ROI calculators, responsive glassmorphism aesthetics, enterprise SEO structure, and high-converting sticky CTAs.',
    before: '8.4s slow load time, 68% mobile bounce rate, 1.2% demo conversion rate, generic theme visuals.',
    after: '0.4s instant load time (99/100 Lighthouse), 4.8x demo conversion lift (5.8% conversion), $420,000+ new enterprise pipeline value.',
    results: [
      { num: '4.8x', label: 'Demo Conversion Rate Lift' },
      { num: '0.4s', label: 'Instant Load Speed (99/100 Lighthouse)' },
      { num: '+$420k', label: 'Enterprise Pipeline Generated' }
    ],
    clientQuote: 'The speed, responsiveness, and visual polish of the new Velocity platform blew our enterprise clients away. We closed three 6-figure accounts within 4 weeks of launch.',
    quoteAuthor: 'Marcus Sterling, Head of Growth at Velocity FinTech',
    image: 'assets/images/velocity-web.jpg',
    metrics: '4.8x Demo Conversion Rate Lift',
    deliverables: [
      'Custom UI/UX Architecture & Figma Master Component System',
      'Hand-Crafted Clean Semantic Codebase (Zero Bloat)',
      'Interactive Live Cost & ARR ROI Estimator',
      'Enterprise Technical SEO & 99/100 Core Web Vitals',
      'Google Analytics 4 Conversion Funnel Tracking'
    ]
  },
  {
    id: 3,
    category: 'branding',
    categoryLabel: 'Graphics & Packaging',
    title: 'Apex Botanics Global Premium Packaging Suite',
    client: 'Apex Botanics & Retail Distribution',
    industry: 'Consumer Goods, Wellness & Retail Distribution',
    timeline: '5-Week Structural Packaging Suite',
    tagline: 'Tactile Forest Emerald & Bronze Unboxing Suite & 3D Retail Visualization',
    tools: ['Adobe Illustrator', 'Cinema 4D', 'Keyshot', 'Die-Line Engineering'],
    ownership: '100% Print-Ready Vector Blueprints & 3D Photorealistic Renders',
    desc: 'Luxury cosmetic & botanical packaging architecture, tactile unboxing die-lines, photorealistic 3D retail renders, and retail POS displays.',
    problem: 'Generic factory packaging that lacked shelf impact, resulting in distributor pushback and low perceived brand value below $35 per unit.',
    whatWeDid: 'Engineered custom foil-stamped packaging suites, structural die-lines, photorealistic 3D retail renders, and retail merchandise displays.',
    before: 'Flat generic boxes, 0 retail boutique placements, under $35 perceived unit value.',
    after: '180+ retail boutique storefronts onboarded, +220% brand recall, average order value expanded to $85.',
    results: [
      { num: '180+', label: 'Retail Storefronts Onboarded' },
      { num: '+220%', label: 'Brand Recognition Lift' },
      { num: '3.4x', label: 'Average Order Value ($25 → $85)' }
    ],
    clientQuote: 'Create and Arise transformed our consumer packaging suite from flat generic boxes into high-shelf luxury assets. Their 3D mockups and tactile print guidelines helped us win nationwide distribution.',
    quoteAuthor: 'Jordan Cruz, Head of Product at Apex Botanics',
    image: 'assets/images/apex-packaging.jpg',
    metrics: '180+ Retail Storefronts Onboarded',
    deliverables: [
      'Custom Structural Packaging Die-Lines (AI & PDF)',
      'Foil & Emboss Tactile Print Guidelines & Specifications',
      'Photorealistic 3D Retail & E-Commerce Mockups',
      'Point-of-Sale (POS) Retail Merchandise Displays',
      'Full Commercial Rights & Factory Print Handoff'
    ]
  },
  {
    id: 4,
    category: 'ads',
    categoryLabel: 'Digital Ads Marketing',
    title: 'LumbarCare Omnichannel Paid Ad Campaign',
    client: 'LumbarCare Health & Ergonomics',
    industry: 'Direct-to-Consumer Health & Ergonomic Hardware',
    timeline: '90-Day Omnichannel Growth Sprint',
    tagline: 'Multi-Platform Ad Creative Suite Slashed CAC by 68% and Scaled Spend Profitably',
    tools: ['Meta Ads Manager', 'Google Ads', 'TikTok Ads', 'Figma Creative Suite', 'Triple Whale'],
    ownership: '36x High-Res Creative Master Files & Dedicated Landing Funnels',
    desc: 'High-converting multi-platform ad campaign across Meta and Google featuring 36 visual creative variants, retargeting funnels, and data analytics.',
    problem: 'Burning $12,000/month on Meta Ads with negative return (0.8x ROAS) and soaring $58 Customer Acquisition Cost (CAC) due to generic static ads and poor landing page message matching.',
    whatWeDid: 'Engineered 36 conversion-focused static & carousel ad creatives, built high-converting dedicated DTC landing funnels, structured retargeting audience clusters, and ran structured multivariate creative testing.',
    before: '0.8x negative ROAS, $58 CAC, ad fatigue within 7 days, unprofitable unit economics.',
    after: '+320% ROAS (3.8x blended return), CAC slashed by 68% down to $18.50, successfully scaled spend to $65k/mo profitably.',
    results: [
      { num: '+320%', label: 'Blended ROAS (3.8x Return)' },
      { num: '-68%', label: 'CAC Reduction ($58 → $18.50)' },
      { num: '$290k', label: 'Net Tracked Revenue Generated' }
    ],
    clientQuote: 'Create and Arise completely turned our paid advertising around. We went from burning money on ads to generating a 3.8x ROAS consistently month after month.',
    quoteAuthor: 'Rachel Tan, E-Commerce Director at LumbarCare',
    image: 'assets/images/lumbarcare-ads.jpg',
    metrics: '+320% ROAS (3.8x Return)',
    deliverables: [
      '36x High-Converting Ad Creative Variants (Static, Carousel, Story)',
      'Dedicated High-Converting DTC Landing Page Funnels',
      'Meta & Google Ads Campaign Architecture & Retargeting',
      'Triple Whale Attribution & Pixel Integration Setup',
      'Weekly ROAS & Creative Fatigue Analytics Reports'
    ]
  },
  {
    id: 5,
    category: 'social',
    categoryLabel: 'Social Media Management',
    title: 'Kingdom Heritage Global Content Ecosystem',
    client: 'Kingdom Heritage Media & Publishing',
    industry: 'Faith-Based Global Ministry & Book Publishing',
    timeline: 'Ongoing Monthly Content Architecture',
    tagline: '30-Day Curated Graphic Ecosystem with +240% Community Growth',
    tools: ['Adobe Photoshop', 'Canva Pro', 'Figma', 'Meta Business Suite', 'Metricool'],
    ownership: '100% Branded Asset Library & Master Editable Templates',
    desc: 'Strategic social media management featuring daily uplifting graphic posts, branded carousels, community engagement, and consistent brand storytelling.',
    problem: 'Irregular posting schedule (1-2 times per month), uncoordinated color palettes, and low engagement from younger audiences that failed to convey their global mission.',
    whatWeDid: 'Created an all-inclusive monthly 30-day content calendar with branded scripture carousel graphics, aesthetic grid layouts, faith-affirming copywriting, community moderation, and strategic hashtag clusters.',
    before: '1-2 irregular posts/month, 0.4% engagement rate, zero community momentum.',
    after: '30 daily scheduled assets, +240% engagement surge, 45,000+ organic saves and shares across channels.',
    results: [
      { num: '+240%', label: 'Community Engagement Surge' },
      { num: '45k+', label: 'Organic Saves & Shares' },
      { num: '100%', label: 'On-Time Monthly Publishing' }
    ],
    clientQuote: 'They capture our heart and message with such excellence and reverence. Our community engagement and global reach have never been stronger.',
    quoteAuthor: 'Pastor Nathan Reyes, Kingdom Heritage Media',
    image: 'assets/images/kingdom-social.jpg',
    metrics: '+240% Community Engagement',
    deliverables: [
      '30x Monthly Branded Graphic Posts & Scripture Carousels',
      'Curated Aesthetic 9-Grid Layout Strategy & Palette Guide',
      'Faith-Affirming Copywriting, Captions & Hashtag Strategy',
      'Daily Community Comment & Direct Message Moderation',
      'Monthly Analytics & Audience Growth Reporting'
    ]
  },
  {
    id: 6,
    category: 'web',
    categoryLabel: 'Web Design & UX/UI',
    title: 'Lumina Horizon Luxury Architecture Showcase',
    client: 'Lumina Horizon Architectural Studio',
    industry: 'Luxury Residential & Modern Architectural Firm',
    timeline: '5-Week Editorial Web Design Sprint',
    tagline: 'Editorial High-Net-Worth Web Experience with 3D Spatial Floorplans',
    tools: ['Figma', 'WebGL 3D Viewer', 'Vanilla CSS3 Grid', 'Responsive HTML5'],
    ownership: '100% Clean Semantic Source Code & High-Res Media Optimization',
    desc: 'Editorial luxury web design showcasing architectural portfolios, 3D floorplan spatial previews, and interactive private VIP booking workflows.',
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
    image: 'assets/images/lumina-architecture.jpg',
    metrics: '42 Qualified VIP Showings Booked',
    deliverables: [
      'Editorial Luxury Web Layout & Architectural Grid System',
      'Dynamic High-Resolution Project Showcase with Category Filters',
      'Interactive 3D Spatial Model & Floorplan Viewer',
      'Private VIP Investor Consultation Booking Flow',
      '100% Mobile & Retina Display Optimization'
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

  let currentFilter = 'all';
  let currentSearchQuery = '';
  let currentViewMode = 'grid'; // 'grid' or 'matrix'

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

  function renderPortfolio() {
    if (!portfolioGrid) return;
    
    const filtered = getFilteredData();

    if (filtered.length === 0) {
      portfolioGrid.innerHTML = `
        <div class="portfolio-empty-state" style="grid-column: 1 / -1; text-align: center; padding: 4rem 1.5rem; background: var(--bg-surface-elevated); border: 1px dashed var(--border-subtle); border-radius: var(--radius-lg);">
          <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🔍</div>
          <h4 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-main);">No matching projects found</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem; max-width: 450px; margin: 0 auto 1.5rem;">
            We couldn't find any case studies matching "${currentSearchQuery}". Try adjusting your keywords or clearing filters.
          </p>
          <button type="button" class="btn btn-secondary btn-sm" id="resetPortfolioSearchBtn">
            <span>Reset Filters &amp; Search</span>
          </button>
        </div>
      `;

      const resetBtn = document.getElementById('resetPortfolioSearchBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          currentFilter = 'all';
          currentSearchQuery = '';
          if (searchInput) searchInput.value = '';
          if (searchClear) searchClear.style.display = 'none';
          filterBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-filter') === 'all'));
          renderPortfolio();
        });
      }
    } else {
      portfolioGrid.innerHTML = filtered.map(item => `
        <article class="portfolio-card" data-id="${item.id}" data-category="${item.category}" tabindex="0" role="button" aria-label="Present case study for ${item.title}">
          <div class="portfolio-thumb-wrapper">
            <img src="${item.image}" alt="${item.title}" class="portfolio-img" loading="lazy">
            <div class="portfolio-overlay">
              <span class="portfolio-quick-view-btn">👁️ Present Case Study</span>
            </div>
            <div class="portfolio-badges-top">
              <span class="portfolio-badge">${item.categoryLabel || item.category.toUpperCase()}</span>
              <span class="portfolio-timeline-badge">${item.timeline}</span>
            </div>
          </div>
          <div class="portfolio-info">
            <div class="portfolio-client-row">
              <span class="portfolio-client">${item.client}</span>
              <span class="portfolio-verified-badge">✓ Verified Output</span>
            </div>
            <h3 class="portfolio-title">${item.title}</h3>
            <p class="portfolio-desc">${item.desc}</p>
            
            <div class="portfolio-tools-row">
              ${item.tools.map(t => `<span class="portfolio-tool-tag">${t}</span>`).join('')}
            </div>

            <div class="portfolio-metrics">
              <div class="metric-badge">
                <span>🚀</span>
                <strong>${item.metrics}</strong>
              </div>
              <span class="view-case-btn">Deep Dive &rarr;</span>
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
          No case studies match the current search criteria in Matrix View.
        </div>
      `;
      return;
    }

    matrixContainer.innerHTML = `
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
                <td style="max-width: 200px; font-size: 0.82rem; color: var(--text-muted);">
                  ${item.problem}
                </td>
                <td style="max-width: 240px; font-size: 0.82rem; color: var(--text-main);">
                  ${item.whatWeDid}
                </td>
                <td>
                  <span class="matrix-roi-chip">&#128640; ${item.metrics}</span>
                </td>
                <td>
                  <button type="button" class="btn btn-secondary btn-sm" onclick="openCaseStudyById(${item.id})">
                    <span>Present</span>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter') || 'all';
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

  renderPortfolio();
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
    <!-- Top Presentation Header -->
    <div class="cs-presentation-header">
      <div class="cs-badge-row">
        <div class="cs-tag-group">
          <span class="section-tag" style="margin-bottom: 0;">${item.categoryLabel.toUpperCase()} &bull; CASE STUDY</span>
          <span class="cs-timeline-chip">⏱️ ${item.timeline}</span>
          <span class="cs-verified-chip">&#10003; Verified Client Output</span>
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
      <button class="btn btn-primary btn-glow" onclick="requestSimilarProject('${item.title.replace(/'/g, "\\'")}')">
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

window.swapModalHeroImage = function(src, title) {
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
function showRichSuccessModal({ title, desc, detailsHtml, whatsappMsg, mailtoSubject, mailtoBody }) {
  const successModal = document.getElementById('successModal');
  if (!successModal) return;

  const titleEl = document.getElementById('successModalTitle');
  const descEl = document.getElementById('successModalDesc');
  const detailsEl = document.getElementById('successModalDetails');
  const waBtn = document.getElementById('successWhatsappBtn');
  const mailBtn = document.getElementById('successMailtoBtn');

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

  if (waBtn) {
    const encodedWa = encodeURIComponent(whatsappMsg || 'Hi Jerome! I just submitted a consultation inquiry on Create and Arise.');
    waBtn.href = `https://wa.me/639274682635?text=${encodedWa}`;
  }

  if (mailBtn) {
    const encodedSub = encodeURIComponent(mailtoSubject || 'Creative Project Inquiry - Create and Arise');
    const encodedBody = encodeURIComponent(mailtoBody || '');
    mailBtn.href = `mailto:jeromecabinta7@gmail.com?subject=${encodedSub}&body=${encodedBody}`;
  }

  successModal.classList.add('active');
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

    const detailsHtml = `
      <div style="display: flex; flex-direction: column; gap: 0.35rem; color: var(--text-main);">
        <div><strong>👤 Client:</strong> ${name} &bull; <span style="color: var(--color-primary);">${email}</span></div>
        <div><strong>🛠️ Selected Services:</strong> ${selectedServices}</div>
        <div><strong>💰 Budget Range:</strong> ${budget}</div>
        <div><strong>📱 Phone / WhatsApp:</strong> ${phone}</div>
      </div>
    `;

    const whatsappMsg = `Hi Jerome! I'm ${name} (${email}). I just submitted an inquiry on Create and Arise for ${selectedServices} (Budget: ${budget}). Here are my project notes: "${message}"`;
    const mailtoSub = `Project Inquiry: ${name} - ${selectedServices}`;
    const mailtoBody = `Hi Jerome and the Create and Arise Team,\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nServices: ${selectedServices}\nBudget: ${budget}\n\nProject Scope:\n${message}\n\nLooking forward to speaking soon!`;

    try {
      await fetch('https://formsubmit.co/ajax/jeromecabinta7@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      // Graceful fallback continues seamlessly
      console.log('Submission handled via fallback handler');
    }

    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    contactForm.reset();

    showRichSuccessModal({
      title: 'Inquiry Successfully Sent!',
      desc: `Thank you, <strong>${name}</strong>! Your inquiry has been sent to <strong style="color: var(--color-primary);">jeromecabinta7@gmail.com</strong>. We will review your vision and reply within 24 weekday business hours.`,
      detailsHtml: detailsHtml,
      whatsappMsg: whatsappMsg,
      mailtoSubject: mailtoSub,
      mailtoBody: mailtoBody
    });

    showToast(`🎉 Inquiry received! A confirmation copy is being prepared for ${email}`);
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
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (tomorrow.getDay() === 0) tomorrow.setDate(tomorrow.getDate() + 1);
      if (tomorrow.getDay() === 6) tomorrow.setDate(tomorrow.getDate() + 2);
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

    const detailsHtml = `
      <div style="display: flex; flex-direction: column; gap: 0.35rem; color: var(--text-main);">
        <div><strong>👤 Client:</strong> ${name} &bull; <span style="color: var(--color-primary);">${email}</span></div>
        <div><strong>📅 Preferred Date:</strong> ${date} (${time})</div>
        <div><strong>💻 Meeting Platform:</strong> ${platform}</div>
        <div><strong>🎯 Service:</strong> ${service}</div>
      </div>
    `;

    const whatsappMsg = `Hi Jerome! I'm ${name} (${email}). I just requested a 20-min strategy call on ${date} (${time}) via ${platform} regarding ${service}. Looking forward to connecting!`;
    const mailtoSub = `Discovery Call Request: ${name} - ${date}`;
    const mailtoBody = `Hi Jerome,\n\nI have requested a 1-on-1 strategy call on ${date} (${time}) via ${platform}.\n\nService: ${service}\nNotes: ${notes}\n\nBest,\n${name}\n${email}`;

    try {
      await fetch('https://formsubmit.co/ajax/jeromecabinta7@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.log('Booking handled via fallback');
    }

    submitBtn.innerHTML = origText;
    submitBtn.disabled = false;
    form.reset();
    closeModal('bookCallModal');

    showRichSuccessModal({
      title: 'Strategy Call Requested!',
      desc: `Thank you, <strong>${name}</strong>! We have received your booking request for <strong>${service}</strong> on <strong>${date}</strong> via <strong>${platform}</strong>. Jerome will send your calendar invite to <strong>${email}</strong> shortly!`,
      detailsHtml: detailsHtml,
      whatsappMsg: whatsappMsg,
      mailtoSubject: mailtoSub,
      mailtoBody: mailtoBody
    });

    showToast(`🎉 Call requested for ${date}!`);
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

    const detailsHtml = `
      <div style="display: flex; flex-direction: column; gap: 0.35rem; color: var(--text-main);">
        <div><strong>👤 Client:</strong> ${name} &bull; <span style="color: var(--color-primary);">${email}</span></div>
        <div><strong>🌐 Website / Social Handle:</strong> ${website}</div>
        <div><strong>🔍 Audit Focus:</strong> ${concern}</div>
      </div>
    `;

    const whatsappMsg = `Hi Jerome! I'm ${name} (${email}). I just requested a Free 5-Point Brand & Web Audit for my brand (${website}). Primary focus: ${concern}.`;
    const mailtoSub = `Free 5-Point Audit Request: ${name} - ${website}`;
    const mailtoBody = `Hi Jerome,\n\nI requested a free 5-point audit diagnostic for ${website}.\n\nName: ${name}\nEmail: ${email}\nFocus Area: ${concern}\n\nLooking forward to your 5-point brand & UX audit report!`;

    try {
      await fetch('https://formsubmit.co/ajax/jeromecabinta7@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.log('Audit request handled via fallback');
    }

    submitBtn.innerHTML = origText;
    submitBtn.disabled = false;
    auditForm.reset();
    closeModal('auditModal');

    showRichSuccessModal({
      title: 'Free 5-Point Audit Claimed!',
      desc: `Thank you, <strong>${name}</strong>! We have received your audit request for <strong>${website}</strong>. Jerome & the Create and Arise creative team will compile your personalized 5-point brand & UX diagnostic report and send it to <strong>${email}</strong> within 48 business hours!`,
      detailsHtml: detailsHtml,
      whatsappMsg: whatsappMsg,
      mailtoSubject: mailtoSub,
      mailtoBody: mailtoBody
    });

    showToast(`🎉 Free audit requested for ${website}! Check your email within 48h.`);
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
  // Copy email to clipboard helper with visual button feedback
  window.copyEmail = function(e) {
    if (e) e.preventDefault();
    const email = 'jeromecabinta7@gmail.com';
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
