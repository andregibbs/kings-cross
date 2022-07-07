import doLogFunction from '../dev/doLog';
var doLog = doLogFunction();
export default function lottieAnim(element, animation) {

 
     var container = document.getElementById(element);
    var animation = lottie.loadAnimation({
      container: container,
      renderer: "svg",
      loop: false,
      autoplay: true,
      animationData: animation
    });

    //Specific for Loading
    if (element === 'loadingScreen__animation') {
      animation.addEventListener("complete", animationDone);
      $j('body').css({ 'height': '100%', 'overflow': 'hidden' })
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }        
  }
 
  function animationDone() {
    console.log('element is', element)
    $j("#parallax__orangex").addClass("animated fadeInRightBig");
    $j("#parallax__building").addClass("animated fadeInRightBig");
    $j("#parallax__yellowx").addClass("animated fadeInLeftBig");
    $j("#parallax__purplex").addClass("animated fadeInLeftBig");
    $j(".parallax__text").addClass("animated fadeIn");
    $j(".loadingScreen").addClass("done");
    $j('body').css({ 'height': '', 'overflow': '' })
    setTimeout(function () {
      $j(".loadingScreen").hide();
    }, 400);
    setTimeout(function () {
      $j("#parallax__orangex").removeClass("animated fadeInRightBig");
      $j("#parallax__building").removeClass("animated fadeInRightBig");
      $j("#parallax__yellowx").removeClass("animated fadeInLeftBig");
      $j("#parallax__purplex").removeClass("animated fadeInLeftBig");
      $j(".parallax__text").removeClass("animated fadeIn");
    }, 1500);
  }

