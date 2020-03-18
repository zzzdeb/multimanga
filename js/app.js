// document.querySelector('#status').innerHTML = String(offset) + String(height)
var Application = function() {
  this.currentChapter = 1;

  this.currentPage = 1
  if (Cookies.get('currentPage')) {
    this.currentPage = Number(Cookies.get('currentPage'))
  }

  this.dataroot = 'https://storage.googleapis.com/multimanga'

  this.json = "";
  this.pagesToShow = 1
  if (Cookies.get('pagesToShow')) {
    this.pagesToShow = Number(Cookies.get('pagesToShow'))
  }

  this.page_selector = $("select#page_select")[0]
  this.lang_selectors = $(".lang_select")
  this.lang = ['ja','en_color'];
  if (Cookies.get('lang')) {
    this.lang = Cookies.get('lang').split(',')
  }

  this.views = ['normal', 'flex'];
  this.view = 'flex'
  if (Cookies.get('view')) {
    this.view = Cookies.get('view')
  }
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
    if (array[i]) {
      img.src = array[i];
    } else {
      img.src = ''
    }
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
  Cookies.set('view', view)
}

Application.prototype.nextView = function() {
  for (var i = 0, len = this.views.length; i < len; i++) {
    if (this.view == this.views[i]) {
      this.changeView(this.views[(i+1)%len]);
      return 0;
    }
  }
}

Application.prototype.changeNumOfLanguages = function(num) {
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

  Cookies.set('currentPage', this.currentPage);


  page_option = this.page_selector.querySelector("option[value='"+this.currentPage+"']")
  if (page_option) {
    this.page_selector.selectedIndex = page_option.index
  }

  document.querySelector(".currentPage").innerHTML = this.currentPage;

  var preLoadList = []
  for (var imgi = 0; imgi < this.pagesToShow; imgi++){
    for (var i = 0, len = this.lang.length; i < len; i++) {
      let l = this.lang[i]
      if (this.json[l][this.currentPage]) {
        document.querySelector(".img_lang#img-"+imgi+'-'+i).src =
          this.dataroot+"/onepiece/" +
          this.lang[i] +
          "/" +
          this.json[l][this.currentPage+imgi];
      } else {
        document.querySelector(".img_lang#img-"+imgi+'-'+i).src = ''
      }
      for (var j = 0; j < 1; j++) {
        if (this.json[l][this.currentPage+j+1]) {
        preLoadList.push(
        this.dataroot+"/onepiece/" +
          this.lang[i] +
          "/" +
          this.json[this.lang[i]][this.currentPage + j + 1])
        }
      }
    }
  }

  // show lang
  // for (var i=0; i< this.lang_selectors.length; i++){
    // this.lang_selectors[i].selectedIndex = $("select#lang1_select > option[value="+this.lang[0]+"]")[0].index
  // }
  // $("select#lang2_select")[0].selectedIndex = $("select#lang2_select > option[value="+this.lang[1]+"]")[0].index
  // $("html, body").animate({ scrollTop: 0 });
};

Application.prototype.setLang = function(num, lang) {
  this.lang[num] = lang;
  this.drawNavbar();
  this.showCurrent();
};

Application.prototype.changePage = function(delta) {
  this.currentPage = parseInt(this.page_selector.options[this.page_selector.selectedIndex + parseInt(delta)].value)
  this.showCurrent();
};

Application.prototype.changePageTo = function(page) {
  this.currentPage = parseInt(page);
  this.showCurrent();
};

Application.prototype.nextPage = function() {
  var hard = false;
  if (!hard) {
    if (window.innerHeight + window.pageYOffset < document.body.scrollHeight) {
      window.scrollBy(0, window.innerHeight / 1.2);
      return;
    }
  }
  this.changePage(this.pagesToShow);
};

Application.prototype.prevPage = function() {
  var hard = false;
  if (!hard) {
    var d = document.documentElement;

    document.querySelector("#status").innerHTML = d.scrollTop;
    if (document.body.scrollTop + d.scrollTop > 0) {
      window.scrollBy(0, -window.innerHeight / 1.2);
      return;
    }
  }

  this.changePage(-this.pagesToShow);
};

Application.prototype.toggleLang = function() {
  var images = $('.img_lang');
  for (var i = 0, len = images.length; i < len; i++) {
    images[i].style.zIndex++;
    images[i].style.zIndex%= this.lang.length;
  }
};

