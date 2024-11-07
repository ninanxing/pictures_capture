chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "getImages") {
      // 获取所有图片元素
      const images = Array.from(document.images);
      
      // 获取背景图片
      const elementsWithBg = document.querySelectorAll('*');
      const bgImages = Array.from(elementsWithBg)
        .map(el => {
          const style = window.getComputedStyle(el);
          const bgImage = style.backgroundImage;
          if (bgImage && bgImage !== 'none') {
            return bgImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
          }
          return null;
        })
        .filter(url => url);
  
      // 合并所有图片信息
      const allImages = images.map(img => ({
        src: img.src,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        type: img.src.split('.').pop().toLowerCase(),
        alt: img.alt || '未命名图片'
      })).concat(bgImages.map(url => ({
        src: url,
        width: 0, // 背景图片无法直接获取尺寸
        height: 0,
        type: url.split('.').pop().toLowerCase(),
        alt: '背景图片'
      })));
  
      // 过滤掉小图标和数据URI
      const filteredImages = allImages.filter(img => {
        return img.src.startsWith('http') && 
               !img.src.includes('icon') && 
               !img.src.includes('logo');
      });
  
      sendResponse({images: filteredImages});
    }
  }); 

function getImageType(url) {
    // 处理 data URL
    if (url.startsWith('data:image/')) {
        const mimeType = url.split(';')[0].split('/')[1];
        return mimeType;
    }
    
    // 处理普通 URL
    const extension = url.split('.').pop().toLowerCase().split('?')[0];
    const validTypes = [
        'jpg', 'jpeg', 'png', 'gif', 'webp', 
        'svg', 'ico', 'bmp'
    ];
    
    return validTypes.includes(extension) ? extension : 'other';
} 