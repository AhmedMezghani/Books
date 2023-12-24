$(document).ready(function () {
    var trigger = $('.hamburger'),
        wrapper = $('.navbar'),
        isClosed = false;

    trigger.click(function () {
        hamburger_cross();
    });

    function hamburger_cross() {

        if (isClosed == true) {
            trigger.removeClass('is-open');
            trigger.addClass('is-closed');
            
            isClosed = false;
        } else {
            trigger.removeClass('is-closed');
            trigger.addClass('is-open');
            

            isClosed = true;
        }
    }

});