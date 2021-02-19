$(function () {

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 为上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })
    // 为文件选择框绑定change事件
    $('#file').on('change', function (e) {
        // console.log(e);
        var filelist = e.target.files;
        // console.log(filelist);
        // console.log(filelist.length);
        if (filelist.length < 0) {
            return layui.layer.msg('请选择照片！')
        }

        // 1.拿到用户所选择的文件
        var file = this.files[0]

        // var file = e.target.files[0]
        // 2.将文件转化为路径
        var imgURL = URL.createObjectURL(file)
        // 3. 重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 修改头像
    $('#btnUpload').on('click', function () {
        // 接口文档上面详细记录需要的头像是base64格式还是使用FormData格式
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')

        // 发起上传头像的请求
        $.ajax({
            method: "POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL
            },
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)
                // 调用父级页面的渲染头像和用户名的方法
                window.parent.getUserInfo()
            }
        });
    })








})