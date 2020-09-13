$(document).ready(function() {
    const responsive = {
        0: {
            items: 1
        },
        320: {
            items: 1
        },
        560: {
            items: 2
        },
        960: {
            items: 3
        }
    };

    // Menu JS
    $nav = $(".nav");
    $toggleCollapse = $(".toggle-collapse");

    $toggleCollapse.click(function() {
        $nav.toggleClass("collapse");
    });

    // Carousel JS
    $(".owl-carousel").owlCarousel({
        loop: true,
        autoplay: false,
        autoplayHoverPause: true,
        autoplayTimeout: 3000,
        dots: false,
        nav: true,
        navText: [$('.owl-navigation .owl-nav-prev'), $('.owl-navigation .owl-nav-next')],
        responsive: responsive
    });

    // Move up button
    $(".move-up span").click(function() {
        $("html, body").animate({
            scrollTop: 0
        }, 1000);
    });

    // Animate on scroll
    AOS.init();
});