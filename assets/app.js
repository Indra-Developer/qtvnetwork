/* assets/app.js */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const darkIcon = document.getElementById('theme-icon-dark');
    const lightIcon = document.getElementById('theme-icon-light');
    const htmlBlock = document.documentElement;

    // Optional: Determine a specific page theme if needed, otherwise rely on HTML class
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            if (darkIcon) darkIcon.classList.toggle('hidden');
            if (lightIcon) lightIcon.classList.toggle('hidden');

            const isDark = htmlBlock.classList.contains('dark');
            if (isDark) {
                htmlBlock.classList.remove('dark');
                localStorage.setItem('qtv-theme', 'light');
            } else {
                htmlBlock.classList.add('dark');
                localStorage.setItem('qtv-theme', 'dark');
            }
            
            document.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDark: !isDark } }));
        });
    }

    // 2. 3D Tilt Logic
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // 3. Smooth Scroll
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({ duration: 0.8, smooth: true });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
    }

    // 4. GSAP Reveals
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        gsap.to(".gsap-hero", { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power4.out", delay: 0.2 });
        
        const fadeElements = document.querySelectorAll('.gsap-fade-up');
        fadeElements.forEach((el) => {
            gsap.from(el, {
                scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
                y: 40, opacity: 0, duration: 1, ease: "power3.out"
            });
        });
    }
});

// Utility: WhatsApp Dispatch
function sendToWhatsApp(e) {
    e.preventDefault();
    const nameInput = document.getElementById('waName');
    const locationInput = document.getElementById('waInstitution') || document.getElementById('waCollege') || document.getElementById('waLocation');
    const select = document.getElementById('waIssue') || document.getElementById('waType') || document.getElementById('waDept');
    const messageInput = document.getElementById('waMessage');

    const name = nameInput ? nameInput.value : 'User';
    const location = locationInput ? locationInput.value : 'N/A';
    const issue = select ? select.options[select.selectedIndex].text : 'General Inquiry';
    const message = messageInput ? messageInput.value : '';

    const waText = `*QTV Network Dispatch*%0A%0A*Name:* ${name}%0A*Location/Inst:* ${location}%0A*Category:* ${issue}%0A*Details:* ${message}`;
    const whatsappURL = `https://wa.me/919494943556?text=${waText}`;

    window.open(whatsappURL, '_blank');
    if (messageInput) messageInput.value = ''; 
}