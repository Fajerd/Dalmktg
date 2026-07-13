// Initialize Lucide Icons
lucide.createIcons();

// Automatically update footer year
document.getElementById('year').innerText = new Date().getFullYear();

// Scroll helper to Contact
function scrollToContact() {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}

// 1. MAGNETIC PHOTO EFFECT
const magneticPhoto = document.getElementById('magnetic-photo');
window.addEventListener('mousemove', (e) => {
    const rect = magneticPhoto.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < 200) {
        gsap.to(magneticPhoto, {
            x: distanceX * 0.25,
            y: distanceY * 0.25,
            duration: 0.3,
            ease: "power2.out"
        });
    } else {
        gsap.to(magneticPhoto, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: "power2.inOut"
        });
    }
});

// 2. MARQUEE IMAGES DATA & GENERATION
const gifs = [
    "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
    "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
    "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
    "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
    "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
    "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
    "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
    "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
    "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
    "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
    "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
    "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
    "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif"
];

const row1 = document.getElementById('marquee-row1');
const row2 = document.getElementById('marquee-row2');

// Duplicate items to ensure loop is visually seamless
const doubleGifs = [...gifs, ...gifs, ...gifs];
doubleGifs.forEach((gif, index) => {
    const imgWrapper = `<div class="flex-shrink-0 w-[240px] h-[154px] sm:w-[320px] sm:h-[205px] md:w-[420px] md:h-[270px]">
        <img src="${gif}" class="w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-500" loading="lazy">
    </div>`;
    if(index % 2 === 0) {
        row1.innerHTML += imgWrapper;
    } else {
        row2.innerHTML += imgWrapper;
    }
});

// Interactive scroll moving using GSAP
gsap.registerPlugin(ScrollTrigger);

gsap.to(row1, {
    xPercent: -20,
    ease: "none",
    scrollTrigger: {
        trigger: "#marquee",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
    }
});

gsap.to(row2, {
    xPercent: 15,
    ease: "none",
    scrollTrigger: {
        trigger: "#marquee",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
    }
});

// 3. ABOUT TEXT REVEAL ON SCROLL
const textContainer = document.getElementById('about-text');
const originalText = textContainer.innerText;
textContainer.innerHTML = originalText.split('').map(char => `<span class="transition-all duration-200">${char}</span>`).join('');

const chars = textContainer.querySelectorAll('span');
gsap.to(chars, {
    color: "#D7E2EA",
    stagger: 0.05,
    scrollTrigger: {
        trigger: "#about-text",
        start: "top 75%",
        end: "bottom 30%",
        scrub: true
    }
});

// 4. DYNAMIC SERVICES RENDER
const services = [
    { id: "01", name: "Videography", desc: "Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for shops, products, and visualizations." },
    { id: "02", name: "editing", desc: "High-quality, editing that showcase designs with custom lighting, textures, and materials to bring concepts to life." },
    { id: "03", name: "Motion Design", desc: "Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences." },
    { id: "04", name: "Branding", desc: "Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence." },
    { id: "05", name: "Web Design", desc: "Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience." }
];

const servicesList = document.getElementById('services-list');
services.forEach(svc => {
    servicesList.innerHTML += `
    <div class="flex flex-col md:flex-row items-start md:items-center py-8 sm:py-12 border-b border-[#0C0C0C]/15 group transition-colors duration-300 hover:bg-[#0C0C0C]/5 px-2">
        <div class="text-[#0C0C0C] font-black leading-none tracking-tighter w-full md:w-1/3 mb-4 md:mb-0 text-[18vw] sm:text-[14vw] md:text-[10vw]">
            ${svc.id}
        </div>
        <div class="w-full md:w-2/3 flex flex-col gap-2">
            <h3 class="text-[#0C0C0C] font-semibold uppercase tracking-wide text-2xl md:text-3xl">${svc.name}</h3>
            <p class="text-[#0C0C0C]/75 font-light leading-relaxed max-w-2xl text-base sm:text-lg">${svc.desc}</p>
        </div>
    </div>`;
});

// 5. PROJECTS DATA & STACK CARDS LOGIC
const projects = [
    {
        id: "01",
        name: "Nextlevel Studio",
        category: "Client",
        col1_img1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
        col1_img2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
        col2_img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85"
    },
    {
        id: "02",
        name: "Aura Brand Identity",
        category: "Personal",
        col1_img1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
        col1_img2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
        col2_img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85"
    },
    {
        id: "03",
        name: "Solaris Digital",
        category: "Client",
        col1_img1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
        col1_img2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
        col2_img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85"
    }
];

const projectsContainer = document.getElementById('projects-container');
projects.forEach((project, idx) => {
    const cardTopOffset = 100 + (idx * 30);
    const scaleFactor = 1 - ((projects.length - 1 - idx) * 0.03);

    projectsContainer.innerHTML += `
    <div class="project-card w-full rounded-[30px] md:rounded-[50px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-8 flex flex-col justify-between overflow-hidden shadow-2xl" 
         style="top: ${cardTopOffset}px; z-index: ${idx + 10}; transform: scale(${scaleFactor})">
        
        <!-- Header -->
        <div class="flex flex-row justify-between items-center w-full border-b border-[#D7E2EA]/20 pb-4">
            <div class="flex items-center gap-4">
                <span class="text-[#D7E2EA] font-black text-4xl sm:text-6xl">${project.id}</span>
                <div class="flex flex-col">
                    <span class="text-[#D7E2EA]/60 uppercase tracking-widest text-[10px]">${project.category}</span>
                    <h3 class="text-[#D7E2EA] font-semibold uppercase tracking-wide text-sm sm:text-xl">${project.name}</h3>
                </div>
            </div>
            <button class="rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-4 py-2 sm:px-6 sm:py-3 text-xs bg-transparent hover:bg-[#D7E2EA]/10 transition-all flex items-center gap-2">
                Live Project <i data-lucide="arrow-up-right" class="w-4 h-4"></i>
            </button>
        </div>

        <!-- Grid Images Content -->
        <div class="grid grid-cols-12 gap-4 flex-1 mt-4 sm:mt-6 overflow-hidden">
            <div class="col-span-5 flex flex-col gap-4 h-full justify-between">
                <div class="flex-1 rounded-[16px] sm:rounded-[30px] overflow-hidden border border-[#D7E2EA]/10">
                    <img src="${project.col1_img1}" class="w-full h-full object-cover">
                </div>
                <div class="flex-1 rounded-[16px] sm:rounded-[30px] overflow-hidden border border-[#D7E2EA]/10">
                    <img src="${project.col1_img2}" class="w-full h-full object-cover">
                </div>
            </div>
            <div class="col-span-7 h-full rounded-[20px] sm:rounded-[40px] overflow-hidden border border-[#D7E2EA]/10">
                <img src="${project.col2_img}" class="w-full h-full object-cover">
            </div>
        </div>
    </div>`;
});

// Update icons since they've been rendered dynamically
lucide.createIcons();