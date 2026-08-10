/**
 * Furnix Accordion Module
 * 
 * Reusable, accessible accordion component with smooth transitions and keyboard navigation.
 */
class Accordion {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            allowMultiple: element.hasAttribute('data-allow-multiple') ? element.getAttribute('data-allow-multiple') === 'true' : false,
            ...options
        };
        
        this.headers = Array.from(this.element.querySelectorAll('.accordion-header'));
        this.items = Array.from(this.element.querySelectorAll('.accordion-item'));
        
        this.init();
    }

    init() {
        this.headers.forEach((header, index) => {
            // Ensure proper ARIA attributes
            header.setAttribute('role', 'button');
            header.setAttribute('tabindex', '0');
            
            const content = header.nextElementSibling;
            const contentId = content.id || `accordion-content-${Math.random().toString(36).substr(2, 9)}`;
            const headerId = header.id || `accordion-header-${Math.random().toString(36).substr(2, 9)}`;
            
            content.id = contentId;
            header.id = headerId;
            
            header.setAttribute('aria-controls', contentId);
            content.setAttribute('aria-labelledby', headerId);
            content.setAttribute('role', 'region');
            
            if (!header.hasAttribute('aria-expanded')) {
                header.setAttribute('aria-expanded', 'false');
            }
            
            // Event Listeners
            header.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggle(index);
            });
            
            header.addEventListener('keydown', (e) => this.handleKeydown(e, index));
        });
    }

    toggle(index) {
        const header = this.headers[index];
        const content = header.nextElementSibling;
        const isExpanded = header.getAttribute('aria-expanded') === 'true';

        if (!this.options.allowMultiple && !isExpanded) {
            this.closeAll();
        }

        if (isExpanded) {
            this.close(header, content);
        } else {
            this.open(header, content);
        }
    }

    open(header, content) {
        header.setAttribute('aria-expanded', 'true');
        content.classList.add('is-open');
        content.style.maxHeight = content.scrollHeight + 'px';
    }

    close(header, content) {
        header.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = '0px';
        
        // Remove class after transition
        setTimeout(() => {
            if (header.getAttribute('aria-expanded') === 'false') {
                content.classList.remove('is-open');
            }
        }, 300); // Matches CSS transition duration
    }

    closeAll() {
        this.headers.forEach(header => {
            const content = header.nextElementSibling;
            if (header.getAttribute('aria-expanded') === 'true') {
                this.close(header, content);
            }
        });
    }

    handleKeydown(e, index) {
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.focusNext(index);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.focusPrev(index);
                break;
            case 'Home':
                e.preventDefault();
                this.headers[0].focus();
                break;
            case 'End':
                e.preventDefault();
                this.headers[this.headers.length - 1].focus();
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                this.toggle(index);
                break;
        }
    }

    focusNext(index) {
        const nextIndex = (index + 1) % this.headers.length;
        this.headers[nextIndex].focus();
    }

    focusPrev(index) {
        const prevIndex = (index - 1 + this.headers.length) % this.headers.length;
        this.headers[prevIndex].focus();
    }
}

// Self-initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    const accordions = document.querySelectorAll('.accordion');
    const instances = [];
    
    accordions.forEach(el => {
        instances.push(new Accordion(el));
    });
    
    // Expose for programmatic control
    window.FurnixAccordion = {
        instances: instances,
        init: (element, options) => new Accordion(element, options)
    };
});
