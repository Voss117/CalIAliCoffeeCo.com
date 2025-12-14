document.addEventListener('DOMContentLoaded', () => {
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
