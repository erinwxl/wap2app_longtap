mui.init({
    gestureConfig: {
        longtap: true
    }
});

mui.previewImage();

mui.plusReady(function() {
    document.addEventListener('longtap', function(e) {
        var target = e.target;
        savePic(target);
    });
});

/**
 * 长按保存图片
 * 1. 获取图片链接
 * 2. 创建下载并下载图片
 * 3. 保存至相册
 */
function savePic(target) {
    if(target.tagName == 'IMG' && target.currentSrc.length > 0 && target.classList.contains('mui-zoom')) { //确保图片链接不为空
        var imgUrl = target.src;
        console.log('图片地址：' + imgUrl);
        var suffix = cutImageSuffix(imgUrl);
        mui.confirm("是否保存此图片", "", ["保存", "取消"], function(event) {
            var index = event.index;
            if(index == 0) {
                /**
                 * 创建下载任务
                 * http://www.html5plus.org/doc/zh_cn/downloader.html#plus.downloader.createDownload
                 */
                var downLoader = plus.downloader.createDownload(imgUrl, {
                    method: 'GET',
                    filename: '_downloads/image' + suffix
                }, function(download, status) {
                    var fileName = download.filename;
                    console.log('文件名:' + fileName);
                    console.log('下载状态：' + status);
                    /**
                     * 保存至本地相册
                     */
                    plus.gallery.save(fileName, function() {
                        /**
                         * 保存后，弹出对话框是否查看；
                         */
                        mui.confirm("打开相册查看", "", ["打开", "取消"], function(event) {
                            var gindex = event.index;
                            if(gindex == 0) {
                                /**
                                 * 选择图片
                                 */
                                plus.gallery.pick(function(file) {
                                    mui.toast("你选择了图片：" + file);
                                }, function(error) {
                                    console.log(JSON.stringify(error));
                                }, {

                                });
                            }
                        });
                    });
                });
                /**
                 * 开始下载任务
                 */
                downLoader.start();
            }
        });
    }
}
// 截取图片后缀用于重命名图片，防止%E5%85%89%E6%98%8E%E8%A1%8C编码的文件不被系统相册识别；
function cutImageSuffix(imageUrl) {
    var index = imageUrl.lastIndexOf('.');
    return imageUrl.substring(index);
}
