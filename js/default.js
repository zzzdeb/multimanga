$(document).ready(function() {
  // var url = 'http://reader.shurikenteam.com/m/DrStone/';
  // var chapter_num = '131';
  // var next_url = 'm/DrStone/131/02';
  // var prev_url = 'm/DrStone/131';

  $('select#page_select').change(function() {
    url += chapter_num + '/' + $(this).attr('value');
    $(location).attr('href', url);
  });

  $('select#chapter_select').change(function() {
    url += $(this).attr('value');
    $(location).attr('href', url);
  });
  $('input#img_next').click(function() {
    $(location).attr('href', next_url);
  });

  $('input#img_prev').click(function() {
    $(location).attr('href', prev_url);
  });

  $(window).keydown(function(event) {
    if (event.keyCode == '39') {
      $(location).attr('href', next_url);
    }
    if (event.keyCode == '37') {
      $(location).attr('href', prev_url);
    }
});

function img_fix() {
  if ($.cookie('img_fix') == 1) {
  var hh = window.innerHeight - 40;
  $('#img1').css('height', hh + 'px');
  } else {
  $('#img1').removeAttr('width')
    .removeAttr('height')
    .css({ width: '', height: '' });
  }
}
