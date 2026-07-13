import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

// ============================================================================
// STYLES & FONTS INJECTION
// ============================================================================
const FontLoaderAndGlobalStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800;900&display=swap');
    
    html, body, #root {
      background-color: #0C0C0C;
      font-family: 'Kanit', sans-serif;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      scroll-behavior: smooth;
    }
    
    *, *:before, *:after {
      box-sizing: inherit;
    }

    .hero-heading {
      background: linear-gradient(180deg, #646973 0%, #BBCCD7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    /* Hide scrollbars but keep functionality */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: #0C0C0C;
    }
    ::-webkit-scrollbar-thumb {
      background: #252525;
      border-radius: 3px;
    }
  `}} />
);

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

// 1. ContactButton
export const ContactButton: React.FC = () => {
  return (
    <button 
      onClick={() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          // Fallback window scroll to bottom
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
      }}
      className="relative rounded-full uppercase tracking-widest font-medium text-white transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
        outline: '2px solid white',
        outlineOffset: '-3px',
        padding: '12px 32px', // fallback
      }}
    >
      <span className="px-1 sm:px-3 py-1 text-xs sm:text-sm md:text-base block">
        Contact Me
      </span>
    </button>
  );
};

// 2. LiveProjectButton
export const LiveProjectButton: React.FC = () => {
  return (
    <button className="rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-6 py-2 sm:px-10 sm:py-3.5 text-xs sm:text-sm md:text-base bg-transparent hover:bg-[#D7E2EA]/10 transition-all duration-300 flex items-center gap-2">
      Live Project
      <ArrowUpRight className="w-4 h-4" />
    </button>
  );
};

// 3. FadeIn (Viewport detection wrapper using motion.create for element type dynamism)
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: string;
  className?: string;
}
export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  as = 'div',
  className = ''
}) => {
  const Component = motion[as as keyof typeof motion] || motion.div;

  return (
    <Component
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{
        delay,
        duration,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={className}
    >
      {children}
    </Component>
  );
};

// 4. Magnet (Smooth mouse-following magnetic element)
interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}
export const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
  className = ""
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>("translate3d(0px, 0px, 0px)");
  const [transitionStyle, setTransitionStyle] = useState<string>("");

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;
      
      const distanceX = e.clientX - elementCenterX;
      const distanceY = e.clientY - elementCenterY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance < padding) {
        setTransitionStyle(activeTransition);
        const targetX = distanceX / strength;
        const targetY = distanceY / strength;
        setTransformStyle(`translate3d(${targetX}px, ${targetY}px, 0px)`);
      } else {
        setTransitionStyle(inactiveTransition);
        setTransformStyle("translate3d(0px, 0px, 0px)");
      }
    };

    const handleMouseLeave = () => {
      setTransitionStyle(inactiveTransition);
      setTransformStyle("translate3d(0px, 0px, 0px)");
    };

    window.addEventListener("mousemove", handleMouseMove);
    containerRef.current?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      containerRef.current?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [padding, strength, activeTransition, inactiveTransition]);

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{
        transform: transformStyle,
        transition: transitionStyle,
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  );
};

// 5. AnimatedText (Scroll-driven individual character opacity)
interface AnimatedTextProps {
  text: string;
  className?: string;
}
export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = "" }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2']
  });

  const characters = useMemo(() => text.split(""), [text]);

  return (
    <p ref={containerRef} className={`${className} flex flex-wrap justify-center relative`}>
      {characters.map((char, index) => {
        // Calculate a linear step window for each character
        const start = index / characters.length;
        const end = (index + 1) / characters.length;
        
        // Map the container's overall progress to this character's opacity [0.2 -> 1]
        const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);

        return (
          <span key={index} className="relative inline-block whitespace-pre">
            {/* Structural spacer keeping layout aligned */}
            <span className="opacity-0">{char}</span>
            {/* Absolute positioning element which animates opacity */}
            <motion.span 
              style={{ opacity }} 
              className="absolute left-0 top-0 select-none"
            >
              {char}
            </motion.span>
          </span>
        );
      })}
    </p>
  );
};

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

// 1. HERO SECTION
const HeroSection: React.FC = () => {
  return (
    <section className="relative h-screen w-full flex flex-col justify-between overflow-x-clip z-20">
      {/* Navbar */}
      <FadeIn delay={0} y={-20} className="w-full">
        <nav className="flex justify-between items-center w-full px-6 md:px-10 pt-6 md:pt-8">
          <a href="#" className="font-bold tracking-wider text-[#D7E2EA] text-sm md:text-lg lg:text-[1.4rem]">
            DALMKTG
          </a>
          <div className="flex gap-4 sm:gap-8 md:gap-10 lg:gap-14">
            {["About", "Services", "Projects", "Contact"].map((link) => (
              <a 
                key={link} 
                href={`#${link.toLowerCase()}`}
                className="text-[#D7E2EA] font-medium uppercase tracking-wider text-xs sm:text-sm md:text-lg lg:text-[1.1rem] hover:opacity-70 transition-all duration-200"
              >
                {link}
              </a>
            ))}
          </div>
        </nav>
      </FadeIn>

      {/* Hero Central Graphic & Background Portrait */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <FadeIn delay={0.6} y={30}>
          <Magnet 
            padding={150} 
            strength={3} 
            activeTransition="transform 0.3s ease-out" 
            inactiveTransition="transform 0.6s ease-in-out"
            className="pointer-events-auto"
          >
            <div className="relative w-[280px] sm:w-[340px] md:w-[420px] lg:w-[480px]">
              <img 
                src="https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png" 
                alt="Dalal Portrait" 
                className="w-full h-auto object-cover rounded-3xl"
              />
            </div>
          </Magnet>
        </FadeIn>
      </div>

      {/* Hero Title */}
      <div className="flex-1 flex items-center justify-center overflow-hidden z-20 pointer-events-none mt-6 sm:mt-4 md:-mt-5">
        <FadeIn delay={0.15} y={40} className="w-full text-center">
          <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full select-none text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]">
            Hi, i&apos;m Dalal
          </h1>
        </FadeIn>
      </div>

      {/* Bottom bar */}
      <div className="w-full px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 flex justify-between items-end z-20">
        <FadeIn delay={0.35} y={20}>
          <p 
            className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
          >
            a creator driven by crafting striking and unforgettable projects
          </p>
        </FadeIn>

        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
};

