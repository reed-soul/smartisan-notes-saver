console.log('Content script loaded');

// 创建导出按钮
function createExportButton() {
  const button = document.createElement('button');
  button.className = 'markdown-export-btn';
  button.textContent = '导出 Markdown';
  button.addEventListener('click', extractAndDownload);
  document.body.appendChild(button);
}

// 提取并下载 Markdown
async function extractAndDownload() {
  try {
    // 尝试不同的选择器
    let container;
    try {
      container = await waitForElement('.CodeMirror-code');
    } catch (e) {
      console.log('尝试替代选择器...');
      try {
        container = await waitForElement('[class*="CodeMirror-code"]');
      } catch (e2) {
        console.log('尝试查找 iframe 中的元素...');
        // 检查 iframe
        const iframes = document.getElementsByTagName('iframe');
        for (let iframe of iframes) {
          try {
            const iframeDoc =
              iframe.contentDocument || iframe.contentWindow.document;
            const element = iframeDoc.querySelector('.CodeMirror-code');
            if (element) {
              container = element;
              break;
            }
          } catch (e3) {
            console.log('无法访问 iframe 内容:', e3);
          }
        }
        if (!container) {
          throw new Error('找不到便签容器');
        }
      }
    }

    console.log('找到容器:', container);

    // 从容器中获取所有便签行
    const noteLines = container.querySelectorAll('.CodeMirror-line');
    console.log('找到的行数:', noteLines.length);

    // 处理每一行文本
    const lines = Array.from(noteLines)
      .map((line) => {
        const text = line.textContent.trim();
        console.log('处理行:', text);
        return text || '';
      })
      .filter((line) => line !== '');

    if (lines.length === 0) {
      throw new Error('未找到内容');
    }

    // 使用双换行符连接所有行
    const markdown = lines.join('\n\n');
    console.log('Final markdown:', markdown);

    // 下载文件
    downloadMarkdown(markdown);
  } catch (error) {
    console.error('Error:', error);
    alert(`导出失败: ${error.message}`);
  }
}

// 下载 Markdown 文件
function downloadMarkdown(content) {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `notes-${new Date().toISOString().split('T')[0]}.md`;

  try {
    document.body.appendChild(a);
    a.click();
  } finally {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// 等待 DOM 加载完成
function waitForElement(selector, timeout = 100) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      console.log(`元素 ${selector} 已存在`);
      return resolve(element);
    }

    console.log(`开始等待元素 ${selector} 出现...`);
    console.log('当前页面所有 CodeMirror 相关元素:',
      document.querySelectorAll('*[class*="CodeMirror"]'));

    const observer = new MutationObserver((mutations, obs) => {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`元素 ${selector} 已找到`);
        obs.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });

    setTimeout(() => {
      observer.disconnect();
      console.log(`等待元素 ${selector} 超时`);
      console.log('超时时的所有 CodeMirror 相关元素:',
        document.querySelectorAll('*[class*="CodeMirror"]'));
      reject(new Error(`Timeout waiting for ${selector}`));
    }, timeout);
  });
}

// 当 DOM 加载完成后创建按钮
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createExportButton);
} else {
  createExportButton();
}

// 初始检查
console.log('页面 URL:', window.location.href);
console.log('当前 DOM 状态:', document.readyState);
console.log('当前所有 CodeMirror 相关元素:',
  document.querySelectorAll('*[class*="CodeMirror"]'));
