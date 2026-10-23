/**
 * CREATE AND ARISE - Automated AI Chatbot Engine (AriseBot)
 * Purpose-Driven Virtual Creative Consultant & Client Navigator
 */

(function () {
  'use strict';

  // Conversation History for Contextual Multi-Turn Dialog
  const chatHistory = [];

  // Local Offline Knowledge Base & Semantic Intent Mapping
  const botKnowledge = [
    {
      keywords: ['hi', 'hello', 'hey', 'kumusta', 'magandang', 'greetings', 'start', 'morning', 'afternoon', 'evening'],
      response: `👋 **Hello and welcome to Create and Arise!** ✨\n\nI'm **AriseBot**, your AI creative and digital growth assistant. We are a premier Christian-founded creative design & digital studio based in the Philippines, helping visionary brands arise through:\n\n1. **🎨 Graphic Design & Brand Identity** — Bespoke vector logos, guidelines & packaging.\n2. **💻 Web Design & UI/UX** — Ultra-fast, responsive, sub-second websites.\n3. **📈 Digital Ads Marketing** — High-ROI Meta, Google & TikTok campaigns.\n4. **📱 Social Media Management** — 30-day content calendars & aesthetic feeds.\n\nHow can I help grow or uplift your brand today?`,
      actions: [
        { label: '🎨 Explore Services', callback: 'showServicesMenu' },
        { label: '💰 Check Pricing & Packages', callback: 'scrollToEstimator' },
        { label: '⭐ View Verified USA Reviews', callback: 'scrollToReviews' },
        { label: '📅 Book a Free Discovery Call', callback: 'openBookCallModal' }
      ],
      chips: ['Web Design', 'Graphic Design', 'Digital Ads', 'Social Media', 'Pricing', 'Client Reviews']
    },
    {
      keywords: ['aime', 'leon dore', 'aimeleondore', 'streetwear', 'marcus sterling'],
      response: `🌟 **Aimé Leon Dore Case Study (New York City, NY, USA)**\n\n**Discipline:** Web Design & UI/UX • Luxury Streetwear E-Commerce\n**Client Lead:** Marcus Sterling, Head of Digital Commerce\n\n💬 *"Jerome and the Create and Arise team engineered our custom web platform with sub-second performance. Their clean code and responsive edge infrastructure cut our load times from 7.2s to 0.4s and lifted checkout conversions by 4.8x across international drop releases."*\n\n🚀 **Key Outcome:** Sub-0.4s Edge Load Speed & 4.8x Conversion Lift.\n🌐 **Official Website:** [aimeleondore.com](https://www.aimeleondore.com)`,
      actions: [
        { label: '👁️ Deep Dive Case Study (Aimé Leon Dore)', callback: 'openCaseStudy2' },
        { label: '💻 Web Design Services', callback: 'selectWeb' },
        { label: '📅 Book a Discovery Call', callback: 'openBookCallModal' }
      ],
      chips: ['Buck Mason', 'Blue Bottle Coffee', 'The Ridge', 'Web Design', 'Pricing']
    },
    {
      keywords: ['buck mason', 'buckmason', 'heritage', 'menswear', 'michael ramirez'],
      response: `🌟 **Buck Mason Case Study (Los Angeles, California, USA)**\n\n**Discipline:** Graphics & Branding • American Heritage Menswear\n**Client Lead:** Michael Ramirez, Head of Brand Retail\n\n💬 *"Create and Arise took our brand presentation to new heights. The attention to detail in our custom typography hierarchy, woven label specs, and tactile packaging guidelines enabled seamless store expansions across key flagship retail locations."*\n\n👔 **Key Outcome:** Iconic Heritage Monogram & Expansion across 30+ Flagship Stores.\n🌐 **Official Website:** [buckmason.com](https://www.buckmason.com)`,
      actions: [
        { label: '👁️ Deep Dive Case Study (Buck Mason)', callback: 'openCaseStudy8' },
        { label: '🎨 Branding Services', callback: 'selectGraphics' },
        { label: '📅 Book a Strategy Call', callback: 'openBookCallModal' }
      ],
      chips: ['Aimé Leon Dore', 'Blue Bottle Coffee', 'The Ridge', 'Branding', 'Pricing']
    },
    {
      keywords: ['blue bottle', 'coffee', 'bluebottle', 'roastery', 'elena vance'],
      response: `🌟 **Blue Bottle Coffee Case Study (Oakland, California, USA)**\n\n**Discipline:** Branding & Packaging • Specialty Coffee Roasteries & Cafes\n**Client Lead:** Elena Vance, Senior Brand Director\n\n💬 *"Create and Arise delivered immaculate visual brand systems and tactile packaging guidelines. Their respect for craftsmanship, typographic restraint, and clean vector precision gave our retail team total confidence across our nationwide cafes and roasteries."*\n\n☕ **Key Outcome:** Single-Origin Packaging Guidelines & Direct-Trade Monogram.\n🌐 **Official Website:** [bluebottlecoffee.com](https://bluebottlecoffee.com)`,
      actions: [
        { label: '👁️ Deep Dive Case Study (Blue Bottle)', callback: 'openCaseStudy3' },
        { label: '🎨 Packaging & Branding', callback: 'selectGraphics' },
        { label: '📅 Book a Discovery Call', callback: 'openBookCallModal' }
      ],
      chips: ['Aimé Leon Dore', 'Buck Mason', 'The Ridge', 'Branding', 'Pricing']
    },
    {
      keywords: ['ridge', 'wallet', 'lumbarcare', 'jadd sanchez', 'everyday carry'],
      response: `🌟 **The Ridge Case Study (Santa Monica, California, USA)**\n\n**Discipline:** Digital Paid Ads & Creative Strategy • High-Growth DTC\n**Client Lead:** Jadd Sanchez, Performance Marketing Director\n\n💬 *"Create and Arise completely turned our paid social advertising performance around. They engineered 36 high-converting ad creative variants, slashed our customer acquisition cost by 64%, and scaled our campaigns to a consistent 3.8x blended ROAS."*\n\n📈 **Key Outcome:** +320% ROAS Lift & Slashed CAC from $58 to $18.50.\n🌐 **Official Website:** [ridge.com](https://ridge.com)`,
      actions: [
        { label: '👁️ Deep Dive Case Study (The Ridge)', callback: 'openCaseStudy4' },
        { label: '📈 Digital Ads Services', callback: 'selectAds' },
        { label: '📅 Book Paid Ads Consultation', callback: 'openBookCallModal' }
      ],
      chips: ['Aimé Leon Dore', 'Buck Mason', 'Digital Ads', 'Pricing', 'Contact']
    },
    {
      keywords: ['crossway', 'esv', 'bible', 'nathan reyes', 'the gospel coalition', 'tgc', 'jordan cruz', 'compassion', 'joycie santos', 'ministry', 'church'],
      response: `✝️ **Faith-Driven Ministry Partnerships**\n\nCreate and Arise is honored to serve leading Christian ministries and biblical publishers:\n\n• **Crossway (ESV Bible - Wheaton, IL):** Editorial book typography, scripture carousels & +240% reader outreach.\n• **The Gospel Coalition (Austin, TX):** Theological video reels, social discipleship carousels & +280% reach.\n• **Compassion International (Colorado Springs, CO):** Global donor presentation decks & 100% biblical stewardship.\n\nEvery project is delivered with reverence, classical typographic restraint, and genuine kingdom stewardship.`,
      actions: [
        { label: '👁️ Crossway Case Study', callback: 'openCaseStudy5' },
        { label: '👁️ Compassion Case Study', callback: 'openCaseStudy10' },
        { label: '📅 Book Ministry Consultation', callback: 'openBookCallModal' }
      ],
      chips: ['Client Reviews', 'Web Design', 'Pricing', 'Our Faith', 'Contact']
    },
    {
      keywords: ['review', 'reviews', 'testimonial', 'testimonials', 'feedback', 'rating', 'ratings', 'clients', 'usa client', 'usa clients'],
      response: `⭐ **Verified Client Reviews & Testimonials**\n\nCreate and Arise maintains a **100% 5-Star Track Record** with visionary brands across the USA and worldwide:\n\n• **Aimé Leon Dore (NYC):** 0.4s load speed & 4.8x conversion lift.\n• **Buck Mason (LA):** Iconic monogram & expansion to 30+ stores.\n• **Blue Bottle Coffee (Oakland):** Single-origin retail packaging guidelines.\n• **The Ridge (Santa Monica):** +320% ROAS lift & CAC slashed by 64%.\n• **Velocity Global (Denver):** 4x enterprise inbound pipeline.\n• **Crossway & TGC:** +240% to +280% digital outreach surge.\n\nAll client websites are live and verified!`,
      actions: [
        { label: '⭐ View Reviews & Team Section', callback: 'scrollToReviews' },
        { label: '🖼️ Explore Full Portfolio Grid', callback: 'scrollToPortfolio' },
        { label: '📅 Book a Free Discovery Call', callback: 'openBookCallModal' }
      ],
      chips: ['Aimé Leon Dore', 'Buck Mason', 'Blue Bottle Coffee', 'The Ridge', 'Pricing']
    },
    {
      keywords: ['service', 'services', 'what do you do', 'offer', 'packages', 'capabilities', 'specialty', 'specialties'],
      response: `We specialize in 4 core creative and digital disciplines:\n\n1. **🎨 Graphic Design & Brand Identity** — Full logo suites, brand books, packaging & collaterals.\n2. **💻 Web Design & Development** — High-converting, fast, responsive UI/UX websites.\n3. **📈 Digital Ads & Campaign Marketing** — Meta, Google & TikTok Ads with high-ROI creative copy.\n4. **📱 Social Media Management** — Monthly content calendars, aesthetic grids & engagement.\n\nWhich service would you like to explore?`,
      actions: [
        { label: '🎨 Graphic Design Details', callback: 'selectGraphics' },
        { label: '💻 Web Design Details', callback: 'selectWeb' },
        { label: '📈 Digital Ads Details', callback: 'selectAds' },
        { label: '📱 Social Media Details', callback: 'selectSocial' },
        { label: '🧮 Open Cost Estimator', callback: 'scrollToEstimator' }
      ],
      chips: ['Graphic Design', 'Web Design', 'Digital Ads', 'Social Media', 'Pricing']
    },
    {
      keywords: ['graphic', 'graphics', 'logo', 'branding', 'brand identity', 'packaging', 'vector', 'flyer', 'pitch deck', 'style guide', 'merch', 'stationery'],
      response: `🎨 **Graphic Design & Brand Identity**\n\nOur foundational craft helps visionary brands command respect and trust:\n\n• **Complete Master Logo Suite:** Primary, secondary, submarks, and favicon vectors (AI, SVG, EPS, PDF, PNG).\n• **Brand Architecture Guidelines:** Color palettes, typography hierarchies, and visual standard books.\n• **Packaging & Unboxing:** Factory-ready die-lines, foil stamping, and 3D photorealistic mockups.\n• **Full Commercial Rights:** 100% source file handover with unlimited commercial rights.\n• **Investment:** Starting at **$450 / ₱25,000** with 2-week delivery.`,
      actions: [
        { label: '🧮 Estimate Branding Package ($450+)', callback: 'selectGraphics' },
        { label: '👁️ Buck Mason Heritage Case Study', callback: 'openCaseStudy8' },
        { label: '👁️ Blue Bottle Packaging Suite', callback: 'openCaseStudy3' },
        { label: '📅 Book a Discovery Call', callback: 'openBookCallModal' }
      ],
      chips: ['Pricing', 'Web Design', 'Digital Ads', 'Social Media', 'Contact']
    },
    {
      keywords: ['web', 'website', 'web design', 'development', 'landing page', 'ui', 'ux', 'responsive', 'e-commerce', 'ecommerce', 'shopify', 'code'],
      response: `💻 **Web Design & Development at Create and Arise**\n\nWe design and hand-craft high-converting, sub-second responsive websites:\n\n• **Speed & Performance:** 99/100 Core Web Vitals with sub-0.5s edge load speeds (just like our work for Aimé Leon Dore!).\n• **Clean Architecture:** Semantic HTML5, modern vanilla CSS, responsive layouts, zero template bloat.\n• **Conversion Optimization:** Lead capture forms, automated booking integrations, GA4 analytics.\n• **Investment:** Starting at **$750 / ₱43,500** with 2 to 3-week turnaround.\n\nWould you like an instant estimate or a free design audit of your current site?`,
      actions: [
        { label: '🧮 Estimate Web Design ($750+)', callback: 'selectWeb' },
        { label: '👁️ Aimé Leon Dore Case Study', callback: 'openCaseStudy2' },
        { label: '📅 Book Free 30-Min Strategy Call', callback: 'openBookCallModal' }
      ],
      chips: ['Pricing', 'Graphic Design', 'Digital Ads', 'Social Media', 'Book a Call']
    },
    {
      keywords: ['ad', 'ads', 'marketing', 'campaign', 'meta ads', 'facebook ads', 'google ads', 'tiktok ads', 'roas', 'traffic', 'cac'],
      response: `📈 **Digital Ads & Performance Marketing**\n\nWe engineer omnichannel campaigns designed to scale revenue profitably:\n\n• **Platforms:** Meta Ads (Facebook & Instagram), Google Search & Display, TikTok Ads.\n• **High-Converting Creatives:** Static hooks, carousel funnels, and conversion-tested copywriting.\n• **Proven Results:** We slashed CAC by 64% and achieved **+320% ROAS** for high-growth brands like The Ridge.\n• **Full Funnel:** Dedicated landing pages, pixel integration, and weekly ROAS tracking.\n• **Investment:** Starting at **$500 / ₱29,000** per month/sprint.`,
      actions: [
        { label: '🧮 Estimate Ads Package ($500+)', callback: 'selectAds' },
        { label: '👁️ The Ridge Case Study', callback: 'openCaseStudy4' },
        { label: '📅 Book Paid Ads Consultation', callback: 'openBookCallModal' }
      ],
      chips: ['Pricing', 'Web Design', 'Graphic Design', 'Social Media', 'Contact']
    },
    {
      keywords: ['social', 'social media', 'smm', 'instagram', 'content calendar', 'grid', 'feed', 'posting', 'followers'],
      response: `📱 **Social Media Management**\n\nTransform your social media channels into an aesthetic, authoritative client magnet:\n\n• **30-Day Content Architecture:** Monthly editorial calendars mapped to your business sales cycle.\n• **Visual Polish:** High-impact branded carousels, aesthetic grids, and devotional/educational assets.\n• **Growth Copywriting:** High-retention hooks, thoughtful captions, and optimized hashtag clusters.\n• **Community Stewardship:** Strategic response protocols and monthly performance analytics.\n• **Investment:** Starting at **$450 / ₱25,000** per month.`,
      actions: [
        { label: '🧮 Estimate Social Media ($450+)', callback: 'selectSocial' },
        { label: '👁️ TGC Discipleship Case Study', callback: 'openCaseStudy21' },
        { label: '📅 Schedule Social Strategy Call', callback: 'openBookCallModal' }
      ],
      chips: ['Pricing', 'Web Design', 'Graphic Design', 'Digital Ads', 'Contact']
    },
    {
      keywords: ['reel', 'reels', 'video', 'tiktok video', 'shorts', 'youtube', 'editing', 'motion', 'video editing'],
      response: `🎬 **Creative Capabilities Note:**\n\nAt **Create and Arise**, our studio is 100% focused on our 4 high-impact core disciplines:\n\n1. **🎨 Graphic Design & Brand Identity**\n2. **💻 Web Design & Development**\n3. **📈 Digital Ads Marketing**\n4. **📱 Social Media Management**\n\nWe do **not** offer standalone freelance video shooting or YouTube editing, which allows us to deliver world-class craft and ROI for our 4 specialized core pillars!\n\nWhich core service can we assist you with today?`,
      actions: [
        { label: '🎨 Graphic Design', callback: 'selectGraphics' },
        { label: '💻 Web Design', callback: 'selectWeb' },
        { label: '📈 Digital Ads', callback: 'selectAds' },
        { label: '📱 Social Media Management', callback: 'selectSocial' }
      ],
      chips: ['Web Design', 'Graphic Design', 'Pricing', 'Contact']
    },
    {
      keywords: ['price', 'pricing', 'cost', 'rates', 'how much', 'magkano', 'fee', 'quote', 'budget', 'estimate', 'cheap', 'expensive'],
      response: `💰 **Transparent Studio Pricing & Packages**\n\nWe offer clear fixed-price packages with zero hidden fees:\n\n• **🎨 Graphic Design & Branding:** from **$450 / ₱25,000**\n• **💻 Web Design & Development:** from **$750 / ₱43,500**\n• **📈 Digital Ads Marketing:** from **$500 / ₱29,000**\n• **📱 Social Media Management:** from **$450 / ₱25,000**\n\n✨ **Options:**\n• Standard Delivery: 2–3 Weeks\n• Express Priority Sprint: 7 Days (+30%)\n• Ongoing Monthly Retainer: 10% Bundle Discount\n\nSupported Currencies: **USD ($), PHP (₱), AUD (A$), EUR (€), GBP (£)**!`,
      actions: [
        { label: '🧮 Open Interactive Cost Estimator', callback: 'scrollToEstimator' },
        { label: '📅 Book a Free Discovery Call', callback: 'openBookCallModal' },
        { label: '📝 Submit Custom Project Scope', callback: 'scrollToContact' }
      ],
      chips: ['Web Design', 'Graphic Design', 'Digital Ads', 'Payment Methods', 'Contact']
    },
    {
      keywords: ['jerome', 'cabinta', 'developer', 'web developer', 'who built', 'who coded', 'who made', 'coder', 'purpose', 'streetwear'],
      response: `👨‍💻 **Meet Web Developer Jerome Cabinta**\n\n**Jerome Cabinta** is the web developer and UI/UX implementation specialist at Create and Arise who built this website from the ground up!\n\n• **Craft:** Clean semantic HTML5, modern vanilla CSS, sub-second edge speeds, and zero template bloat.\n• **Featured Live Project:** [create-with-purpose.vercel.app](https://create-with-purpose.vercel.app) — an interactive 500 GSM heavyweight streetwear platform.\n• **Philosophy:** Excellence in workmanship as working for the Lord (Colossians 3:23).`,
      actions: [
        { label: '🚀 Launch PURPOSE / STUDIO™ Live', callback: 'openPurposeProject' },
        { label: '👁️ Purpose Studio Case Study', callback: 'openCaseStudy7' },
        { label: '📅 Book Call with Jerome & Team', callback: 'openBookCallModal' },
        { label: '💬 Chat on WhatsApp', callback: 'openWhatsApp' }
      ],
      chips: ['Meet the Team', 'Web Design', 'Client Reviews', 'Pricing', 'Contact']
    },
    {
      keywords: ['team', 'members', 'staff', 'who works', 'people', 'collective', 'who is on the team', 'studio team', 'agency team', 'leadership', 'founder'],
      response: `👥 **The Create and Arise Creative Collective**\n\nBased in the Philippines and serving clients across the USA, UK, Australia, and worldwide:\n\n• **Elijah Morales** — Founder & Executive Creative Director\n• **Jerome Cabinta** — Web Developer & UI/UX Specialist\n• **Hannah Grace Santos** — Senior Brand & Packaging Designer\n• **Caleb Tan** — Digital Ads & Growth Strategist\n• **Faith Dela Cruz** — Social Media & Content Strategist\n\nDedicated weekday sprints, direct Slack/Loom communication, and 100% intellectual property handover!`,
      actions: [
        { label: '👥 Meet Our Team & Reviews', callback: 'scrollToTeam' },
        { label: '📅 Book Discovery Call', callback: 'openBookCallModal' },
        { label: '💬 WhatsApp Direct Chat', callback: 'openWhatsApp' }
      ],
      chips: ['Client Reviews', 'Services', 'Pricing', 'Our Faith', 'Contact']
    },
    {
      keywords: ['hours', 'open', 'schedule', 'time', 'operating', 'closed', 'weekend', 'saturday', 'sunday', 'monday', 'friday', 'sabbath'],
      response: `🕒 **Studio Operating Schedule (PHT / GMT+8):**\n\n• **Monday to Friday:** 8:00 AM – 6:00 PM PHT (Active Studio & Build Sprints)\n• **Saturday & Sunday:** Closed for Weekend Sabbath, Rest & Family Renewal\n\n⚡ **Global Asynchronous Collaboration:** We collaborate smoothly with clients in the US (EST/PST), Australia, and Europe with zero midnight meetings. Guaranteed replies within 24 weekday business hours!`,
      actions: [
        { label: '📅 Schedule a Discovery Call', callback: 'openBookCallModal' },
        { label: '📝 Submit Consultation Form', callback: 'scrollToContact' },
        { label: '💬 Send WhatsApp Message', callback: 'openWhatsApp' }
      ],
      chips: ['Services', 'Pricing', 'Meet the Team', 'Contact']
    },
    {
      keywords: ['payment', 'pay', 'gcash', 'maya', 'bank', 'paypal', 'stripe', 'wise', 'credit card', 'currency'],
      response: `💳 **Secure Payment Methods Accepted:**\n\n• **Philippine Clients:** GCash, Maya, BDO, BPI, UnionBank (PHP ₱)\n• **USA & International Clients:** Stripe, PayPal, Wise, Direct International Wire Transfer (USD $, AUD A$, EUR €, GBP £)\n\n💼 **Terms:** 50% initial milestone deposit to lock your sprint calendar, with the remaining 50% upon final delivery and 100% commercial source file handover.`,
      actions: [
        { label: '🧮 Interactive Cost Estimator', callback: 'scrollToEstimator' },
        { label: '📅 Book a Discovery Call', callback: 'openBookCallModal' },
        { label: '📝 Start a Project Inquiry', callback: 'scrollToContact' }
      ],
      chips: ['Pricing', 'Web Design', 'Graphic Design', 'Contact']
    },
    {
      keywords: ['location', 'where', 'benguet', 'la trinidad', 'manila', 'philippines', 'base', 'country', 'international'],
      response: `📍 **Studio Headquarters:**\n\nCreate and Arise is headquartered in **La Trinidad, Benguet, Philippines (GMT+8)**, serving visionary clients across the USA, UK, Europe, Australia, and Asia.\n\nOur highland studio operates with world-class design standards, international communication protocols, and dedicated asynchronous video walkthroughs (Loom & Figma).`,
      actions: [
        { label: '👥 Meet Our Team & Reviews', callback: 'scrollToTeam' },
        { label: '📅 Book a Discovery Call', callback: 'openBookCallModal' },
        { label: '💬 Chat on WhatsApp', callback: 'openWhatsApp' }
      ],
      chips: ['Client Reviews', 'Services', 'Pricing', 'Operating Hours']
    },
    {
      keywords: ['contact', 'hire', 'book', 'talk', 'email', 'phone', 'whatsapp', 'messenger', 'consultation', 'call', 'meeting', 'audit'],
      response: `📞 **Get in Touch with Create and Arise:**\n\n• **WhatsApp / Mobile:** +63 927 468 2635\n• **Official Email:** [createandarise05@gmail.com](mailto:createandarise05@gmail.com)\n• **Facebook:** [@CreateAndArise2023](https://www.facebook.com/CreateAndArise2023)\n• **Studio Hours:** Mon–Fri 8:00 AM – 6:00 PM PHT\n\nWe respond to all weekday inquiries within 24 business hours!`,
      actions: [
        { label: '💬 Message on WhatsApp', callback: 'openWhatsApp' },
        { label: '📅 Book a Discovery Call', callback: 'openBookCallModal' },
        { label: '📝 Fill Project Inquiry Form', callback: 'scrollToContact' }
      ],
      chips: ['Pricing', 'Services', 'Operating Hours', 'About Us']
    }
  ];

  // Default Fallback Response
  const defaultFallback = {
    response: `Thank you for reaching out! ✨ At **Create and Arise**, we specialize in purpose-driven Graphic Design, High-Converting Web Design, Digital Ads Marketing, and Social Media Management for visionary businesses worldwide.\n\nWhether you need an ultra-fast web platform like **Aimé Leon Dore**, iconic heritage branding like **Buck Mason**, or high-ROAS ads like **The Ridge**, our team is ready to engineer your growth!\n\nWhat can we configure or answer for you?`,
    actions: [
      { label: '🎨 Explore Services', callback: 'showServicesMenu' },
      { label: '🧮 Interactive Cost Calculator', callback: 'scrollToEstimator' },
      { label: '⭐ Read Verified Client Reviews', callback: 'scrollToReviews' },
      { label: '📅 Book a Free Discovery Call', callback: 'openBookCallModal' }
    ],
    chips: ['Web Design', 'Graphic Design', 'Digital Ads', 'Social Media', 'Pricing', 'Contact']
  };

  // Chatbot Initialization
  function initChatbot() {
    createChatbotMarkup();
    bindChatEvents();

    // Auto-greeting if empty
    setTimeout(() => {
      const messagesContainer = document.getElementById('chatbotMessages');
      if (messagesContainer && messagesContainer.children.length === 0) {
        appendBotMessage(
          `👋 **Hi there! Welcome to Create and Arise!**\n\nI'm **AriseBot**, your AI creative and digital growth assistant. How can we help uplift and grow your brand today?`,
          [
            { label: '🎨 View Creative Services', callback: 'showServicesMenu' },
            { label: '🧮 Interactive Cost Calculator', callback: 'scrollToEstimator' },
            { label: '⭐ Read USA Client Reviews', callback: 'scrollToReviews' },
            { label: '🕒 Check Business Schedule', callback: 'showHoursInfo' }
          ],
          ['Web Design', 'Graphic Design', 'Digital Ads', 'Social Media', 'Pricing', 'Client Reviews']
        );
      }
    }, 400);
  }

  function createChatbotMarkup() {
    // Remove existing if any to prevent duplicate initialization
    const existing = document.getElementById('ariseChatbotWidget');
    if (existing) existing.remove();

    const widget = document.createElement('div');
    widget.className = 'chatbot-widget';
    widget.id = 'ariseChatbotWidget';
    widget.innerHTML = `
      <!-- Chat Window Popup -->
      <div class="chatbot-window" id="chatbotWindow" role="dialog" aria-modal="true" aria-label="Create and Arise AI Assistant">
        <!-- Header -->
        <div class="chat-header">
          <div class="chat-header-info">
            <div class="chat-bot-avatar">
              <img src="assets/Logo/Logo.png" alt="AriseBot Logo" class="chat-bot-avatar-img">
            </div>
            <div>
              <div class="chat-bot-title">AriseBot &bull; AI Assistant</div>
              <div class="chat-bot-status">
                <span class="chat-status-dot"></span>
                <span>Active &bull; Studio Philippines</span>
              </div>
            </div>
          </div>
          <div class="chat-header-actions">
            <button type="button" class="chat-header-btn" id="chatRestartBtn" title="Restart Conversation" aria-label="Restart Conversation">&#8635;</button>
            <button type="button" class="chat-header-btn" id="chatCloseBtn" title="Minimize Chat" aria-label="Close Chat">&times;</button>
          </div>
        </div>

        <!-- Messages Container -->
        <div class="chat-messages-container" id="chatbotMessages">
          <!-- Rendered dynamically -->
        </div>

        <!-- Typing Indicator -->
        <div id="chatTypingIndicator" style="display: none; padding: 0 1rem 0.5rem;">
          <div class="chat-typing-indicator">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>

        <!-- Suggestions Chips Bar -->
        <div class="chat-suggestions-wrapper" id="chatSuggestions">
          <!-- Dynamically filled -->
        </div>

        <!-- Footer / Input Form -->
        <div class="chat-footer">
          <form class="chat-input-form" id="chatbotInputForm">
            <input type="text" id="chatUserInput" class="chat-input-field" placeholder="Ask about services, pricing, reviews, team..." autocomplete="off" required>
            <button type="button" id="chatSendBtn" class="chat-send-btn" aria-label="Send Message">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
          <div class="chat-disclaimer">Faith &bull; Excellence &bull; Integrity &bull; Create and Arise</div>
        </div>
      </div>

      <!-- Floating Trigger Button & Tooltip -->
      <div class="chatbot-trigger-container">
        <div class="chatbot-tooltip" id="chatTooltip">Chat with AriseBot &#128075;</div>
        <button type="button" class="chatbot-trigger-btn" id="chatbotTriggerBtn" aria-label="Open AI Creative Chatbot">
          <span id="chatTriggerIcon">
            <img src="assets/Logo/Logo.png" alt="AriseBot Logo" class="chat-trigger-logo">
          </span>
          <span class="chatbot-unread-badge" id="chatUnreadBadge">1</span>
        </button>
      </div>
    `;

    document.body.appendChild(widget);
  }

  // Global window functions for absolute reliability
  let lastToggleTime = 0;
  window.toggleAriseChatbot = function (openState) {
    const now = Date.now();
    if (openState === undefined && now - lastToggleTime < 250) {
      return;
    }
    lastToggleTime = now;

    const chatWindow = document.getElementById('chatbotWindow');
    const unreadBadge = document.getElementById('chatUnreadBadge');
    const triggerIcon = document.getElementById('chatTriggerIcon');
    const tooltip = document.getElementById('chatTooltip');
    const userInput = document.getElementById('chatUserInput');
    if (!chatWindow) return;

    const isCurrentlyOpen = chatWindow.classList.contains('open');
    const shouldOpen = openState !== undefined ? Boolean(openState) : !isCurrentlyOpen;

    if (shouldOpen) {
      chatWindow.classList.add('open');
      if (unreadBadge) unreadBadge.style.display = 'none';
      if (triggerIcon) triggerIcon.innerHTML = '<span style="font-size: 1.5rem; line-height: 1; font-weight: 800; color: #0a0b10;">&times;</span>';
      if (tooltip) tooltip.style.display = 'none';
      setTimeout(() => userInput && userInput.focus(), 250);
    } else {
      chatWindow.classList.remove('open');
      if (triggerIcon) triggerIcon.innerHTML = '<img src="assets/Logo/Logo.png" alt="AriseBot Logo" class="chat-trigger-logo">';
    }
  };

  window.openAriseChatbot = function (initialQuery) {
    window.toggleAriseChatbot(true);
    if (initialQuery) {
      setTimeout(() => {
        appendUserMessage(initialQuery);
        processUserQuery(initialQuery);
      }, 300);
    }
  };

  window.sendAriseChatMessage = function () {
    const userInput = document.getElementById('chatUserInput');
    if (!userInput) return;
    const text = userInput.value.trim();
    if (!text) return;

    appendUserMessage(text);
    userInput.value = '';
    processUserQuery(text);
  };

  function bindChatEvents() {
    const triggerBtn = document.getElementById('chatbotTriggerBtn');
    const tooltip = document.getElementById('chatTooltip');
    const closeBtn = document.getElementById('chatCloseBtn');
    const restartBtn = document.getElementById('chatRestartBtn');
    const inputForm = document.getElementById('chatbotInputForm');
    const userInput = document.getElementById('chatUserInput');
    const sendBtn = document.getElementById('chatSendBtn');

    if (triggerBtn) {
      triggerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.toggleAriseChatbot();
      });
    }

    if (tooltip) {
      tooltip.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.toggleAriseChatbot(true);
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.toggleAriseChatbot(false);
      });
    }

    if (inputForm) {
      inputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.sendAriseChatMessage();
      });
    }

    if (sendBtn) {
      sendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.sendAriseChatMessage();
      });
    }

    if (userInput) {
      userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
          window.sendAriseChatMessage();
        }
      });
    }

    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (messagesContainer) messagesContainer.innerHTML = '';
        chatHistory.length = 0;
        appendBotMessage(
          `✨ **Conversation refreshed!**\n\nHow can Create and Arise help elevate your brand today?`,
          [
            { label: '🎨 Explore Services', callback: 'showServicesMenu' },
            { label: '🧮 Calculate Package Cost', callback: 'scrollToEstimator' },
            { label: '⭐ View Verified Reviews', callback: 'scrollToReviews' },
            { label: '📅 Book a Discovery Call', callback: 'openBookCallModal' }
          ],
          ['Web Design', 'Graphic Design', 'Digital Ads', 'Social Media', 'Pricing', 'Client Reviews']
        );
      });
    }
  }

  function appendUserMessage(text) {
    const container = document.getElementById('chatbotMessages');
    if (!container) return;

    chatHistory.push({ role: 'user', text: text });

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-msg user';
    msgEl.innerHTML = `
      <div class="chat-bubble">${escapeHtml(text)}</div>
      <div class="chat-msg-time">${time}</div>
    `;
    container.appendChild(msgEl);
    scrollToBottom();
  }

  function appendBotMessage(markdownText, actions = [], chips = []) {
    const container = document.getElementById('chatbotMessages');
    if (!container) return;

    chatHistory.push({ role: 'model', text: markdownText });

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-msg bot';

    let formattedContent = formatMarkdown(markdownText);

    let actionsHtml = '';
    if (actions && actions.length > 0) {
      actionsHtml = `
        <div class="chat-action-container">
          ${actions.map(a => `
            <button type="button" class="chat-inline-btn" data-callback="${a.callback}">
              ${a.label} &rarr;
            </button>
          `).join('')}
        </div>
      `;
    }

    msgEl.innerHTML = `
      <div class="chat-bubble">
        ${formattedContent}
        ${actionsHtml}
      </div>
      <div class="chat-msg-time">AriseBot &bull; ${time}</div>
    `;

    container.appendChild(msgEl);

    // Bind action callbacks
    msgEl.querySelectorAll('.chat-inline-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cbName = btn.getAttribute('data-callback');
        executeActionCallback(cbName);
      });
    });

    // Update chips
    renderSuggestionChips(chips);
    scrollToBottom();
  }

  function renderSuggestionChips(chips) {
    const chipsContainer = document.getElementById('chatSuggestions');
    if (!chipsContainer) return;

    if (!chips || chips.length === 0) {
      chipsContainer.innerHTML = '';
      return;
    }

    chipsContainer.innerHTML = chips.map(chip => `
      <button type="button" class="chat-suggestion-chip" data-chip="${escapeHtml(chip)}">
        ${escapeHtml(chip)}
      </button>
    `).join('');

    chipsContainer.querySelectorAll('.chat-suggestion-chip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const query = btn.getAttribute('data-chip');
        appendUserMessage(query);
        processUserQuery(query);
      });
    });
  }

  async function processUserQuery(userQuery) {
    const typingIndicator = document.getElementById('chatTypingIndicator');
    if (typingIndicator) typingIndicator.style.display = 'block';
    scrollToBottom();

    // 1. Attempt to query live /api/chat backend
    let backendSuccess = false;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userQuery, history: chatHistory.slice(-8) }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.reply) {
          backendSuccess = true;
          if (typingIndicator) typingIndicator.style.display = 'none';
          appendBotMessage(data.reply, data.actions || [], data.chips || []);
          return;
        }
      }
    } catch (err) {
      // Backend request failed or timed out, gracefully continue to local knowledge engine
    }

    // 2. Client-side Semantic Fallback Engine (Immediate & guaranteed)
    if (!backendSuccess) {
      const normalized = userQuery.toLowerCase();
      let matched = null;
      let maxMatchCount = 0;

      for (const item of botKnowledge) {
        let count = 0;
        for (const kw of item.keywords) {
          if (normalized.includes(kw)) {
            count += (kw.length > 5 ? 2 : 1);
          }
        }
        if (count > maxMatchCount) {
          maxMatchCount = count;
          matched = item;
        }
      }

      const delay = Math.min(500 + userQuery.length * 8, 1100);

      setTimeout(() => {
        if (typingIndicator) typingIndicator.style.display = 'none';

        if (matched && maxMatchCount > 0) {
          appendBotMessage(matched.response, matched.actions, matched.chips);
        } else {
          appendBotMessage(defaultFallback.response, defaultFallback.actions, defaultFallback.chips);
        }
      }, delay);
    }
  }

  function executeActionCallback(callbackName) {
    switch (callbackName) {
      case 'showServicesMenu':
        appendBotMessage(
          `Here are the 4 core disciplines of **Create and Arise**:\n\n1. **🎨 Graphic Design & Brand Identity** — From $450 / ₱25k\n2. **💻 Web Design & Development** — From $750 / ₱43.5k\n3. **📈 Digital Ads Marketing** — From $500 / ₱29k\n4. **📱 Social Media Management** — From $450 / ₱25k\n\nClick any button below to configure an instant package quote!`,
          [
            { label: '🎨 Estimate Graphics', callback: 'selectGraphics' },
            { label: '💻 Estimate Web Design', callback: 'selectWeb' },
            { label: '📈 Estimate Digital Ads', callback: 'selectAds' },
            { label: '📱 Estimate Social Media', callback: 'selectSocial' }
          ],
          ['Cost Estimator', 'Working Hours', 'Payment Methods', 'Contact']
        );
        break;

      case 'showHoursInfo':
        appendBotMessage(
          `🕒 **Studio Operating Hours (PHT / GMT+8):**\n\n• **Monday to Friday:** 8:00 AM – 6:00 PM PHT (Active Studio)\n• **Saturday & Sunday:** Closed for Weekend Sabbath Rest\n\nWe provide rapid response times under 24 weekday hours for all clients worldwide! Would you like to schedule a 1-on-1 discovery call?`,
          [
            { label: '📅 Schedule 1-on-1 Call', callback: 'openBookCallModal' },
            { label: '📝 Fill Project Consultation Form', callback: 'scrollToContact' },
            { label: '💬 Chat on WhatsApp', callback: 'openWhatsApp' }
          ],
          ['Services', 'Pricing', 'Client Reviews', 'Contact']
        );
        break;

      case 'openCaseStudy2':
        if (window.switchTab) window.switchTab('portfolio');
        setTimeout(() => {
          if (window.openCaseStudyById) window.openCaseStudyById(2);
        }, 120);
        break;

      case 'openCaseStudy3':
        if (window.switchTab) window.switchTab('portfolio');
        setTimeout(() => {
          if (window.openCaseStudyById) window.openCaseStudyById(3);
        }, 120);
        break;

      case 'openCaseStudy4':
        if (window.switchTab) window.switchTab('portfolio');
        setTimeout(() => {
          if (window.openCaseStudyById) window.openCaseStudyById(4);
        }, 120);
        break;

      case 'openCaseStudy5':
        if (window.switchTab) window.switchTab('portfolio');
        setTimeout(() => {
          if (window.openCaseStudyById) window.openCaseStudyById(5);
        }, 120);
        break;

      case 'openCaseStudy7':
        if (window.switchTab) window.switchTab('portfolio');
        setTimeout(() => {
          if (window.openCaseStudyById) window.openCaseStudyById(7);
        }, 120);
        break;

      case 'openCaseStudy8':
        if (window.switchTab) window.switchTab('portfolio');
        setTimeout(() => {
          if (window.openCaseStudyById) window.openCaseStudyById(8);
        }, 120);
        break;

      case 'openCaseStudy10':
        if (window.switchTab) window.switchTab('portfolio');
        setTimeout(() => {
          if (window.openCaseStudyById) window.openCaseStudyById(10);
        }, 120);
        break;

      case 'openCaseStudy21':
        if (window.switchTab) window.switchTab('portfolio');
        setTimeout(() => {
          if (window.openCaseStudyById) window.openCaseStudyById(21);
        }, 120);
        break;

      case 'selectGraphics':
        if (window.selectServiceInEstimator) window.selectServiceInEstimator('graphics');
        break;

      case 'selectWeb':
        if (window.selectServiceInEstimator) window.selectServiceInEstimator('web');
        break;

      case 'selectAds':
        if (window.selectServiceInEstimator) window.selectServiceInEstimator('ads');
        break;

      case 'selectSocial':
        if (window.selectServiceInEstimator) window.selectServiceInEstimator('social');
        break;

      case 'scrollToEstimator':
        if (window.switchTab) window.switchTab('estimator');
        break;

      case 'scrollToContact':
        if (window.switchTab) window.switchTab('contact');
        break;

      case 'scrollToTeam':
        if (window.switchTab) window.switchTab('team');
        break;

      case 'scrollToReviews':
        if (window.switchTab) window.switchTab('team');
        setTimeout(() => {
          const revs = document.getElementById('testimonialsGrid');
          if (revs) revs.scrollIntoView({ behavior: 'smooth' });
        }, 120);
        break;

      case 'scrollToPortfolio':
        if (window.switchTab) window.switchTab('portfolio');
        break;

      case 'openBookCallModal':
        if (window.openBookCallModal) window.openBookCallModal();
        break;

      case 'openWhatsApp':
        window.open('https://wa.me/639274682635?text=Hello%20Create%20and%20Arise!%20I%20am%20chatting%20with%20AriseBot%20and%20would%20like%20to%20inquire%20about%20a%20project.', '_blank');
        break;

      case 'openPurposeProject':
        window.open('https://create-with-purpose.vercel.app', '_blank');
        break;

      default:
        break;
    }
  }

  function scrollToBottom() {
    const container = document.getElementById('chatbotMessages');
    if (container) {
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 50);
    }
  }

  function formatMarkdown(text) {
    if (!text) return '';
    let formatted = text
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); text-decoration: underline; text-underline-offset: 3px; font-weight: 600;">$1 &nearr;</a>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
    return formatted;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Load when document is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }
})();
