/* Imperium Exteriors — site interactions */
(function () {
  "use strict";

  /* Mobile menu */
  var menuBtn = document.querySelector(".menu-btn");
  var mobileNav = document.querySelector(".mobile-nav");
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Before / after sliders */
  document.querySelectorAll(".ba-slider").forEach(function (s) {
    var input = s.querySelector("input");
    if (!input) return;
    var set = function () { s.style.setProperty("--pos", input.value + "%"); };
    input.addEventListener("input", set);
    set();
  });

  /* "Quote this" buttons pre-select the service in the form */
  var select = document.querySelector("#service");
  document.querySelectorAll("[data-service]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (select) select.value = btn.getAttribute("data-service");
    });
  });

  /* Quote form: posts to Netlify Forms on the live site; demo success elsewhere */
  var form = document.querySelector("#quote-form");
  var live = /netlify\.app$|imperiumexteriors\.net$/.test(location.hostname);
  if (form && !live) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = form.querySelector(".form-success");
      if (ok) { ok.classList.add("show"); ok.scrollIntoView({ behavior: "smooth", block: "center" }); }
      form.reset();
    });
  }

  /* Holiday string lights */
  var box = document.querySelector(".bulbs");
  if (box) {
    var c = document.createElement("canvas");
    box.prepend(c);
    var ctx = c.getContext("2d");
    var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var colors = ["#f0c75e", "#d4a537", "#fff3c4", "#e8b84a"];
    var strands = [], w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var size = function () {
      var r = box.getBoundingClientRect();
      w = r.width; h = r.height;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      strands = [];
      [0.16, 0.34, 0.52].forEach(function (y, row) {
        var n = Math.max(8, Math.round(w / 46));
        var pts = [];
        for (var i = 0; i <= n; i++) {
          var t = i / n;
          pts.push({ x: t * w, y: y * h + Math.sin(t * Math.PI) * h * 0.09, ph: Math.random() * 6.28, col: colors[(i + row) % colors.length] });
        }
        strands.push(pts);
      });
    };
    var draw = function (time) {
      ctx.clearRect(0, 0, w, h);
      strands.forEach(function (pts) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255,255,255,0.18)";
        ctx.lineWidth = 1.2;
        pts.forEach(function (p, i) { i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); });
        ctx.stroke();
        pts.forEach(function (p, i) {
          if (i === 0 || i === pts.length - 1) return;
          var glow = still ? 0.85 : 0.55 + 0.45 * Math.sin(time / 600 + p.ph);
          var g = ctx.createRadialGradient(p.x, p.y + 7, 0, p.x, p.y + 7, 18);
          g.addColorStop(0, p.col);
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.globalAlpha = glow * 0.55;
          ctx.fillStyle = g;
          ctx.fillRect(p.x - 18, p.y - 11, 36, 36);
          ctx.globalAlpha = 0.6 + glow * 0.4;
          ctx.fillStyle = p.col;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y + 7, 3.4, 5.2, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        });
      });
      if (!still) requestAnimationFrame(draw);
    };
    size();
    window.addEventListener("resize", function () { size(); if (still) draw(0); });
    requestAnimationFrame(draw);
  }

  /* Footer year */
  var yr = document.querySelector("#year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
