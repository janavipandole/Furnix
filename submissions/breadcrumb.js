/**
 * @file breadcrumb.js
 * @description Reusable breadcrumb component with JSON-LD SEO structured data support.
 */

window.FurnixBreadcrumb = {
  /**
   * Initializes the breadcrumb component.
   * @param {Object} config - Configuration object
   * @param {Array<{label: string, url: string}>} [config.items] - Breadcrumb items
   * @param {string|HTMLElement} [config.target] - Target container (selector or element)
   */
  init: function(config = {}) {
    const items = config.items || this.autoDetectItems();
    const target = config.target ? (typeof config.target === 'string' ? document.querySelector(config.target) : config.target) : document.querySelector('main');
    
    if (!target || !items.length) return;

    // Render HTML
    const breadcrumbHtml = this.renderHtml(items);
    
    // Create wrapper if it doesn't exist to prepend to target safely
    const wrapper = document.createElement('nav');
    wrapper.setAttribute('aria-label', 'Breadcrumb');
    wrapper.className = 'furnix-breadcrumb-nav';
    wrapper.innerHTML = breadcrumbHtml;
    
    target.insertBefore(wrapper, target.firstChild);

    // Generate and inject JSON-LD
    this.injectJsonLd(items);
  },

  /**
   * Generates the HTML for the breadcrumb.
   * @param {Array<{label: string, url: string}>} items 
   * @returns {string} HTML string
   */
  renderHtml: function(items) {
    let html = '<ol class="furnix-breadcrumb">';
    items.forEach((item, index) => {
      const isLast = index === items.length - 1;
      const separator = isLast ? '' : '<span class="furnix-breadcrumb-separator" aria-hidden="true">›</span>';
      
      if (isLast) {
        html += `<li class="furnix-breadcrumb-item current" aria-current="page">${this.escapeHtml(item.label)}</li>`;
      } else {
        html += `<li class="furnix-breadcrumb-item"><a href="${this.escapeHtml(item.url || '#')}">${this.escapeHtml(item.label)}</a>${separator}</li>`;
      }
    });
    html += '</ol>';
    return html;
  },

  /**
   * Injects JSON-LD structured data into the document head.
   * @param {Array<{label: string, url: string}>} items 
   */
  injectJsonLd: function(items) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.label,
        "item": item.url ? new URL(item.url, window.location.origin).href : window.location.href
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
    
    // Store schema globally for demo purposes
    window.__furnix_last_breadcrumb_schema = schema;
  },

  /**
   * Auto-detects breadcrumb items if none are provided.
   * @returns {Array<{label: string, url: string}>}
   */
  autoDetectItems: function() {
    return [
      { label: 'Home', url: '/' },
      { label: document.title || 'Current Page', url: '' }
    ];
  },

  /**
   * Utility to escape HTML and prevent XSS.
   * @param {string} str 
   * @returns {string}
   */
  escapeHtml: function(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
  }
};
