// Inject Lenis Script
const lenisScript = document.createElement('script');
lenisScript.src = 'https://unpkg.com/@studio-freight/lenis@1.0.42/dist/lenis.min.js';
document.head.appendChild(lenisScript);

document.addEventListener('DOMContentLoaded', () => {
    // Inject Custom Cursor
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    document.body.appendChild(cursor);

    // Inject Preloader (Only if not already present)
    if (!document.querySelector('.preloader')) {
        const preloader = document.createElement('div');
        preloader.classList.add('preloader');
        preloader.innerHTML = `
            <img src="assets/logo-black.png" class="preloader-logo" alt="Loading...">
            <div class="preloader-line"></div>
        `;
        document.body.prepend(preloader);
    }

    // Wait for Lenis to load
    lenisScript.onload = () => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Connect Lenis to ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    };

    // Cursor Logic
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: 'power2.out'
        });
    });

    // Cursor Hover Effects
    const hoverElements = document.querySelectorAll('a, button, .hero-logo');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });

    // Preloader Animation
    const tl = gsap.timeline();

    tl.to('.preloader-logo', {
        opacity: 1,
        y: -20,
        duration: 0.8,
        ease: 'power3.out'
    })
        .to('.preloader-line', {
            width: '200px',
            duration: 1.2,
            ease: 'power2.inOut'
        }, '-=0.5')
        .to('.preloader', {
            y: '-100%',
            duration: 0.8,
            ease: 'power4.inOut',
            delay: 0.2
        });

    // Inject Page Transition HTML
    if (!document.querySelector('.page-transition')) {
        const transitionEl = document.createElement('div');
        transitionEl.classList.add('page-transition');
        transitionEl.innerHTML = `
            <div class="cup-container">
                <div class="cup-body">
                    <div class="cup-fill"></div>
                </div>
                <div class="cup-handle"></div>
                <div class="smoke" style="margin-left: -15px;"></div>
                <div class="smoke" style="margin-left: 0;"></div>
                <div class="smoke" style="margin-left: 15px;"></div>
            </div>
        `;
        document.body.appendChild(transitionEl);
    }

    // Handle Order Links
    const orderLinks = document.querySelectorAll('a[href="order.html"]');
    orderLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');

            const tl = gsap.timeline({
                onComplete: () => window.location.href = target
            });

            // Slide up overlay
            tl.to('.page-transition', {
                y: 0,
                duration: 0.5,
                ease: 'power3.inOut'
            })
                // Fill cup
                .to('.cup-fill', {
                    height: '100%',
                    duration: 1.5,
                    ease: 'power1.inIn'
                })
                // Smoke effect
                .to('.smoke', {
                    opacity: 0.6,
                    y: -20,
                    stagger: 0.2,
                    duration: 0.5,
                    repeat: -1,
                    yoyo: true
                }, '-=0.5');
        });
    });

    // Existing GSAP Logic
    gsap.registerPlugin(ScrollTrigger);

    // Hero Animation
    const heroTl = gsap.timeline();

    // Animate Logo if present
    const logoExists = document.querySelector('.hero-logo');
    if (logoExists) {
        heroTl.from('.hero-logo', {
            opacity: 0,
            scale: 0.8,
            duration: 1.2,
            ease: 'elastic.out(1, 0.5)',
            delay: 0.2
        });

        // Mouse Parallax Effect for Logo
        const heroSection = document.querySelector('.hero');
        heroSection.addEventListener('mousemove', (e) => {
            const x = (e.clientX - window.innerWidth / 2) * 0.015; // Reduced movement
            const y = (e.clientY - window.innerHeight / 2) * 0.015;

            gsap.to('.hero-logo', {
                x: x,
                y: y,
                duration: 1, // Slower duration for heavier feel
                ease: 'power1.out'
            });
        });

        // Mobile Gyroscope Parallax
        window.addEventListener('deviceorientation', (e) => {
            // Gamma is left/right tilt (-90 to 90)
            // Beta is front/back tilt (-180 to 180)

            // Normalize values for subtle effect
            const x = e.gamma ? e.gamma * 2 : 0;
            const y = e.beta ? (e.beta - 45) * 2 : 0; // Subtract 45 to account for natural holding angle

            gsap.to('.hero-logo', {
                x: x,
                y: y,
                duration: 1.5,
                ease: 'power2.out'
            });
        });
    }

    heroTl.to('.hero-title', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
    }, '-=0.8')
        .to('.hero-subtitle', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.6')
        .to('.hero-content p', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.5')
        .to('.hero-btn', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.5');

    // General Reveal Animation (ScrollTrigger)
    gsap.utils.toArray('.animate-text').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Image Reveal
    gsap.utils.toArray('.image-reveal').forEach(container => {
        let img = container.querySelector('img');

        gsap.from(container, {
            scrollTrigger: {
                trigger: container,
                start: 'top 75%'
            },
            clipPath: 'inset(0 100% 0 0)',
            duration: 1.5,
            ease: 'power4.out'
        });

        gsap.from(img, {
            scrollTrigger: {
                trigger: container,
                start: 'top 75%',
                scrub: true
            },
            scale: 1.2,
            duration: 1
        });
    });
});
