const PATTERNS = {
    name: {
        regex: /^[A-Za-z\s'-]{2,50}$/,
        msg: 'Name must be 2-50 characters (letters, spaces, hyphens, apostrophes only).'
    },
    email: {
        regex: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        msg: 'Please enter a valid email address (e.g. you@example.com).'
    },
    phone: {
        regex: /^\d{3}-\d{3}-\d{4}$/,
        msg: 'Phone must follow the format 555-123-4567.'
    },
    message: {
        regex: /^[\s\S]{10,1000}$/,
        msg: 'Message must be between 10 and 1000 characters.'
    }
};

function validateField(field, regex, msg) {
    clearFieldError(field);
    const value = field.value.trim();
    if (!regex.test(value)) {
        showFieldError(field, msg);
        return false;
    }
    return true;
}

function showFieldError(field, msg) {
    field.classList.add('input-error');
    const err = document.createElement('span');
    err.className = 'field-error';
    err.textContent = msg;
    field.parentNode.insertBefore(err, field.nextSibling);
}

function clearFieldError(field) {
    field.classList.remove('input-error');
    const next = field.nextElementSibling;
    if (next && next.classList.contains('field-error')) {
        next.remove();
    }
}

function initAnnouncementBanner() {
    const dismissed = localStorage.getItem('pizzaPlusBannerDismissed');

    if (dismissed) {
        const expiry = new Date(dismissed);
        if (new Date() < expiry) return;
    }

    const banner = document.createElement('div');
    banner.id = 'announcement-banner';
    banner.className = 'announcement-banner';
    banner.innerHTML = `
        <div class="banner-content">
            <p><strong>Special Offer!</strong> Get 20% off your first catering order. Use code: <em>CATER20</em></p>
            <button class="banner-close" aria-label="Close banner">&times;</button>
        </div>
    `;

    document.body.insertBefore(banner, document.body.firstChild);
    document.body.style.paddingTop = '50px';

    banner.querySelector('.banner-close').addEventListener('click', function () {
        banner.style.opacity = '0';
        setTimeout(function () {
            banner.remove();
            document.body.style.paddingTop = '0';
        }, 300);

        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);
        localStorage.setItem('pizzaPlusBannerDismissed', expiry.toISOString());
    });
}

function initActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar a, .nav-links a');

    navLinks.forEach(function (link) {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

function initMobileMenu() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let navLinks = navbar.querySelector('.nav-links');
    if (!navLinks) {
        navLinks = document.createElement('div');
        navLinks.className = 'nav-links';

        while (navbar.firstChild) {
            navLinks.appendChild(navbar.firstChild);
        }
        navbar.appendChild(navLinks);
    }

    const toggle = document.createElement('button');
    toggle.className = 'hamburger';
    toggle.setAttribute('aria-label', 'Toggle navigation');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    navbar.insertBefore(toggle, navLinks);

    toggle.addEventListener('click', function () {
        navLinks.classList.toggle('open');
        toggle.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('open');
            toggle.classList.remove('open');
        });
    });
}

function initBackToTop() {
    const btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '&#9650;';

    document.body.appendChild(btn);

    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initScrollAnimations() {
    const cards = document.querySelectorAll('.card');
    if (!cards.length) return;

    cards.forEach(function (card) {
        card.classList.add('fade-in');
    });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(function (card) {
        observer.observe(card);
    });
}

function initFooterYear() {
    const footer = document.querySelector('footer p');
    if (!footer) return;
    const currentYear = new Date().getFullYear();
    footer.innerHTML = '&copy; ' + currentYear + ' Pizza Plus';
}

function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    if (form.id === 'custom-form') return;

    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');
    const messageField = document.getElementById('message');

    if (nameField) {
        nameField.addEventListener('blur', function () {
            validateField(nameField, PATTERNS.name.regex, PATTERNS.name.msg);
        });
        nameField.addEventListener('input', function () { clearFieldError(nameField); });
    }

    if (emailField) {
        emailField.addEventListener('blur', function () {
            validateField(emailField, PATTERNS.email.regex, PATTERNS.email.msg);
        });
        emailField.addEventListener('input', function () { clearFieldError(emailField); });
    }

    if (phoneField) {
        phoneField.addEventListener('input', function () {
            clearFieldError(phoneField);
            let digits = phoneField.value.replace(/\D/g, '').substring(0, 10);
            if (digits.length > 6) {
                phoneField.value = digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6);
            } else if (digits.length > 3) {
                phoneField.value = digits.slice(0, 3) + '-' + digits.slice(3);
            } else {
                phoneField.value = digits;
            }
        });
        phoneField.addEventListener('blur', function () {
            validateField(phoneField, PATTERNS.phone.regex, PATTERNS.phone.msg);
        });
    }

    if (messageField) {
        messageField.addEventListener('blur', function () {
            validateField(messageField, PATTERNS.message.regex, PATTERNS.message.msg);
        });
        messageField.addEventListener('input', function () { clearFieldError(messageField); });
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let isValid = true;

        if (nameField && !validateField(nameField, PATTERNS.name.regex, PATTERNS.name.msg)) isValid = false;
        if (emailField && !validateField(emailField, PATTERNS.email.regex, PATTERNS.email.msg)) isValid = false;
        if (phoneField && !validateField(phoneField, PATTERNS.phone.regex, PATTERNS.phone.msg)) isValid = false;
        if (messageField && !validateField(messageField, PATTERNS.message.regex, PATTERNS.message.msg)) isValid = false;

        if (isValid) {
            showFormSuccess(form);
        }
    });
}

