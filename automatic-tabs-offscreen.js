// Automatic Tabs – Off-Screen Edition
// Based on Refokus Automatic Tabs v1.0.0
// Modified: Timer starts immediately on page load instead of waiting for IntersectionObserver.
//           On mobile (touch-primary) devices, tab switching is skipped when the container
//           is not visible in the viewport, preventing auto-scroll to off-screen elements on click.
//
// Usage:
//   Add [r-automatic-tabs="10"] to your .w-tab-menu element (value = seconds)
//   Optional: add [pause-on-hover] attribute to pause on mouse hover
//   Optional: add [r-automatic-tabs-loop] to <body> to control looping

!function () {
  "use strict";
  var attr = "r-automatic-tabs";
  var isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

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
  var visible = {};

  containers.forEach(function (container, i) {
    var children = container.querySelectorAll(":scope > *");
    var delay = 1000 * Number(container.getAttribute(attr));
    var pauseOnHover = container.getAttribute("pause-on-hover");

    if (isMobile) {
      // Assume visible until the observer says otherwise
      visible[i] = true;

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          visible[i] = entry.isIntersecting;
        });
      });
      observer.observe(container);
    }

    function canSwitch() {
      return !isMobile || visible[i];
    }

    if (pauseOnHover) {
      container.addEventListener("mouseover", function () {
        clearTimeout(timers[i]);
      });
      container.addEventListener("mouseout", function () {
        timers[i] = setTimeout(function () {
          if (canSwitch()) switchTab(container);
        }, delay);
      });
    }

    children.forEach(function (child) {
      child.addEventListener("click", function (e) {
        e.stopPropagation();
        if (!(pauseOnHover && container.matches(":hover"))) {
          clearTimeout(timers[i]);
          timers[i] = setTimeout(function () {
            if (canSwitch()) switchTab(container);
          }, delay);
        }
      });
    });

    // Start timer immediately on page load
    timers[i] = setTimeout(function () {
      if (canSwitch()) switchTab(container);
    }, delay);
  });
}();
