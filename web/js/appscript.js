function CutString(string,limit) {
    // temparary node to parse the html tags in the string
    this.tempDiv = document.createElement('div');
    this.tempDiv.id = "TempNodeForTest";
    this.tempDiv.innerHTML = string;
    // while parsing text no of characters parsed
    this.charCount = 0;
    this.limit = limit;
}
CutString.prototype.cut = function(){
    var newDiv = document.createElement('div');
    this.searchEnd(this.tempDiv, newDiv);
    return newDiv.innerHTML;
};

CutString.prototype.searchEnd = function(parseDiv, newParent){
    var ele;
    var newEle;
    for(var j=0; j< parseDiv.childNodes.length; j++){
        ele = parseDiv.childNodes[j];
        // not text node
        if(ele.nodeType != 3){
            newEle = ele.cloneNode(true);
            newParent.appendChild(newEle);
            if(ele.childNodes.length === 0)
                continue;
            newEle.innerHTML = '';
            var res = this.searchEnd(ele,newEle);
            if(res)
                return res;
            else{
                continue;
            }
        }

        // the limit of the char count reached
        if(ele.nodeValue.length + this.charCount >= this.limit){
            newEle = ele.cloneNode(true);
            newEle.nodeValue = ele.nodeValue.substr(0, this.limit - this.charCount);
            newParent.appendChild(newEle);
            return true;
        }
        newEle = ele.cloneNode(true);
        newParent.appendChild(newEle);
        this.charCount += ele.nodeValue.length;
    }
    return false;
};

function cutHtmlString($string, $limit){
    var output = new CutString($string,$limit);
    return output.cut();
}

