async function openDatabase(dbName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 5); // 添加版本号
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

async function extractNotes() {
  try {
    // 打开文件夹数据库
    const folderDb = await openDatabase('_pouch_folder');
    // 打开便签数据库
    const noteDb = await openDatabase('_pouch_note');

    // 获取所有分类
    const folders = await new Promise((resolve, reject) => {
      const transaction = folderDb.transaction(['by-sequence'], 'readonly');
      const store = transaction.objectStore('by-sequence');
      const request = store.getAll();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });

    // 获取所有便签
    const notes = await new Promise((resolve, reject) => {
      const transaction = noteDb.transaction(['by-sequence'], 'readonly');
      const store = transaction.objectStore('by-sequence');
      const request = store.getAll();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });

    // 处理分类数据，建立 sync_id 到 title 的映射
    const folderMap = new Map();
    folders.forEach(item => {
      if (item.folder && !item._deleted) {
        folderMap.set(item.folder.sync_id, item.folder.title);
      }
    });

    // 整理便签数据
    const notesData = {};
    notes.forEach(item => {
      if (!item.note || item._deleted) return;

      const note = item.note;
      const folderId = note.folderId;
      const folderName = folderMap.get(folderId) || '未分类';

      if (!notesData[folderName]) {
        notesData[folderName] = [];
      }

      // 格式化修改时间
      const modifyTime = new Date(note.modify_time);
      const formattedTime = modifyTime.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      // 组合内容：修改时间 + 原始内容
      const content = `修改时间：${formattedTime}\n\n${note.detail || ''}`;

      notesData[folderName].push({
        title: note.title || `note_${note._id}`,
        content: content
      });
    });

    // 关闭数据库连接
    folderDb.close();
    noteDb.close();

    return notesData;
  } catch (error) {
    console.error('Error extracting notes:', error);
    throw error;
  }
}

function downloadMarkdownFiles(notesData) {
  const zip = new JSZip();

  Object.keys(notesData).forEach((category) => {
    const folder = zip.folder(category);
    notesData[category].forEach((note, index) => {
      // 清理文件名中的非法字符
      const safeTitle = note.title.replace(/[\\/:*?"<>|]/g, '_');
      folder.file(`${safeTitle}.md`, note.content);
    });
  });

  zip.generateAsync({ type: 'blob' }).then(function (content) {
    saveAs(content, 'notes.zip');
  });
}

async function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function loadDependencies() {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js');
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js');
}

// 修改执行逻辑
async function main() {
  try {
    // 先加载依赖
    await loadDependencies();
    console.log('Dependencies loaded');

    // 然后执行导出
    const notesData = await extractNotes();
    await downloadMarkdownFiles(notesData);
  } catch (error) {
    console.error('Error:', error);
  }
}

// 执行主函数
main();
