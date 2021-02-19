$(function () {
    // 1.定义参数提交
    var form = layui.form
    var q = {
        pagenum: 1, // 页面值
        pagesize: 2, // 每页显示几条数据
        cate_id: '', // 文章分类的id
        state: ''  // 文章发布状态
    }

    // 定义补零函数
    function padZero(n) {
        return n < 10 ? '0' + n : n;
    }
    // 时间过滤器函数
    template.defaults.imports.dataFoemat = function (dtStr) {
        var dt = new Date(dtStr)
        // return dt
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
        // return 111
    }
    // 2.动态生成文章列表
    initTable()
    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        });
    }

    // 3.获取所有分类的下拉菜单列表
    initCate()
    function initCate() {
        $.ajax({
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                console.log(res);
                var htmlStr = template('tpl-cate', res)
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                // layui的单选、多选、下拉菜单需要重新渲染form表单
                form.render()
            }
        });
    }
    // 4.提交筛选条件，重新渲染数据
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        q.cate_id = cate_id;
        q.state = state
        initTable()
    })

    var laypage = layui.laypage;
    // 5.渲染分页的函数
    function renderPage(total) {
        // console.log(total);
        // var count = Math.ceil(total / q.pagenum)
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 每页显示的数据条数
            curr: q.pagenum, // 设置默认被选中的分页
            // 分页模块设置  显示哪些模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 选择一页显示多少条时，默认为10,20,30,40,  需要以数组的形式赋值自己想要展示的条数
            limits: [2, 3, 5, 10],
            // 分页发生变化的时候会触发jump回调

            // 1.点击页码时会调用jump函数
            // 2.只要调用了renderPage()方法就会触发jump方法
            jump: function (obj, first) {
                // console.log(obj.curr);
                // console.log(first);
                // 如果是调用方法触发的jump  则first的值为true
                // 如果切换页码时触发，first的值为undefined
                q.pagenum = obj.curr;
                // initTable()

                // obj.limit 为切换一页的条数
                q.pagesize = obj.limit
                // first 不为true时  说明是页码切换，再执行获取文章列表的函数
                if (!first) {
                    initTable()

                }
            }
        });
    }

    // 6.删除功能
    $('tbody').on('click', '.btn-del', function () {
        var id = $(this).attr('data-id')
        layer.confirm('是否确定删除?', { icon: 3, title: '提示' }, function (index) {
            //do something 
            $.ajax({
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg(res.message)
                    }
                    layui.layer.msg(res.message)

                    if ($('.btn-del').length == 1 && q.pagenum > 1) q.pagenum--;
                    layer.close(index);
                    initTable()
                }
            });

        });
    })

})