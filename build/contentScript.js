(()=>{function o(){const o=document.createElement("button");o.className="markdown-export-btn",o.textContent="导出 Markdown",o.addEventListener("click",e),document.body.appendChild(o)}async function e(){try{let o;try{o=await t(".CodeMirror-code")}catch(e){console.log("尝试替代选择器...");try{o=await t('[class*="CodeMirror-code"]')}catch(e){console.log("尝试查找 iframe 中的元素...");const t=document.getElementsByTagName("iframe");for(let e of t)try{const t=(e.contentDocument||e.contentWindow.document).querySelector(".CodeMirror-code");if(t){o=t;break}}catch(o){console.log("无法访问 iframe 内容:",o)}if(!o)throw new Error("找不到便签容器")}}console.log("找到容器:",o);const e=o.querySelectorAll(".CodeMirror-line");console.log("找到的行数:",e.length);const n=Array.from(e).map((o=>{const e=o.textContent.trim();return console.log("处理行:",e),e||""})).filter((o=>""!==o));if(0===n.length)throw new Error("未找到内容");const r=n.join("\n\n");console.log("Final markdown:",r),function(o){const e=new Blob([o],{type:"text/markdown"}),t=URL.createObjectURL(e),n=document.createElement("a");n.href=t,n.download=`notes-${(new Date).toISOString().split("T")[0]}.md`;try{document.body.appendChild(n),n.click()}finally{document.body.removeChild(n),URL.revokeObjectURL(t)}}(r)}catch(o){console.error("Error:",o),alert(`导出失败: ${o.message}`)}}function t(o,e=100){return new Promise(((t,n)=>{const r=document.querySelector(o);if(r)return console.log(`元素 ${o} 已存在`),t(r);console.log(`开始等待元素 ${o} 出现...`),console.log("当前页面所有 CodeMirror 相关元素:",document.querySelectorAll('*[class*="CodeMirror"]'));const c=new MutationObserver(((e,n)=>{const r=document.querySelector(o);r&&(console.log(`元素 ${o} 已找到`),n.disconnect(),t(r))}));c.observe(document.body,{childList:!0,subtree:!0,attributes:!0,characterData:!0}),setTimeout((()=>{c.disconnect(),console.log(`等待元素 ${o} 超时`),console.log("超时时的所有 CodeMirror 相关元素:",document.querySelectorAll('*[class*="CodeMirror"]')),n(new Error(`Timeout waiting for ${o}`))}),e)}))}console.log("Content script loaded"),"loading"===document.readyState?document.addEventListener("DOMContentLoaded",o):o(),console.log("页面 URL:",window.location.href),console.log("当前 DOM 状态:",document.readyState),console.log("当前所有 CodeMirror 相关元素:",document.querySelectorAll('*[class*="CodeMirror"]'))})();