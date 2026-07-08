const fs = require('fs');

let html = fs.readFileSync('../stitch_spatial_dashboard_interface/code.html', 'utf8');
let bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
let body = bodyMatch ? bodyMatch[1] : html;

// Remove scripts inside body
body = body.replace(/<script[\s\S]*?<\/script>/gi, '');

let jsx = body
  .replace(/class=/g, 'className=')
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/<br>/g, '<br />')
  .replace(/<input([^>]*[^\/])>/g, '<input$1 />')
  .replace(/<img([^>]*[^\/])>/g, '<img$1 />');

// Convert inline styles to JSX object
jsx = jsx.replace(/style="([^"]*)"/g, (match, p1) => {
  const styleObj = p1.split(';').filter(s => s.trim()).reduce((acc, s) => {
    let parts = s.split(':');
    let key = parts[0].trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
    let val = parts.slice(1).join(':').trim();
    acc[key] = val;
    return acc;
  }, {});
  return 'style={{ ' + Object.entries(styleObj).map(([k, v]) => `${k}: '${v.replace(/'/g, "\\'")}'`).join(', ') + ' }}';
});

// Replace custom colors
const colors = {
  'primary': '#6a38d4',
  'secondary': '#006875',
  'tertiary': '#3338fe',
  'secondary-container': '#00e3fd',
  'on-surface-variant': '#494454',
  'on-surface': '#191c1e',
  'surface': '#f7f9fc',
  'surface-container-low': '#f2f4f7',
  'surface-container-high': '#e6e8eb',
  'surface-bright': '#f7f9fc',
  'outline': '#7b7486',
  'on-primary': '#ffffff',
  'tertiary-container': '#5860ff'
};

// Handle bg-primary, text-primary, border-primary, from-primary, to-primary, via-primary, ring-primary
Object.entries(colors).forEach(([colorName, hex]) => {
  const regex = new RegExp(`(bg|text|border|from|to|via|ring)-${colorName}(\\/\\d+)?`, 'g');
  jsx = jsx.replace(regex, (match, prefix, opacity) => {
    if (opacity) {
      return `${prefix}-[${hex}${opacity.replace('/', '')}]`; // Note: This isn't perfect for tailwind hex opacity, let's just do `${prefix}-[${hex}]${opacity}` wait no, arbitrary opacity: `bg-[#hex]/20`
    }
    return `${prefix}-[${hex}]`;
  });
  
  // also handle opacity e.g., bg-primary/20
  const regexOpacity = new RegExp(`(bg|text|border|from|to|via|ring)-\\[${hex}\\]\\/(\\d+)`, 'g');
  jsx = jsx.replace(regexOpacity, (match, prefix, opacity) => {
      // actually tailwind supports `bg-[#hex]/20` directly! So the above logic creates bg-[#hex]/20 which is perfect
      return match;
  });
});

// The previous replacement replaces `bg-primary/20` with `bg-[#6a38d4]/20` which is valid in tailwind 3+

// Replace fonts
const fonts = {
  'font-headline-md': "font-['Geist'] text-[32px] leading-[40px] font-semibold",
  'font-label-sm': "font-['Geist'] text-[12px] leading-[16px] tracking-[0.05em] font-medium",
  'font-headline-lg': "font-['Geist'] text-[48px] leading-[56px] tracking-[-0.02em] font-semibold",
  'font-body-md': "font-['Inter'] text-[16px] leading-[24px] font-normal",
  'font-body-lg': "font-['Inter'] text-[18px] leading-[28px] font-normal",
  'font-display-hero': "font-['Geist'] text-[84px] leading-[92px] tracking-[-0.04em] font-bold"
};
Object.entries(fonts).forEach(([className, styles]) => {
  jsx = jsx.replace(new RegExp(className, 'g'), styles);
});

