
  function addScript() {
    return new Promise((resolve, reject) => {
      if (window.html3pdf) {
        resolve();
        return;
      }

      var script = document.createElement("script");
      script.src = "./core.js";

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
      throw new Error("tool 仍未定义");
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

    return html3pdf().set(opt)
      .from(element)
      .save()
      .then(() => {
        console.log("pdf下载成功");
        changePageWatermark(1)
        if (isMultiPage) changePageElementsGap(16)
      })
      .catch((error) => {
        console.error("pdf下载失败:", error);
        throw error;
      });
  }
  async function run() {
    try {
      console.log("开始加载 tool 库...");
      await addScript();
      console.log("tool 库加载完成，准备下载...");
      await down();
    } catch (error) {
      console.error("操作失败:", error.message);
    }
  }
  run();