Application.prototype.drawNavbar = function() {
    Cookies.set('lang', this.lang);
    this_orig = this;
    lang_select_bar = $("div#lang-select-bar")[0]
    lang_select_bar.innerHTML = ''

    // Number of languages
    lang_select_bar.innerHTML += '<strong>Number of languages:</strong>';
    sel = document.createElement('select');
    lang_select_bar.appendChild(sel)
    sel.setAttribute('class', 'num-of-languages');
    for (var i = 0, len = Object.keys(this.json).length; i < len; i++) {
      op = document.createElement('option')
      if (i < this.lang.length) {
        if (!this.lang[i]) {
          this.lang[i] = Object.keys(this.json)[i]
        }
      }

      if (i+1==this.lang.length) {
        op.setAttribute('selected', 'selected')
      }
      op.setAttribute('value', i+1)
      op.innerHTML = i+1
      sel.appendChild(op)
    }

    // Page options
    var i, j = 0;
    var options = "";

    for (i in this.json[this.lang[0]]) {
      if (this.json[this.lang[0]][i]) {
        options += '<option value = "' + i + '">';
        for (j in this.lang) {
           options += this.json[this.lang[j]][i] + ' - '
        }
        options += "</option>";
      }
    }
    this.page_selector.innerHTML = options;
    selected = this.page_selector.querySelector("option[value='"+this.currentPage+"']")
    if (!selected) {
      this.currentPage = parseInt(this.page_selector.options[0].value)
      selected = this.page_selector.querySelector("option[value='"+this.currentPage+"']")
    }
    selected.setAttribute('selected', 'selected')

    // Language select options
    options = ''
    for (i in this.json) {
      options += ('<option value = "' + i + '">' + i + "</option>");
    }

    for (var i = 0, len = this.lang.length; i < len; i++) {
      lang_select_bar.innerHTML += '<strong>Lang-'+(i+1)+':</strong>';
      var sel = document.createElement('select');
      sel.innerHTML = options;
      sel.setAttribute('class', 'lang_select');
      sel.setAttribute('name', 'lang'+(i+1));
      sel.setAttribute('index', i);
      sel.querySelector("option[value="+this.lang[i]+"]").setAttribute('selected', 'selected')
      // Action
      lang_select_bar.appendChild(sel);
    }
    this.lang_selectors = $(".lang_select")

    // Adding Images
    var img_show_div = $('#image-show-div')[0];
    img_show_div.innerHTML = ''
    for (var imgi = 0; imgi < this.pagesToShow; imgi++){
      var div = document.createElement('div');
      div.setAttribute('id', 'img-'+imgi);
      div.setAttribute('class', 'img-row');
      div.style.top = (2000*imgi)+'px';
      j = 0;
      img_show_div.appendChild(div);
      for (i in this.lang){
        var img = document.createElement('img');
        img.setAttribute('class', 'img_lang');
        img.setAttribute('id', 'img-'+imgi+'-'+j);
        img.setAttribute('src', '');
        img.style.zIndex = j
        div.appendChild(img);
        j++;
      }
    }
  this.showCurrent();
  this.loadShortcuts();
}

Application.prototype.setPagesToShow = function(num){
  this.pagesToShow = num
  Cookies.set('pagesToShow', num)
  this.drawNavbar();
}

Application.prototype.loadShortcuts = function(){
  var this_orig = this

  for (var i = 0; i < this.lang_selectors.length; i++) {
    let j = i;
    this.lang_selectors[j].onchange = function(e) {
      this_orig.setLang(j, this.value);
    };
  }

  $('.num-of-languages')[0].onchange = function(e) {
    for (var i = 0, len = this.value-this_orig.lang.length; i < len; i++) {
      this_orig.lang.push(null)
    }
    for (var i = 0, len = this_orig.lang.length - this.value; i < len; i++) {
      this_orig.lang.pop()
    }
    this_orig.drawNavbar();
    this_orig.showCurrent();
    this_orig.changeView();
  }

  this.page_selector.onchange = function(e){
    this_orig.changePageTo(this.selectedOptions[0].value)
  }

  $('.num-of-pages')[0].onchange = function(e){
    this_orig.setPagesToShow(this.value)
  }
}

Application.prototype.loadMetaData = function() {
  var this_orig = this;
  jQuery.getJSON("data/onepiece/con.json", function(json) {
    this_orig.json = json;
    this_orig.drawNavbar();
    this_orig.showCurrent();
    this_orig.changeView();
  });
}

