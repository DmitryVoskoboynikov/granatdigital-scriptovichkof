
var appasyncadd = appasyncadd || [];
(function(){
    var app = {}, am = {}, self = {};
    var loader = function(an_app){
        app = an_app;
        am = app.misc;
        app.addScript = module;
        self = module;
        self.init();
    };
    setTimeout(function(){ appasyncadd.push(loader); }, 0);

    var busy = false;

    var module = {
        init: function() {

            am.on('add script start', function(e, callbackToPassScriptDataTo){
                if (typeof callbackToPassScriptDataTo === 'function') {
                    callbackToPassScriptDataTo({"steps":[{"id":"start","text":"Начало\nИнструкции оператору, что он должен говорить","left":301,"top":20}],"connections":[]});
                }
            });
            am.on('add script done', function(e, res){
                window.location.href = '/scripts#s='+res.id;
            });
        }
    };
})();
