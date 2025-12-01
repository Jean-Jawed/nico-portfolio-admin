/* ═══════════════════════════════════════════════════════════════
   ANIMATIONS - Scroll-based animations
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initParallax();
});

/* ═══════════════════════════════════════════════════════════════
   SCROLL ANIMATIONS
   ═══════════════════════════════════════════════════════════════ */

function initScrollAnimations() {
  if ('IntersectionObserver' in window) {
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Optional: unobserve after animation (performance optimization)
          // animationObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all elements with data-animate attribute
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => {
      animationObserver.observe(el);
    });
    
    // Stagger animations for groups
    const staggerGroups = document.querySelectorAll('.cta-grid, .blog-grid, .courses-grid');
    staggerGroups.forEach(group => {
      const items = group.querySelectorAll('[data-animate]');
      items.forEach((item, index) => {
        item.style.transitionDelay = `${index * 100}ms`;
      });
    });
  } else {
    // Fallback: show all elements immediately
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => {
      el.classList.add('visible');
    });
  }
}

/* ═══════════════════════════════════════════════════════════════
   PARALLAX EFFECT
   ═══════════════════════════════════════════════════════════════ */

function initParallax() {
  const parallaxElements = document.querySelectorAll('.hero-shape');
  
  if (parallaxElements.length === 0) return;
  
  // Disable parallax on mobile for performance
  if (window.innerWidth < 768) return;
  
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((el, index) => {
          const speed = 0.3 + (index * 0.1);
          const yPos = -(scrolled * speed);
          el.style.transform = `translateY(${yPos}px) rotate(${el.dataset.rotation || 0}deg)`;
        });
        
        ticking = false;
      });
      
      ticking = true;
    }
  });
}

/* ═══════════════════════════════════════════════════════════════
   FADE IN ON LOAD
   ═══════════════════════════════════════════════════════════════ */

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  
  // Fade in hero content
  const heroElements = document.querySelectorAll('.hero-text > *, .hero-image');
  heroElements.forEach((el, index) => {
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, index * 100);
  });
});

/* ═══════════════════════════════════════════════════════════════
   SMOOTH REVEAL FOR RESEARCH BLOCKS
   ═══════════════════════════════════════════════════════════════ */

function revealResearchBlocks() {
  const blocks = document.querySelectorAll('.research-block');
  
  if (blocks.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.2
  });
  
  blocks.forEach(block => observer.observe(block));
}

// Initialize research blocks reveal if on research page
if (document.querySelector('.research-content')) {
  revealResearchBlocks();
}

/* ═══════════════════════════════════════════════════════════════
   HOVER EFFECTS
   ═══════════════════════════════════════════════════════════════ */

// Magnetic effect for CTA cards on desktop
if (window.innerWidth >= 1024) {
  const ctaCards = document.querySelectorAll('.cta-card');
  
  ctaCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;
      
      card.style.transform = `
        translateY(-8px) 
        rotateX(${deltaY * -5}deg) 
        rotateY(${deltaX * 5}deg)
      `;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   PERFORMANCE OPTIMIZATION
   ═══════════════════════════════════════════════════════════════ */

// Debounce utility
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle utility
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Export utilities
window.debounce = debounce;
window.throttle = throttle;
