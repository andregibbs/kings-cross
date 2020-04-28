import doLogFunction from '../dev/doLog';
var doLog = doLogFunction();
export default function loadingScreen(element, animation, callback, skip) {

  if (document.referrer.indexOf("explore/kings-cross") != -1 || skip) {
    animationDone();
  } else {
    var animation = lottie.loadAnimation({
      container: element,
      renderer: "svg",
      loop: false,
      autoplay: true,
      animationData: animation
    });

    animation.addEventListener("complete", animationDone);

    $('body').css({ 'height': '100%', 'overflow': 'hidden' })
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  function animationDone() {
    $("#parallax__orangex").addClass("animated fadeInRightBig");
    $("#parallax__building").addClass("animated fadeInRightBig");
    $("#parallax__yellowx").addClass("animated fadeInLeftBig");
    $("#parallax__purplex").addClass("animated fadeInLeftBig");
    $(".parallax__text").addClass("animated fadeIn");
    $(".loadingScreen").addClass("done");
    $('body').css({ 'height': '', 'overflow': '' })
    setTimeout(function () {
      $(".loadingScreen").hide();
      if (callback) {
        callback()
      }
    }, 400);
    setTimeout(function () {
      // $("#parallax__orangex").removeClass("animated fadeInRightBig");
      // $("#parallax__building").removeClass("animated fadeInRightBig");
      // $("#parallax__yellowx").removeClass("animated fadeInLeftBig");
      // $("#parallax__purplex").removeClass("animated fadeInLeftBig");
      // $(".parallax__text").removeClass("animated fadeIn");
    }, 1500);
  }
}
