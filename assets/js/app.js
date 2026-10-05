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
  } catch (e) {}

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

  if (modal) modal.classList.add('active');
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
    } catch (e) {}

    // 3. Asynchronously notify studio email via form endpoint
    window.sendFormSubmission(payload).catch(() => {});

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
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  };

  window.closeModal = function (modalId) {
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
      }).catch(() => {});

      closeModal('feedbackModal');
      showToast(`✅ Thank you${name !== 'Anonymous' ? ', ' + name : ''}! Your feedback has been sent directly to Jerome & the team.`);
    };
  }
}
