export default function sidedrawer() {
  const container = $(".sidedrawer");
  // $(window).on("load scroll", function () {
  //   const topPosition = $(".nav").offset().top;
  //   $(container).css("top", `${topPosition}px`);
  // });
  const mainCategoriesButtons = $(container).find(
    ".sidedrawer__heading-button"
  );

  $(mainCategoriesButtons).click(function () {
    $(this).toggleClass("opened");
    if ($(this).next().hasClass("opened")) {
      $(this).next().removeClass("opened");
      $(this).next().slideUp(350);
    } else {
      $(this)
        .parent()
        .parent()
        .find(".sidedrawer__submenu")
        .removeClass("opened")
        .slideUp(350);
      $(this).next().toggleClass("opened").slideToggle(350);
    }
  });

  const mobileBurgerMenu = $(".navigation-mobile__item--toggle");
  $(mobileBurgerMenu).click(function () {
    if ($(".sidedrawer").hasClass("opened")) {
      $(".sidedrawer").removeClass("opened");
      $("#content").css("margin-left", "0");
    } else {
      $(".sidedrawer").addClass("opened");
      $("#content").css("margin-left", "260px");
    }
  });
}
