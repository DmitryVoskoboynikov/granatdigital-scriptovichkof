var appasyncadd = appasyncadd || [];
(function(){
    var app = {
        misc: {
            getClang: function() {
                var lang = $('html').attr('lang');

                if (lang == 'en-US') {
                    lang = 'en_EN';
                } else if (lang == 'ru-RU') {
                    lang = 'ru_RU';
                }

                return lang;
            },
            configParameterCache: {},
            /** get parameters
            maybeConfigParameter: function(name) {
                if (typeof name !== 'string') return null;
                name = name.trim();
                if (!name) return null;
                if (am.configParameterCache.hasOwnProperty(name)) return am.configParameterCache[name];
                var el = $('body > div.cpc2348y93u0ri3tf2 .'+name);
                if (el.length !== 1) return null;
                am.configParameterCache[name] = el.data('val');
                return am.configParameterCache[name];
            },
            */
            listenersByType: {},
            on: function(type, a, b) { // [type, callback] | [type, data, callback]
                am.lastOnCallback = function() {};
                if (typeof type !== 'string') return am;
                type = type.trim();
                if (!type) return am;
                if (!(type in am.listenersByType)) {
                    am.listenersByType[type] = [];
                }
                var li = {cb: null, th: null, data: null};
                var args = Array.prototype.slice.call(arguments, 1);
                if (args.length === 2) {
                    li.data = args.shift();
                }
                if (args.length === 1 && typeof args[0] === 'function') {
                    li.cb = args.shift();
                }
                if (typeof li.cb === 'function') {
                    am.listenersByType[type].push(li);
                    am.lastOnCallback = li.cb;
                }
                return am;
            },
            lastOnCallback: null,
            pushLastOnCallbackInto: function(maybeArr) {
                if (maybeArr && typeof maybeArr.push === 'function') {
                    maybeArr.push(am.lastOnCallback);
                }
                return am;
            },
            off: function(callback) {
                if (typeof callback !== 'function') return am;
                var empty = [];
                $.each(am.listenersByType, function(type, list) {
                    am.listenersByType[type] = $.grep(list, function(li) {
                        return li.cb !== callback;
                    });
                    if (am.listenersByType[type].length === 0) {
                        empty.push(type);
                    }
                });
                $.each(empty, function(i, type){
                    delete am.listenersByType[type];
                });
                return am;
            },
            Evt: function(type, args, data) {
                if (typeof type !== 'string') throw 'invalid event type given';
                type = type.trim();
                if (!type) throw 'no event type given';
                this.type = type;
                this.args = $.isArray(args) ? args : [];
                this.data = data;
                this.propagationStopped = false;
                this.stopPropagation = function() {
                    this.propagationStopped = true;
                }
            },
            trigger: function(type, maybeArgList) {
                if (typeof type !== 'string') return am;
                type = type.trim();
                if (!type) return am;
                if (!(type in am.listenersByType)) return am;
                var listeners = am.listenersByType[type];
                /*
                 if (!(self.ltt instanceof Date)) self.ltt = new Date();
                 var now = new Date();
                 var diff = now.getTime() - self.ltt.getTime();
                 self.ltt = now;
                 am.console_log((new Date().toISOString())+' ['+(diff/1000)+'] '+type+' ('+listeners.length+')');
                 */
                var args = $.isArray(maybeArgList) ? maybeArgList : [];
                for (var i = 0; i < listeners.length; i++) {
                    var li = listeners[i];
                    var e = new am.Evt(type, args, li.data);
                    li.cb.apply(li.th, [e].concat(args));
                    if (e.propagationStopped) break;
                }
                return am;
            },
            loader: {
                count: 0,
                inited: false,
                cssClass: 'js_loader_2309tuj392',
                selector: '.js_loader_2309tuj392',
                init: function() {
                    if (am.loader.inited) return;
                    if ($(am.loader.selector).length) return;
                    $('body').append([
                        '<div class="'+am.loader.cssClass+'" style="display: none; position: fixed;',
                        ' left: 50%; top: 50%; margin-left: -16px;',
                        ' margin-top: -16px; opacity: 0.7; cursor: pointer; z-index: 100500;">',
                        ' <div style="background: url(\'/img/ajax_loader_1.gif\')',
                        '  center center no-repeat; width: 32px; height: 32px;">',
                        ' </div>',
                        '</div>'
                    ].join('\n'));
                },
                show: function() {
                    am.loader.init();
                    am.loader.count++;
                    $(am.loader.selector).show();
                },
                hide: function() {
                    am.loader.init();
                    am.loader.count = Math.max(0, am.loader.count - 1);
                    if (!am.loader.count) {
                        $(am.loader.selector).hide();
                    }
                },
                hideForce: function() {
                    am.loader.init();
                    am.loader.count = 0;
                    $(am.loader.selector).hide();
                }
            },
            url: {
                autogeneratorUrlKey: function(sel, nel) {
                    sel.prop('placeholder', nel.val());

                    nel.bind('paste change blur keyup', null, function(e) {
                        setTimeout(function() {
                            var key = nel.val();
                            sel.prop('placeholder', am.url.generateUrlKey(key));
                        }, 100);
                    }).change(function(){
                        if (sel.val()) return;

                        var key = sel.prop('placeholder');
                        sel.val(key);
                    });
                },
                generateUrlKey: function(t) {
                    t = t.toLowerCase();

                    return app.misc.url.translit(t);
                },
                translit: function(text){
                    var space = '-';

                    var transl = {
                        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
                        'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
                        'о': 'o', 'п': 'p', 'р': 'r','с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h',
                        'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh','ъ': space, 'ы': 'y', 'ь': space, 'э': 'e', 'ю': 'yu', 'я': 'ya',
                        ' ': space, '_': space, '`': space, '~': space, '!': space, '@': space,
                        '#': space, '$': space, '%': space, '^': space, '&': space, '*': space,
                        '(': space, ')': space,'-': space, '\=': space, '+': space, '[': space,
                        ']': space, '\\': space, '|': space, '/': space,'.': space, ',': space,
                        '{': space, '}': space, '\'': space, '"': space, ';': space, ':': space,
                        '?': space, '<': space, '>': space, '№':space
                    }

                    var result = '';
                    var curent_sim = '';

                    for(i=0; i < text.length; i++) {
                        if(transl[text[i]] != undefined) {
                            if(curent_sim != transl[text[i]] || curent_sim != space){
                                result += transl[text[i]];
                                curent_sim = transl[text[i]];
                            }
                        }
                        else {
                            result += text[i];
                            curent_sim = text[i];
                        }
                    }

                    return result;
                }
            },
            cUrl: {
                setUrlParameter: function(key, value) {
                    key = escape(key); value = escape(value);
                    var kvp = document.location.search.substr(1).split('&');
                    var i=kvp.length; var x; while(i--)
                    {
                        x = kvp[i].split('=');

                        if (x[0]==key)
                        {
                            x[1] = value;
                            kvp[i] = x.join('=');
                            break;
                        }
                    }
                    if(i<0) {kvp[kvp.length] = [key,value].join('=');}

                    //this will reload the page, it's likely better to store this until finished
                    document.location.search = kvp.join('&');
                },
                removeUrlParameter: function(k) {

                },

                setUrlParameter: function(param, value) {
                    var regexp = new RegExp("(\\?|\\&)" + param + "\\=([^\\&]*)(\\&|$)");
                    if (regexp.test(document.location.search))
                        return (document.location.search.toString().replace(regexp, function(a, b, c, d)
                        {
                            return (b + param + "=" + value + d);
                        }));
                    else
                        return document.location.search+ param + "=" + value;
                },
                parseAnchorQueryString: function(queryString) {
                    var params = {}, queries, temp, i, l;

                    queries = queryString.split("&");
                    for (i = 0, l = queries.length; i < l; i++) {
                        temp = queries[i].split('=');
                        if (temp[0] == '') continue;

                        params[temp[0]] = temp[1];
                    }

                    return params;
                },
                getAnchorParams: function() {
                    var params = {};

                    try {
                        var hash = location.hash;
                        hash = hash.substring(1, hash.length);

                        params = app.misc.cUrl.parseAnchorQueryString(hash);
                    } catch(e){}

                    return params;
                },
                getAnchorParam: function(k) {
                    var v = null;

                    var params = app.misc.cUrl.getAnchorParams();
                    if (typeof params[k] == 'undefined') return null;

                    return params[k];
                },
                setAnchorParam: function(k, v) {
                    var params = app.misc.cUrl.getAnchorParams();
                    params[k] = v;

                    location.hash = '#'+$.param(params);
                },
                removeAnchorParam: function(k) {
                    var params = app.misc.cUrl.getAnchorParams();
                    delete params[k];

                    location.hash = '#'+$.param(params);
                }
            },
            /**
            slider: function(selector, options){
                if (!selector) return;
                if (typeof options !== 'object') return;

                var slider = $(selector);
                if (!slider.size()) return;

                slider.flexslider(options);

                slider.find('.js_prev').click(function(e){
                    e.preventDefault();
                    slider.flexslider('prev');
                });
                slider.find('.js_next').click(function(e){
                    e.preventDefault();
                    slider.flexslider('next');
                });

                slider.resize();
            },
            */
            generateKey: function() {
                return (new Date).getTime();
            },
            insertParam: function(key, value) {
                key = encodeURI(key); value = encodeURI(value);

                var kvp = document.location.search.substr(1).split('&');

                var i=kvp.length; var x; while(i--)
                {
                    x = kvp[i].split('=');

                    if (x[0]==key)
                    {
                        x[1] = value;
                        kvp[i] = x.join('=');
                        break;
                    }
                }

                if(i<0) {kvp[kvp.length] = [key,value].join('=');}

                //this will reload the page, it's likely better to store this until finished
                document.location.search = kvp.join('&');
            },
            pluralize : function(number, odno_slovo, dva_slova, pjat_slov){
                number = parseInt(number, 10);
                if (typeof number !== 'number' || isNaN(number)) number = 0;
                number = Math.abs(number);
                var cases = [2, 0, 1, 1, 1, 2];
                var titles = jQuery.isArray(odno_slovo) ? odno_slovo : [odno_slovo, dva_slova, pjat_slov];
                var rem = number % 100;
                return titles[ (rem > 4 && rem < 20) ? 2 : cases[ Math.min(number % 10, 5) ] ];
            },
            naturalize: function(number) {
                number = parseInt(number, 10);
                if (typeof number !== 'number' || isNaN(number)) number = 0;
                return Math.abs(number);
            },
            arrayToForm: function(data, opts) {
                if (typeof opts !== 'object') opts = {};
                var appendTo = opts.appendTo || $('body');
                var attrs = {
                    id: opts.id || 'form_'+(new Date().getTime())+'_'+Math.floor(Math.random() * 10000000),
                    method: opts.method || 'post',
                    action: opts.action || '',
                    enctype: opts.enctype || 'multipart/form-data'
                };
                var fel = jQuery('<form></form>');
                fel.attr(attrs);
                fel.appendTo(appendTo);
                if (!opts.visible) fel.hide();
                for (var di in data) {
                    var iel = jQuery('<input type="text" />');
                    iel.appendTo(fel);
                    iel.attr({name: di, value: data[di]});
                }
                return fel;
            },
            dateFormat: function(num, is_year) {
                if (typeof num === 'number') num = num.toString();
                if (typeof num !== 'string') {
                    if (is_year) return '0000';
                    else return '00';
                }
                if (is_year) {
                    num = parseInt(num, 10);
                    if (isNaN(num)) num = 0;
                    if (num < 1900) num = 1900;
                    else if (num > (2100)) num = 2100;
                    num = num.toString();
                } else {
                    if (num.length < 1) num = '01';
                    else if (num.length == 1) num = '0'+num;
                    else num = num.substr(num.length - 2, 2);
                }
                return num;
            },
            runCmd: function(data, scb, ecb){
                var mapRep = {
                    '.':"/",
                    '_':"-",
                }

                jQuery.ajax({
                    'type' : 'POST',
                    'dataType' : 'json',
                    'url' : data.method.replace(/\.|_/g, function(matched){
                        return mapRep[matched];
                    }),
                    'data' : data,
                    'cache' : false,
                    'timeout' : 20000,
                    'success' : function(res){
                        if (!res || typeof res !== 'object') {
                            if (typeof ecb === 'function') ecb({"status":1,"text_status":"error","code":2,"msg":"Connection error","msg_ru":"Ошибка соединения"});
                        } else if (typeof res.status !== 'number') {
                            if (typeof ecb === 'function') ecb({"status":1,"text_status":"error","code":2,"msg":"Connection error","msg_ru":"Ошибка соединения"});
                        } else if (res.status !== 0  || !res.hasOwnProperty('response')) {
                            if (typeof ecb === 'function') ecb(res);
                        } else {
                            if (typeof scb === 'function') scb(res.response);
                        }
                    },
                    'error': function(){
                        if (typeof ecb === 'function') ecb({"status":1,"text_status":"error","code":2,"msg":"Connection error","msg_ru":"Ошибка соединения"});
                    }
                });
            },
            promiseCmd: function(data) {
                var def = jQuery.Deferred();
                am.runCmd(data, function(res){
                    def.resolve(res);
                }, function(err){
                    def.reject(err);
                });

                return def.promise();
            },
            console_log: function(msg) {
                if (console && typeof console === 'object' && typeof console.log === 'function') console.log(msg);
            },
            clearGenericFormErrors: function(fel) {
                fel.find('.js_field_error').parent().removeClass('invalid');
                fel.find('.js_field_error').remove();
                fel.find('.js_glob_error').hide().css('color', 'red').text('');
            },
            clearFormElements: function(fel) {
                fel.find('input').each(function(){
                    var t = $(this).prop('type');
                    if (t == 'hidden' || t == 'submit') return;

                    $(this).val('');
                });
                fel.find('textarea').val('');
            },
            showGenericFormErrors: function(fel, err, with_clear) {
                if (with_clear) {
                    fel.find('.js_field_error').html('').hide();
                }

                if (!err || typeof err !== 'object') return;
                if (typeof err.details === 'object') {
                    jQuery.each(err.details, function(name, txt){
                        var msg = '';
                        if (typeof txt === 'string') msg = txt;
                        else if (typeof txt === 'object' && typeof txt.ru === 'string') msg = txt.ru;
                        var errel = fel.find('.js_'+name+'_error');
                        var inpel = fel.find('input[name="'+name+'"], input.js_'+name);
                        if (errel.length == 1) errel.parent().addClass('invalid').find('.js_field_error').remove().end()
                            .append('<div class="form-row_error error-msg js_field_error" style="color: red;">'+msg+'</div>').parent().addClass('invalid');

                        else if (inpel.length == 1) inpel.parent().addClass('invalid') // && inpel.is(':visible')
                            .find('.js_field_error').remove().end().append('<div class="form-row_error error-msg js_field_error" style="color: red;">'+msg+'</div>');
                        else fel.find('.js_glob_error').css('color', 'red').text(msg).show();
                    });
                    if (err.details && err.details.ru) fel.find('.js_glob_error').css('color', 'red').text(err.details.ru).show();
                    else if (err.details && err.details.en) fel.find('.js_glob_error').css('color', 'red').text(err.details.en).show();
                } else if (err.details) {
                    fel.find('.js_glob_error').css('color', 'red').text(err.details).show();
                } else if (err.msg_ru) {
                    fel.find('.js_glob_error').css('color', 'red').text(err.msg_ru).show();
                } else if (err.msg) {
                    fel.find('.js_glob_error').css('color', 'red').text(err.msg).show();
                } else {
                    fel.find('.js_glob_error').css('color', 'red').text('ошибка').show();
                }
            },
            hideGenericFormErrorsInGlob: function(fel) {
                fel.find('.js_glob_error').html('').hide().css('color', 'red');
            },
            showGenericFormErrorsInGlob: function(fel, err) {
                fel.find('.js_glob_error').html('').hide().css('color', 'red');

                if (!err || typeof err !== 'object') return;
                var garr = [];
                if (typeof err.details === 'object') {
                    jQuery.each(err.details, function(name, txt){
                        if (name === 'msg_en') return;
                        var msg = '';
                        if (typeof txt === 'string') msg = txt;
                        else if (typeof txt === 'object' && typeof txt.ru === 'string') msg = txt.ru;
                        garr.push(msg)
                    });
                    if (err.details && err.details.ru) garr.push(err.details.ru);
                    else if (err.details && err.details.en) garr.push(err.details.en);
                } else if (err.details) {
                    garr.push(err.details);
                } else if (err.msg_ru) {
                    garr.push(err.msg_ru);
                } else if (err.msg) {
                    garr.push(err.msg);
                } else {
                    garr.push('Ошибка');
                }
                fel.find('.js_glob_error').html(garr.join('<br />\n')).show();
            },
            showMessageList: function(el, list) {
                if (!$.isArray(list)) {
                    return;
                }
                var msgs = $.grep(list, function(v){
                    return typeof v === 'string';
                });
                if (msgs.length > 0) {
                    el.css('color', 'green').html(msgs.join('<br />')).show();
                }
            }
        },
        get: function(moduleName) {
            var md = app.moduleLoadDefs[moduleName];
            if (typeof md === 'object' && typeof md.d === 'object' && typeof md.p === 'object') return md.p;
            var def = jQuery.Deferred();
            var pr = def.promise();
            md = {d: def, p: pr};
            app.moduleLoadDefs[moduleName] = md;
            if (typeof app[moduleName] === 'object') def.resolve(app[moduleName]);
            return pr;
        },
        moduleLoadDefs: {},
        onModuleLoaded: function() {
            for (var mi in app.moduleLoadDefs) {
                var md = app.moduleLoadDefs[mi];
                if (typeof app[mi] === 'object' && typeof md === 'object' && typeof md.d === 'object') {
                    md.d.resolve(app[mi]);
                }
            }
        },
        Fsm: function(stateList) {
            var initialized = false;
            var skipToCheck = false;
            var state = null;
            var states = {};
            if (stateList && typeof stateList === 'object') {
                states = stateList;
            }
            this.addState = function(name, data) {
                if (typeof name !== 'string' || !name.trim()) {
                    throw 'invalid state name';
                }
                if (!$.isPlainObject(data)) {
                    throw 'invalid state data';
                }
                states[name] = data;
                return this;
            },
            this.addStates = function(stateList) {
                if (!$.isPlainObject(stateList)) {
                    throw 'invalid state list';
                }
                var zis = this;
                $.each(stateList, function(name, val){
                    zis.addState(name, val);
                });
                return this;
            };
            this.getState = function(){
                return state;
            };
            this.getStates = function(){
                return states;
            };
            this.disableToCheck = function() { skipToCheck = true };
            this.enableToCheck = function() { skipToCheck = false };
            this.prev = null;
            this.next = null;
            this.to = function(nextState){
                var tail = Array.prototype.slice.call(arguments).slice(1);
                var currentState = state;
                if (!initialized) {
                    throw 'fsm is not initialized';
                }

                if (nextState === 'start' && !states[nextState]) {
                    nextState = Object.keys(states)[0];
                } else if (!states[nextState]) {
                    throw 'no such state exist ('+nextState+')';
                }

                var cs = states[currentState];
                var ns = states[nextState];
                this.next = ns;
                if (cs) {
                    this.prev = cs;
                    if (!skipToCheck) {
                        if (!$.isArray(cs.to) || $.inArray(nextState, cs.to) < 0) {
                            if (typeof cs.toError === 'function') {
                                cs.toError(nextState);
                                return;
                            } else {
                                this.prev = null;
                                throw 'state transition from "'+currentState+'" to "'+nextState+'" is impossible';
                            }
                        }
                    }
                    if (typeof cs.off === 'function') {
                        cs.off.apply(this, tail);
                    }
                } else {
                    this.prev = null;
                }
                state = nextState;
                if (typeof ns.on === 'function') {
                    ns.on.apply(this, tail);
                }
                return this;
            };
            this.init = function(initialState) {
                if (initialized) {
                    throw 'fsm is already initialized';
                }
                if (typeof initialState !== 'string' || !initialState.trim()) {
                    throw 'invalid initial state';
                }
                initialized = true;
                this.to(initialState);
                return this;
            }
        },
        init: function() {
            if (!jQuery.isArray(appasyncadd)) return;
            for (var i = 0; i < appasyncadd.length; i++) {
                if (typeof appasyncadd[i] === 'function') {
                    appasyncadd[i](app);

                    app.onModuleLoaded();
                }
            }
            appasyncadd = {
                push: function(loader){
                    if (typeof loader === 'function') {
                        loader(app);

                        app.onModuleLoaded();
                    }
                }
            };
        }
    };
    var am = {};
    var loader = function(){
        jQuery.app = app;
        am = app.misc;
        jQuery(function(){
            app.init();
        });
    };
    var ali = setInterval(function(){
        if (typeof jQuery !== 'function') return;
        clearInterval(ali);
        setTimeout(loader, 0);
    }, 50);
})();
