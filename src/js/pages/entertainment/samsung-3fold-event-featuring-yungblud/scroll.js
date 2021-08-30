/*
Class for scrolling effect: ons croll moves to the next section, appending classes to the section: current, prev and next, and making prev and next sections darker.
*/

const myPage = {
  // Scroll to the block
  scrollThere: function(targetElement, speed) {
    var _self = this;
    $("html, body")
      .stop()
      .animate(
        {
          scrollTop: targetElement.offset().top
        },
        {
          duration: speed,
          complete: function() {
            _self.setViewportClasses(); // On complete set viewport classes
          }
        }
      );
  },

  //Check if element is in the viewport
  isInViewport: function(element) {
    var _self = this;
    // check for the section which is the main currently
    var elementMiddle = element.offset().top + element.outerHeight() / 2;
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementMiddle > viewportTop && elementMiddle < viewportBottom;
  },

  // Set classes for the current element, prev and next
  setViewportClasses: function() {
    var _self = this;
    // add classes for main, prev and next sections
    $(".inView").removeClass("inView");
    $(".prev-inView").removeClass("prev-inView");
    $(".next-inView").removeClass("next-inView");
    $(".section").each(function(i, obj) {
      if (_self.isInViewport($(this))) {
        $(this).addClass("inView");
        if ($(this).prev())
          $(this)
            .prev()
            .addClass("prev-inView");
        if ($(this).next())
          $(this)
            .next()
            .addClass("next-inView");
        return false;
      }
    });

    // Make colors darker
    $(".inView").css("opacity", "1");
    $(".prev-inView").css("opacity", "0.3");
    $(".next-inView").css("opacity", "0.3");
  },

  initEvents: function() {
    var _self = this;
    $(window)
      .off()
      .on("wheel", function(e) {
        e.preventDefault;
        if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
          //scroll up
          if ($(".prev-inView").length > 0)
            _self.scrollThere($(".prev-inView"), 500);
        } else {
          //scroll down
          if ($(".next-inView").length > 0)
            _self.scrollThere($(".next-inView"), 500);
        }
      });
  },

  init: function() {
    var _self = this;
    _self.setViewportClasses();
    _self.initEvents();
  }
};

myPage.init();