// 2. MARQUEE SECTION (Passive High-Frequency Row Parallax scrolling)
const MarqueeSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const marqueeGifs = [
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
    "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
    "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
    "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
    "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
    "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
    "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
    "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
    "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
    "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif"
  ];

  // Distribute 21 GIFs
  const row1Gifs = useMemo(() => marqueeGifs.slice(0, 11), []);
  const row2Gifs = useMemo(() => marqueeGifs.slice(11), []);

  // Triple elements for absolute infinite loop continuity
  const row1Triple = useMemo(() => [...row1Gifs, ...row1Gifs, ...row1Gifs], [row1Gifs]);
  const row2Triple = useMemo(() => [...row2Gifs, ...row2Gifs, ...row2Gifs], [row2Gifs]);

  const getRowStyles = (direction: 'right' | 'left') => {
    if (!sectionRef.current) return {};
    const sectionTop = sectionRef.current.offsetTop;
    const offset = (scrollY - sectionTop + window.innerHeight) * 0.3;
    
    // Set dynamic horizontal translation based on continuous scroll offset direction
    const transformX = direction === 'right' ? (offset - 200) : -(offset - 200);
    return {
      transform: `translateX(${transformX}px)`,
      willChange: 'transform' as const
    };
  };

  return (
    <section ref={sectionRef} className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden relative w-full">
      {/* Row 1 (Rightward Scroll) */}
      <div className="flex gap-3 mb-3 w-[300%] select-none pointer-events-none transition-transform duration-75 ease-out" style={getRowStyles('right')}>
        {row1Triple.map((gif, index) => (
          <div key={`r1-${index}`} className="flex-shrink-0 w-[240px] h-[154px] sm:w-[320px] sm:h-[205px] md:w-[420px] md:h-[270px]">
            <img 
              src={gif} 
              alt="3D motion render item" 
              className="w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-500" 
              loading="lazy" 
            />
          </div>
        ))}
      </div>

      {/* Row 2 (Leftward Scroll) */}
      <div className="flex gap-3 w-[300%] select-none pointer-events-none transition-transform duration-75 ease-out" style={getRowStyles('left')}>
        {row2Triple.map((gif, index) => (
          <div key={`r2-${index}`} className="flex-shrink-0 w-[240px] h-[154px] sm:w-[320px] sm:h-[205px] md:w-[420px] md:h-[270px]">
            <img 
              src={gif} 
              alt="3D motion render item" 
              className="w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-500" 
              loading="lazy" 
            />
          </div>
        ))}
      </div>
    </section>
  );
};

