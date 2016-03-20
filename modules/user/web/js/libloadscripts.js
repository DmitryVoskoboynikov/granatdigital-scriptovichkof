var appasyncadd = appasyncadd || [];

(function(){
    var app = {}, am = {}, self = {};
    var loader = function(an_app) {
        app = an_app;
        am = app.misc;
        app.libLoadScripts = module;
        self = module;
        self.init();
    };
    setTimeout(function(){ appasyncadd.push(loader); }, 0);

    var busy = false;

    var module = {
        init: function() {
            if (busy) return;
            busy = true;

            am.trigger('load scripts start', [function() {
                am.promiseCmd({
                    method: 'scripts.scripts',
                }).always(function() {
                    busy = false;
                }).fail(function(err) {
                    am.trigger('load scripts fail', [err])
                }).done(function(res) {
                    am.trigger('load scripts done', [res])
                });
            }]);
        }
    }
}());
