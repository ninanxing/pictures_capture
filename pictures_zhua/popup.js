document.addEventListener('DOMContentLoaded', function() {
    let allImages = [];

    // 获取文件扩展名的函数
    function getFileExtension(url) {
        try {
            if (url.startsWith('data:image/')) {
                const mimeType = url.split(';')[0].split('/')[1];
                return mimeType === 'jpeg' ? 'jpg' : mimeType;
            }
            
            const urlParts = url.split('/');
            const fileName = urlParts[urlParts.length - 1];
            const fileNameParts = fileName.split('.');
            if (fileNameParts.length > 1) {
                const extension = fileNameParts.pop().toLowerCase().split(/[?#]/)[0];
                if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico', 'bmp'].includes(extension)) {
                    return extension === 'jpeg' ? 'jpg' : extension;
                }
            }

            return 'jpg';
        } catch (error) {
            console.error('获取文件扩展名失败:', error);
            return 'jpg';
        }
    }

    // 下载图片的函数
    function downloadImage(imgUrl) {
        const timestamp = new Date().getTime();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const fileExtension = getFileExtension(imgUrl);
        const fileName = `image_${timestamp}_${randomStr}.${fileExtension}`;

        if (imgUrl.startsWith('data:image/')) {
            const blob = dataURLtoBlob(imgUrl);
            const url = URL.createObjectURL(blob);
            downloadWithCorrectType(url, fileName);
            URL.revokeObjectURL(url);
        } else {
            fetch(imgUrl)
                .then(response => response.blob())
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    downloadWithCorrectType(url, fileName);
                    URL.revokeObjectURL(url);
                })
                .catch(error => {
                    console.error('下载图片失败:', error);
                    alert('下载图片失败，可能是由于跨域限制');
                });
        }
    }

    // 辅助函数：处理 data URL
    function dataURLtoBlob(dataUrl) {
        const arr = dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type: mime});
    }

    // 辅助函数：使用正确的类型下载
    function downloadWithCorrectType(url, fileName) {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // 获取当前标签页中的图片
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      // 添加错误处理和检查
      if (!tabs || !tabs[0] || !tabs[0].id) {
        console.error('无法获取当前标签页信息');
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id, {action: "getImages"}, function(response) {
        if (chrome.runtime.lastError) {
          console.error('连接错误:', chrome.runtime.lastError.message);
          document.getElementById('imageGrid').innerHTML = 
            '<div class="error-message">请刷新页面后重试，或确保您正在浏览一个网页</div>';
          return;
        }
        
        if (response && response.images) {
          allImages = response.images;
          filterAndDisplayImages();
        }
      });
    });
  
    // 筛选并显示图片
    function filterAndDisplayImages() {
      const selectedType = document.getElementById('imageType').value;
      const minSize = parseInt(document.getElementById('minSize').value);
  
      const filteredImages = allImages.filter(img => {
        const meetsSizeRequirement = img.width >= minSize && img.height >= minSize;
        
        let meetsTypeRequirement = true;
        if (selectedType !== 'all') {
            const imgExtension = getFileExtension(img.src).toLowerCase();
            const isJpgType = imgExtension === 'jpg' || imgExtension === 'jpeg';
            
            switch(selectedType) {
                case 'jpg':
                    meetsTypeRequirement = isJpgType;
                    break;
                case 'jpeg':
                    meetsTypeRequirement = isJpgType;
                    break;
                default:
                    meetsTypeRequirement = imgExtension === selectedType;
            }
        }
            
        return meetsSizeRequirement && meetsTypeRequirement;
      });
  
      displayImages(filteredImages);
    }
  
    // 显示图片网格
    function displayImages(images) {
        const container = document.getElementById('imageGrid');
        container.innerHTML = '';
        
        images.forEach(img => {
            const div = document.createElement('div');
            div.className = 'image-container';
            
            // 添加复选框
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'image-checkbox';
            
            // 创建图片包装器
            const wrapper = document.createElement('div');
            wrapper.className = 'image-wrapper';
            
            const imgElement = document.createElement('img');
            imgElement.src = img.src;
            imgElement.alt = img.alt || '图片';
            
            // 添加图片尺寸显示
            const sizeDisplay = document.createElement('div');
            sizeDisplay.className = 'image-size';
            sizeDisplay.textContent = `${img.width} × ${img.height}`;
            
            const fileName = `image_${new Date().getTime()}_${Math.random().toString(36).substring(2, 8)}.${getFileExtension(img.src)}`;
            
            const fileNameDisplay = document.createElement('div');
            fileNameDisplay.className = 'file-name';
            fileNameDisplay.textContent = fileName;
            
            wrapper.appendChild(imgElement);
            wrapper.appendChild(sizeDisplay);
            div.appendChild(checkbox);
            div.appendChild(wrapper);
            div.appendChild(fileNameDisplay);
            
            // 点击图片容器时切换复选框状态
            wrapper.onclick = (e) => {
                e.stopPropagation();
                checkbox.checked = !checkbox.checked;
            };
            
            // 添加加载错误处理
            imgElement.onerror = () => {
                imgElement.src = 'images/error-image.png'; // 替换为错误占位图
                sizeDisplay.style.display = 'none';
            };
            
            container.appendChild(div);
        });
    }
  
    // 下载选中的图片
    document.getElementById('download').addEventListener('click', async function() {
        const checkedImages = document.querySelectorAll('input[type="checkbox"]:checked');
        const progressBar = document.querySelector('.progress-bar');
        const progress = document.querySelector('.progress');
        
        if (checkedImages.length === 0) {
            alert('请至少选择一张图片');
            return;
        }

        // 提示用户输入文件夹名称
        const folderName = prompt('请输入保存的文件夹名称：', 'images');
        if (!folderName) {
            return; // 用户取消输入
        }

        try {
            // 显示进度条
            progressBar.style.display = 'block';
            progress.style.width = '0%';

            // 获取所有选中的图片URL
            const images = Array.from(checkedImages).map(checkbox => {
                return checkbox.nextElementSibling.querySelector('img').src;
            });

            let successCount = 0;

            // 下载所有图片
            for (let i = 0; i < images.length; i++) {
                try {
                    await new Promise((resolve, reject) => {
                        const filename = `${folderName}/img_${i + 1}.jpg`;
                        chrome.downloads.download({
                            url: images[i],
                            filename: filename,
                            conflictAction: 'uniquify'
                        }, (downloadId) => {
                            if (chrome.runtime.lastError) {
                                reject(chrome.runtime.lastError);
                            } else {
                                successCount++;
                                resolve(downloadId);
                            }
                        });
                    });
                } catch (err) {
                    console.error(`下载第 ${i + 1} 张图片失败:`, err);
                }

                // 更新进度条
                const percent = ((i + 1) / images.length) * 100;
                progress.style.width = `${percent}%`;
            }

            // 完成下载
            setTimeout(() => {
                progressBar.style.display = 'none';
                progress.style.width = '0%';
                alert(`下载完成！成功下载 ${successCount} 张图片到 ${folderName} 文件夹`);
            }, 1000);

        } catch (error) {
            console.error('下载过程出错:', error);
            alert('下载过程中出现错误，请重试');
            progressBar.style.display = 'none';
            progress.style.width = '0%';
        }
    });
  
    // 全选功能
    document.getElementById('selectAll').addEventListener('click', function() {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => checkbox.checked = true);
    });
  
    // 取消全选
    document.getElementById('deselectAll').addEventListener('click', function() {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => checkbox.checked = false);
    });
  
    // 监听筛选条件变化
    document.getElementById('imageType').addEventListener('change', filterAndDisplayImages);
    document.getElementById('minSize').addEventListener('change', filterAndDisplayImages);
  }); 