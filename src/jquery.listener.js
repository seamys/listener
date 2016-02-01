
(function ($, undefined) {
    //�ͻ��˼�������
    var listener = {
        tid: 0,
        keys: "",
        //����洢����
        taskType: {},
        //ע��һ������
        appendTaskType: function (key, type) {
            if (typeof (type) == "function" && typeof (key) == "string" && /^[a-z0-9]+$/.test(key)) {
                //���һ������
                this.taskType[key] = {
                    //����ִ�к���
                    fun: type,
                    //�仯��
                    ts: ''
                };
                var a = [];
                for (var k in this.taskType) { a.push(k); }
                this.keys = a.join('.');
            }
        },
        //��ʼ���м���
        start: function () {
            //�����ʱ�����������򷵻�
            if (this.tid === 0) {
                //˽�ж�ʱִ�з���
                (function fn() {
                    $.getJSON("/api/listener", { keys: listener.keys }, function (d) {
                        //��ȡ��ʱ�����е�ע������
                        for (var key in listener.taskType) {
                            //��ȡע�����Ͷ���
                            var O = listener.taskType[key];
                            //�жϵ�ǰ�����Ƿ���ں͵�ǰ��ֵ�Ƿ��֮ǰ�ı仯ֵһ�����Ƿ�����ִ��
                            if (d[key] && d[key] != O.ts) {
                                //��������״̬
                                O.ts = d[key];
                                //ִ��ע�ắ��
                                O.fun(O);
                            }
                        }
                        //����ID
                        listener.tid = setTimeout(fn, 1000);
                    })
                })();
            }
        },
        //�رռ���
        stop: function () {
            //�����ʱ��
            clearTimeout(this.tid);
            //����
            this.tid = 0;
        }
    }
    //��ʼִ�м�������
    listener.start();
    window.listener = listener;
})(jQuery)