// 3. ABOUT SECTION
const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative min-h-screen w-full bg-[#0C0C0C] flex flex-col justify-center items-center px-5 sm:px-8 md:px-10 py-20 overflow-hidden">
      
      {/* Floating 3D Corner Artifacts with high visual weight */}
      <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] z-10">
        <img 
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png" 
          alt="3D Moon Icon" 
          className="w-[120px] sm:w-[160px] md:w-[210px] h-auto object-contain select-none"
        />
      </FadeIn>

      <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] z-10">
        <img 
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png" 
          alt="3D Geometric Object" 
          className="w-[100px] sm:w-[140px] md:w-[180px] h-auto object-contain select-none"
        />
      </FadeIn>

      <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] z-10">
        <img 
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png" 
          alt="3D Lego Icon" 
          className="w-[120px] sm:w-[160px] md:w-[210px] h-auto object-contain select-none"
        />
      </FadeIn>

      <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] z-10">
        <img 
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png" 
          alt="3D Group Icon" 
          className="w-[130px] sm:w-[170px] md:w-[220px] h-auto object-contain select-none"
        />
      </FadeIn>

      {/* Main content stack */}
      <div className="flex flex-col items-center justify-center text-center max-w-4xl z-20">
        <FadeIn delay={0} y={40}>
          <h2 
            className="hero-heading font-black uppercase leading-none tracking-tight text-center"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            About me
          </h2>
        </FadeIn>

        {/* Dynamic Spacing */}
        <div className="h-10 sm:h-14 md:h-16" />

        <AnimatedText 
          text="With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!"
          className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[560px] tracking-wide"
          style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
        />

        <div className="h-16 sm:h-20 md:h-24" />

        <FadeIn delay={0.1} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
};

// 4. SERVICES SECTION
interface ServiceItem {
  id: string;
  name: string;
  desc: string;
}

