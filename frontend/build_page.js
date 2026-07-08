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
  return 'style={{ ' + Object.entries(styleObj).map(([k, v]) => `${k}: '${v}'`).join(', ') + ' }}';
});

// Create page.js content
let pageContent = `
'use client';
import { useEffect } from 'react';
import Head from 'next/head';

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
    <div className="landing-page-wrapper">
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Geist:wght@500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <script dangerouslySetInnerHTML={{ __html: \`
          tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "outline-variant": "#cbc3d7",
                        "on-primary": "#ffffff",
                        "surface-container-low": "#f2f4f7",
                        "surface-dim": "#d8dadd",
                        "inverse-surface": "#2d3133",
                        "on-surface-variant": "#494454",
                        "primary-container": "#8455ee",
                        "error-container": "#ffdad6",
                        "on-secondary-fixed-variant": "#004f58",
                        "on-tertiary": "#ffffff",
                        "on-error": "#ffffff",
                        "tertiary-fixed-dim": "#bfc2ff",
                        "on-secondary-container": "#00616d",
                        "surface-bright": "#f7f9fc",
                        "outline": "#7b7486",
                        "primary-fixed": "#e9ddff",
                        "error": "#ba1a1a",
                        "surface": "#f7f9fc",
                        "surface-container-lowest": "#ffffff",
                        "on-secondary-fixed": "#001f24",
                        "secondary-fixed-dim": "#00daf3",
                        "on-primary-fixed-variant": "#5417be",
                        "inverse-primary": "#d0bcff",
                        "tertiary": "#3338fe",
                        "on-tertiary-fixed": "#02006d",
                        "surface-container-highest": "#e0e3e6",
                        "on-error-container": "#93000a",
                        "primary-fixed-dim": "#d0bcff",
                        "secondary-fixed": "#9cf0ff",
                        "on-tertiary-container": "#fffbff",
                        "surface-tint": "#6d3bd6",
                        "on-background": "#191c1e",
                        "on-tertiary-fixed-variant": "#0e05ec",
                        "surface-container-high": "#e6e8eb",
                        "on-primary-fixed": "#23005c",
                        "surface-container": "#eceef1",
                        "background": "#f7f9fc",
                        "tertiary-container": "#5860ff",
                        "secondary-container": "#00e3fd",
                        "on-surface": "#191c1e",
                        "tertiary-fixed": "#e0e0ff",
                        "inverse-on-surface": "#eff1f4",
                        "primary": "#6a38d4",
                        "on-primary-container": "#fffbff",
                        "secondary": "#006875",
                        "on-secondary": "#ffffff",
                        "surface-variant": "#e0e3e6"
                    },
                    "borderRadius": {
                        "DEFAULT": "1rem",
                        "lg": "2rem",
                        "xl": "3rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "container-padding": "40px",
                        "gutter": "24px",
                        "margin-mobile": "16px",
                        "unit": "8px",
                        "margin-desktop": "64px"
                    },
                    "fontFamily": {
                        "headline-md": ["Geist"],
                        "label-sm": ["Geist"],
                        "headline-lg": ["Geist"],
                        "headline-lg-mobile": ["Geist"],
                        "body-md": ["Inter"],
                        "body-lg": ["Inter"],
                        "display-hero": ["Geist"]
                    },
                    "fontSize": {
                        "headline-md": ["32px", {"lineHeight": "40px", "fontWeight": "600"}],
                        "label-sm": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500"}],
                        "headline-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "600"}],
                        "headline-lg-mobile": ["32px", {"lineHeight": "40px", "fontWeight": "600"}],
                        "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                        "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
                        "display-hero": ["84px", {"lineHeight": "92px", "letterSpacing": "-0.04em", "fontWeight": "700"}]
                    }
                }
            }
          }
        \`}} />
      </Head>
      <div dangerouslySetInnerHTML={{ __html: \`
        <style>
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
      <div className="font-body-md text-on-surface grain-texture">
        ${jsx.replace(/`/g, '\\`')}
      </div>
    </div>
  );
}
`;

fs.writeFileSync('app/page.js', pageContent);
