$(function () {

    var form = layui.form
    // 1.获取所有分类的下拉菜单列表
    initCate()
    function initCate() {
        $.ajax({
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                // console.log(res);
                var htmlStr = template('tpl-cate', res)
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                // layui的单选、多选、下拉菜单需要重新渲染form表单
                form.render()
            }
        });
    }


    // 2.初始化富文本编辑器
    initEditor()

    // 3.裁剪封面
    // 3.1. 初始化图片裁剪器
    var $image = $('#image')

    // 3.2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3.3. 初始化裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()


    })
    $('#coverFile').on('change', function (e) {
        var files = e.target.files
        if (files.length === 0) {
            return layui.layer.msg('请选择封面图片')
        }

        // var file = e.target.files[0]
        // if (file === undefined) {
        //     return layui.layer.msg('请选择封面图片')
        // }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    var state = ''
    $('#btnSubmit').on('click', function () {
        state = '已发布'
    })
    $('#btnSave').on('click', function () {
        state = '草稿'
    })

    $('#form-pub').on('submit', function (e) {
        // 1.阻止表单默认提交
        e.preventDefault()
        // console.log(this);
        // 2.基于form表单快速创建一个FormData对象
        // var fd = new FormData($(this)[0])
        var fd = new FormData(this)
        // 3.将文章发布状态追加到fd中
        fd.append('state', state)
        // fd.forEach(function (value, k) {
        //     console.log(k, value);
        // })
        // console.log(...fd);

        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)

            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }

                layui.layer.msg(res.message)
                // $('#form-pub')[0].reset()
                // 发布文章成功后，跳转到文章列表页面
                // location.href = '/article/art_list.html'

                // setTimeout(function () {
                //     window.parent.document.getElementById('art_list').click()
                // }, 1500)

                window.parent.document.getElementById('art_list').click()
            }
        });
    }
})