var appasyncadd = appasyncadd || [];
(function(){
    var app = {}, am = {}, self = {};
    var loader = function(an_app) {
        app = an_app;
        am = app.misc;
        app.string = module;
        self = module;
        self.init();
    };
    setTimeout(function(){ appasyncadd.push(loader); }, 0);

    var busy, edit, desk, jsp = null;
    var module = {
        role: null,
        _isHs: null,
        isHs: function() {
            if (self._isHs === null) {
                self._isHs = $('body').hasClass('hs');
                $('body').removeClass('hs');
            }
            return self._isHs;
        },
        /**************************************************************************************************************/
        view: {
            setProgress: function(percent) {
                percent = Math.min(100, am.naturalize(percent));
                $('.progressBar .progressPercent').text(percent);
                $('.progressBar .progressLineFill').width(Math.round($('.progressBar .progressLineBack').width() * percent / 100));
            },
            nlToArray: function(str) {
                if (typeof str === 'number') str = str.toString();
                if (typeof str !== 'string') str = '';
                str = str.trim();
                var arr = str.split('\n');
                if (arr.length === 1) return str;
                return arr;
            },
            convertScript: function(data) {
                if (!data || !data.steps || !$.isArray(data.steps)) {
                    throw 'Некорректные данные';
                }

                var hash = {};
                var list = [];
                $.each(data.steps, function(i, o){
                    if (!o.id) {
                        throw 'Некорректный шаг в данных';
                    }
                    hash[o.id] = {name: o.id, is_starred: o.is_starred, starred_text: o.starred_text,
                        description: self.view.nlToArray(o.description), buttons: []};
                    list.push(hash[o.id]);
                });
                if (data.connections && $.isArray(data.connections)) {
                    $.each(data.connections, function(i, o){
                        if (!o.start_id || !o.finish_id || typeof o.text !== 'string') {
                            throw 'Некорректная связь в данных';
                        }
                        var s = o.start_id;
                        var t = o.finish_id;
                        if (!hash[s] || !hash[t]) {
                            throw 'Некорректная связь в данных';
                        }
                        hash[s].buttons.push({state: t, text: o.text});
                    });
                }
                return self.view.setNodeDistances(list);
            },
            setNodeDistances: function(data) {
                if (!$.isArray(data) || data.length < 1) return data;
                var Node = function(id) {
                    this.id = id;
                    this.distanceFromStart = null;
                    this.distanceToEnd = null;
                    this.parents = [];
                    this.children = [];
                };
                var start = null;
                var net = {};
                $.each(data, function(i, o){
                    net[o.name] = new Node(o.name);
                    if (o.name === 'start') {
                        start = net[o.name];
                    }
                });

                if (!start) {
                    start = net[data[0].name];
                }

                $.each(data, function(i, o){
                    if (!$.isArray(o.buttons)) return;
                    $.each(o.buttons, function(i, b) {
                        net[o.name].children.push(net[b.state]);
                        if ($.inArray(net[o.name], net[b.state].parents) < 0) {
                            net[b.state].parents.push(net[o.name]);
                        }
                    });
                });
                var ends = [];
                $.each(net, function(i, o){
                    if (o.children.length < 1) {
                        ends.push(o);
                    }
                });
                var updateDistance = function(node, distProp, listProp, dist, visited) {
                    if ($.inArray(node.id, visited) >= 0) return;
                    visited.push(node.id);
                    if (node[distProp] === null || dist < node[distProp]) {
                        node[distProp] = dist;
                    }
                    $.each(node[listProp], function(i, o){
                        updateDistance(o, distProp, listProp, dist+1, visited.slice());
                    });
                }
                updateDistance(start, 'distanceFromStart', 'children', 0, []);
                $.each(ends, function(i, o){
                    updateDistance(o, 'distanceToEnd', 'parents', 0, []);
                });
                $.each(net, function(i, o){
                    if (o.distanceFromStart === null) {
                        o.distanceFromStart = 0;
                    }
                    if (o.distanceToEnd === null) {
                        o.distanceToEnd = Infinity;
                    }
                });
                $.each(data, function(i, o){
                    var fromStart = net[o.name].distanceFromStart;
                    var total = fromStart + net[o.name].distanceToEnd;
                    o.progress = total > 0 ? Math.round(fromStart / total * 1000) / 10 : 0;
                });
                return data;
            },
            logStep: function(step, status) {
                var lel = $('.log');
                lel.find('.unexpected_answer').remove();
                var buttonsIsArray = step.buttons && $.isArray(step.buttons);
                var html = [
                    '<div class="item" data-id="'+step.name+'" data-is_end="'+(buttonsIsArray && step.buttons.length > 0 ? 'n' : 'y')+'">',
                    '   <div class="counter">'+(lel.find('.item').length+1)+' ></div>',
                    '   <div class="text">'+($.isArray(step.description) ? step.description.join(' ') : step.description)+'</div>',
                    (buttonsIsArray ? $.map(step.buttons, function(b){
                        return '<button class="set_state btn btn-success" data-state="'+(b.state ? b.state : 'no_state_defined')+'">'+(b.text ? b.text : '...')+'</button>';
                    }).join('') : ''),
                    (step.progress && step.progress >= 100 ?
                        '	<button class="talk_is_over btn btn-primary" style="margin: 5px;">Разговор окончен</button>' :
                        '   <button class="unexpected_answer btn btn-default">Нет нужного ответа</button>'),
                    '</div>'
                ].join('\n');
                lel.find('.item').fadeTo(0, 0.5);
                lel.append(html);
                lel.scrollTop(lel[0].scrollHeight);

                $('.js_view_box .progressBar .talk_is_over')[step.progress && step.progress >= 100 ? 'hide' : 'show']();
            },
            testProgressBar: function() {
                var pr = 0;
                var pi = setInterval(function(){
                    self.view.setProgress(pr++);
                    if (pr > 100) clearInterval(pi);
                }, 100);
            },
            testLogHeight: function() {
                for (var i = 0; i < 50; i++) {
                    $('.log').append('<div>'+i+' '+Math.random()+'</div>');
                }
            },
            openAndLaunchScript: function(id, ver, title, data, target) {
                self.view.lastOpenData = [id, ver, title, data, target];

                var vbel = $('.js_view_box');
                vbel.find('.log').html('<div class="heading item" style="display: none;">' +
                    '<h2></h2><button class="set_state btn btn-success" data-state="start">Начать</button></div>');
                vbel.find('.progressPercent').text(0);
                vbel.find('.progressLineFill').width(0);

                self.view.launchScript(id, ver, title, data, target);
            },
            lastOpenData: [],
            reopenAndLaunchScript: function() {
                self.view.openAndLaunchScript.apply(self.view, self.view.lastOpenData);
            },
            runningScriptId: null,
            runningScriptVer: null,
            launchScript: function(id, ver, title, data, target) {
                $('.log .heading h2').text(title);
                $('.log .heading').show();

                if (target) {
                    $('.script-target').show().find('.target-content').text(target);
                }
                else {
                    $('.script-target').hide();
                }

                var f = new app.Fsm();
                f.disableToCheck();
                f.addState('init', {name: 'init', off: function(){
                    $('.log .heading').remove();
                }});
                var steps = null;
                try {
                    steps = self.view.convertScript(data);
                } catch (e) {
                    alert('Что-то пошло не так при запуске скрипта, попробуйте перезагрузить страницу');
                    return;
                }

                var starredSteps = [];

                $.each(steps, function(i, s){
                    if (s.is_starred) {
                        starredSteps.push(s);
                    }

                    f.addState(s.name, {
                        name: s.name,
                        on: function(){
                            self.view.logStep(s, this.next);
                            self.view.setProgress(s.progress ? s.progress : 0);
                        }
                    });
                });
                self.view.renderStarredBox(starredSteps);

                f.init('init');
                self.view.fsm = f;

                $('.js_view_box').unbind('click.setState').on('click.setState', '.item .set_state, button.set_state', function(e){
                    e.preventDefault();
                    var el = $(this);
                    var par = el.parents('.item').first();
                    if (!par.is($('.log .item').last())) {
                        par.nextAll().remove();
                    }
                    var nextState = el.data('state');
                    if (!nextState) {
                        return;
                    }

                    f.to(nextState);
                });

                $('.js_view_box .progressBar .talk_is_over').show();

                self.view.runningScriptId = id;
                self.view.runningScriptVer = ver;

                if (self.isHs()) {
                    f.to('start');
                }
            },
            renderStarredBox: function(steps) {
                var box = $('.js_starred_box');
                box.hide();

                if (!steps.length) return;
                box.find('button').remove();

                $.each(steps, function(i,s){
                    box.append('<button data-state="' + s.name +
                        '" type="button" class="set_state btn btn-default">' + s.starred_text + '</button>');
                });

                box.show();
            },
            stopScriptAndSaveLog: function(endButton) {
                if (busy) return;
                if (!self.view.runningScriptId) {
                    alert('Скрипт не запущен');
                    return;
                }
                busy = true;
                $.fancybox.showLoading();
                var outcome = 'unknown';
                if (endButton.hasClass('talk_is_over')) {
                    var ls = $('.log .item').last();
                    if (ls.length > 0) {
                        if (ls.data('is_end') === 'y') {
                            outcome = 'ok';
                        } else {
                            outcome = 'forced_interruption';
                        }
                    } else {
                        outcome = 'forced_interruption';
                    }
                } else if (endButton.hasClass('unexpected_answer')) {
                    outcome = 'unexpected_answer';
                }
                var log = $('.log .item').map(function(i, o){
                    var s = $(o);
                    return {id: s.data('id')};
                }).get();


                if (log[0]['id'] == undefined) {
                    $.fancybox.hideLoading();
                    busy = false;

                    alert('Скрипт не запущен');
                    return;
                }

                am.promiseCmd({
                    method: 'script.save_log',
                    id: self.view.runningScriptId,
                    //ver: self.view.runningScriptVer,
                    outcome: outcome,
                    log: log
                }).always(function(){
                    busy = false;
                    $.fancybox.hideLoading();
                    self.view.runningScriptId = null;
                    self.view.runningScriptVer = null;
                }).fail(function(err){
                    console.log(err);
                }).done(function(res){
                    self.view.reopenAndLaunchScript();
                });
            },
            fsm: null,
            init: function() {
                $('.js_view_box').on('click', '.talk_is_over', function(e){
                    e.preventDefault();
                    self.view.stopScriptAndSaveLog($(this));
                });
                $('.log').on('click', '.item .unexpected_answer', function(e){
                    e.preventDefault();
                    self.view.stopScriptAndSaveLog($(this));
                });
            }
        },
        scripts: {
            processed: false,
            stopSaveButtonGlimmering: function() {
                self.scripts.doSaveButtonGlimmering = false;
            },
            init: function() {
                var boxel = $('.js_editor');
                if (!boxel.size()) return;

                /**
                am.on('add script start', function(e, callbackToPassScriptDataTo){
                    if (!jsp) self.constructor.init();
                    self.constructor.reset(jsp);
                    if (typeof callbackToPassScriptDataTo === 'function') {
                        callbackToPassScriptDataTo(self.constructor.save(jsp));
                    }
                }).on('add script done', function(e, res){
                    $('.js_editor').data('id', res.id);
                    self.scripts.initScriptsList(res.scripts);
                    $('.js_scripts_list_box .js_show_script[data-id='+res.id+']').click();
                });

                $(document).on('click', '.js_new_script',function(e){
                    e.preventDefault();
                    $('#scriptsNameFormError').val('');
                    $('.js_scripts_edit_box').show();
                    app.get('libAddScript').done(function(l){l.showPopup()});
                });

                $('.js_rename_script').click(function(e){
                    e.preventDefault();
                    $('#scriptsRenameFormError').val($('.js_selected_script_name').text());
                    $('#rename_script_id').val($('.js_editor').data('id'));
                    $.fancybox.open($('.js_scripts_rename_script'));
                });

                $('.js_copy_script').click(function(e){
                    e.preventDefault();
                    $.fancybox.open($('.js_scripts_copy_script'));
                });

                $('.js_scripts_rename_script form').submit(function(e){
                    e.preventDefault();
                    var name = $('#scriptsRenameFormError').val();
                    var scriptID = $('#rename_script_id').val();

                    if (self.busy) return;
                    self.busy = true;

                    $.fancybox.showLoading();

                    am.promiseCmd({
                        method: 'scripts.rename',
                        id: scriptID,
                        name: name
                    }).always(function(){
                        self.busy = false;
                        $.fancybox.hideLoading();
                    }).done(function(res){
                        if ($('.js_list_box').css('display') == 'none') {
                            $('.js_selected_script_name').text(name);
                        }
                        $('h4.js_show_script[data-id=' + scriptID + ']').text(name);
                        $.fancybox.close();
                    }).fail(function(err){
                        console.log(err);
                    });
                });

                $('.js_script_target').on('change, keyup', function(){
                    var value = $(this).val();
                    boxel.data('target', value);
                    am.trigger('constructor has changes');
                });

                $('.js_scripts_copy_script form').submit(function(e){
                    e.preventDefault();
                    var name = $('#scriptsCopyFormError').val();
                    var scriptID = $('.js_editor').data('id');

                    if (self.busy) return;
                    self.busy = true;

                    $.fancybox.showLoading();

                    am.promiseCmd({
                        method: 'scripts.copy',
                        id: scriptID,
                        name: name
                    }).always(function(){
                        self.busy = false;
                        $.fancybox.hideLoading();
                    }).done(function(res){
                        window.location.reload();
                    }).fail(function(err){
                        console.log(err);
                    });
                });

                $('.js_scripts_action_delete').click(function(e){
                    e.preventDefault();

                    app.get('all').done(function(all){
                        all.confirm.show('Вы действительно хотите удалить скрипт?', function(){
                            if (self.busy) return;
                            self.busy = true;

                            var boxel = $('.js_editor');
                            if (!boxel.size()) return;

                            $.fancybox.showLoading();
                            am.promiseCmd({
                                method: 'script.delete',
                                id: boxel.data('id')
                            }).always(function(){
                                self.busy = false;
                                $.fancybox.hideLoading();
                            }).done(function(res){
                                am.cUrl.removeAnchorParam('s');

                                if (!res.scripts.length && self.isHs()) window.location.href = '/add_script';

                                self.scripts.initScriptsList(res.scripts);
                                self.constructor.reset(jsp);

                                boxel.find('.js_scripts_edit_box').hide();
                                $('.js_box').hide();

                                $.fancybox.close();

                                if (self.isHs()) {
                                    $('.js_scripts_list .js_show_script').first().click();
                                }
                            }).fail(function(err){
                            });
                        });
                    });
                });

                $('.js_scripts_action_save').click(function(e){
                    var c = $('.js_desk');
                    var zoom = 1;

                    var matrix = c.css('transform').match(/(-?[0-9\.]+)/g);
                    if (matrix) {
                        zoom = matrix[0];
                    }

                    c.css('transform', 'scale(' + (parseFloat(1)) + ')');
                    c.css('transform-origin', '0 0');
                    jsp.setZoom(1);

                    e.preventDefault();

                    var boxel = $('.js_editor');
                    if (!boxel.length) return;

                    if (busy) return;
                    busy = true;

                    am.trigger('constructor save started');

                    $('.js_show_constructor').trigger('click');

                    $.fancybox.showLoading();
                    am.promiseCmd({
                        method: 'scripts.update',
                        id: boxel.data('id'),
                        target: boxel.data('target'),
                        data: self.constructor.save(jsp)
                    }).always(function(){
                        c.css('transform', 'scale(' + (parseFloat(zoom)) + ')');
                        c.css('transform-origin', '0 0');
                        jsp.setZoom(1);
                        busy = false;
                        $.fancybox.hideLoading();
                    }).done(function(res){
                        boxel.data('id', res.id);
                        boxel.data('ver', res.ver);
                        $.fancybox.close();
                        am.trigger('constructor has no changes');
                        am.trigger('constructor save finished');
                    }).fail(function(err){
                        console.log(err);
                    });
                });
                */

                $('.js_scripts_action_view').click(function(e){
                    e.preventDefault();

                    $('.js_settings_box').hide();

                    var boxel = $('.js_editor');
                    if (boxel.length !== 1) return;

                    var sebel = $('.js_scripts_edit_box');
                    if (sebel.length < 1) return;

                    self.view.openAndLaunchScript(boxel.data('id'), boxel.data('ver'), boxel.data('title'),
                        self.constructor.save(jsp), boxel.data('target'));

                    $('.js_box').hide();
                    $('.js_view_box').show();

                    am.trigger('tab selected', ['js_view_box']);
                });

                self.scripts.initShowScriptButtons();
                self.scripts.initTabs();

                /**
                (function(){
                    var currentScript = am.cUrl.getAnchorParam('s');
                    if ('localStorage' in window && window['localStorage'] !== null) {
                        currentScript = window.localStorage.getItem('current_script');
                    }

                    if (currentScript && currentScript != null && currentScript != 'null') {
                        $('.js_scripts_list .js_show_script[data-id='+currentScript+']').click();
                    } else {
                        if (self.isHs()) {
                            $('.js_back_to_list').click();
                        }
                    }
                })();
                */

                /**
                (function(){
                    var statJsp = null;
                    var statDesk = $('.js_stat_desk');
                    var statBox = $('.js_stats_box');
                    var busy = false;
                    var vss = $('.version_stats_sel').on('change', function(){
                        $('.js_show_conversion').trigger('click', [vss.val()]);
                    });

                    $('.js_show_conversion').click(function(e, maybeVer) {
                        e.preventDefault();
                        if (busy) return;
                        var id = am.naturalize($('.js_scripts_list .js_show_script.active').data('id'));
                        if (id < 1) return;
                        var ver = undefined;
                        if (am.naturalize(maybeVer) > 0) ver = am.naturalize(maybeVer);
                        busy = true;
                        if (statJsp instanceof jsPlumbInstance) {
                            statJsp.reset();
                        }
                        statJsp = jsPlumb.getInstance({
                            Endpoint: ['Dot', {radius: 2}],
                            HoverPaintStyle: {strokeStyle: '#2b99d2', lineWidth: 2},
                            ConnectionOverlays: [
                                ['Arrow', {location: 1, id: 'arrow', length: 10, foldback: 0.5, width: 10}],
                                ['Label', {label: '-', location: 0.5, id: 'label', cssClass: 'condition'}]
                            ],
                            Container: statDesk
                        });
                        self.constructor.unload(statJsp);

                        $.fancybox.showLoading();
                        vss.prop('disabled', true);
                        statDesk.find('.js_stats_notice').remove();
                        am.promiseCmd({
                            method: 'script.get_stats',
                            id: id,
                            ver: ver
                        }).always(function(){
                            busy = false;
                            $.fancybox.hideLoading();
                        }).done(function(res){
                            $('.js_editor .js_conversion_count').text(am.naturalize(res.script_stats.conversion));
                            $('.js_editor .js_passages_count').text(res.script_stats.runs_count);
                            self.constructor.addStepOpts.disableAll();
                            self.constructor.load(statJsp, res.node_stats, true);
                            self.constructor.addStepOpts.enableAll();
                            vss.empty();
                            $.each(res.versions, function(i, o) {
                                vss.append('<option value="'+o+'">'+o+'</option>');
                            });
                            if (res.versions.length > 1) {
                                vss.val(res.ver).prop('disabled', false);
                            }
                            var runsCount = am.naturalize(res.ver_stats.runs_count);
                            $.each(['runs_count', 'runs_with_unexpected_answer_count', 'runs_forcefully_interrupted_count',
                                'runs_achieved_goal_count'], function(i, o) {
                                var cnt = am.naturalize(res.ver_stats[o]);
                                var per = runsCount > 0 ? am.naturalize(Math.round(cnt / runsCount * 100)) : 0;
                                statBox.find('.stat_'+o).find('.count').text(cnt).end().find('.percent').text(per);
                            });
                            var workerList = statBox.find('.worker_list').empty();
                            $.each(res.worker_stats, function(i, o) {
                                workerList.append([
                                    '<div>'+o.name,
                                    ' = '+am.naturalize(o.runs_achieved_goal_count),
                                    '/'+am.naturalize(o.runs_count)+' звонков ',
                                    ' ('+am.naturalize(Math.round(o.conversion))+'%)',
                                    '</div>'
                                ].join(''));
                            });
                            if (typeof res.notice === 'string') {
                                statDesk.append('<div class="js_stats_notice">'+res.notice+'</div>');
                            }
                        });
                    });
                })();
                */

                $('.js_menu').click(function(){
                    var c = $(this);
                    $('.js_menu').not(c).removeClass('active');
                    c.addClass('active');
                });

                /**
                $(document).on('click', '.js_answer_remove', function() {
                    if (!confirm('Вы уверены?')) return;
                    var id = $(this).parents('.link').data('cid');
                    if (!id) return;
                    $.each(jsp.getConnections(), function(i, o) {
                        if ($(o.getOverlay('label').canvas).prop('id') === id) {
                            jsp.detach(o);
                            self.constructor.showStepLinks(self.constructor.selStep);
                        }
                    });
                });

                $(document).on('click', '.js_answer_forward', function(){
                    var cid = $(this).parents('.link').data('id');
                    var targetId;

                    $.each(jsp.getConnections(), function(i, o) {
                        if (o.id == cid) {
                            targetId = o.targetId;
                        }
                    });

                    if (targetId) {
                        var step = $('#' + targetId);
                        step.click();
                    }
                });
                */

                /**
                $(document).on('click', '.js_save_answer', function(){
                    var answerBox = $(this).parents('.link');
                    var connectionId = answerBox.data('id');
                    var targetId = $('#target' + connectionId).val();
                    var answerText = answerBox.find('.js_answer_label').val();
                    var newNodeText = answerBox.find('.js_answer_target').val();

                    var connection;
                    var newConnection;
                    var jl;

                    $.each(jsp.getConnections(), function(i, o){

                        if (o.id == connectionId) {
                            connection = o;
                        }
                    });

                    var sourceStep = self.constructor.selStep;

                    if (connection && !targetId && newNodeText) {

                        jsp.detach(connection);
                        var pos = sourceStep.position();
                        var freePos = self.constructor.getFreePos(pos.left+sourceStep.width()+100, pos.top+sourceStep.height()+100);
                        var s = self.constructor.addStep(jsp, {id: self.constructor.generateId(desk), is_goal: false,
                            is_starred: false, starred_text: '', title: newNodeText, text: '', left: freePos[0] - 40, top: freePos[1] - 29});
                        newConnection = jsp.connect({source: sourceStep, target: s});
                        jl = newConnection.getOverlay('label');
                        jl.setLabel(self.constructor.cutText(answerText, 100)+self.constructor.getLinkRemoveHtml());
                        $(jl.getElement()).data('text', answerText);

                        jsp.repaintEverything();
                        self.constructor.showStepLinks(sourceStep);
                    }
                    else if (connection && connection.targetId != targetId) {

                        var targetStep = $('#' + targetId);

                        jsp.detach(connection);
                        newConnection = jsp.connect({source: sourceStep, target: targetStep});

                        jl = newConnection.getOverlay('label');
                        jl.setLabel(self.constructor.cutText(answerText, 100)+self.constructor.getLinkRemoveHtml());
                        $(jl.getElement()).data('text', answerText);
                        self.constructor.showStepLinks(sourceStep);
                    }

                    $(this).parents('.panel-collapse').collapse('toggle');
                });
                */

                /**
                $('.js_add_answer').click(function() {
                    $(this).hide();
                    var form = $('.js_add_answer_form');
                    var d = $(jsp.getContainer());
                    var addAnswerInput = $('.js_target_add_answer');
                    addAnswerInput.val('');
                    form.find('.new_target_hint').hide();

                    var steps = [];
                    $.each(d.find('.step'), function(i, o) {
                        var s = $(o);
                        var text = (s.data('title')) ? s.data('title') : self.constructor.cutText(s.data('text'), 100);
                        steps.push({value: s.prop('id'), label: text.replace(/<\/?[^>]+>/gi, '')});
                    });

                    addAnswerInput.autocomplete({
                        source: steps,
                        select: function(event, ui) {

                            var input = $(this);
                            var hidden = input.parents('.target_box').find('.js_answer_target_hidden');

                            input.val(ui.item.label);
                            hidden.val(ui.item.value);
                            return false;
                        },
                        focus: function(event, ui) {
                            $(this).val(ui.item.label);
                            return false;
                        },
                        change: function() {
                            var input = $(this);
                            var hidden = input.parents('.target_box').find('.js_answer_target_hidden');
                            var box = input.parents('.target_box');
                            var hint = box.find('.new_target_hint');

                            if (!hidden.val() && $(this).val()) {
                                hint.find('b').text($(this).val());
                                hint.css('display', 'inline-block');
                            }
                            else {
                                hint.hide();
                            }
                        },
                        response: function(event, ui) {

                            var input = $(this);
                            var box = input.parents('.target_box');
                            var hidden = box.find('.js_answer_target_hidden');
                            hidden.val('');
                            var hint = box.find('.new_target_hint');

                            if (!ui.content.length) {
                                hint.find('b').text($(this).val());
                                hint.css('display', 'inline-block');
                            }
                            else {
                                hint.hide();
                            }
                        }
                    });

                    form.show(0, function() {
                        form.find('.js_answer_label').focus();
                        $('.js_edit').scrollTo(form.find('.js_add_answer_done'), 100);
                    });
                });
                */

                /**
                $('.js_add_answer_done').click(function(){
                    var form = $('.js_add_answer_form');
                    var answerText = form.find('textarea').val();
                    var targetId = $('#targetAddAnswer').val();
                    var newNodeText = form.find('.js_target_add_answer').val();

                    if (answerText && (targetId || newNodeText)) {

                        var sourceStep = self.constructor.selStep;
                        var newConnection;
                        var jl;

                        if (!targetId && newNodeText) {

                            var pos = sourceStep.position();
                            var freePos = self.constructor.getFreePos(pos.left+sourceStep.width()+100, pos.top+sourceStep.height()+100);
                            var s = self.constructor.addStep(jsp, {id: self.constructor.generateId(desk), is_goal: false,
                                is_starred: false, starred_text: '', title: newNodeText, text: '', left: freePos[0] - 40, top: freePos[1] - 29});
                            newConnection = jsp.connect({source: sourceStep, target: s});
                            jsp.repaintEverything();
                            jl = newConnection.getOverlay('label');
                            jl.setLabel(self.constructor.cutText(answerText, 100)+self.constructor.getLinkRemoveHtml());
                            $(jl.getElement()).data('text', answerText);
                            self.constructor.showStepLinks(sourceStep);
                        }
                        else {
                            var targetStep = $('#' + targetId);
                            newConnection = jsp.connect({source: sourceStep, target: targetStep});

                            jl = newConnection.getOverlay('label');
                            jl.setLabel(self.constructor.cutText(answerText, 100)+self.constructor.getLinkRemoveHtml());
                            $(jl.getElement()).data('text', answerText);
                            self.constructor.showStepLinks(sourceStep);
                        }

                        form.hide();
                        $('.js_add_answer').show();
                        form.find('textarea').val('');
                    }
                });

                $('.js_add_answer_form .close').click(function(){

                    $('.js_add_answer_form').hide();
                    $('.js_add_answer').show();
                });
                */

                am.on('constructor load done', function(){
                    am.trigger('constructor has no changes');
                }).on('constructor has no changes', function(){
                    $('.js_scripts_action_save').hide();
                    self.scripts.stopSaveButtonGlimmering();
                    $(window).unbind('beforeunload');
                }).on('constructor step moved', function(){
                    am.trigger('constructor has changes');
                }).on('constructor condition removed', function(){
                    am.trigger('constructor has changes');
                }).on('constructor condition added', function(){
                    am.trigger('constructor has changes');
                }).on('constructor step removed', function(){
                    am.trigger('constructor has changes');
                }).on('constructor step added', function(){
                    am.trigger('constructor has changes');
                }).on('constructor step is_goal changed', function(){
                    am.trigger('constructor has changes');
                }).on('constructor step is_starred changed', function(){
                    am.trigger('constructor has changes');
                }).on('constructor step task changed', function(){
                    am.trigger('constructor has changes');
                }).on('constructor step title changed', function(){
                    am.trigger('constructor has changes');
                }).on('constructor step text changed', function(){
                    am.trigger('constructor has changes');
                }).on('constructor condition text changed', function(){
                    am.trigger('constructor has changes');
                }).on('constructor has changes', function(){
                    if ($.inArray(self.role, ['ROLE_SCRIPT_WRITER', 'ROLE_ADMIN']) >= 0) {
                        $('.js_scripts_action_save').show();
                        self.scripts.startSaveButtonGlimmering();
                        $(window).bind('beforeunload', function(){
                            return 'Сделанные в конструкторе изменения не сохранены! Если вы покинете страницу, они будут утеряны. Чтобы сохранить изменения, нажмите на зеленую кнопку \"Сохранить изменения\".';
                        });
                    }
                });
            },
            initScriptsList: function(scripts) {
                var con = $('.js_scripts_list');
                var scriptList = $('.js_list_box .row');

                con.find('.js_show_script').remove();
                scriptList.find('.script__item').remove();

                if (self.isHs()) {
                    scriptList.append('<div class="col-md-2 script__item script__item-plus">' +
                        '<div class="panel panel-default">' +
                        '<div class="panel-body js_new_script">' +
                        'Добавить скрипт' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="col-md-2 script__item script__item-order">' +
                        '<div class="panel panel-default">' +
                        '<div class="panel-body js_order_script">' +
                        '<span>Заказать скрипт</span>' +
                        '</div>' +
                        '</div>' +
                        '</div>'
                    );
                } else  {
                    $.each(scripts, function(i, o) {
                        con.append([
                            '<li role="presentation">',
                            '	<a class="js_show_script" data-id="' + o.id + '" role="menuitem" tabindex="-1" href="#">' + o.title + '</a>',
                            '</li>'
                        ].join('\n'));

                        scriptList.append('<div class="col-md-2 script__item">' +
                            '<div class="panel panel-default js_show_script" data-id="' + o.id +'">' +
                            '<div class="panel-header">' +
                            '<h4>' + o.title + '</h4>' +
                            '</div>' +
                            '<div class="panel-body">' +
                            '<div class="clearfix"></div>' +
                            '<div class="script__item-stats">' +
                            '<div class="col-md-4" title="Проходы"><span class="glyphicon glyphicon-earphone"></span>' + (o.stats.passages_count ? o.stats.passages_count : 0) + '</div>' +
                            '<div class="col-md-4" title="Конверсия"><span class="glyphicon glyphicon-ok"></span>' + (o.stats.conversion_count ? o.stats.conversion_count : 0) + '%</div>' +
                            //'<div class="col-md-4" title="Доступ"><span class="glyphicon glyphicon-user"></span>' + 0 + '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>'
                        );
                    });
                }

                self.scripts.initShowScriptButtons();
            },
            initShowScriptButtons: function() {
                var boxel = $('.js_editor');
                if (!boxel.size()) return;

                var sclbel = $('.js_scripts_list_box');
                $('.js_show_script').click(function(e) {
                    e.preventDefault();

                    if (self.scripts.processed) return;
                    self.scripts.processed = true;

                    sclbel.find('.js_show_script').removeClass('active');
                    $('.js_show_script[data-id=' + $(this).data('id') + ']').addClass('active');

                    $.fancybox.showLoading();
                    am.promiseCmd({
                        method: 'script.load',
                        id: $(this).data('id')
                    }).always(function() {
                        $.fancybox.hideLoading();
                        self.scripts.processed = false;
                        $('.js_script_menu').show();
                        $('.sales-infos').css('display', 'inline-block');
                        $('.target').removeClass('hidden').show();
                        $('.script-buttons').show();
                        $('.js_editor').show();
                        $('.js_back_to_list').show();
                        $('.js_scripts_list_box_wrap').show();
                        $('.zoom-btns').show();
                    }).fail(function(res) {
                        console.log(res);
                    }).done(function(res) {
                        self.role = res.role;

                        $('.js_show_constructor').trigger('click');

                        boxel.data('id', res.script.id);
                        boxel.data('title', res.script.title);
                        boxel.data('target', res.script.target);

                        $('.js_script_target').val(res.script.target);
                        $('.target').removeClass('hidden');

                        am.cUrl.setAnchorParam('s', res.script.id);
                        if ('localStorage' in window && window['localStorage'] !== null) {
                            window.localStorage.setItem('current_script', res.script.id);
                        }

                        var sebel = $('.js_scripts_edit_box');
                        $('.js_selected_script_name').text(res.script.title);
                        $('.js_conversion_count').text(res.script.conversion_count);
                        boxel.find('.js_operators_count').text(res.script.operators_count);
                        $('.js_passages_count').text(res.script.passages_count);

                        sebel.find('.js_user_access_count').text(res.script.user_access_count);
                        sebel.show();

                        if (!jsp) self.constructor.init();
                        self.constructor.load(jsp, res.data);

                        self.scripts.initRights();

                        if (res.role === 'ROLE_SCRIPT_OPERATOR') {
                            $('.js_scripts_action_view').click();
                            $('.js_script_menu').hide();
                            $('.sales-infos').hide();
                            $('.target').addClass('hidden');
                            $('.script-buttons').hide();
                        }

                        var expires = new Date(new Date().getTime() + 3600 * 24 * 1000).toUTCString();
                        document.cookie = 'crnscrd=' + res.script.id + '; Expires=' + expires + '; Path=/';

                        am.trigger('constructor load done');
                    });
                });


                /**
                $('.js_show_script').click(function(e) {
                    e.preventDefault();

                    if (self.scripts.processed) return;
                    self.scripts.processed = true;

                    sclbel.find('.js_show_script').removeClass('active');
                    $('.js_show_script[data-id=' + $(this).data('id') + ']').addClass('active');

                    $.fancybox.showLoading();
                    am.promiseCmd({
                        method: 'scripts.load',
                        id: $(this).data('id')
                    }).always(function(){
                        $.fancybox.hideLoading();
                        self.scripts.processed = false;

                        $('.sales-infos').css('display', 'inline-block');
                        $('.js_editor').show();
                        $('.js_back_to_list').show();
                        $('.js_scripts_list_box_wrap').show();
                    }).done(function(res) {
                        console.dir(res);
                        var sebel = $('.js_scripts_edit_box');
                        console.dir(sebel.find('.js_selected_script_name'));
                        $('.js_selected_script_name').text(res.script.title);
                        sebel.show();
                    });
                })
                */
            },
            initRights: function() {
                if (self.role !== 'ROLE_SCRIPT_WRITER' && self.role !== 'ROLE_ADMIN') {
                    $('.js_show_constructor, .js_show_conversion, .js_show_access, .js_scripts_action_view, .js_show_integration').hide();
                    $('.js_scripts_action_save, .js_scripts_action_delete').hide();

                    $('.js_constructor_box').hide();
                    $('.js_view_box').show();

                    $('.sales-infos .sales-info').hide();
                } else {
                    $('.js_show_constructor, .js_show_conversion, .js_show_access, .js_scripts_action_view, .js_show_integration').show();
                    $('.js_scripts_action_save, .js_scripts_action_delete').show();

                    $('.js_constructor_box').show();
                    $('.js_view_box').hide();

                    $('.sales-infos .sales-info').show();

                    /**
                    app.get('access').done(function(access){
                        access.loadAccessUsers();
                    });
                    */
                }
            },
            initTabs: function() {
                var sebel = $('.js_scripts_edit_box');
                if (!sebel.size()) return;

                sebel.find('.js_show_box').click(function(e) {
                    e.preventDefault();

                    $('.js_settings_box').hide();

                    var box = $(this).data('box');

                    $('.js_box').hide();
                    $('.'+box).show();

                    am.trigger('tab selected', [box]);
                });
            }
        },
        constructor: {
            init: function() {
                var boxel = $('.js_editor');
                if (!boxel.size()) return;

                busy = false;
                self.busy = busy;

                edit = $('.js_edit');
                if (edit.length !== 1) return;
                self.edit = edit;

                desk = $('.js_desk');
                if (desk.length !== 1) return;
                self.desk = desk;

                jsp = jsPlumb.getInstance({
                    Endpoint: ['Dot', {radius: 2}],
                    HoverPaintStyle: {strokeStyle: '#2b99d2', lineWidth: 2},
                    ConnectionOverlays: [
                        ['Arrow', {location: 1, id: 'arrow', length: 10, foldback: 0.5, width: 10}],
                        ['Label', {label: '-', location: 0.5, id: 'label', cssClass: 'condition', events: {
                            click: function(o, e) {
                                //self.constructor.onStepSelected($(o.component.source), true);
                                //self.constructor.highlightCondition($(o.getElement()).prop('id'));
                            }
                        }}]
                    ],
                    Container: desk
                });

                self.constructor.jsp = jsp;

                /**
                jsp.bind('click', function(c) {
                    jsp.detach(c);
                    if (!self.constructor.selStep) return;
                    var s = self.constructor.selStep;
                    if (c.sourceId !== s.prop('id')) return;
                    self.constructor.showStepLinks(s);
                });

                jsp.bind('connectionDetached', function(info) {
                    am.trigger('constructor condition removed', [info.connection]);
                });

                jsp.bind('connection', function(info) {
                    am.trigger('constructor condition added', [info.connection]);
                    var jl = info.connection.getOverlay('label');
                    var l = $(jl.getElement());
                    l.data('jl', jl).data('text', self.constructor.addStepOpts.defaultCondition);
                    jl.setLabel(self.constructor.addStepOpts.defaultCondition+self.constructor.getLinkRemoveHtml());
                    if (!self.constructor.selStep) return;
                    var s = self.constructor.selStep;
                    if (info.sourceId !== s.prop('id')) return;
                    self.constructor.showStepLinks(s);
                });

                var step = 0.1;

                $('.js_zoom_plus').click(function(e){

                    e.preventDefault();
                    var c = $('.js_desk');
                    var zoom = 1;

                    var matrix = c.css('transform').match(/(-?[0-9\.]+)/g);
                    if (matrix) {
                        zoom = matrix[0];
                    }

                    c.css('transform', 'scale(' + (parseFloat(zoom) + step) + ')');
                    c.css('transform-origin', '0 0');

                    jsp.setZoom(zoom);

                    //if ($('.call_script_tour').is('.active')) {
                    //    $.app.scriptTour.highlightFirstUndoneGoal();
                    //}
                });

                $('.js_zoom_minus').click(function(e) {
                    e.preventDefault();
                    var c = $('.js_desk');
                    var zoom = 1;

                    var matrix = c.css('transform').match(/(-?[0-9\.]+)/g);
                    if (matrix) {
                        zoom = matrix[0];
                    }

                    c.css('transform', 'scale(' + (parseFloat(zoom) - step) + ')');
                    c.css('transform-origin', '0 0');

                    jsp.setZoom(zoom);

                    //if ($('.call_script_tour').is('.active')) {
                    //    $.app.scriptTour.highlightFirstUndoneGoal();
                    //}
                });

                $('.js_zoom_reset').click(function(e){
                    e.preventDefault();
                    var c = $('.js_desk');
                    c.css('zoom', 1);
                    c.css('transform', 'scale(1)');
                    c.css('transform-origin', '0 0');
                    jsp.setZoom(1);

                    //if ($('.call_script_tour').is('.active')) {
                    //    $.app.scriptTour.highlightFirstUndoneGoal();
                    //}
                });

                $('.auto-sidebar .title').on('click', function(){
                    $(this).parents('.auto-sidebar').addClass('auto-sidebar-open');
                    $(this).parents('.js_edit').find('.step-settings').hide();
                });

                $('.auto-sidebar .close').on('click', function(){
                    $(this).parents('.auto-sidebar').removeClass('auto-sidebar-open');
                    $(this).parents('.js_edit').find('.step-settings').show();
                });

                $('.js_show_add_amo_task').on('click', function(){
                    $('.add_amo_task_form').slideDown(100);
                });

                $('.js_add_amo_task').on('click', function(e){
                    e.preventDefault();

                    var step = self.constructor.selStep;
                    var tasks = step.data('tasks');
                    var box = $(this).parents('.add_amo_task_form');
                    var date = box.find('input[name=date]').val();
                    var content = box.find('textarea[name=content]').val();

                    tasks.push({date: date, content: content});
                    step.data('tasks', tasks);

                    step['addClass']('is_tasks');
                    am.trigger('constructor step task changed', [step]);
                    $('.add_amo_task_form').slideUp(100);

                    var taskBox = $('#step-tasks');
                    var html = '<li data-index="' + (tasks.length-1) + '">' +
                        '<p>' + content + '</p><small class="text-muted">' + date + ' дн.</small>' +
                        '<span class="close">&times;</span>' +
                        '</li>';
                    taskBox.append(html);
                });

                $('#step-tasks').on('click', 'li .close', function(){
                    var box = $(this).parents('li');
                    var index = box.data('index');
                    var step = self.constructor.selStep;
                    var tasks = step.data('tasks');

                    var newTasks = [];
                    $.each(tasks, function(i,t){
                        if (i != index) {
                            newTasks.push(t);
                        }
                    });

                    step.data('tasks', newTasks);
                    box.remove();

                    step[newTasks.length ? 'addClass' : 'removeClass']('is_tasks');
                    am.trigger('constructor step task changed', [step]);
                });
                */

                self.constructor.reset(jsp);

                /**
                $('.js_desk').click(function(e){
                    if ($(e.target).hasClass('js_desk')) self.constructor.onStepDeselected();
                });
                */
            },
            reset: function(j) {
                self.constructor.addStepOpts.enableAll();
                self.constructor.load(jsp, {"steps":[{"id": "start", "text":"Начало\nИнструкции оператору, что он должен говорить","left":301,"top":20}], "connections":[]});
            },
            save: function(j) {
                var d = $(j.getContainer());

                return {
                    target: d.data('target'),
                    desk: {width: d.width(), height: d.height()},
                    steps: d.find('.step').map(function(i, o) {
                        var s = $(o);
                        var id = s.prop('id');
                        if (!id) throw 'step has no id, impossible to save it';
                        var inp = s.data('inputs');
                        if (!$.isArray(inp)) inp = [];
                        var pos = s.position();
                        return {
                            id: id,
                            is_goal: s.data('is_goal'),
                            is_starred: s.data('is_starred'),
                            starred_text: s.data('starred_text'),
                            title: s.data('title'),
                            description: s.data('description'),
                            inputs: inp,
                            left: pos.left,
                            top: pos.top,
                            tasks: s.data('tasks')
                        };
                    }).get(),
                    connections: $.map(j.getConnections(), function(o) {
                        return {start_id: o.sourceId, finish_id: o.targetId, text: $(o.getOverlay('label').getElement()).data('text')};
                    })
                };
            },
            load: function(j, data, skipUnload) {
                if (!skipUnload) {
                    self.constructor.unload(j);
                }

                var d = $(j.getContainer());

                if (data.desk && data.desk.width && data.desk.height) {
                    d.width(data.desk.width);
                    d.height(data.desk.height);
                } else {
                    d.width(800);
                    d.height(600);
                }

                j.doWhileSuspended(function() {
                    if (!$.isArray(data.steps)) return;
                    $.each(data.steps, function(i, o){
                        self.constructor.addStep(j, o);
                    });

                    if (!$.isArray(data.connections)) return;
                    $.each(data.connections, function(i, o){
                        var c = j.connect({source: d.find('#' + o.start_id), target: d.find('#' + o.finish_id)});
                        var jl = c.getOverlay('label');
                        jl.setLabel(self.constructor.cutText(o.text, 100) + self.constructor.getLinkRemoveHtml());
                        $(jl.getElement()).data('text', o.text);
                    });
                });

                j.repaintEverything();
            },
            unload: function(j) {
                var d = $(j.getContainer());
                d.find('.step').each(function(i, o) {
                    j.remove($(o));
                });
                self.constructor.onStepDeselected();
            },
            onStepDeselected: function() {

            },
            addStepOpts: {
                noRemove: false,
                noAdd: false,
                noDrag: false,
                noLink: false,

                defaultCondition: 'Ответ',
                disableAll: function() {
                    self.constructor.addStepOpts.noRemove = true;
                    self.constructor.addStepOpts.noAdd = true;
                    self.constructor.addStepOpts.noDrag = true;
                    self.constructor.addStepOpts.noLink = true;
                    self.constructor.addStepOpts.defaultCondition = '';
                },
                enableAll: function() {
                    self.constructor.addStepOpts.noRemove = false;
                    self.constructor.addStepOpts.noAdd = false;
                    self.constructor.addStepOpts.noDrag = false;
                    self.constructor.addStepOpts.noLink = false;
                    self.constructor.addStepOpts.defaultCondition = 'Ответ';
                }
            },
            addStep: function(j, s) {
                var d = $(j.getContainer());
                var isTarget = false;

                var isStarred = false;
                if (s.is_target && (s.is_target === true || s.is_target === 'true' || s.is_target === 1 || s.is_target === '1')) {
                    isTarget = true;
                }

                if (s.is_starred && (s.is_starred === true || s.is_starred === 'true' || s.is_starred === 1 || s.is_starred === '1')) {
                    isStarred = true;
                }

                var isTasks = (s.tasks && s.tasks.length) ? true : false;

                d.append(
                    self.constructor.getStepHtml(
                        s.id, isTarget, isStarred, isTasks, s.title, s.text,
                        s.position_x, s.position_y, {
                            noRemove: s.id === 'start' || self.constructor.addStepOpts.noRemove,
                            noAdd: self.constructor.addStepOpts.noAdd,
                            noLink: self.constructor.addStepOpts.noLink,
                            stats: s.stats
                        }
                    )
                );

                var step = d.find('#'+s.id);
                step.data('tasks', (s.tasks) ? s.tasks : []);
                step.data('is_target', isTarget);

                step.data('is_starred', isStarred);
                step.data('starred_text', s.starred_text);
                step.data('title', s.title ? s.title : '');

                step.data('description', s.description ? s.description : '');
                step.data('inputs', $.isArray(s.inputs) ? s.inputs : []);

                if (!s.text) {
                    step.find('.no-text-error').show();
                } else {
                    step.find('.no-text-error').hide();
                }

                if (!self.constructor.addStepOpts.noDrag) {
                    j.draggable(step, {
                        containment: 'parent',
                        stop: function(ev, ui) {
                            am.trigger('constructor step moved', [step, ev, ui]);
                        }
                    });
                }

                j.makeTarget(step, {
                    dropOptions: {hoverClass: 'dragHover'},
                    anchor: 'Continuous',
                    allowLoopback: false
                });

                j.makeSource(step, {
                    filter: '.link_start',
                    anchor: 'Continuous',
                    connector: ['StateMachine', {curviness: 20}],
                    connectorStyle: {strokeStyle: '#5c96bc', lineWidth: 2, outlineColor: 'transparent', outlineWidth: 4}
                });

                return step;
            },
            getStepHtml: function(id, isTarget, isStarred, isTasks, title, text, left, top, opts) {
                var content = self.constructor.cutText(title ? title : (text ? text : ''));

                opts = $.extend({}, opts);
                stats = $.extend({}, opts.stats);

                var isOkStat = function(name) {
                    var s = stats[name];
                    return typeof s === 'number' || typeof s === 'string';
                };

                return [
                    '<div class="step'+(isTarget ? ' is_target' : '') + (isStarred ? ' is_starred' : '') + (isTasks ? ' is_tasks' : '') +'" id="'+id+'" style="left: '+left+'px; top: '+top+'px;">',
                    '   <div class="text">'+content+'</div>',
                    '   <div class="link_start" data-toggle="tooltip" data-placement="auto left" title="Потяните, чтобы соединить с другим узлом"'+(opts.noLink ? ' style="display: none;"' : '')+'></div>',
                    (opts.noRemove ? '' : '<div class="remove"><div class="remove_inner">удалить</div></div>'),
                    (opts.noAdd ? '' : '<div class="add_step"></div>'),
                    (isOkStat('end_with_unexpected_answer_count') && isOkStat('end_forcefully_interrupted_count') ? [
                        '<div class="stat_info">',
                        '	<span class="stat_unexpected_answer_color">'+am.naturalize(stats.end_with_unexpected_answer_count)+'%</span> / ',
                        '	<span class="stat_ended_by_client_color">'+am.naturalize(stats.end_forcefully_interrupted_count)+'%</span>',
                        '</div>'
                    ].join('\n') : ''),
                    '<div title="Не указан текст шага" class="no-text-error"><span class="glyphicon glyphicon-exclamation-sign"></span></div>',
                    '<div class="starred"><span class="is_starred glyphicon glyphicon-star"></span></div>',
                    '<div class="tasks"><span class="is_starred glyphicon glyphicon-play"></span></div>',
                    '</div>'
                ].join('\n');
            },
            getLinkRemoveHtml: function() {
                return '<div class="condition_remove"><div class="condition_remove_inner">удалить</div></div>';
            },
            cutText: function(text, lim) {
                lim = am.naturalize(lim);
                if (lim < 1) lim = 100;
                if (text.length > lim + 3) {
                    var cutObj = new CutString(text, lim);
                    text = cutObj.cut() + '...';
                }

                return text;
            }
        },
        init: function() {
            $('.js_back_to_list').click(function(e) {
                e.preventDefault();

                $('.js_box').hide();
                $('.js_list_box').show();
                $('.js_editor').hide();
                $('.js_scripts_list_box_wrap .target').hide();
                $('.sales-infos').hide();
                $('.js_selected_script_name').text('...');
                $('.script-buttons').hide();
                $(this).hide();
                $('.script_goal_highlight').hide();
                $('.js_scripts_list_box_wrap').hide();
                $('.limit_exceeded').hide();
                $('.js_settings_box').hide();

                am.cUrl.removeAnchorParam('s');
                if ('localStorage' in window && window['localStorage'] !== null) {
                    window.localStorage.setItem('current_script', null);
                }
            });

            self.scripts.init();
            self.view.init();

            // prevent backspace
            $(document).unbind('keydown').bind('keydown', function (event) {
                var doPrevent = false;
                if (event.keyCode === 8) {
                    var d = event.srcElement || event.target;
                    if ((d.tagName.toUpperCase() === 'INPUT' &&
                            (
                            d.type.toUpperCase() === 'TEXT' ||
                            d.type.toUpperCase() === 'PASSWORD' ||
                            d.type.toUpperCase() === 'FILE' ||
                            d.type.toUpperCase() === 'EMAIL' ||
                            d.type.toUpperCase() === 'SEARCH' ||
                            d.type.toUpperCase() === 'DATE' )
                        ) ||
                        d.tagName.toUpperCase() === 'TEXTAREA') {
                        doPrevent = d.readOnly || d.disabled;
                    }
                    else {
                        doPrevent = true;
                    }
                }

                if (doPrevent) {
                    event.preventDefault();
                }
            });
        }
    }
})();
