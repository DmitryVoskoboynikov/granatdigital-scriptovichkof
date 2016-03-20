var Conversion = (function() {
    return {
        init: function(id) {
            var url = 'conversion/init?id=' + id;

            var getting = $.get(url);

            getting.done(function (data) {
                if (data.status) {
                    $('div#ci-0').html(data.html);

                    DeskConversion.init();
                } else {
                    alert("Error while init accees panel");
                }
            });
        },

        initHandler: function() {
            this.initConversionForm();
        },

        initConversionForm: function() {

        }
    }
}());

$(document).ready(function() {
    Conversion.initHandler();
});