/* ============================================================
   LINA ZAKARIA — Portfolio  ·  script.js
   Progressive enhancement only. No dependencies, no build.
   ============================================================ */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---- year ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---- nav: shrink on scroll ---- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- mobile menu ---- */
  var burger = document.getElementById("burger");
  if (burger && nav) {
    function setMenu(open) {
      nav.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
    }
    burger.addEventListener("click", function () {
      setMenu(!nav.classList.contains("open"));
    });
    nav.querySelectorAll(".nav__links a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    // close on Escape (and return focus to the toggle)
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        setMenu(false);
        burger.focus();
      }
    });
    // close when clicking/tapping outside the nav
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("open") && !nav.contains(e.target)) setMenu(false);
    });
    // safety: if the viewport grows back to desktop, never leave scroll locked
    window.addEventListener("resize", function () {
      if (window.innerWidth > 760 && nav.classList.contains("open")) setMenu(false);
    });
  }

  /* ---- scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  if (reduce) return; // everything below is pure motion polish

  /* ---- chrome cursor ---- */
  var cursor = document.getElementById("cursor");
  if (cursor && canHover) {
    var cx = 0, cy = 0, tx = 0, ty = 0, shown = false;
    window.addEventListener("mousemove", function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!shown) { cursor.classList.add("on"); shown = true; cx = tx; cy = ty; }
    });
    (function loop() {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      cursor.style.transform =
        "translate(" + cx + "px," + cy + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll("a,button,[data-magnetic],[data-tilt]").forEach(function (el) {
      el.addEventListener("mouseenter", function () { cursor.classList.add("grow"); });
      el.addEventListener("mouseleave", function () { cursor.classList.remove("grow"); });
    });
  }

  if (!canHover) return; // skip magnetic/tilt on touch

  /* ---- magnetic buttons ---- */
  document.querySelectorAll("[data-magnetic]").forEach(function (el) {
    el.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect();
      var mx = e.clientX - (r.left + r.width / 2);
      var my = e.clientY - (r.top + r.height / 2);
      el.style.transform = "translate(" + mx * 0.25 + "px," + my * 0.35 + "px)";
    });
    el.addEventListener("mouseleave", function () { el.style.transform = ""; });
  });

  /* ---- subtle 3D tilt on work cards ---- */
  document.querySelectorAll("[data-tilt]").forEach(function (el) {
    el.style.transformStyle = "preserve-3d";
    el.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform =
        "perspective(900px) rotateY(" + px * 4 + "deg) rotateX(" + (-py * 4) +
        "deg) translateY(-4px)";
    });
    el.addEventListener("mouseleave", function () { el.style.transform = ""; });
  });
})();
