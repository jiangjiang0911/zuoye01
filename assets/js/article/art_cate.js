
$(function () {
    // 初始化文章分类类别
    initArtCateList()

    // 封装加载文章类别列表并渲染 的函数
    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                // console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        });
    }
    var layer = layui.layer
    var indexAdd = null
    // 添加按钮
    $('#btnAddCate').on('click', function () {

        indexAdd = layer.open({
            type: 1,
            area: ['500px', '260px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    // 通过代理的形式为form-add 表单绑定提交事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        // console.log(111);
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 弹出提示
                layer.msg(res.message)
                // 刷新列表
                initArtCateList()
                // 关闭弹框
                layer.close(indexAdd)
            }
        });

    })

    // 通过代理形式给btn-edit 绑定编辑事件
    var indexEdit = null
    var form = layui.form
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '260px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        // console.log(1111);
        var id = $(this).attr('data-id')
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                form.val('form-edit', res.data)
            }
        });
    })

    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        // console.log(111);
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 弹出提示
                layer.msg(res.message)
                // 刷新列表
                initArtCateList()
                // 关闭弹框
                layer.close(indexEdit)
            }
        });

    })


    $('tbody').on('click', '.btn-del', function () {
        var id = $(this).attr('data-id')
        // console.log(id);
        // 弹出是否确定删除
        layer.confirm('确定删除吗?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 如果确定则发起删除请求
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    // 删除成功后 弹出删除成功的提示
                    layer.msg(res.message)
                    // 关闭弹出框
                    layer.close(index);
                    // 重新渲染数据
                    initArtCateList()

                }
            });


        });

    })





})