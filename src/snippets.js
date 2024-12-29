// 提取便签内容的函数
function extractNotes() {
  // 获取所有的便签行，使用第一个 CodeMirror-code 容器内的行
  const container = document.querySelector('.CodeMirror-code');
  if (!container) {
    console.error('未找到便签容器');
    return;
  }

  const noteLines = container.querySelectorAll('.CodeMirror-line');
  console.log('找到的行数:', noteLines.length); // 调试信息

  // 将 NodeList 转换为数组并处理每一行
  const lines = Array.from(noteLines)
    .map(line => {
      // 获取文本内容并去除首尾空格
      const text = line.textContent.trim();
      console.log('处理行:', text); // 调试信息
      return text || '';
    })
    .filter(line => line !== ''); // 过滤掉空行

  // 使用双换行符连接所有行，创建 Markdown 格式的文本
  const markdown = lines.join('\n\n');
  console.log('生成的 Markdown:', markdown); // 调试信息

  // 创建下载链接
  downloadMarkdown(markdown);
}

// 下载 Markdown 文件的函数
function downloadMarkdown(content) {
  // 创建 Blob 对象
  const blob = new Blob([content], { type: 'text/markdown' });

  // 创建下载链接
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'notes.md'; // 设置下载文件名

  // 添加链接到页面并触发点击
  document.body.appendChild(a);
  a.click();

  // 清理
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 创建一个按钮来触发导出
function createExportButton() {
  const button = document.createElement('button');
  button.textContent = '导出为 Markdown';
  button.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    z-index: 9999;
  `;

  button.addEventListener('click', extractNotes);
  document.body.appendChild(button);
}

// 当页面加载完成后创建导出按钮
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createExportButton);
} else {
  createExportButton();
}
