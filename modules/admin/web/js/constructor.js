var Constructor = (function() {
    return {
        init: function(id) {
            var url = 'constructor/init' + (id ? "?id=" + id : "");

            var getting = $.get(url);

            getting.done(function (data) {
                if (data.status) {
                    $('div#ci-0').html(data.html);

                    Desk.init();
                } else {
                    alert("Error while init constructor");
                }
            });
        },

        initHandlers: function() {
            this.initNewScriptForm();
            this.initCopyScriptForm();
            this.initDeleteScriptForm();
            this.initShowScript();
            this.initShowAccess();
            this.initShowConversion();
        },

        initShowScript: function() {
            $("body").on('click', '.dropdown-menu li a.js_show_script', function () {
                var id = $(this).data('id');

                Constructor.init(id);
            });

            $("body").on('click', '.js_show_constructor', function() {
                var id = $(this).data('id');

                Constructor.init(id);
            });
        },

        initShowAccess: function() {
            $("body").on('click', '.js_show_access', function() {
                var id = $(this).data('id');

                Access.init(id);
            });
        },

        initShowConversion: function() {
            $("body").on('click', '.js_show_conversion', function() {
                var id = $(this).data('id');

                Conversion.init(id);
            });
        },

        initNewScriptForm: function() {
            $("a#js_new_script").fancybox({
                'parent': 'div#ci-0',
                'afterLoad': function() {
                    $("form#js_form_create_script").submit(function(event) {
                        event.preventDefault();
                        event.stopPropagation();

                        var $form = $(this),
                            title = $form.find("input[name='Script[title]']").val(),
                            url = $form.attr("action");

                        $.ajax({
                            async: false,
                            method: "POST",
                            url: url,
                            data: {'Script[title]': title},
                        })
                        .done(function(data) {
                            if (data.status) {
                                Constructor.init(data.script_id);
                            } else {
                                alert("Error while creating new script");
                            }
                        });
                    });
                }
            });
        },

        initCopyScriptForm: function() {
            $("a#js_copy_script").fancybox({
                'parent': 'div#ci-0',
                'afterLoad': function() {
                    $("form#js_form_copy_script").submit(function(event) {
                        event.preventDefault();
                        event.stopPropagation();

                        var $form = $(this),
                            title = $form.find("input[name='Script[title]']").val(),
                            url = $form.attr("action");

                        $.ajaxSetup({async: false});
                        var posting = $.post(url, {'title': title});

                        posting.done(function(data) {
                            if (data.status) {
                                Constructor.init(data.script_id);
                            } else {
                                alert("Error while copy new script");
                            }
                        });
                    });
                },
            });
        },

        initDeleteScriptForm: function() {
            $("a#js_delete_script").fancybox({
                'parent': 'div#ci-0',
                'afterLoad': function() {
                    $("button#js_delete_cancel").click(function() {
                        $.fancybox.close();
                    });

                    $("form#js_form_delete_script").submit(function(event) {
                        event.preventDefault();
                        event.stopPropagation();

                        var $form = $(this),
                           id = $form.find("input[name='Script[id]']").val(),
                           url = $form.attr("action");

                        $.ajaxSetup({async: false});
                        var posting = $.post(url + '?id=' + id);

                        posting.done(function(data) {
                            if (data.status) {
                                Constructor.init();
                            } else {
                               alert("Error while deleting script");
                            }
                        });
                    });
                },
            });
        }
    }
}());

$(document).ready(function() {
    Constructor.init();
    Constructor.initHandlers();
});
