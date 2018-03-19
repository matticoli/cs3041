$(document).ready(function () {
    $("[data-js-page]").on("touchend", function () {
        $(".button").css({
            "transform": ""
        });


        $("[data-js-button]").on("touchend", function () {
            var goal_menu = $(this).data("js-menu");
            $(this).css("transform", "translate(-200%)");
            $(".button[data-button='" + goal_menu + "']").css("transform", "translate(0%)");
        });

    });
});
