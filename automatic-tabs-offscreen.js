// Automatic Tabs – Off-Screen Edition
// Based on Refokus Automatic Tabs v1.0.0
// Modified: Timer starts immediately on page load instead of waiting for IntersectionObserver.
//
// Usage:
//   Add [r-automatic-tabs="10"] to your .w-tab-menu element (value = seconds)
//   Optional: add [pause-on-hover] attribute to pause on mouse hover
//   Optional: add [r-automatic-tabs-loop] to <body> to control looping

!function () {
  "use strict";
  var attr = "r-automatic-tabs";

  function switchTab(container) {
    var current = container.querySelector(":scope > .w--current");
    if (current && container) {
      var loop = document.body.getAttribute("r-automatic-tabs-loop");
      var next = current.nextElementSibling;
      if (next || loop && !parseInt(loop) || (next = container.firstChild), next) {
        var target = current.nextElementSibling || container.firstChild;
        target && target.click();
      }
    }
  }

  var containers = document.querySelectorAll("[" + attr + "]");
  var timers = {};

  containers.forEach(function (container, i) {
    var children = container.querySelectorAll(":scope > *");
    var delay = 1000 * Number(container.getAttribute(attr));
    var pauseOnHover = container.getAttribute("pause-on-hover");

    if (pauseOnHover) {
      container.addEventListener("mouseover", function () {
        clearTimeout(timers[i]);
      });
      container.addEventListener("mouseout", function () {
        timers[i] = setTimeout(function () { switchTab(container); }, delay);
      });
    }

    children.forEach(function (child) {
      child.addEventListener("click", function (e) {
        e.stopPropagation();
        if (!(pauseOnHover && container.matches(":hover"))) {
          clearTimeout(timers[i]);
          timers[i] = setTimeout(function () { switchTab(container); }, delay);
        }
      });
    });

    // Start timer immediately on page load (no IntersectionObserver)
    timers[i] = setTimeout(function () { switchTab(container); }, delay);
  });
}();
