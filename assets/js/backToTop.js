let btn = $('#btn-to-top');

$(window).scroll(function () {
  if ($(window).scrollTop() > 50) {
    btn.addClass('show');
  } else {
    btn.removeClass('show');
  }
});

btn.on('click', function (top) {
  top.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