function showFormSuccess(form) {
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.textContent = 'Thank you for your message! We will get back to you soon.';
    form.parentNode.insertBefore(successDiv, form.nextSibling);
    form.reset();

    setTimeout(function () {
        successDiv.remove();
    }, 5000);
}

function initCateringForm() {
    const form = document.getElementById('catering-form');
    if (!form) return;

    const nameField = form.querySelector('#catering-name');
    const emailField = form.querySelector('#catering-email');
    const phoneField = form.querySelector('#catering-phone');
    const guestField = form.querySelector('#catering-guests');

    const guestPattern = {
        regex: /^[1-9]\d{0,2}$/,
        msg: 'Please enter a number of guests between 1 and 999.'
    };

    if (nameField) {
        nameField.addEventListener('blur', function () {
            validateField(nameField, PATTERNS.name.regex, PATTERNS.name.msg);
        });
        nameField.addEventListener('input', function () { clearFieldError(nameField); });
    }
    if (emailField) {
        emailField.addEventListener('blur', function () {
            validateField(emailField, PATTERNS.email.regex, PATTERNS.email.msg);
        });
        emailField.addEventListener('input', function () { clearFieldError(emailField); });
    }
    if (phoneField) {
        phoneField.addEventListener('input', function () {
            clearFieldError(phoneField);
            let digits = phoneField.value.replace(/\D/g, '').substring(0, 10);
            if (digits.length > 6) {
                phoneField.value = digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6);
            } else if (digits.length > 3) {
                phoneField.value = digits.slice(0, 3) + '-' + digits.slice(3);
            } else {
                phoneField.value = digits;
            }
        });
        phoneField.addEventListener('blur', function () {
            validateField(phoneField, PATTERNS.phone.regex, PATTERNS.phone.msg);
        });
    }
    if (guestField) {
        guestField.addEventListener('blur', function () {
            validateField(guestField, guestPattern.regex, guestPattern.msg);
        });
        guestField.addEventListener('input', function () { clearFieldError(guestField); });
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let isValid = true;

        if (nameField && !validateField(nameField, PATTERNS.name.regex, PATTERNS.name.msg)) isValid = false;
        if (emailField && !validateField(emailField, PATTERNS.email.regex, PATTERNS.email.msg)) isValid = false;
        if (phoneField && !validateField(phoneField, PATTERNS.phone.regex, PATTERNS.phone.msg)) isValid = false;
        if (guestField && !validateField(guestField, guestPattern.regex, guestPattern.msg)) isValid = false;

        if (isValid) {
            showFormSuccess(form);
        }
    });
}

function initSpecialsCountdown() {
    const el = document.getElementById('countdown');
    if (!el) return;

    function update() {
        const now = new Date();
        const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
        const nextSunday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSunday);
        const diff = nextSunday - now;

        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);

        el.textContent = days + 'd ' + hours + 'h ' + mins + 'm ' + secs + 's';
    }

    update();
    setInterval(update, 1000);
}

function initMenuSearch() {
    const searchBox = document.getElementById('menu-search');
    if (!searchBox) return;

    searchBox.addEventListener('input', function () {
        const query = searchBox.value.toLowerCase().trim();
        const items = document.querySelectorAll('.menu-item');

        items.forEach(function (item) {
            const name = item.querySelector('.item-name').textContent.toLowerCase();
            item.style.display = name.includes(query) ? '' : 'none';
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    initAnnouncementBanner();
    initActiveNav();
    initMobileMenu();
    initBackToTop();
    initScrollAnimations();
    initFooterYear();
    initContactForm();
    initCateringForm();
    initSpecialsCountdown();
    initMenuSearch();
});
