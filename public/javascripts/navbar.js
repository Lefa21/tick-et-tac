// When the user scrolls down 80px from the top of the document, resize the navbarno's padding and the logo's font size
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    document.getElementById("navbarno").style.padding = "30px 10px";
    document.getElementById("logo").style.fontSize = "25px";
  } else {
    document.getElementById("logo").style.fontSize = "35px";
    document.getElementById("navbarno").style.visibility = 'visible';
  }
} 