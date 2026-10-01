/**
 * CREATE AND ARISE - Automated AI Chatbot Engine (AriseBot)
 * Purpose-Driven Virtual Creative Consultant
 */

(function () {
  // Knowledge Base & Intent Mapping
  const botKnowledge = [
    {
      keywords: ['hi', 'hello', 'hey', 'kumusta', 'magandang', 'greetings', 'start', 'morning', 'afternoon', 'evening'],
      response: `Hello and welcome to **Create and Arise**! ✨\n\nI'm **AriseBot**, your AI creative and digital growth assistant. We are a Christian-founded creative agency based in the Philippines, helping visionary brands arise through world-class graphics, high-converting websites, dynamic video reels, and digital marketing.\n\nHow can I help you today?`,
      actions: [
        { label: '🎨 Explore Services', callback: 'showServicesMenu' },
        { label: '💰 Check Pricing & Cost', callback: 'showPricingMenu' },
        { label: '📅 Book Discovery Call', callback: 'openBookCallModal' },
        { label: '🚀 Start a Project', callback: 'scrollToContact' }
      ],
      chips: ['Graphic Design', 'Web Design', 'Video Reels', 'Book a Call', 'Cost Estimator', 'Working Hours']
    },
    {
      keywords: ['service', 'services', 'what do you do', 'offer', 'packages', 'capabilities', 'specialty', 'specialties'],
      response: `We specialize in 5 core creative and digital disciplines:\n\n1. **🎨 Graphic Design & Brand Identity** — Full logo suites, brand books, packaging & collaterals.\n2. **💻 Web Design & Development** — High-converting, fast, responsive UI/UX websites.\n3. **🎬 Video Reels & Motion** — Hook-driven vertical video editing for TikTok, Reels & Shorts.\n4. **📈 Digital Ads & Campaign Marketing** — Meta, Google & TikTok Ads with high-ROI creative copy.\n5. **📱 Social Media Management** — Monthly content calendars, aesthetic grids & engagement.\n\nWhich service would you like to explore?`,
      actions: [
        { label: '🎨 Graphic Design Details', callback: 'explainGraphics' },
        { label: '💻 Web Design Details', callback: 'explainWeb' },
        { label: '🎬 Video Reels Details', callback: 'explainReels' },
        { label: '🧮 Open Cost Estimator', callback: 'scrollToEstimator' }
      ],
      chips: ['Graphic Design', 'Web Design', 'Video Reels', 'Digital Ads', 'Social Media']
    },
    {
      keywords: ['graphic', 'graphics', 'logo', 'branding', 'brand identity', 'packaging', 'vector', 'flyer', 'pitch deck', 'style guide'],
      response: `Our **Graphic Design & Brand Identity** service is our core craft! 🎨\n\nWe provide:\n• Bespoke vector logo systems (AI, SVG, EPS, PDF, PNG)\n• Comprehensive Brand Guidelines & Color Palettes\n• Premium Packaging, Merchandise & Stationery\n• High-Impact Investor Pitch Decks & Marketing Collaterals\n• Unlimited commercial ownership of all source files\n\nWould you like an estimated investment for a branding package?`,
      actions: [
        { label: '🧮 Estimate Graphics Package ($450+)', callback: 'selectGraphics' },
        { label: '🖼️ View Branding Portfolio', callback: 'filterPortfolioBranding' },
        { label: '📩 Inquire for Branding', callback: 'scrollToContact' }
      ],
      chips: ['Web Design', 'Video Reels', 'Calculate Cost', 'Get a Quote']
    },
    {
      keywords: ['web', 'website', 'web design', 'development', 'landing page', 'ui', 'ux', 'responsive', 'e-commerce', 'ecommerce'],
      response: `Our **Web Design & Development** combines breathtaking aesthetics with conversion-focused UX! 💻\n\nKey Highlights:\n• Modern, responsive, mobile-first layouts\n• Fast load speeds & SEO optimization\n• Clean glassmorphic / dark & light mode styling\n• Lead capture funnels, booking forms & analytics\n• Typical turnaround: 2 to 3 weeks\n\nWould you like to calculate your website investment?`,
      actions: [
        { label: '🧮 Estimate Web Design Package ($750+)', callback: 'selectWeb' },
        { label: '🖼️ View Web Portfolio', callback: 'filterPortfolioWeb' },
        { label: '📅 Book a Free Strategy Call', callback: 'openBookCallModal' }
      ],
      chips: ['Book a Call', 'Cost Estimator', 'Graphic Design', 'Video Reels', 'Payment Methods']
    },
    {
      keywords: ['reel', 'reels', 'video', 'tiktok', 'shorts', 'youtube', 'editing', 'motion', 'animation', 'sound design'],
      response: `Our **Video Reels & Motion Graphics** service is built to win the 3-second attention hook! 🎬\n\nWe deliver:\n• Dynamic vertical video editing (9:16 for Reels, TikTok, Shorts)\n• Kinetic typography & trending caption styles\n• 3D motion graphics & logo animations\n• High-engagement sound design & trending audio\n• Over 10M+ organic views generated for our clients!`,
      actions: [
        { label: '🧮 Estimate Video Reels Package ($400+)', callback: 'selectReels' },
        { label: '🖼️ View Video Portfolio', callback: 'filterPortfolioReels' },
        { label: '📩 Start Video Project', callback: 'scrollToContact' }
      ],
      chips: ['Digital Ads', 'Social Media', 'Cost Estimator', 'Contact']
    },
    {
      keywords: ['ad', 'ads', 'marketing', 'campaign', 'meta ads', 'facebook ads', 'google ads', 'tiktok ads', 'roas', 'roi', 'traffic'],
      response: `Our **Digital Ads & Campaign Marketing** focuses strictly on measurable revenue and ROAS! 📈\n\nDeliverables:\n• Omnichannel campaigns across Meta (FB/IG), Google Search/Display & TikTok\n• Audience segmentation & high-intent retargeting\n• A/B testing of creative visual variations and copywriting\n• Average client ROAS lift: **+320%**\n• Transparent weekly analytics reports`,
      actions: [
        { label: '🧮 Estimate Ads Campaign ($500+)', callback: 'selectAds' },
        { label: '💬 Chat with Growth Strategist', callback: 'openWhatsApp' },
        { label: '📩 Inquire for Ad Campaign', callback: 'scrollToContact' }
      ],
      chips: ['Cost Estimator', 'Video Reels', 'Social Media', 'Working Hours']
    },
    {
      keywords: ['social', 'social media', 'smm', 'instagram', 'facebook', 'content calendar', 'grid', 'posting', 'management'],
      response: `Our **Social Media Management** handles your complete digital presence so you can focus on running your business! 📱\n\nWhat's included:\n• 30-Day strategic monthly content calendar\n• Custom high-impact aesthetic carousels & posts\n• Engaging copywriting, hook captions & hashtag research\n• Active audience interaction & community reply support\n• Monthly growth and engagement analytics`,
      actions: [
        { label: '🧮 Estimate SMM Package ($450+)', callback: 'selectSocial' },
        { label: '📩 Book Social Media Consultation', callback: 'scrollToContact' }
      ],
      chips: ['Graphic Design', 'Video Reels', 'Pricing', 'Contact']
    },
    {
      keywords: ['price', 'pricing', 'cost', 'rates', 'how much', 'fee', 'quote', 'estimate', 'cheap', 'budget', 'expensive'],
      response: `We pride ourselves on transparent, honest pricing with zero hidden fees! 💰\n\n**Starting Estimates:**\n• 🎨 Graphic Design & Branding: from **$450 / ₱25,000**\n• 💻 Web Design & Development: from **$750 / ₱43,500**\n• 🎬 Video Reels Suite: from **$400 / ₱23,000**\n• 📈 Digital Ads Marketing: from **$500 / ₱29,000**\n• 📱 Social Media Management: from **$450 / ₱25,000**\n\nYou can use our Interactive Cost Estimator to customize your package in **USD, PHP, AUD, EUR, or GBP**!`,
      actions: [
        { label: '🧮 Open Interactive Cost Estimator', callback: 'scrollToEstimator' },
        { label: '📩 Request Custom Project Proposal', callback: 'scrollToContact' }
      ],
      chips: ['Graphic Design', 'Web Design', 'Payment Methods', 'Book Project']
    },
    {
      keywords: ['hours', 'open', 'schedule', 'time', 'operating', 'closed', 'weekend', 'saturday', 'sunday', 'monday', 'friday', 'sabbath'],
      response: `🕒 **Our Operating Hours (PHT / GMT+8):**\n\n• **Monday to Friday:** 8:00 AM – 6:00 PM PHT (Active Studio)\n• **Saturday & Sunday:** Closed for Weekend Sabbath, Rest & Family Renewal\n\nAll inquiries sent during weekends are prioritized first thing on Monday morning! We serve clients across all global time zones (US, Australia, UK, Europe, Asia) with smooth asynchronous communication.`,
      actions: [
        { label: '📩 Leave a Message for Monday', callback: 'scrollToContact' },
        { label: '💬 Send a WhatsApp Inquiry', callback: 'openWhatsApp' }
      ],
      chips: ['Location', 'Pricing', 'Services', 'Faith Foundation']
    },
    {
      keywords: ['philippines', 'location', 'where', 'manila', 'base', 'country', 'international', 'overseas', 'foreign', 'timezone', 'gmt'],
      response: `🇵🇭 **Create and Arise** is proudly based in **Metro Manila, Philippines (GMT+8)**, serving both Philippine enterprises and global brands in North America, Australia, the UK, Europe, and Asia!\n\nWe provide seamless asynchronous updates, dedicated Slack/WhatsApp channels, and flexible video consultations tailored to your local timezone.`,
      actions: [
        { label: '💳 View Accepted Payment Methods', callback: 'showPaymentMethods' },
        { label: '🚀 Start Your Global Project', callback: 'scrollToContact' }
      ],
      chips: ['Payment Methods', 'Working Hours', 'Services', 'Contact']
    },
    {
      keywords: ['payment', 'pay', 'gcash', 'maya', 'bank', 'paypal', 'stripe', 'wise', 'credit card', 'transfer', 'currency'],
      response: `💳 **We accept flexible local and international payment methods:**\n\n• **For Philippine Clients:** GCash, Maya, BDO, BPI, UnionBank Online Transfers.\n• **For International Clients:** PayPal, Stripe (Credit/Debit Cards), Wise (TransferWise), and International Bank Wire Transfers in USD, PHP, AUD, EUR, or GBP.\n\nAll projects include formal electronic invoices and milestone billing (50% upfront / 50% upon completion).`,
      actions: [
        { label: '🧮 Calculate Investment Range', callback: 'scrollToEstimator' },
        { label: '📩 Get an Official Invoice Quote', callback: 'scrollToContact' }
      ],
      chips: ['Cost Estimator', 'Services', 'Working Hours', 'Contact']
    },
    {
      keywords: ['faith', 'christian', 'bible', 'isaiah', 'values', 'mission', 'vision', 'integrity', 'owner', 'god', 'church', 'ministry'],
      response: `🙏 **Our Faith Foundation & Values:**\n\n**Create and Arise** was founded on **Isaiah 60:1**: *“Arise, shine; for your light has come, and the glory of the Lord rises upon you.”*\n\nWe operate with **Christian integrity, honesty, and stewardship**. We treat every design, website, and campaign as an act of excellence, ensuring transparent communication, respect for your resources, and uncompromising creative distinction.`,
      actions: [
        { label: '📜 Read Full Mission & ARISE Values', callback: 'scrollToMission' },
        { label: '🚀 Collaborate with Us', callback: 'scrollToContact' }
      ],
      chips: ['Our Mission', 'Services', 'Cost Estimator', 'Working Hours']
    },
    {
      keywords: ['contact', 'hire', 'book', 'talk', 'email', 'phone', 'whatsapp', 'messenger', 'consultation', 'call', 'meeting'],
      response: `We'd love to partner with you! Here is how you can connect directly with our creative team:\n\n• 📝 **Booking Form:** Scroll to our free project consultation form.\n• 📱 **WhatsApp:** +63 995 123 4567\n• 💬 **FB Messenger:** m.me/createandarise\n• ✉️ **Direct Email:** jeromecabinta7@gmail.com\n\nWe respond to all project inquiries within 24 weekday business hours!`,
      actions: [
        { label: '📝 Fill Project Consultation Form', callback: 'scrollToContact' },
        { label: '💬 Chat on WhatsApp', callback: 'openWhatsApp' },
        { label: '📋 Copy Direct Email', callback: 'copyEmail' }
      ],
      chips: ['Cost Estimator', 'Services', 'Working Hours', 'Branding']
    }
  ];

  // Default Fallback Response
  const defaultFallback = {
    response: `I'd love to help you with that! At **Create and Arise**, we provide world-class Graphic Design, High-Converting Web Design, Viral Video Reels, Digital Ads Marketing, and Social Media Management from the Philippines to global markets. 🌟\n\nWhat would you like to explore or configure?`,
    actions: [
      { label: '🎨 Graphic & Web Services', callback: 'showServicesMenu' },
      { label: '🧮 Calculate Project Investment', callback: 'scrollToEstimator' },
      { label: '📝 Submit Project Consultation', callback: 'scrollToContact' },
      { label: '💬 WhatsApp Direct Chat', callback: 'openWhatsApp' }
    ],
    chips: ['Graphic Design', 'Web Design', 'Video Reels', 'Cost Estimator', 'Working Hours', 'Contact']
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
          `👋 **Hi there! Welcome to Create and Arise!**\n\nI'm **AriseBot**, your AI creative assistant. How can we help uplift and grow your brand today?`,
          [
            { label: '🎨 View Creative Services', callback: 'showServicesMenu' },
            { label: '🧮 Interactive Cost Calculator', callback: 'scrollToEstimator' },
            { label: '🕒 Check Business Schedule', callback: 'showHoursInfo' }
          ],
          ['Graphic Design', 'Web Design', 'Video Reels', 'Pricing', 'Contact']
        );
      }
    }, 800);
  }

  function createChatbotMarkup() {
    // Remove any legacy floating chat if present
    const legacy = document.querySelector('.floating-quick-chat');
    if (legacy) legacy.remove();

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
            <input type="text" id="chatUserInput" class="chat-input-field" placeholder="Ask about services, pricing, hours..." autocomplete="off" required>
            <button type="submit" class="chat-send-btn" aria-label="Send Message">
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
          <span id="chatTriggerIcon"><img src="assets/Logo/Logo.png" alt="AriseBot Logo" class="chat-trigger-logo"></span>
          <span class="chatbot-unread-badge" id="chatUnreadBadge">1</span>
        </button>
      </div>
    `;

    document.body.appendChild(widget);
  }

  function bindChatEvents() {
    const triggerBtn = document.getElementById('chatbotTriggerBtn');
    const tooltip = document.getElementById('chatTooltip');
    const closeBtn = document.getElementById('chatCloseBtn');
    const restartBtn = document.getElementById('chatRestartBtn');
    const chatWindow = document.getElementById('chatbotWindow');
    const inputForm = document.getElementById('chatbotInputForm');
    const userInput = document.getElementById('chatUserInput');
    const unreadBadge = document.getElementById('chatUnreadBadge');
    const triggerIcon = document.getElementById('chatTriggerIcon');

    function toggleChat(openState) {
      const isCurrentlyOpen = chatWindow.classList.contains('open');
      const shouldOpen = openState !== undefined ? openState : !isCurrentlyOpen;

      if (shouldOpen) {
        chatWindow.classList.add('open');
        if (unreadBadge) unreadBadge.style.display = 'none';
        if (triggerIcon) triggerIcon.innerHTML = '&#10005;';
        if (tooltip) tooltip.style.display = 'none';
        setTimeout(() => userInput && userInput.focus(), 300);
      } else {
        chatWindow.classList.remove('open');
        if (triggerIcon) triggerIcon.innerHTML = '&#9993;';
      }
    }

    if (triggerBtn) triggerBtn.addEventListener('click', () => toggleChat());
    if (tooltip) tooltip.addEventListener('click', () => toggleChat(true));
    if (closeBtn) closeBtn.addEventListener('click', () => toggleChat(false));

    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (messagesContainer) messagesContainer.innerHTML = '';
        appendBotMessage(
          `✨ **Conversation refreshed!**\n\nHow can Create and Arise help elevate your brand today?`,
          [
            { label: '🎨 Explore Services', callback: 'showServicesMenu' },
            { label: '🧮 Calculate Package Cost', callback: 'scrollToEstimator' },
            { label: '📝 Start Project Booking', callback: 'scrollToContact' }
          ],
          ['Graphic Design', 'Web Design', 'Video Reels', 'Pricing', 'Working Hours']
        );
      });
    }

    if (inputForm) {
      inputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = userInput.value.trim();
        if (!text) return;
        
        appendUserMessage(text);
        userInput.value = '';
        processUserQuery(text);
      });
    }

    // Expose open function globally
    window.openAriseChatbot = function (initialQuery) {
      toggleChat(true);
      if (initialQuery) {
        setTimeout(() => {
          appendUserMessage(initialQuery);
          processUserQuery(initialQuery);
        }, 400);
      }
    };
  }

  function appendUserMessage(text) {
    const container = document.getElementById('chatbotMessages');
    if (!container) return;

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
      btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-chip');
        appendUserMessage(query);
        processUserQuery(query);
      });
    });
  }

  function processUserQuery(userQuery) {
    const typingIndicator = document.getElementById('chatTypingIndicator');
    if (typingIndicator) typingIndicator.style.display = 'block';
    scrollToBottom();

    const normalized = userQuery.toLowerCase();
    
    // Find matching knowledge item
    let matched = null;
    let maxMatchCount = 0;

    for (const item of botKnowledge) {
      let count = 0;
      for (const kw of item.keywords) {
        if (normalized.includes(kw)) {
          count++;
        }
      }
      if (count > maxMatchCount) {
        maxMatchCount = count;
        matched = item;
      }
    }

    const delay = Math.min(800 + userQuery.length * 10, 1400);

    setTimeout(() => {
      if (typingIndicator) typingIndicator.style.display = 'none';

      if (matched && maxMatchCount > 0) {
        appendBotMessage(matched.response, matched.actions, matched.chips);
      } else {
        appendBotMessage(defaultFallback.response, defaultFallback.actions, defaultFallback.chips);
      }
    }, delay);
  }

  function executeActionCallback(callbackName) {
    const chatWindow = document.getElementById('chatbotWindow');

    switch (callbackName) {
      case 'showServicesMenu':
        appendBotMessage(
          `Here are the 5 core services of **Create and Arise**:\n\n1. **🎨 Graphic Design & Brand Identity**\n2. **💻 Web Design & Development**\n3. **🎬 Video Reels & Motion Graphics**\n4. **📈 Digital Ads & Campaign Marketing**\n5. **📱 Social Media Management**\n\nClick any button below to configure a quote in our Cost Estimator!`,
          [
            { label: '🎨 Estimate Graphics', callback: 'selectGraphics' },
            { label: '💻 Estimate Web Design', callback: 'selectWeb' },
            { label: '🎬 Estimate Video Reels', callback: 'selectReels' },
            { label: '📈 Estimate Digital Ads', callback: 'selectAds' },
            { label: '📱 Estimate Social Media', callback: 'selectSocial' }
          ],
          ['Cost Estimator', 'Working Hours', 'Payment Methods', 'Contact']
        );
        break;

      case 'showPricingMenu':
        if (window.selectServiceInEstimator) {
          window.selectServiceInEstimator('graphics');
        }
        break;

      case 'showHoursInfo':
        appendBotMessage(
          `🕒 **Studio Operating Hours (PHT / GMT+8):**\n\n• **Monday to Friday:** 8:00 AM – 6:00 PM PHT\n• **Saturday & Sunday:** Closed (Weekend Sabbath Rest)\n\nWe provide rapid response times under 24 weekday hours for all clients worldwide!`,
          [
            { label: '📝 Fill Project Consultation Form', callback: 'scrollToContact' },
            { label: '💬 Chat on WhatsApp', callback: 'openWhatsApp' }
          ],
          ['Services', 'Pricing', 'Faith Foundation', 'Contact']
        );
        break;

      case 'showPaymentMethods':
        appendBotMessage(
          `💳 **Accepted Payment Methods:**\n\n• **Philippine Clients:** GCash, Maya, BDO, BPI, UnionBank.\n• **International Clients:** PayPal, Stripe (Credit/Debit Card), Wise, Wire Transfer (USD, PHP, AUD, EUR, GBP).`,
          [
            { label: '🧮 Open Cost Estimator', callback: 'scrollToEstimator' },
            { label: '📩 Inquire for Project Proposal', callback: 'scrollToContact' }
          ],
          ['Cost Estimator', 'Services', 'Working Hours', 'Contact']
        );
        break;

      case 'explainGraphics':
      case 'selectGraphics':
        if (window.selectServiceInEstimator) window.selectServiceInEstimator('graphics');
        break;

      case 'explainWeb':
      case 'selectWeb':
        if (window.selectServiceInEstimator) window.selectServiceInEstimator('web');
        break;

      case 'explainReels':
      case 'selectReels':
        if (window.selectServiceInEstimator) window.selectServiceInEstimator('reels');
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

      case 'scrollToMission':
        if (window.switchTab) window.switchTab('mission');
        break;

      case 'filterPortfolioBranding':
        if (window.switchTab) window.switchTab('portfolio');
        const filterBranding = document.querySelector('.filter-btn[data-filter="branding"]');
        if (filterBranding) filterBranding.click();
        break;

      case 'filterPortfolioWeb':
        if (window.switchTab) window.switchTab('portfolio');
        const filterWeb = document.querySelector('.filter-btn[data-filter="web"]');
        if (filterWeb) filterWeb.click();
        break;

      case 'filterPortfolioReels':
        if (window.switchTab) window.switchTab('portfolio');
        const filterReels = document.querySelector('.filter-btn[data-filter="reels"]');
        if (filterReels) filterReels.click();
        break;

      case 'openBookCallModal':
      case 'bookCall':
        if (window.openBookCallModal) window.openBookCallModal();
        break;

      case 'openWhatsApp':
        window.open('https://wa.me/639951234567?text=Hello%20Create%20and%20Arise!%20I%20am%20chatting%20with%20AriseBot%20and%20would%20like%20to%20inquire%20about%20a%20project.', '_blank');
        break;

      case 'copyEmail':
        if (window.copyEmail) window.copyEmail();
        break;

      default:
        break;
    }
  }

  function scrollToBottom() {
    const container = document.getElementById('chatbotMessages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  function formatMarkdown(text) {
    if (!text) return '';
    let formatted = text
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
