var app;

$(document).ready(function() {

  document.body.addEventListener('click', (function(e){
    console.log(window.innerWidth)
    console.log(e.pageX)
    console.log(window.pageXOffset)
  // $(".img-wrap").click(function(e) {
    var pWidth = window.innerWidth;
    var pOffset = window.pageXOffset;
    var x = e.pageX - pOffset;
    if (x > 2 * (pWidth / 3)) app.nextPage();
    else if (x < pWidth / 3) app.toggleLang();
    else app.prevPage();
  // });
  }), true);

  app = new Application();
  app.loadMetaData();

  // document.body.addEventListener('click', (function(){document.querySelector('#status').innerHTML = 'test'}), true);
});
