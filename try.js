function addScript() {
  return new Promise((resolve, reject) => {
    if (window.html3pdf) {
      resolve();
      return;
    }

    var script = document.createElement("script");
    script.src = "https://rt442979559.github.io/doc/html3pdf.js";

    script.onload = () => {
      setTimeout(() => {
        if (window.html3pdf) {
          resolve();
        } else {
          reject(new Error("插件加载失败"));
        }
      }, 500);
    };

    script.onerror = () => {
      reject(new Error("无法加载插件"));
    };

    document.head.appendChild(script);
  });
}
// 头像转base64
function convertImageToBase64(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // 允许跨域
    img.crossOrigin = 'Anonymous'; 
    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = url;
  });
}

// 使用示例
async function generatePDF() {
  const imgElement = document.querySelector('.user-avatar-image')
  const originalSrc = imgElement.src;
  if (!imgElement) return true 
  try {
    // 将图片转为base64
    const base64Src = await convertImageToBase64(originalSrc);
    imgElement.src = base64Src;
    console.log("图片已转换!");
  } catch (e) {
    throw new Error("无法转换图片:",e);
  }
}
function down() {
  if (!window.html3pdf) {
    throw new Error("插件仍然未定义");
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
  function changePageElementsGap (gap) {
    pageElements.forEach((page,i) => {
      if(i !== pageNumber-1) page.style.marginBottom = `${String(gap)}px`
    }) 
  }
  if(isMultiPage) changePageElementsGap(0)
  const opt = {
    filename: fileName,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 1.5 },
    jsPDF: { unit: "mm", orientation: "p" },
  };

  return html3pdf()
    .set(opt)
    .from(element)
    .save()
    .then(() => {
      console.log("pdf下载成功");
      if(isMultiPage) changePageElementsGap(16)
    })
    .catch((error) => {
      console.error("pdf下载失败:", error);
      throw error;
    });
}
async function run() {
  try {
    console.log("开始加载插件...");
    await addScript();
    console.log("插件加载完成，准备下载...");
    await generatePDF()
    await down();
  } catch (error) {
    console.error("操作失败:", error.message);
  }
}
run();
