function addScript() {
  return new Promise((resolve, reject) => {
    if (window.html3pdf) {
      resolve();
      return;
    }

    var script = document.createElement("script");
    script.src = "./html3pdf.js";

    script.onload = () => {
      setTimeout(() => {
        if (window.html3pdf) {
          resolve();
        } else {
          reject(new Error("html3pdf 加载失败"));
        }
      }, 500);
    };

    script.onerror = () => {
      reject(new Error("无法加载html3pdf脚本"));
    };

    document.head.appendChild(script);
  });
}
function down() {
  if (!window.html3pdf) {
    throw new Error("html3pdf 仍然未定义");
  }

  const elementSelector = "#cv-container";
  const fileName = "resume.pdf";
  const element = document.querySelector(elementSelector);

  if (!element) {
    throw new Error(`未找到选择器为 ${elementSelector} 的元素`);
  }

  const pageElements = document.querySelectorAll('.main');
  const pageNumber = pageElements.length
  const isMultiPage = pageNumber > 1
  function changePageElementsGap(gap) {
    pageElements.forEach((page, i) => {
      if (i !== pageNumber - 1) page.style.marginBottom = `${String(gap)}px`
    })
  }
  function changePageWatermark(isShow) {
    pageElements.forEach((page) => {
      if (isShow) {
        page.style.backgroundImage = ''
      } else {
        page.style.backgroundImage = 'none'
      }
    })
  }
  changePageWatermark(0)
  if (isMultiPage) changePageElementsGap(0)
  const opt = {
    filename: fileName,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 1.5,useCORS: true },
    jsPDF: { unit: "mm", orientation: "p" },
  };

  return html3pdf()
    .set(opt)
    .from(element)
    .toImg()
    .outputImg('dataurlstring')
    .then((res)=>{
      // 1. 创建 <a> 标签
      const a = document.createElement('a');

      // 2. 设置 href 和 download 属性
      a.href = res;
      // 若未指定文件名，从 URL 中提取原文件名（如 "https://xxx.com/abc.jpg" → "abc.jpg"）
      a.download = 'abc.jpg'
      
      // 3. 隐藏标签（避免影响页面布局）
      a.style.display = 'none';
      
      // 4. 插入 DOM 并模拟点击
      document.body.appendChild(a);
      a.click();
      
      // 5. 下载后移除标签（清理 DOM）
      document.body.removeChild(a);
      
      console.log("img下载成功");
      
      changePageWatermark(1)
      if (isMultiPage) changePageElementsGap(16)
  })
  .catch((error) => {
    console.error("img下载失败:", error);
    throw error;
  });
}
async function run() {
  try {
    console.log("开始加载html3pdf库...");
    await addScript();
    console.log("html3pdf库加载完成，准备下载...");
    await down();
  } catch (error) {
    console.error("操作失败:", error.message);
  }
}
run();
