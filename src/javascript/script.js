window.onload = function () {
  let coll = document.getElementsByClassName("collapsible");
  let i;

  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
      this.classList.toggle("active");
      let content = this.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
        content.style.paddingBottom = null;
        } else {
        content.style.maxHeight = "100%";
        content.style.paddingBottom = "20px";
      }
    });
  }
};
