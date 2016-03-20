var appasyncadd = appasyncadd || [];

(function(){
    var app = {}, am = {}, self = {};
    var loader = function(an_app){
        app = an_app;
        am = app.misc;
        app.loadScripts = module;
        self = module;
        self.init();
    };
    setTimeout(function(){ appasyncadd.push(loader); }, 0);

    var busy = false;

    var module = {
        init: function() {
            am.on('load scripts start', function (e, loadScriptsStartCallback){
                loadScriptsStartCallback();
            });

            am.on('load scripts done', function(e, res){
                app.string.scripts.initScriptsList(res.scripts);
            });
        }
    };
})();
