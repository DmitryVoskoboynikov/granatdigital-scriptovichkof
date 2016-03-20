var Desk = (function() {
    var jsp;
    return {
        init: function() {
            $(".js_desk")
                .css('transform', 'scale(' + this.getScriptContainerFormScale() + ')')
                .css('transform-origin', '0px 0px 0px');

            this.initStepsForms();
            this.initJPlumb();
            this.initAnswersForms();
            this.initBindConnection();
            this.initTooltip();
        },

        setProperDeskSize: function() {
            var map = Desk.getCircleMap(70);

            if (desk.width() < map.rightEdge + 100) desk.width(map.rightEdge + 100);
            if (desk.height() < map.bottomEdge + 100) desk.height(map.bottomEdge + 100);
        },

        getCircleMap: function(opts) {
            var ri = 0;

            if (typeof opts === 'number' && isFinite(opts)) ri = opts;

            opts = $.extend({}, opts);

            if (typeof opts.radiusIncrement === 'number' && isFinite(opts.radiusIncrement)) ri = opts.radiusIncrement;

            var rightEdge = 0, bottomEdge = 0;

            var map = desk.find('.step').map(function(i, o) {
                var s = $(o);
                var pos = s.position();
                var w = s.outerWidth();
                var h = s.outerHeight();
                var r = Math.ceil(Math.sqrt(w * w + h * h) / 2) + ri;
                var x = Math.round(pos.left + w / 2);
                var y = Math.round(pos.top + h /2);
                rightEdge = Math.max(rightEdge, x + r);
                bottomEdge = Math.max(bottomEdge, y + r);
                return {x: x, y: y, r: r};
            }).get();

            return {map: map, rightEdge: rightEdge, bottomEdge: bottomEdge};
        },

        getFreePos: function(x, y) {
            var map = Desk.getCircleMap(70);

            if (!Desk.hasMapCollisions(map.map, x, y)) return [x, y];

            for (var i = 0; i <= 50; i++) {
                var steps = Math.floor(i / 2) + 1;
                var dx = (- (i + 1) % 2 * (i % 2 - 1)) * 20;
                var dy = (i % 2 * ((i + 1) % 4 - 1)) * 20;
                for (var s = 0; s < steps; s++) {
                    x = x + dx;
                    y = y + dy;
                    if (!Desk.hasMapCollisions(map.map, x, y)) return [x, y];
                }
            }

            return [map.rightEdge, map.bottomEdge];
        },

        hasMapCollisions: function(map, x, y) {
            for (var i = 0; i < map.length; i++) {
                if (Desk.dist(x, y, map[i].x, map[i].y) < map[i].r) {
                    return true;
                }
            };

            return false;
        },

        dist: function(x1, y1, x2, y2) {
            var dxp = Math.pow(x1 - x2, 2);
            var dyp = Math.pow(y1 - y2, 2);

            return Math.sqrt(dxp + dyp);
        },

        getStepHtml: function(id, left, top, title, isGoal) {
            return [
                '<div class="step'+ (isGoal ? ' is_goal' : '') + '" id="' + id + '" style="left: ' + left + 'px; top: ' + top + 'px;">',
                '    <div class="text">' + (title ? title : '') + '</div>',
                '    <div class="link_start" data-toggle="tooltip" data-placement="auto left" title="Потяните, чтобы соеденить с другим узлом"></div>',
                '    <div class="remove"><div class="remove_inner">удалить</div></div>',
                '    <div class="add_step"></div>',
                '</div>'
            ].join('\n');
        },

        getStepFormHtml: function(id, left, top) {
            var csrfToken = $('meta[name="csrf-token"]').attr("content");
            var script_id =$('.js_desk').attr("script_id");

            return [
                '<form id="js_form_step_container_' + id +'" class="js_form_step_container" action="/admin/step/create" method="post">',
                '    <input type="hidden" value="' + csrfToken + '" name="_csrf"></input>',
                '    <input type="hidden" value="' + script_id + '" name="Step[script_id]"></input>',
                '    <input id="step-is_start" type="hidden" value="0" name="Step[is_start]"></input>',
                '    <input id="step-is_target" type="hidden" value="0" name="Step[is_target]"></input>',
                '    <input id="step-title" type="hidden" value="" name="Step[title]"></input>',
                '    <input id="step-description" type="hidden" value="" name="Step[description]"></input>',
                '    <input id="step-position_x" type="hidden" value="' + left + '" name="Step[position_x]"></input>',
                '    <input id="step-position_y" type="hidden" value="' + top + '" name="Step[position_y]"></input>',
                '</form>',
            ].join('\n');
        },

        getAnswerFormHtml: function(id, start_id, finish_id, text) {
            var csrfToken = $('meta[name="csrf-token"]').attr("content");
            var script_id = $('.js_desk').attr("script_id");
            var text = text ? text : 'Ответ';

            return [
                '<form id="js_form_answer_container_' + id + '" class="js_form_answer_container" action="/admin/answer/create" method="post">',
                '    <input type="hidden" value="' + csrfToken + '" name="_csrf"></input>',
                '    <input type="hidden" value="' + script_id + '" name="Answer[script_id]"></input>',
                '    <input id="answer-start_id" type="hidden" value="' + start_id + '" name="Answer[start_id]"></input>',
                '    <input id="answer-finish_id" type="hidden" value="' + finish_id + '" name="Answer[finish_id]"></input>',
                '    <input id="answer-text" type="hidden" value="' + text + '" name="Answer[text]"></input>',
                '</form>',
            ].join('\n');
        },

        getDeleteAnswerFormHtml: function(ai) {
            var csrfToken = $('meta[name="csrf-token"]').attr("content");

            return [
                '<form class="js_form_answer_container" action="/admin/answer/delete?id=' + ai + '">',
                '    <input type="hidden" value="' + csrfToken + '" name="_csrf"></input>',
                '</form>',
            ].join('\n');
        },

        getDeleteStepFormHtml: function(si) {
            var csrfToken = $('meta[name="csrf-token"]').attr("content");

            return [
                '<form class="js_form_step_container" action="/admin/step/delete?id=' + si + '">',
                '    <input type="hidden" value="' + csrfToken + '" name="_csrf"></input>',
                '</form>',
            ].join('\n');
        },

        updateStepPosition: function(event, ui) {
            var id = event.el.id.replace(/^s/, '');
            var pos = event.pos;
            var form = $("form#js_form_step_container_" + id);

            form.find("input#step-position_x").val(pos[0]);
            form.find("input#step-position_y").val(pos[1]);

            Desk.showScriptAction();
        },

        addStep: function(j, s) {
            var d = $(j.getContainer());

            d.append(Desk.getStepHtml(s.id, s.left, s.top));

            var step = d.find('#' + s.id);

            j.draggable(step, {
                containment: 'parent',
                stop: function(ev, ui) {
                    Desk.updateStepPosition(ev, ui);
                }
            });

            j.makeTarget(step, {
                dropOptions: { hoverClass: "dragHover" },
                anchor: "Continuous",
                allowLoopback: true
            });

            j.makeSource(step, {
                filter: ".link_start",
                anchor: "Continuous",
                connectorStyle: {strokeStyle: '#5c96bc', lineWidth: 2, outlineColor: 'transparent', outlineWidth: 4},
                connectionType:"basic",
                connector: ["StateMachine", {curviness: 20}],
            });

            return step;
        },

        addStepForm: function(s) {
            var c = $('#container_steps');

            c.append(Desk.getStepFormHtml(s.id, s.left, s.top));

            //imediatelly save new step, therefore grab new step id
            var form = $('form#js_form_step_container_' + s.id),
                data = form.serialize(),
                url  = form.attr('action');

            $.ajaxSetup({async: false});
            var posting = $.post(url, data);

            posting.done(function(res) {
                if (res.status) {
                    form.append('<input id="step-id" type="hidden" value="' + res.step_id + '" name="Step[id]"></input>');
                    form.attr('action', '/admin/step/update?id=' + res.step_id);
                } else {
                    alert("Error while creating step");
                }
            });
        },

        addAnswerForm: function (start_id, finish_id, text) {
            var c = $('#container_answers');
            var id = $("form[id^=js_form_answer_container_]").length + 1;

            c.append(Desk.getAnswerFormHtml(id, start_id, finish_id, text));

            //imediatelly save new step, therefore grab new step id
            var form = $('form#js_form_answer_container_' + id),
                data = form.serialize(),
                url  = form.attr('action');

            $.ajaxSetup({async: false});
            var posting = $.post(url, data);

            posting.done(function(res) {
                if (res.status) {
                    form.append('<input id="answer-id" type="hidden" value="' + res.answer_id + '" name="Answer[id]"></input>');
                    form.attr('action', '/admin/answer/update?id=' + res.answer_id);
                } else {
                    alert("Error while creating step");
                }
            });

            return form.find("input#answer-id").val();
        },

        addDeleteAnswerForm: function(ai) {
            var c = $('#container_answers');

            c.append(Desk.getDeleteAnswerFormHtml(ai));
        },

        addDeleteStepForm: function(si) {
            var c = $('#container_steps');

            c.append(Desk.getDeleteStepFormHtml(si));
        },

        getLinkRemoveHtml: function() {
            return "<div class='answer_remove'><div class='answer_remove_inner'>удалить</div></div>";
        },

        getScaleX: function(selector) {
            var el = document.querySelector(selector),
                scaleX = el.getBoundingClientRect().width / el.offsetWidth;

            return scaleX;
        },

        getScaleY: function(selector) {
            var el = document.querySelector(selector),
                scaleY = el.getBoundingClientRect().height / el.offsetHeight;

            return scaleY;
        },

        showScriptAction: function() {
            var element = 'a.js_script_action_save';

            if (!$(element).is(":visible")) {
                $(element).show();
            }
        },

        setScriptContainerFormScale: function(scale) {
            $("form.js_form_script_container input#script-scale").val(scale);
        },

        getScriptContainerFormScale: function() {
            return $("form.js_form_script_container input#script-scale").val();
        },

        setScriptContainerFormTarget: function(target) {
            $("form.js_form_script_container input#script-target").val(target);
        },

        initScaleHandler: function() {
            $("body").on('click', '.js_zoom_plus', function () {
                var scale = Desk.getScaleX('.js_desk') + 0.1;

                $(".js_desk")
                    .css('transform', 'scale(' + scale + ')');

                Desk.setScriptContainerFormScale(scale);
                Desk.showScriptAction();
            });

            $("body").on('click', '.js_zoom_reset', function() {
                var scale = 1.0;

                $(".js_desk")
                    .css('transform', 'scale(' + scale + ')');

                Desk.setScriptContainerFormScale(scale);
                Desk.showScriptAction();
            });

            $("body").on('click', '.js_zoom_minus', function() {
                var scale = Desk.getScaleX('.js_desk') - 0.1;

                $(".js_desk")
                    .css('transform', 'scale(' + scale +')');

                Desk.setScriptContainerFormScale(scale);
                Desk.showScriptAction();
            });
        },

        initChangeTarget: function() {
            $("body").on('keydown', 'input.js_script_target', function () {
                Desk.showScriptAction();
            });

            $("body").on('keyup', 'input.js_script_target', function() {
                var target = $(this).val();

                Desk.setScriptContainerFormTarget(target);
            });
        },

        initScriptSave: function() {
            $("body").on('click', 'a.js_script_action_save', function () {
                //update/delete steps
                $("form.js_form_step_container").each(function() {
                    var form = $(this),
                        data = form.serialize(),
                        url  = form.attr('action');

                    var posting = $.post(url, data);

                    posting.done(function(data) {
                        if (data.status) {
                            return;
                        } else {
                            alert(data.status);
                        }
                    });
                });

                //update/delete answers
                $("form.js_form_answer_container").each(function() {
                    var form = $(this),
                        data = form.serialize(),
                        url  = form.attr('action');

                    var posting = $.post(url, data);

                    posting.done(function(data) {
                        if (data.status) {
                            return;
                        } else {
                            alert(data.status);
                        }
                    });
                });

                //save script
                var form = $("form.js_form_script_container"),
                    data = form.serialize(),
                    url  = form.attr('action');

                var posting = $.post(url, data);

                posting.done(function(data) {
                    if (data.status) {
                        Constructor.init(data.script_id);
                    } else {
                        alert("Error while updating script");
                    }
                });
            });
        },

        initStepsForms: function() {
            $('.js_form_step_container').each(function() {
                var title = $(this).find('input:nth(4)').val(),
                    pos_x = $(this).find('input:nth(6)').val(),
                    pos_y = $(this).find('input:nth(7)').val();

                var id = $('.step').length + 1;
                var html = Desk.getStepHtml('s' + id, pos_x, pos_y, title);

                $('.js_desk').append(html);
            });
        },

        initAnswersForms: function() {
            $('.js_form_answer_container').each(function() {
                var id =$(this).find('input:nth(1)').val(),
                    start_id = $(this).find('input:nth(2)').val(),
                    finish_id = $(this).find('input:nth(3)').val(),
                    text = $(this).find('input:nth(4)').val();

                $('.js_form_step_container').each(function() {
                    var form = $(this);

                    if (form.find('input#step-id').val() == start_id) {
                        start_id = 's' + form.attr('id').replace(/js_form_step_container_/, '');
                    };

                    if (form.find('input#step-id').val() == finish_id) {
                        finish_id = 's' + form.attr('id').replace(/js_form_step_container_/, '');
                    };
                });

                var c = jsp.connect({source: start_id, target: finish_id, type: "basic"});
                var jl = c.getOverlay('label');
                jl.setLabel(text + Desk.getLinkRemoveHtml(id));

                jl.canvas.id = id;
                //console.dir(jl.canvas.id-s = 's');
            });
        },

        initBindConnection: function() {
            if (jsp) {
                //after initiating answers forms bind connect handlers
                jsp.bind('connection', function (info) {
                    var id = parseInt($(info.connection.getOverlay('label').canvas).prop('id'));

                    var source_form_id = 'js_form_step_container_' + info.sourceId.replace(/^s/, '');
                    var source_id = parseInt($('form#' + source_form_id + ' input#step-id').val());

                    var target_form_id = 'js_form_step_container_' + info.targetId.replace(/^s/, '');
                    var target_id = parseInt($('form#' + target_form_id + ' input#step-id').val());

                    var oldConnection = false;

                    $('.js_form_answer_container').each(function() {
                        var answer_id = parseInt($(this).find('input#answer-id').val());

                        if (id == answer_id) {
                            $(this).find('input#answer-start_id').val(source_id);
                            $(this).find('input#answer-finish_id').val(target_id);

                            oldConnection = true;
                        }
                    });

                    if (!oldConnection) {
                        var answer_id = Desk.addAnswerForm(source_id, target_id);

                        var jl = info.connection.getOverlay('label');

                        jl.setLabel('Ответ' + Desk.getLinkRemoveHtml());
                        jl.canvas.id = answer_id;
                    }

                    Desk.showScriptAction();
                });
            } else {
                console.log('jPlumb instance isn\'t defined.');
            }
        },

        initJPlumb: function() {
            jsPlumb.ready(function() {
                desk = $('.js_desk');

                jsp = jsPlumb.getInstance({
                    Endpoint: ["Dot", {radius: 2}],
                    Connector: "StateMachine",
                    HoverPaintStyle: {strokeStyle: "#2b99d2", lineWidth: 2},
                    ConnectionOverlays: [
                        ["Arrow", {location: 1, id: "arrow", length: 14, foldback: 0.5}],
                        ["Label", {label: "-", id: "label", cssClass: "answer"}]
                    ],
                    Container: desk
                });

                jsp.registerConnectionType("basic", {anchor: "Continuous", connector: "StateMachine"});

                var steps = jsPlumb.getSelector(".step");

                var initNode = function(el) {
                    jsp.draggable(el, {
                        containment: 'parent',
                        stop: function(ev, ui) {
                            Desk.updateStepPosition(ev, ui);
                        }
                    });

                    jsp.makeSource(el, {
                        filter: ".link_start",
                        anchor: "Continuous",
                        connectorStyle: {strokeStyle: '#5c96bc', lineWidth: 2, outlineColor: 'transparent', outlineWidth: 4},
                        connectionType:"basic",
                        connector: ["StateMachine", {curviness: 20}],
                    });

                    jsp.makeTarget(el, {
                        dropOptions: { hoverClass: "dragHover" },
                        anchor: "Continuous",
                        allowLoopback: true
                    });

                    jsp.fire("jsPlumbDemoNodeAdded", el);
                };

                jsp.batch(function() {
                    for (var i = 0; i < steps.length; i++) {
                        initNode(steps[i], true);
                    }
                });

                jsPlumb.fire("jsPlumbDemoLoaded", jsp);

                Desk.setProperDeskSize();

                // init custom handlers
                desk.on('click', '.answer_remove', function(e) {
                    var el = $(this);
                    var answer_id = $(this).parents('.answer').first().prop('id');

                    if (el.hasClass('act')) {
                        var id = el.parents('.answer').first().prop('id').trim();
                        if (!id) return;

                        $.each(jsp.getConnections(), function(i, o) {
                            if ($(o.getOverlay('label').canvas).prop('id') === id) {
                                jsp.detach(o);

                                Desk.addDeleteAnswerForm(answer_id);
                                Desk.showScriptAction();
                            }
                        });
                    } else {
                        el.addClass('act');
                        setTimeout(function(){
                            el.removeClass('act');
                        }, 1500);
                    }
                });

                desk.on('click', '.step .remove', function(e) {
                    e.stopPropagation();

                    var el = $(this);

                    if (el.hasClass('act')) {
                        var par = el.parents('.step').first();
                        jsp.remove(par);

                        var id = 'js_form_step_container_' + par.attr('id').replace(/^s/, '');
                        var form = $('#' + id);
                        var step_id = form.find('input#step-id').val();

                        $('.js_form_answer_container').each(function() {
                            var form = $(this),
                                id = form.find('input#answer-id').val();

                            if (form.find('input#answer-start_id').val() == step_id) {
                                Desk.addDeleteAnswerForm(id);
                            }

                            if (form.find('input#answer-finish_id').val() == step_id) {
                                Desk.addDeleteAnswerForm(id);
                            }
                        });

                        Desk.addDeleteStepForm(step_id);
                        Desk.showScriptAction();
                    } else {
                        el.addClass('act');
                        setTimeout(function(){
                            el.removeClass('act');
                        }, 1500);
                    }
                });

                desk.on('click', '.step .add_step', function(e) {
                    e.stopPropagation();

                    var par = $(this).parents('.step').first();
                    var pos = par.position();
                    var id = parseInt($(".step").last().prop('id').replace(/^s/, '')) + 1;
                    var freePos = Desk.getFreePos(pos.left + par.width() + 100, pos.top + par.height() + 100);

                    var s = Desk.addStep(jsp, {id: 's' + id, left: freePos[0] - 40, top: freePos[1] - 29});
                    Desk.addStepForm({id: id, left: freePos[0] - 40, top: freePos[1] - 29});

                    jsp.connect({source: par, target: s, type: "basic"});
                    jsp.repaintEverything();

                    Desk.setProperDeskSize();
                    Desk.showScriptAction();
                })
            });
        },

        initTooltip: function() {
            desk = $('.js_desk');
            desk.tooltip({
                selector: '[data-toggle="tooltip"]',
                delay: {show: 500, hide: 100},
                container: '.js_desk'
            });
        },

        initChangeStep: function() {
            $('body').on('click', '.step', function(event) {
                 event.stopPropagation();

                 var step = $(this),
                     id = step.attr('id').replace(/^s/, ''),
                     form_step_container_id = 'js_form_step_container_' + id,
                     form = $('#' + form_step_container_id),
                     is_target = form.find('input#step-is_target').val(),
                     title = form.find('input#step-title').val(),
                     description = form.find('input#step-description').val(),
                     step_settings_panel = $('.step-settings-panel');

                 if (is_target == true) {
                     $('#stepElementIsTarget').prop('checked', true);
                 } else {
                     $('#stepElementIsTarget').prop('checked', false);
                 }

                 $('#stepElementTitle').val(title);
                 $('#stepElementDescription').val(description);

                 if ($('.answer-settings-panel').is(":visible")) {
                     $('.answer-settings-panel').hide();
                 }

                 step_settings_panel
                     .show()
                     .attr('id', form_step_container_id);

            });

            $('body').on('click', '#stepElementIsTarget', function(event) {
                event.stopPropagation();

                var is_target = $(this),
                    form_step_container_id = is_target.parents('.step-settings-panel').first().attr('id'),
                    input = $('#' + form_step_container_id + ' input#step-is_target');

                if (is_target.is(':checked')) {
                    input.val(1);
                } else {
                    input.val(0);
                }

                Desk.showScriptAction();
            });

            $("body").on('keydown', '#stepElementTitle', function () {
                Desk.showScriptAction();
            });

            $("body").on('keyup', '#stepElementTitle', function() {
                var title = $(this),
                    form_step_container_id = title.parents('.step-settings-panel').first().attr('id'),
                    input = $('#' + form_step_container_id + ' input#step-title');

                input.val(title.val());
            });

            $("body").on('keydown', '#stepElementDescription', function() {
                Desk.showScriptAction();
            });

            $("body").on('keyup', '#stepElementDescription', function() {
                var text = $(this),
                    form_step_container_id = text.parents('.step-settings-panel').first().attr('id'),
                    input = $('#' + form_step_container_id + ' input#step-description');

                input.val(text.val());
            });

            $('body').on('click', '.js_desk', function() {
                $('.step-settings-panel').hide();
            });
        },

        initChangeAnswer: function() {
            $('body').on('click', '.answer', function(event) {
                event.stopPropagation();

                var answer = $(this),
                    answer_id = answer.attr('id'),
                    answer_settings_panel = $('.answer-settings-panel'),
                    form_answer_container_id = null;

                $('.js_form_answer_container').each(function() {
                    var form = $(this),
                        id = form.find('#answer-id').val();

                    if (id == answer_id) {
                        var text = form.find('#answer-text').val();
                        form_answer_container_id = form.attr('id');

                        $('#answerElementDescription').val(text);
                    }
                });

                if ($('.step-settings-panel').is(":visible")) {
                    $('.step-settings-panel').hide();
                }

                answer_settings_panel
                    .show()
                    .attr('id', form_answer_container_id);
            });

            $('body').on('click', '.js_desk', function() {
                $('.answer-settings-panel').hide();
            });

            $("body").on('keydown', '#answerElementDescription', function() {
                Desk.showScriptAction();
            });

            $("body").on('keyup', '#answerElementDescription', function() {
                var textarea = $(this),
                    form_answer_container_id = textarea.parents('.answer-settings-panel').first().attr('id'),
                    input = $('#' + form_answer_container_id + ' input#answer-text');

                input.val(textarea.val());
            });
        },

        initHandler: function() {
            this.initScaleHandler();
            this.initChangeTarget();
            this.initChangeStep();
            this.initChangeAnswer();
            this.initScriptSave();
        },
    }
}());

$(document).ready(function() {
    Desk.init();
    Desk.initHandler();
});
