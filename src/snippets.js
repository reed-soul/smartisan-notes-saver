async function extractNotes() {
  const iframe = document.getElementById('cloud_app_notes');
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  const notesData = {};

  // 获取所有分类
  const categories = iframeDoc.querySelectorAll('.folder-item');
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    category.click(); // 模拟点击分类
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 等待数据加载

    const categoryName = category
      .querySelector('.folder-tit-wrap .ng-binding')
      .innerText.trim();
    notesData[categoryName] = [];

    // 获取当前分类下的便签列表
    const notes = iframeDoc.querySelectorAll('.note-item');
    for (let j = 0; j < notes.length; j++) {
      const note = notes[j];
      note.click(); // 模拟点击便签
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 等待数据加载

      const title = note
        .querySelector('.note-title .ng-binding')
        .innerText.trim();
      const content = iframeDoc
        .querySelector('.CodeMirror-code')
        .innerText.trim();
      notesData[categoryName].push({ title, content });
    }
  }

  return notesData;
}

function downloadMarkdownFiles(notesData) {
  const zip = new JSZip();

  Object.keys(notesData).forEach((category) => {
    const folder = zip.folder(category);
    notesData[category].forEach((note, index) => {
      folder.file(`${note.title || `note_${index}`}.md`, note.content);
    });
  });

  zip.generateAsync({ type: 'blob' }).then(function (content) {
    saveAs(content, 'notes.zip');
  });
}

// 添加依赖库
const jszipScript = document.createElement('script');
jszipScript.src =
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js';
document.head.appendChild(jszipScript);

const fileSaverScript = document.createElement('script');
fileSaverScript.src =
  'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js';
document.head.appendChild(fileSaverScript);

// 执行脚本
extractNotes().then((notesData) => {
  downloadMarkdownFiles(notesData);
});
