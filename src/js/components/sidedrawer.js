export default function sidedrawer() {
  const container = $j(".sidedrawer");

  // sub menu dropdowns
  // const mainCategoriesButtons = $j(container).find(
  //   ".sidedrawer__heading-button"
  // );
  // $j(mainCategoriesButtons).click(function () {
  //   $j(this).toggleClass("opened");
  //   if ($j(this).next().hasClass("opened")) {
  //     $j(this).next().removeClass("opened");
  //     $j(this).next().slideUp(350);
  //   } else {
  //     $j(this)
  //       .parent()
  //       .parent()
  //       .find(".sidedrawer__submenu")
  //       .removeClass("opened")
  //       .slideUp(350);
  //     $j(this).next().toggleClass("opened").slideToggle(350);
  //   }
  // });

  // mobile burger toggle
  const mobileBurgerMenu = $j(".navigation-mobile__item--toggle");
  $j(mobileBurgerMenu).click(function () {
    if ($j(".sidedrawer").hasClass("opened")) {
      $j(".sidedrawer").removeClass("opened");
      // $j("#content").css("margin-left", "0");
    } else {
      $j(".sidedrawer").addClass("opened");
      // $j("#content").css("margin-left", "260px");
    }
  });

}
