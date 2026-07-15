// تأمين تسجيل مكتبة ScrollTrigger لتفادي أي خطأ قبل التحميل
try {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
} catch (e) {
    console.error("GSAP/ScrollTrigger Registration Error: ", e);
}

// دالة التنقل السلس لقسم اتصل بنا
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// نصوص قسم من أنا (About) خارج الحدث ليسهل الوصول إليها
const aboutTexts = {
    en: "With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!",
    ar: "مع خبرة تزيد عن خمس سنوات في مجال التصميم، أركز على بناء الهوية البصرية، وتصميم الويب وتجربة المستخدم. أستمتع بمساعدة الشركات التي تطمح للبروز والظهور بأفضل شكل ممكن. لنصنع معاً شيئاً استثنائياً!"
};

// دالة حركة نص من أنا (تدعم اللغة العربية بشكل مثالي وبدون تفكيك للحروف)
function triggerAboutAnimation(isAr) {
    const textContainer = document.getElementById('about-text');
    if (!textContainer || typeof gsap === 'undefined') return;

    // مسح أي أنيميشن سابق وتفريغ العناصر لمنع التداخل
    gsap.killTweensOf(textContainer);
    textContainer.style.clipPath = "none"; 
    textContainer.style.opacity = "1";

    const existingSpans = textContainer.querySelectorAll('span');
    if (existingSpans.length > 0) {
        gsap.killTweensOf(existingSpans);
    }

    if (isAr) {
        // للغة العربية: نضع النص العربي الصافي بدون أي تقطيع أحرف لمنع تفككها
        textContainer.innerHTML = aboutTexts.ar; 
        
        // تطبيق تأثير كشف انسيابي ناعم يتوافق مع حركة العين من اليمين إلى اليسار
        gsap.fromTo(textContainer, 
            { 
                opacity: 0,
                y: 15,
                clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)"
            }, 
            { 
                opacity: 1, 
                y: 0,
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                duration: 1.4, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: "#about-text",
                    start: "top 85%",
                    toggleActions: "play none none none"
                } 
            }
        );
    } else {
        // للغة الإنجليزية: نستخدم تأثير تقطيع الأحرف والظهور التدريجي المعتاد
        textContainer.innerHTML = aboutTexts.en.split('').map(char => 
            `<span class="opacity-20 transition-all duration-200 inline-block">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');

        const chars = textContainer.querySelectorAll('span');
        gsap.to(chars, {
            opacity: 1,
            color: "#D7E2EA",
            stagger: 0.02,
            scrollTrigger: {
                trigger: "#about-text",
                start: "top 80%",
                end: "bottom 45%",
                scroll: 0.5
            }
        });
    }
}

// دالة تأثير القلوب المتطايرة
function initHearts() {
    const container = document.getElementById('hearts-container');
    if (!container) return;

    const hearts = ["❤️", "💖", "✨", "💕"];
    const count = 15; // عدد القلوب المتطايرة

    for (let i = 0; i < count; i++) {
        const heart = document.createElement('span');
        heart.innerText = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.position = 'absolute';
        heart.style.pointerEvents = 'none';
        
        const size = Math.random() * (30 - 14) + 14; // حجم عشوائي للقلب
        const left = Math.random() * 100; // توزيع عشوائي على العرض
        const duration = Math.random() * (12 - 7) + 7; // سرعة عشوائية للصعود
        const delay = Math.random() * -15; // تأخير لتبدأ الحركة فوراً دون انتظار

        heart.style.fontSize = `${size}px`;
        heart.style.left = `${left}%`;
        heart.style.bottom = `-40px`;
        heart.style.opacity = '0';
        heart.style.animation = `heartFlyUp ${duration}s linear infinite`;
        heart.style.animationDelay = `${delay}s`;

        container.appendChild(heart);
    }
}

// تشغيل الأكواد عند جاهزية الصفحة
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. تحديد اللغة والتحكم بها (حفظ الاختيار في المتصفح)
    let currentLang = localStorage.getItem('selectedLanguage') || document.documentElement.lang || 'en';
    
    // دالة لتطبيق اللغة على الصفحة
    function applyLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('selectedLanguage', lang);
        document.documentElement.lang = lang;
        
        const isAr = lang === 'ar';
        
        // تعديل اتجاه الصفحة (RTL للعربي و LTR للإنجليزي)
        document.documentElement.dir = isAr ? 'rtl' : 'ltr';
        
        // تحديث نص زر اللغة
        const langBtn = document.getElementById('lang-toggle');
        if (langBtn) {
            langBtn.innerText = isAr ? 'EN' : 'العربية';
        }

        // إعادة بناء الخدمات والمشاريع باللغة الجديدة
        renderServices(isAr);
        renderProjects(isAr);
        
        // تحديث نصوص الـ HTML الثابتة
        translateStaticElements(isAr);

        // تحديث مكتبة الأيقونات والأنيميشن بعد تغيير المحتوى
        try {
            if (typeof lucide !== 'undefined') lucide.createIcons();
            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
        } catch (e) {}
    }

    // تفعيل زر تغيير اللغة عند الضغط عليه
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const nextLang = currentLang === 'ar' ? 'en' : 'ar';
            applyLanguage(nextLang);
        });
    }

    // 2. تحديث السنة تلقائياً بالتأمين
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.innerText = new Date().getFullYear();
    }

    // 3. حركة الصورة المغناطيسية (MAGNETIC PHOTO EFFECT)
    const magneticPhoto = document.getElementById('magnetic-photo');
    if (magneticPhoto && typeof gsap !== 'undefined') {
        window.addEventListener('mousemove', (e) => {
            const rect = magneticPhoto.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distanceX = e.clientX - centerX;
            const distanceY = e.clientY - centerY;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            if (distance < 250) {
                gsap.to(magneticPhoto, {
                    x: distanceX * 0.2,
                    y: distanceY * 0.2,
                    duration: 0.3,
                    ease: "power2.out"
                });
            } else {
                gsap.to(magneticPhoto, {
                    x: 0,
                    y: 0,
                    duration: 0.7,
                    ease: "elastic.out(1, 0.5)"
                });
            }
        });
    }

    // 4. رندرة وتفعيل حركة شريط الصور (MARQUEE IMAGES)
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

    if (row1 && row2) {
        row1.innerHTML = "";
        row2.innerHTML = "";

        const doubleGifs = [...gifs, ...gifs, ...gifs];
        doubleGifs.forEach((gif, index) => {
            const imgWrapper = `
            <div class="flex-shrink-0 w-[240px] h-[154px] sm:w-[320px] sm:h-[205px] md:w-[420px] md:h-[270px]">
                <img src="${gif}" class="w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-500" loading="lazy">
            </div>`;
            if (index % 2 === 0) {
                row1.innerHTML += imgWrapper;
            } else {
                row2.innerHTML += imgWrapper;
            }
        });

        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.to(row1, {
                xPercent: -35,
                ease: "none",
                scrollTrigger: {
                    trigger: "#marquee",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.2
                }
            });

            gsap.to(row2, {
                xPercent: 20,
                ease: "none",
                scrollTrigger: {
                    trigger: "#marquee",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.2
                }
            });
        }
    }

    // 5. رندرة قسم الخدمات
    const servicesData = {
        en: [
            { id: "1", name: "Videography", desc: "Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for shops, products, and visualizations." },
            { id: "2", name: "Editing", desc: "High-quality editing that showcases designs with custom lighting, textures, and materials to bring concepts to life." },
            { id: "3", name: "Motion Design", desc: "Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences." },
            { id: "4", name: "Branding", desc: "Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence." },
            { id: "5", name: "Web Design", desc: "Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience." }
        ],
        ar: [
            { id: "1", name: "تصوير الفيديو", desc: "إنشاء عناصر وتفاصيل مرئية مخصصة تناسب احتياجات مشروعك، مثالية للمتاجر، المنتجات، والعروض البصرية." },
            { id: "2", name: "المونتاج وتحرير الفيديو", desc: "تحرير ومونتاج عالي الجودة يبرز تصاميمك بإضاءة، ملمس، ومؤثرات بصرية تنبض بالحياة." },
            { id: "3", name: "تصميم الموشن جرافيك", desc: "تحريك تفاعلي ورسوم متحركة تضيف الحيوية لعلامتك التجارية ومنتجاتك وتجاربك الرقمية." },
            { id: "4", name: "الهوية البصرية والبراندنج", desc: "بناء هويات بصرية متكاملة وشعارات فريدة تعبر عن حضور مميز ولا يُنسى لعلامتك التجارية." },
            { id: "5", name: "تصميم المواقع", desc: "تصميم مواقع إنترنت حديثة وجذابة تركز على تجربة المستخدم، الخطوط، وتناسق الألوان لتحقيق أعلى تفاعل." }
        ]
    };

    function renderServices(isAr) {
        const servicesList = document.getElementById('services-list');
        if (!servicesList) return;
        
        servicesList.innerHTML = "";
        const selectedServices = isAr ? servicesData.ar : servicesData.en;
        
        const textAlignment = isAr ? 'text-right' : 'text-left';
        const flexDir = isAr ? 'flex-row-reverse' : 'flex-row';
        
        const numberOrder = isAr ? 'md:order-2 md:text-right' : 'md:order-1 md:text-left';
        const textOrder = isAr ? 'md:order-1' : 'md:order-2';

        selectedServices.forEach(svc => {
            servicesList.innerHTML += `
            <div class="flex flex-col md:${flexDir} items-start md:items-center py-8 sm:py-12 border-b border-[#0C0C0C]/15 group transition-colors duration-300 hover:bg-[#0C0C0C]/5 px-2 ${textAlignment}">
                <div class="text-[#0C0C0C] font-black leading-none tracking-tighter w-full md:w-1/3 mb-4 md:mb-0 text-[18vw] sm:text-[14vw] md:text-[10vw] ${numberOrder}">
                    ${svc.id}
                </div>
                <div class="w-full md:w-2/3 flex flex-col gap-2 ${textOrder}">
                    <h3 class="text-[#0C0C0C] font-semibold uppercase tracking-wide text-2xl md:text-3xl">${svc.name}</h3>
                    <p class="text-[#0C0C0C]/75 font-light leading-relaxed max-w-2xl text-base sm:text-lg">${svc.desc}</p>
                </div>
            </div>`;
        });
    }

    // 6. رندرة وتكديس كروت المشاريع
    const projectsData = {
        en: [
            {
                id: "1",
                name: "Nextlevel Studio",
                category: "Client Project",
                buttonText: "Live Project",
                col1_img1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
                col1_img2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
                col2_img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85"
            },
            {
                id: "2",
                name: "Aura Brand Identity",
                category: "Personal Project",
                buttonText: "Live Project",
                col1_img1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
                col1_img2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
                col2_img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85"
            },
            {
                id: "3",
                name: "Solaris Digital",
                category: "Client Project",
                buttonText: "Live Project",
                col1_img1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
                col1_img2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
                col2_img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85"
            }
        ],
        ar: [
            {
                id: "1",
                name: "استوديو نيكست ليفيل",
                category: "مشروع عميل",
                buttonText: "عرض المشروع",
                col1_img1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
                col1_img2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
                col2_img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85"
            },
            {
                id: "2",
                name: "هوية أورا التجارية",
                category: "مشروع شخصي",
                buttonText: "عرض المشروع",
                col1_img1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
                col1_img2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
                col2_img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85"
            },
            {
                id: "3",
                name: "سولاريس ديجيتال",
                category: "مشروع عميل",
                buttonText: "عرض المشروع",
                col1_img1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
                col1_img2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
                col2_img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85"
            }
        ]
    };

    function renderProjects(isAr) {
        const projectsContainer = document.getElementById('projects-container');
        if (!projectsContainer) return;
        
        projectsContainer.innerHTML = "";
        const selectedProjects = isAr ? projectsData.ar : projectsData.en;

        selectedProjects.forEach((project, idx) => {
            const cardTopOffset = 100 + (idx * 30);
            const scaleFactor = 1 - ((selectedProjects.length - 1 - idx) * 0.03);
            const textDir = isAr ? 'text-right' : 'text-left';
            const flexHeaderDir = isAr ? 'flex-row-reverse' : 'flex-row';
            const iconRotation = isAr ? 'rotate-180' : '';

            projectsContainer.innerHTML += `
            <div class="project-card w-full rounded-[30px] md:rounded-[50px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-8 flex flex-col justify-between overflow-hidden shadow-2xl" 
                 style="top: ${cardTopOffset}px; z-index: ${idx + 10}; transform: scale(${scaleFactor})">
                
                <div class="flex ${flexHeaderDir} justify-between items-center w-full border-b border-[#D7E2EA]/20 pb-4">
                    <div class="flex ${flexHeaderDir} items-center gap-4 ${textDir}">
                        <div class="flex flex-col">
                            <span class="text-[#D7E2EA]/60 uppercase tracking-widest text-[10px]">${project.category}</span>
                            <h3 class="text-[#D7E2EA] font-semibold uppercase tracking-wide text-sm sm:text-xl">${project.name}</h3>
                        </div>
                    </div>
                    <button class="rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-4 py-2 sm:px-6 sm:py-3 text-xs bg-transparent hover:bg-[#D7E2EA]/10 transition-all flex items-center gap-2 ${flexHeaderDir}">
                        ${project.buttonText} <i data-lucide="arrow-up-right" class="w-4 h-4 ${iconRotation}"></i>
                    </button>
                </div>

                <div class="grid grid-cols-12 gap-4 flex-1 mt-4 sm:mt-6 overflow-hidden">
                    <div class="col-span-5 flex flex-col gap-4 h-full justify-between">
                        <div class="flex-1 rounded-[16px] sm:rounded-[30px] overflow-hidden border border-[#D7E2EA]/10">
                            <img src="${project.col1_img1}" class="w-full h-full object-cover" alt="">
                        </div>
                        <div class="flex-1 rounded-[16px] sm:rounded-[30px] overflow-hidden border border-[#D7E2EA]/10">
                            <img src="${project.col1_img2}" class="w-full h-full object-cover" alt="">
                        </div>
                    </div>
                    <div class="col-span-7 h-full rounded-[20px] sm:rounded-[40px] overflow-hidden border border-[#D7E2EA]/10">
                        <img src="${project.col2_img}" class="w-full h-full object-cover" alt="">
                    </div>
                </div>
            </div>`;
        });
    }

    // 7. دالة اختيارية لتغيير نصوص الـ HTML الثابتة بالموقع مثل العناوين والأزرار الأخرى
    function translateStaticElements(isAr) {
        // تحديث نص الأنيميشن
        triggerAboutAnimation(isAr);
        
        // ترجمة عنوان الخدمات
        const servicesTitle = document.getElementById('services-title');
        if (servicesTitle) {
            servicesTitle.innerText = isAr ? "الخدمات" : "Services";
        }

        // ترجمة عنوان المشاريع
        const projectsTitle = document.getElementById('projects-title');
        if (projectsTitle) {
            projectsTitle.innerText = isAr ? "المشاريع" : "Projects";
        }
    }

    // تشغيل الصفحة باللغة الافتراضية المحددة عند أول تحميل
    applyLanguage(currentLang);
    
    // تشغيل القلوب عند التحميل مباشرة
    initHearts();
});
