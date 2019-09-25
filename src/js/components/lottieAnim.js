import doLogFunction from '../dev/doLog';
var doLog = doLogFunction();
export default function lottieAnim(element, animation) {
  doLog("called");
  // if(!document.referrer){
  //   console.log("OK?");
  //   animationDone();
  //   return;
  // } else {
  //   console.log("document referrer exists");
  //   console.log(document.referrer);
  // }

  if (document.referrer.indexOf("explore/kings-cross") != -1) {
    
    //Specific for Loading
    if (element === 'loadingScreen__animation') {      
      animationDone();
    }
    
    
  } else {
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
      $('body').css({ 'height': '100%', 'overflow': 'hidden' })
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }        
  }
 
  function animationDone() {
    console.log('element is', element)
    $("#parallax__orangex").addClass("animated fadeInRightBig");
    $("#parallax__building").addClass("animated fadeInRightBig");
    $("#parallax__yellowx").addClass("animated fadeInLeftBig");
    $("#parallax__purplex").addClass("animated fadeInLeftBig");
    $(".parallax__text").addClass("animated fadeIn");
    $(".loadingScreen").addClass("done");
    $('body').css({ 'height': '', 'overflow': '' })
    setTimeout(function () {
      $(".loadingScreen").hide();
    }, 400);
    setTimeout(function () {
      $("#parallax__orangex").removeClass("animated fadeInRightBig");
      $("#parallax__building").removeClass("animated fadeInRightBig");
      $("#parallax__yellowx").removeClass("animated fadeInLeftBig");
      $("#parallax__purplex").removeClass("animated fadeInLeftBig");
      $(".parallax__text").removeClass("animated fadeIn");
    }, 1500);
  }
}
