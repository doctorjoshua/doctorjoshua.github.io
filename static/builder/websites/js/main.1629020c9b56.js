(function($) {
  "use strict";

    // collapse the navbar after it was clicked
    $('.navbar-nav>li>a').on('click', function(){
        $('.navbar-collapse').collapse('hide');
    });

    // -- Back Top Link -----------------------------------------------
    var offset = 200;
    var duration = 500;
    $(window).scroll(function() {
      if ($(this).scrollTop() > offset) {
        $('.back-to-top').fadeIn(400);
      } else {
        $('.back-to-top').fadeOut(400);
      }
    });
    $('.back-to-top').on('click', function(event) {
      event.preventDefault();
      $('html, body').animate({
        scrollTop: 0
      }, 600);
      return false;
    })

    // -- Subcategories -----------------------------------------------
    $('.dropdown-subcategory').on("click", function(e) {
        $(this).next('.subcategory-menu').toggle();
        e.stopPropagation();
    });

}(jQuery));


/*
   Collapse the top menu if too wide (https://www.codeply.com/go/IETSah3bFG)
   ========================================================================== */
var autocollapse = function (menu, maxHeight) {
    // do not collapse on small screen sizes, this is handled by the bootstrap hamburger
    const width = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
    )
    if (width >= 960) {  // width is bootstrap large or more

        var nav = $(menu);
        var navHeight = nav.innerHeight();

        if (navHeight >= maxHeight) {
            $(menu + ' .dropdown').removeClass('d-none');
            while (navHeight > maxHeight) {
                //  add child to dropdown
                var children = nav.children(menu + ' li:not(:last-child)');
                var count = children.length;
                $(children[count - 1]).prependTo(menu + ' .dropdown-menu');
                navHeight = nav.innerHeight();
            }
        } else {
            var collapsed = $(menu + ' .dropdown-menu').children(menu + ' li');
            if (collapsed.length === 0) {
              $(menu + ' .dropdown').addClass('d-none');
            }
            while (navHeight < maxHeight && (nav.children(menu + ' li').length > 0) && collapsed.length > 0) {
                //  remove child from dropdown
                collapsed = $(menu + ' .dropdown-menu').children('li');
                $(collapsed[0]).insertBefore(nav.children(menu + ' li:last-child'));
                navHeight = nav.innerHeight();
            }
            if (navHeight > maxHeight) { 
                autocollapse(menu,maxHeight);
            }
        }
    }
};

/* 
   Ckeditor adds the style to a parent figure, move it to the img
   ========================================================================== */
var addWidthToImages = function() {
    $('figure.image_resized[style]').each(function () {
        $(this).children("img").attr("style", $(this).attr("style"));
        $(this).removeAttr("style");
    })
};


/* 
   Document ready
   ========================================================================== */
$(document).ready(function() {
    // add the width of the resized images
    addWidthToImages();

    // when the page loads
    autocollapse('#main-navbar-ul', 50);
    // when the window is resized
    $(window).on('resize', function () {
        autocollapse('#main-navbar-ul', 50);
    });
});