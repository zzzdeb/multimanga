var app

$(document).ready(function() {
    app = new Application();
    app.currentPage = document.cookie;
    app.showCurrent()
  
  document.body.addEventListener('click', (function(){document.querySelector('#status').innerHTML = 'test'}), true);

  $(".img-wrap").click(function(e){
     var pWidth = $(this).innerWidth(); //use .outerWidth() if you want borders
     var pOffset = $(this).offset(); 
     var x = e.pageX - pOffset.left;
      if( x > 2*(pWidth/3))
          app.nextPage()
      else if(x < pWidth/3)
          app.toggleLang()
      else
          app.prevPage()
  });
});