const ServicesSection: React.FC = () => {
  const services: ServiceItem[] = [
    {
      id: "01",
      name: "Videography",
      desc: "Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for shops, products, and visualizations."
    },
    {
      id: "02",
      name: "editing",
      desc: "High-quality, editing that showcase designs with custom lighting, textures, and materials to bring concepts to life."
    },
    {
      id: "03",
      name: "Motion Design",
      desc: "Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences."
    },
    {
      id: "04",
      name: "Branding",
      desc: "Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence."
    },
    {
      id: "05",
      name: "Web Design",
      desc: "Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience."
    }
  ];

  return (
    <section id="services" className="bg-[#FFFFFF] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-20">
      <div className="max-w-5xl mx-auto">
        <h2 
          className="text-[#0C0C0C] font-black uppercase text-center leading-none tracking-tight mb-16 sm:mb-20 md:mb-28"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Services
        </h2>

        <div className="flex flex-col border-t border-[#0C0C0C]/15">
          {services.map((svc, i) => (
            <FadeIn key={svc.id} delay={i * 0.1} y={30} className="w-full">
              <div className="flex flex-col md:flex-row items-start md:items-center py-8 sm:py-10 md:py-12 border-b border-[#0C0C0C]/15 group transition-colors duration-300 hover:bg-[#0C0C0C]/5 px-2">
                
                {/* Number ID */}
                <div 
                  className="text-[#0C0C0C] font-black leading-none tracking-tighter w-full md:w-1/3 mb-4 md:mb-0"
                  style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
                >
                  {svc.id}
                </div>

                {/* Info Container */}
                <div className="w-full md:w-2/3 flex flex-col gap-2">
                  <h3 
                    className="text-[#0C0C0C] font-medium uppercase tracking-wide"
                    style={{ fontSize: 'clamp(1.1rem, 2.2vw, 2.1rem)' }}
                  >
                    {svc.name}
                  </h3>
                  <p 
                    className="text-[#0C0C0C]/75 font-light leading-relaxed max-w-2xl"
                    style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}
                  >
                    {svc.desc}
                  </p>
                </div>

              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

// 5. PROJECTS SECTION
interface ProjectData {
  id: string;
  name: string;
  category: string;
  col1_img1: string;
  col1_img2: string;
  col2_img: string;
}

// Nested Card component supporting progressive stack scaling via Framer Motion useScroll
interface ProjectCardProps {
  project: ProjectData;
  index: number;
  total: number;
  containerProgress: any; // Parent scroll progress
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, total, containerProgress }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Custom container scroll hooks for the individual card stacking animations
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"]
  });

  // Calculate target scale and mapping values
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div 
      ref={cardRef}
      className="sticky w-full h-[85vh] flex items-center justify-center"
      style={{
        top: `calc(96px + ${index * 28}px)`,
        zIndex: index + 10,
      }}
    >
      <motion.div 
        style={{ scale }}
        className="w-full h-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 flex flex-col justify-between overflow-hidden relative shadow-2xl"
      >
        {/* Top Header Row inside the card */}
        <div className="flex flex-row justify-between items-center w-full border-b border-[#D7E2EA]/20 pb-4 sm:pb-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <span 
              className="text-[#D7E2EA] font-black leading-none"
              style={{ fontSize: 'clamp(2rem, 6vw, 72px)' }}
            >
              {project.id}
            </span>
            <div className="flex flex-col">
              <span className="text-[#D7E2EA]/60 uppercase tracking-widest text-[9px] sm:text-xs">
                {project.category}
              </span>
              <h3 className="text-[#D7E2EA] font-semibold uppercase tracking-wide text-sm sm:text-xl md:text-2xl mt-0.5">
                {project.name}
              </h3>
            </div>
          </div>
          <LiveProjectButton />
        </div>

        {/* Double-Column Image Stack Grid */}
        <div className="grid grid-cols-12 gap-4 sm:gap-6 flex-1 mt-4 sm:mt-6 overflow-hidden">
          {/* Left stack (40% space on big screen) */}
          <div className="col-span-5 flex flex-col gap-4 sm:gap-6 h-full justify-between">
            <div className="flex-1 rounded-[24px] sm:rounded-[36px] md:rounded-[48px] overflow-hidden border border-[#D7E2EA]/10">
              <img 
                src={project.col1_img1} 
                alt={`${project.name} preview 1`} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-1 rounded-[24px] sm:rounded-[36px] md:rounded-[48px] overflow-hidden border border-[#D7E2EA]/10">
              <img 
                src={project.col1_img2} 
                alt={`${project.name} preview 2`} 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>

          {/* Right giant showcase image (60% space) */}
          <div className="col-span-7 h-full rounded-[30px] sm:rounded-[45px] md:rounded-[60px] overflow-hidden border border-[#D7E2EA]/10">
            <img 
              src={project.col2_img} 
              alt={`${project.name} heroic showcase`} 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>

      </motion.div>
    </div>
  );
};

const ProjectsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const projects: ProjectData[] = [
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

  return (
    <section 
      id="projects" 
      ref={containerRef}
      className="bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 pt-16 sm:pt-24 md:pt-32 pb-32 relative z-25 px-5 sm:px-8 md:px-10"
    >
      <div className="max-w-6xl mx-auto flex flex-col">
        {/* Section Heading */}
        <FadeIn delay={0} y={40}>
          <h2 
            className="hero-heading font-black uppercase leading-none tracking-tight text-center mb-16 sm:mb-24"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Project
          </h2>
        </FadeIn>

        {/* Scrollable Sticky Cards Stacking Zone */}
        <div className="relative flex flex-col items-center w-full gap-24">
          {projects.map((proj, idx) => (
            <ProjectCard 
              key={proj.id} 
              project={proj} 
              index={idx} 
              total={projects.length}
              containerProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// 6. CONTACT / FOOTER SECTION (Additional interactive layout to wrap the page gracefully)
const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="bg-[#0C0C0C] pt-24 pb-12 px-6 md:px-10 border-t border-[#D7E2EA]/10 relative z-30">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
        
        {/* Quick Pitch */}
        <div className="flex flex-col gap-4">
          <span className="text-[#D7E2EA]/50 uppercase tracking-widest text-xs sm:text-sm font-medium">
            Let&apos;s Build
          </span>
          <h2 className="text-[#D7E2EA] font-extrabold text-3xl sm:text-5xl uppercase tracking-tighter leading-none">
            Have a project <br /> in mind?
          </h2>
        </div>

        {/* Live Contact links */}
        <div className="flex flex-col gap-2 text-[#D7E2EA] font-light text-base sm:text-lg">
          <a href="mailto:hello@dalmktg.com" className="hover:text-pink-500 transition-colors duration-200">
            hello@dalmktg.com
          </a>
          <span className="text-white/40">© {new Date().getFullYear()} Dalmktg. All rights reserved.</span>
        </div>
        
      </div>
    </section>
  );
};

// ============================================================================
// MAIN PAGE COMPOSITION
// ============================================================================
export default function App() {
  return (
    <div className="relative w-full bg-[#0C0C0C] text-[#D7E2EA] overflow-x-clip min-h-screen">
      {/* Load fonts dynamically */}
      <FontLoaderAndGlobalStyles />

      {/* Structured Single-Page sections */}
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
}