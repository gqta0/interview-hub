// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.top-nav').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Back to top button
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Active TOC link on scroll
const tocLinks = document.querySelectorAll('.toc a');
const sections = document.querySelectorAll('[id]');

function updateActiveTocLink() {
    const navHeight = document.querySelector('.top-nav').offsetHeight;
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 100;
        if (window.pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    tocLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveTocLink);

// Auto-detect language and apply Prism classes
document.querySelectorAll('.code-block').forEach(block => {
    const langSpan = block.querySelector('.code-lang');
    const codeElement = block.querySelector('code');

    if (langSpan && codeElement) {
        const lang = langSpan.textContent.toLowerCase().trim();
        const langMap = {
            'java': 'java',
            'sql': 'sql',
            'mysql': 'sql',
            'yaml': 'yaml',
            'yml': 'yaml',
            'bash': 'bash',
            'shell': 'bash',
            'properties': 'properties',
            'json': 'json',
            'xml': 'markup',
            'html': 'markup',
            'flow': 'plaintext',
            'text': 'plaintext'
        };

        const prismLang = langMap[lang] || 'plaintext';
        codeElement.className = `language-${prismLang}`;

        // Also add to pre element for proper styling
        const preElement = codeElement.parentElement;
        if (preElement && preElement.tagName === 'PRE') {
            preElement.className = `language-${prismLang}`;
        }
    }
});

// Trigger Prism highlighting if available
if (typeof Prism !== 'undefined') {
    Prism.highlightAll();
}

// Copy code button
document.querySelectorAll('.code-block').forEach(block => {
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    copyBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255,255,255,0.1);
        border: none;
        color: #888;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s;
    `;

    const header = block.querySelector('.code-header');
    if (header) {
        header.style.position = 'relative';
        header.appendChild(copyBtn);
    }

    copyBtn.addEventListener('click', async () => {
        const code = block.querySelector('code').innerText;
        await navigator.clipboard.writeText(code);
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        copyBtn.style.color = '#22c55e';
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
            copyBtn.style.color = '#888';
        }, 2000);
    });
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.concept-card, .question-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});
