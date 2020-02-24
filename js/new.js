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
  app.currentPage = document.cookie;

  app.page_selector.onchange = function(e){
    app.changePageTo(app.page_selector.selectedIndex)
  }
  // app.page_selector.addEventListener('change', (event)=> {
    // console.log(event)
    // this.prototype.changePageTo(this.page_selector.selectedIndex)
  // })

  for (var i = 0; i < app.lang_selectors.length; i++) {
    let j = i;
    app.lang_selectors[j].onchange = function(e) {
      app.setLang(j, this.value);
    };
  }

  app.showCurrent();
  app.changeView();
  // document.body.addEventListener('click', (function(){document.querySelector('#status').innerHTML = 'test'}), true);

});
