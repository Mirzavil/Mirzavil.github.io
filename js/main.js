document.addEventListener('DOMContentLoaded', () => {
    initBootSequence();
    initMatrixRain();
    initScrollSpy();
    initProjectsCarousel();
});

/* --- Boot Sequence --- */
function initBootSequence() {
    const terminalOutput = document.getElementById('terminal-output');
    const bootScreen = document.getElementById('boot-screen');
    const navbar = document.getElementById('navbar');
    const mainContent = document.getElementById('main-content');

    const bootLines = [
        "Initializing...",
        "Access Granted.",
        "Welcome, User."
    ];

    let lineIndex = 0;
    let charIndex = 0;

    function typeLine() {
        if (lineIndex < bootLines.length) {
            const line = bootLines[lineIndex];
            const p = document.createElement('p');
            terminalOutput.appendChild(p);

            let currentText = "";
            const typeInterval = setInterval(() => {
                currentText += line[charIndex];
                p.textContent = "> " + currentText;
                charIndex++;

                if (charIndex >= line.length) {
                    clearInterval(typeInterval);
                    charIndex = 0;
                    lineIndex++;
                    setTimeout(typeLine, 150); // Reduced delay
                }
            }, 20); // Faster typing
        } else {
            // Sequence complete
            setTimeout(() => {
                bootScreen.style.transition = "opacity 0.5s ease";
                bootScreen.style.opacity = "0";
                setTimeout(() => {
                    bootScreen.style.display = "none";
                    navbar.classList.remove('hidden');
                    mainContent.classList.remove('hidden');
                    mainContent.style.opacity = "1";
                }, 500);
            }, 500);
        }
    }

    typeLine();
}

/* --- Matrix Rain --- */
function initMatrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const rainDrops = [];
    for (let x = 0; x < columns; x++) {
        rainDrops[x] = 1;
    }

    function draw() {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)'; // Fade effect
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0'; // Green text
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

            if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    }

    setInterval(draw, 30);

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

/* --- Scroll Spy & Navigation --- */
function initScrollSpy() {
    const sections = document.querySelectorAll('.snap-section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const scrollContainer = document.querySelector('.scroll-container');

    const observerOptions = {
        root: scrollContainer,
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

/* --- Projects Horizontal Carousel --- */
function initProjectsCarousel() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    let isPaused = false;
    let scrollTimeout;

    // Auto-scroll function
    function autoScroll() {
        if (isPaused) return;

        const maxScroll = projectsGrid.scrollWidth - projectsGrid.clientWidth;

        // Smooth scroll by 1 pixel
        projectsGrid.scrollLeft += 1;

        // Reset to beginning when reaching the end
        if (projectsGrid.scrollLeft >= maxScroll) {
            projectsGrid.scrollLeft = 0;
        }
    }

    // Start auto-scroll
    setInterval(autoScroll, 30);

    // Pause on hover
    projectsGrid.addEventListener('mouseenter', () => {
        isPaused = true;
    });

    projectsGrid.addEventListener('mouseleave', () => {
        isPaused = false;
    });

    // Pause on manual scroll
    projectsGrid.addEventListener('scroll', () => {
        isPaused = true;

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isPaused = false;
        }, 2000); // Resume auto-scroll 2 seconds after manual scroll ends
    });

    // Handle touch events for mobile
    projectsGrid.addEventListener('touchstart', () => {
        isPaused = true;
    });

    projectsGrid.addEventListener('touchend', () => {
        setTimeout(() => {
            isPaused = false;
        }, 2000);
    });
}
