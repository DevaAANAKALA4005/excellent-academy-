/* ============================================
   Excellent Academy - script.js
   Mobile menu, scroll effects, animations,
   counters, FAQ, form handling.
   ============================================ */

(function () {
    'use strict';

    /* ---------- DOM Ready ---------- */
    document.addEventListener('DOMContentLoaded', function () {
        initMobileMenu();
        initStickyHeader();
        initFAQ();
        initScrollReveal();
        initCounters();
        initContactForm();
        initSmoothScroll();
        initActiveNav();
    });

    /* ---------- Mobile Menu ---------- */
    function initMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (!hamburger || !navMenu) return;

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);

        function closeMenu() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
            overlay.classList.remove('show');
            document.body.style.overflow = '';
        }

        function openMenu() {
            hamburger.classList.add('active');
            navMenu.classList.add('open');
            overlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        }

        hamburger.addEventListener('click', function () {
            if (navMenu.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        overlay.addEventListener('click', closeMenu);

        // Close on nav link click (mobile)
        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                if (window.innerWidth <= 820) closeMenu();
            });
        });

        // Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navMenu.classList.contains('open')) {
                closeMenu();
            }
        });

        // Reset on resize
        window.addEventListener('resize', function () {
            if (window.innerWidth > 820) closeMenu();
        });
    }

    /* ---------- Sticky Header Shadow ---------- */
    function initStickyHeader() {
        const header = document.querySelector('.site-header');
        if (!header) return;

        function onScroll() {
            if (window.scrollY > 30) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ---------- FAQ Accordion ---------- */
    function initFAQ() {
        const items = document.querySelectorAll('.faq-item');
        items.forEach(function (item) {
            const btn = item.querySelector('.faq-question');
            if (!btn) return;
            btn.addEventListener('click', function () {
                const wasOpen = item.classList.contains('open');
                // Close all
                items.forEach(function (i) { i.classList.remove('open'); });
                // Toggle current
                if (!wasOpen) {
                    item.classList.add('open');
                }
            });
        });
    }

    /* ---------- Scroll Reveal ---------- */
    function initScrollReveal() {
        const reveals = document.querySelectorAll('.reveal');
        if (!reveals.length) return;

        if (!('IntersectionObserver' in window)) {
            reveals.forEach(function (el) { el.classList.add('visible'); });
            return;
        }

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

        reveals.forEach(function (el) { observer.observe(el); });
    }

    /* ---------- Animated Counters ---------- */
    function initCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        if (!counters.length) return;

        function animateCounter(el) {
            const target = parseFloat(el.getAttribute('data-counter'));
            const duration = 2000;
            const start = performance.now();
            const startValue = 0;

            function step(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = startValue + (target - startValue) * eased;
                if (target % 1 === 0) {
                    el.textContent = Math.floor(current).toLocaleString();
                } else {
                    el.textContent = current.toFixed(1);
                }
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = target.toLocaleString();
                }
            }
            requestAnimationFrame(step);
        }

        if (!('IntersectionObserver' in window)) {
            counters.forEach(animateCounter);
            return;
        }

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function (el) { observer.observe(el); });
    }

    /* ---------- Contact / Admission Form ---------- */
    function initContactForm() {
        const forms = document.querySelectorAll('form[data-form]');
        forms.forEach(function (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                // Basic validation
                let valid = true;
                form.querySelectorAll('[required]').forEach(function (field) {
                    if (!field.value.trim()) {
                        valid = false;
                        field.style.borderColor = '#dc2626';
                    } else {
                        field.style.borderColor = '';
                    }
                });

                const successBox = form.querySelector('.form-success');
                if (!valid) {
                    if (successBox) {
                        successBox.classList.remove('show');
                    }
                    return;
                }

                // Simulate submit
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Sending...';
                    submitBtn.disabled = true;
                    setTimeout(function () {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        form.reset();
                        if (successBox) {
                            successBox.classList.add('show');
                            setTimeout(function () {
                                successBox.classList.remove('show');
                            }, 5000);
                        }
                    }, 900);
                }
            });
        });
    }

    /* ---------- Smooth Scroll for in-page links ---------- */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#' || href.length < 2) return;
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    /* ---------- Active Nav Highlight ---------- */
    function initActiveNav() {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-menu a').forEach(function (link) {
            const href = link.getAttribute('href');
            if (!href) return;
            const filename = href.split('/').pop();
            if (filename === path || (path === '' && filename === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    /* ---------- Year stamp ---------- */
    const yr = document.querySelector('[data-year]');
    if (yr) yr.textContent = new Date().getFullYear();
})();