// Specific font sizes used as text-headline-md etc
const textSizes = {
  'text-headline-md': "text-[32px] leading-[40px] font-semibold",
  'text-headline-lg': "text-[48px] leading-[56px] tracking-[-0.02em] font-semibold",
  'text-display-hero': "text-[84px] leading-[92px] tracking-[-0.04em] font-bold"
};
Object.entries(textSizes).forEach(([className, styles]) => {
  jsx = jsx.replace(new RegExp(className, 'g'), styles);
});

// Spacings
jsx = jsx.replace(/px-container-padding/g, 'px-[40px]');
jsx = jsx.replace(/gap-gutter/g, 'gap-[24px]');


let pageContent = `
'use client';
import { useEffect } from 'react';

export default function LandingPage() {
  useEffect(() => {
    document.querySelectorAll('.magnetic-hover').forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            button.style.transform = \`translate(\${x * 0.1}px, \${y * 0.1}px) scale(1.02)\`;
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });

    const dashboard = document.querySelector('.floating-dashboard');
    const onMouseMove = (e) => {
        if (!dashboard) return;
        const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
        const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;
        dashboard.style.transform = \`rotateX(\${-yPercent * 5 + 10}deg) rotateY(\${xPercent * 5 - 5}deg) translateZ(50px)\`;
    };
    document.addEventListener('mousemove', onMouseMove);

    const handleScroll = () => {
        const nav = document.querySelector('header');
        if (nav) {
            if (window.scrollY > 50) {
                nav.style.width = '95%';
                nav.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
            } else {
                nav.style.width = '90%';
                nav.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }
        }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="landing-page-wrapper bg-[#f7f9fc] min-h-screen">
      <div dangerouslySetInnerHTML={{ __html: \`
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Geist:wght@500;600;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
          
          .landing-page-wrapper {
              background-color: #f7f9fc;
              overflow-x: hidden;
              -webkit-font-smoothing: antialiased
          }
          .liquid-glass {
              background: rgba(255, 255, 255, 0.08);
              backdrop-filter: blur(40px);
              -webkit-backdrop-filter: blur(40px);
              border: 1px solid rgba(255, 255, 255, 0.4);
              box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05)
          }
          .aurora-glow {
              filter: blur(120px);
              background: linear-gradient(135deg, #6a38d4 0%, #00e3fd 50%, #3338fe 100%);
              opacity: 0.15;
              z-index: -1
          }
          .grain-texture::before {
              content: "";
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDvk6jyVK-QsLl1ZK4hYnJIlceou426U_2CzDNvrhcUdEMCGE1EhEaGUjU9R9InrD7Q-7P7rKAzwdkO1bKZZQ1LBsb0-5fdAic8A-NVgv2fD4lcsZSiUzEprLDk4MQgIIXjczyHh8oTsKHeKI9qY_8nUmuoE10A1Il0MKKMjcvoZLe9VHY4GKo_AeBU1WP7YWkDF2oia9TdhA1mOcWJY23P_aFRgq-WzbGb4iIQLYFaGTVeTGzXpPy48rDDaT314ImKcM1tloyURJd6');
              opacity: 0.05;
              pointer-events: none;
              z-index: 100
          }
          .magnetic-hover {
              transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)
          }
          .magnetic-hover:hover {
              transform: scale(1.05) translatey(-2px)
          }
          .perspective-container {
              perspective: 2000px
          }
          .floating-dashboard {
              transform: rotatex(10deg) rotatey(-5deg) translatez(50px);
              transition: transform 0.8s ease-out
          }
          .floating-dashboard:hover {
              transform: rotatex(0deg) rotatey(0deg) translatez(100px)
          }
          @keyframes float {
              0% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
              100% { transform: translateY(0px); }
          }
          .animate-float {
              animation: float 6s ease-in-out infinite
          }
        </style>
      \`}} />
      <div className="font-['Inter'] text-[16px] leading-[24px] font-normal text-[#191c1e] grain-texture">
        ${jsx.replace(/`/g, '\\`').replace(/\$/g, '\\$')}
      </div>
    </div>
  );
}
`;

fs.writeFileSync('app/page.js', pageContent);
console.log('page.js successfully created without CDN');
