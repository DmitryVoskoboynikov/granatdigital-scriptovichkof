var DeskConversion = (function() {
    var jsp;
    return {
        init: function() {
            $(".js_desk")
                .css('transform', 'scale(' + this.getScriptContainerFormScale() + ')')
                .css('transform-origin', '0px 0px 0px');

            this.initStepsForms();
            this.initJPlumb();
            this.initAnswersForms();
        },

        setProperDeskSize: function() {
            var map = DeskConversion.getCircleMap(70);

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

        getStepHtml: function(id, left, top, title, isGoal, stats) {
            var isOkStat = function(name) {
                var s = stats[name];
                return typeof s === 'number' || typeof s === 'string';
            };

            return [
                '<div class="step'+ (isGoal ? ' is_goal' : '') + '" id="' + id + '" style="left: ' + left + 'px; top: ' + top + 'px;">',
                '    <div class="text">' + (title ? title : '') + '</div>',
                (isOkStat('end_with_unexpected_answer_count') && isOkStat('end_forcefully_interrupted_count') ? [
                    '<div class="stat_info">',
                    '	<span class="stat_unexpected_answer_color">'+stats.end_with_unexpected_answer_count+'%</span> / ',
                    '	<span class="stat_ended_by_client_color">'+stats.end_forcefully_interrupted_count+'%</span>',
                    '</div>'
                ].join('\n') : ''),
                '</div>'
            ].join('\n');
        },

        getScriptContainerFormScale: function() {
            return $("form.js_form_script_container input#script-scale").val();
        },

        initStepsForms: function() {
            $('.js_form_step_container').each(function() {
                var title = $(this).find('input:nth(4)').val(),
                    pos_x = $(this).find('input:nth(6)').val(),
                    pos_y = $(this).find('input:nth(7)').val(),
                    end_with_unexpected_answer_count = $(this).find('input:nth(8)').val(),
                    end_forcefully_interrupted_count = $(this).find('input:nth(9)').val();

                var stats = {
                    end_with_unexpected_answer_count: end_with_unexpected_answer_count,
                    end_forcefully_interrupted_count: end_forcefully_interrupted_count
                };

                var id = $('.step').length + 1;
                var html = DeskConversion.getStepHtml('s' + id, pos_x, pos_y, title, false, stats);

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
                jl.setLabel(text);
            });
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

                DeskConversion.setProperDeskSize();
            });
        },
    }
}());
