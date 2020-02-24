// document.querySelector('#status').innerHTML = String(offset) + String(height)
var Application = function() {
  this.currentChapter = 1;
  this.currentPage = 1;
  this.json = "";

  this.page_selector = $("select#page_select")[0]
  this.lang_selectors = $(".lang_select")
  this.lang = ['',''];
  this.views = ['normal', 'flex'];
  this.view = 'normal'


  var this_orig = this;

  jQuery.getJSON("data/onepiece/con.json", function(json) {
    this_orig.json = json;


    lang_select_bar = $("div#lang-select-bar")[0]

    // Number of languages
    lang_select_bar.innerHTML += '<strong>Number of languages:</strong>';
    sel = document.createElement('select');
    lang_select_bar.appendChild(sel)
    sel.setAttribute('class', 'num-of-languages');
    for (var i = 0, len = Object.keys(json).length; i < len; i++) {
      op = document.createElement('option')
      if (i < this_orig.lang.length) {
        this_orig.lang[i] = Object.keys(json)[i]
      }
      
      if (i+1==this_orig.lang.length) {
        op.setAttribute('selected', 'selected')
      }
      op.setAttribute('value', i+1)
      op.innerHTML = i+1
      sel.appendChild(op)
    }

    // Page options
    var i, j = 0;
    var options = "";

    for (i in json[this_orig.lang[0]]) {
      options += ('<option value = "' + i + '">' + json[this_orig.lang[0]][i] + "</option>");
    }
    this_orig.page_selector.innerHTML = options;
    this_orig.page_selector.querySelector("option[value='"+this_orig.currentPage+"']").setAttribute('selected', 'selected')

    // Language select options
    options = ''
    for (i in json) {
      options += ('<option value = "' + i + '">' + i + "</option>");
    }

    for (var i = 0, len = this_orig.lang.length; i < len; i++) {
      lang_select_bar.innerHTML += '<strong>Lang-'+(i+1)+':</strong>';
      sel = document.createElement('select');
      sel.innerHTML = options;
      sel.setAttribute('class', 'lang_select');
      sel.setAttribute('name', 'lang'+(i+1));
      lang_select_bar.appendChild(sel);
      sel.querySelector("option[value="+this_orig.lang[i]+"]").setAttribute('selected', 'selected')
    }
    this_orig.lang_selectors = $(".lang_select")

    j = 0;
    // Adding Images
    var img_show_div = $('#image-show-div')[0];
    img_show_div.innerHTML = ''
    for (i in this_orig.lang){
      var img = document.createElement('img');
      img.setAttribute('class', 'img_lang');
      img.setAttribute('id', 'img-'+j);
      img.setAttribute('src', '');
      img.style.zIndex = j
      img_show_div.appendChild(img);
      j++;
    }
  });

};


function preloadImages(array) {
  if (!preloadImages.list) {
    preloadImages.list = [];
  }
  var list = preloadImages.list;
  for (var i = 0; i < array.length; i++) {
    var img = new Image();
    img.onload = function() {
      var index = list.indexOf(this);
      if (index !== -1) {
        // remove image from the array once it's loaded
        // for memory consumption reasons
        list.splice(index, 1);
      }
    };
    list.push(img);
    img.src = array[i];
  }
}

Application.prototype.changeView = function(view) {
  var img_show_div = $('#image-show-div')[0];
  var images = $('.img_lang');
  if (view == 'normal') {
    for (var i = 0, len = images.length; i < len; i++) {
      var s = images[i].style;
      s.position = 'absolute';
      s.top = '0';
      s.left = '50%';
      s.transform = 'translate(-50%, 0)';
    }
    img_show_div.style.display = 'block';
    img_show_div.style.flexFlow = 'row wrap';
    img_show_div.style.justifyContent = 'center';
    this.view = view;
  } else if (view == 'flex'){
    for (var i = 0, len = images.length; i < len; i++) {
      var s = images[i].style;
      s.position = 'relative'
      s.left = '0';
      s.transform = 'translate(0, 0)';
    }
    img_show_div.style.display = 'flex';
    img_show_div.style.flexFlow = 'row wrap';
    img_show_div.style.justifyContent = 'center';
    this.view = view;
  }

}

Application.prototype.nextView = function() {
  for (var i = 0, len = this.views.length; i < len; i++) {
    if (this.view == this.views[i]) {
      this.changeView(this.views[(i+1)%len]);
      return 0;
    }
  }
}
Application.prototype.showCurrent = function() {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  document.cookie = this.currentPage;

  page_option = this.page_selector.querySelector("option[value='"+this.currentPage+"']")
  if (page_option) {
    this.page_selector.selectedIndex = page_option.index
  }

  document.querySelector(".currentPage").innerHTML = this.currentPage;

  for (var i = 0, len = this.lang.length; i < len; i++) {
    let l = this.lang[i]
    if (this.json[l][String(this.currentPage)]) {
      document.querySelector(".img_lang#img-"+i).src =
        "data/onepiece/" +
        this.lang[i] +
        "/" +
        this.json[l][String(this.currentPage)];
    } else {
      document.querySelector(".img_lang#img-"+i).src =''
    }
  }

  preloadImages([
    "data/onepiece/" +
      this.lang[0] +
      "/" +
      this.json[this.lang[0]][String(this.currentPage + 1)],
    "data/onepiece/" +
      this.lang[1] +
      "/" +
      this.json[this.lang[1]][String(this.currentPage + 1)]
  ]);
  
  // show lang
  // for (var i=0; i< this.lang_selectors.length; i++){
    // this.lang_selectors[i].selectedIndex = $("select#lang1_select > option[value="+this.lang[0]+"]")[0].index
  // }
  // $("select#lang2_select")[0].selectedIndex = $("select#lang2_select > option[value="+this.lang[1]+"]")[0].index
  // $("html, body").animate({ scrollTop: 0 });
};

Application.prototype.setLang = function(num, lang) {
  app.lang[num] = lang;
  app.showCurrent();
};

Application.prototype.changePage = function(delta) {
  app.currentPage = parseInt(app.currentPage) + parseInt(delta);
  app.showCurrent();
};

Application.prototype.changePageTo = function(page) {
  app.currentPage = parseInt(page);
  app.showCurrent();
};

Application.prototype.nextPage = function() {
  var hard = false;
  if (!hard) {
    if (window.innerHeight + window.pageYOffset < document.body.offsetHeight) {
      window.scrollBy(0, window.innerHeight / 1.2);
      return;
    }
  }
  app.changePage(1);
};

Application.prototype.prevPage = function() {
  var hard = false;
  if (!hard) {
    var d = document.documentElement;

    document.querySelector("#status").innerHTML = d.scrollTop;
    if (document.body.scrollTop + d.scrollTop > 0) {
      window.scrollBy(0, -window.innerHeight / 1.5);
      return;
    }
  }

  app.changePage(-1);
};

Application.prototype.toggleLang = function() {
  var images = $('.img_lang');
  for (var i = 0, len = images.length; i < len; i++) {
    images[i].style.zIndex++;
    images[i].style.zIndex%= len;
  }
};

