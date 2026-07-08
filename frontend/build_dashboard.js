const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'Dashbaord', 'code.html');
const outPath = path.join(__dirname, 'app', 'dashboard', 'page.js');

let html = fs.readFileSync(htmlPath, 'utf8');

const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/);
const styles = styleMatch ? styleMatch[1] : '';

let scriptMatch = html.match(/<script data-purpose="interaction-simulation">([\s\S]*?)<\/script>/);
let scriptContent = scriptMatch ? scriptMatch[1] : '';

if (scriptContent.includes('const resLoc = gl.')) {
  let completion = "const resLoc = gl.getUniformLocation(program, 'u_resolution');\n" +
      "let startTime = Date.now();\n" +
      "function render() {\n" +
      "  if (!gl) return;\n" +
      "  const displayWidth = canvas.clientWidth;\n" +
      "  const displayHeight = canvas.clientHeight;\n" +
      "  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {\n" +
      "    canvas.width = displayWidth;\n" +
      "    canvas.height = displayHeight;\n" +
      "    gl.viewport(0, 0, canvas.width, canvas.height);\n" +
      "  }\n" +
      "  gl.uniform2f(resLoc, canvas.width, canvas.height);\n" +
      "  gl.uniform1f(timeLoc, (Date.now() - startTime) / 1000.0);\n" +
      "  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);\n" +
      "  requestAnimationFrame(render);\n" +
      "}\n" +
      "render();\n" +
      "}";
  scriptContent = scriptContent.replace('const resLoc = gl.', completion);
}

let mainContentMatch = html.match(/<!-- BEGIN: MainContainer -->([\s\S]*?)<!-- END: MainContainer -->/);
let mainContent = mainContentMatch ? mainContentMatch[1] : '';

mainContent = mainContent.replace(/class="/g, 'className="');
mainContent = mainContent.replace(/<!--[\s\S]*?-->/g, ''); 
mainContent = mainContent.replace(/viewbox=/g, 'viewBox=');
mainContent = mainContent.replace(/stroke-width=/g, 'strokeWidth=');
mainContent = mainContent.replace(/stroke-linecap=/g, 'strokeLinecap=');
mainContent = mainContent.replace(/stroke-linejoin=/g, 'strokeLinejoin=');
mainContent = mainContent.replace(/stroke-dasharray=/g, 'strokeDasharray=');

mainContent = mainContent.replace(/<img([^>]*)>/g, (match, p1) => {
    if(p1.endsWith('/')) return match;
    return "<img" + p1 + " />";
});
mainContent = mainContent.replace(/<input([^>]*)>/g, (match, p1) => {
    if(p1.endsWith('/')) return match;
    return "<input" + p1 + " />";
});

scriptContent = scriptContent.replace(/const canvas = document.getElementById\('shader-bg'\);/g, "const canvas = canvasRef.current; if (!canvas) return;");

const componentCode = "'use client';\n" +
"import { useEffect, useRef } from 'react';\n\n" +
"export default function DashboardPage() {\n" +
"  const canvasRef = useRef(null);\n\n" +
"  useEffect(() => {\n" +
"    " + scriptContent + "\n" +
"  }, []);\n\n" +
"  return (\n" +
"    <div className=\"relative min-h-screen font-['Inter'] antialiased text-[#0f172a]\" style={{ background: '#f0f2f5' }}>\n" +
"      <div dangerouslySetInnerHTML={{ __html: `" + "\n" +
"        <style>\n" +
"          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');\n" +
"          " + styles + "\n" +
"        </style>\n" +
"      `}} />\n" +
"      <canvas id=\"shader-bg\" ref={canvasRef} className=\"fixed top-0 left-0 w-screen h-screen -z-10\" />\n" +
"      \n" + mainContent + "\n" +
"    </div>\n" +
"  );\n" +
"}\n";

fs.writeFileSync(outPath, componentCode);
console.log('Dashboard page created.');
