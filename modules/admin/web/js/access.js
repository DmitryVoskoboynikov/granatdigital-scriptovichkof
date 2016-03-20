var Access = (function() {
    return {
        init: function(id) {
            var url = 'access/init?id=' + id;

            var getting = $.get(url);

            getting.done(function (data) {
                if (data.status) {
                    $('div#ci-0').html(data.html);
                } else {
                    alert("Error while init accees panel");
                }
            });
        },

        initHandler: function() {
            this.initAccessForm();
            this.initAccessRemove();
        },

        initAccessRemove: function() {
            $('body').on('click', '.js_remove', function(event) {
                event.preventDefault();

                var user_id = $(this).data('user_id'),
                    script_id = $(this).data('script_id'),
                    url = '/admin/access/delete?uid=' + user_id + '&sid=' + script_id,
                    parent = $(this).parents('tr');

                var posting = $.post(url);

                posting.done(function(data) {
                    if (data.status == true) {
                        parent.hide();
                    } else if (data.status == false) {
                        alert('Error while add access to script.');
                    }
                });
            });
        },

        initAccessForm: function() {
             $('body').on('submit', 'form.js_access_form', function(event) {
                 console.log('add access rights');
                 event.preventDefault();

                 var form = $(this),
                     data = form.serialize(),
                     url  = form.attr('action');

                 var posting = $.post(url, data);

                 posting.done(function(data) {
                     if (data.status == true) {
                         $('.js_email_error').html('<span style="color: #339900;">' + data.message + '</span>');
                     } else if (data.status == false) {
                         $('.js_email_error').html('<span style="color: #F00;">' + data.message + '</span>');
                     } else {
                         alert('Error while add access to script.');
                     }
                 });
             });
        }
    }
}());

$(document).ready(function() {
    Access.initHandler();
});