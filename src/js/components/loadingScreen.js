export default function loadingScreen(element, animation) {
    
    var animation = lottie.loadAnimation({
    container: element,
    renderer: 'svg',
    loop: false,
    autoplay: true,
    animationData: animation
  });

  animation.addEventListener('complete', animationDone);

  function animationDone() {
    $('.loadingScreen').addClass('done');
    setTimeout(function () {
        $('.loadingScreen').hide();
    
        }, 400);
  }

}