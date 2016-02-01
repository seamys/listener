
(function ($, undefined) {
    //客户端监听对象
    var listener = {
        tid: 0,
        keys: "",
        //任务存储对象
        taskType: {},
        //注册一个任务
        appendTaskType: function (key, type) {
            if (typeof (type) == "function" && typeof (key) == "string" && /^[a-z0-9]+$/.test(key)) {
                //添加一个任务
                this.taskType[key] = {
                    //任务执行函数
                    fun: type,
                    //变化量
                    ts: ''
                };
                var a = [];
                for (var k in this.taskType) { a.push(k); }
                this.keys = a.join('.');
            }
        },
        //开始运行监听
        start: function () {
            //如果定时器正在运行则返回
            if (this.tid === 0) {
                //私有定时执行方法
                (function fn() {
                    $.getJSON("/api/listener", { keys: listener.keys }, function (d) {
                        //获取定时器所有的注册类型
                        for (var key in listener.taskType) {
                            //获取注册类型对象
                            var O = listener.taskType[key];
                            //判断当前对象是否存在和当前的值是否和之前的变化值一样，是否真正执行
                            if (d[key] && d[key] != O.ts) {
                                //更改现有状态
                                O.ts = d[key];
                                //执行注册函数
                                O.fun(O);
                            }
                        }
                        //设置ID
                        listener.tid = setTimeout(fn, 1000);
                    })
                })();
            }
        },
        //关闭监听
        stop: function () {
            //清除定时器
            clearTimeout(this.tid);
            //归零
            this.tid = 0;
        }
    }
    //开始执行监听任务
    listener.start();
    window.listener = listener;
})(jQuery)