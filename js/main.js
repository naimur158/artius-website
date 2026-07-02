/* =====================================================================
   ARTIUS LTD — Site scripts
   Plain JavaScript, no dependencies.
   Motion: word-reveal headings, media curtain reveals, stat counters,
   hero parallax, hide-on-scroll header. All disabled for users who
   prefer reduced motion.
   ===================================================================== */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile menu toggle ---------- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
      document.body.classList.toggle("nav-open");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        document.body.classList.remove("nav-open");
      });
    });
  }

  /* ---------- Header: solid on scroll, hides going down, returns going up ---------- */
  var header = document.getElementById("header");
  var darkHero = document.body.hasAttribute("data-hero-dark");
  var lastY = window.scrollY;

  /* Thin reading-progress line along the top of the page */
  var progress = null;
  if (!reduced) {
    progress = document.createElement("div");
    progress.className = "progress";
    progress.setAttribute("aria-hidden", "true");
    document.body.appendChild(progress);
  }

  function onScroll() {
    if (!header) return;
    var y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 40);
    if (darkHero) header.classList.toggle("is-light", y <= 40);
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
    }
    if (!document.body.classList.contains("nav-open")) {
      if (y > 420 && y > lastY + 4) header.classList.add("is-hidden");
      else if (y < lastY - 4 || y <= 420) header.classList.remove("is-hidden");
    }
    lastY = y;
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Highlight the current page in the nav ---------- */
  var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav a").forEach(function (link) {
    var target = (link.getAttribute("href") || "").toLowerCase();
    if (target === here || (here === "" && target === "index.html")) {
      link.classList.add("is-active");
    }
  });

  /* ---------- Split headings into words for masked line reveals ---------- */
  function splitWords(el) {
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      if (n.nodeType !== 3) return; // keep <br> etc. untouched
      var frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
        var w = document.createElement("span"); w.className = "w";
        var i = document.createElement("span"); i.className = "ww"; i.textContent = part;
        w.appendChild(i);
        frag.appendChild(w);
      });
      el.replaceChild(frag, n);
    });
  }
  if (!reduced) {
    document.querySelectorAll("h1, h2, .work h3").forEach(function (h) {
      splitWords(h);
      h.classList.add("wr");
      var words = h.querySelectorAll(".ww");
      Array.prototype.forEach.call(words, function (w, i) {
        w.style.transitionDelay = (i * 45) + "ms";
      });
    });
  }

  /* ---------- Auto-apply curtain reveal to all media blocks ---------- */
  if (!reduced) {
    document.querySelectorAll(".hero__image, .split__media, .work__media, .gallery > *")
      .forEach(function (el) { el.setAttribute("data-reveal", "media"); });
    // stagger gallery tiles
    document.querySelectorAll(".gallery").forEach(function (g) {
      Array.prototype.forEach.call(g.children, function (c, i) {
        c.style.transitionDelay = (i * 90) + "ms";
        var im = c.querySelector ? c.querySelector("img") : null;
        if (im) im.style.transitionDelay = (i * 90) + "ms";
      });
    });
  }

  /* ---------- Animated stat counters ---------- */
  function runCounter(el) {
    if (reduced) return;
    var m = el.textContent.trim().match(/^(\d+)(.*)$/);
    if (!m) return;
    var end = parseInt(m[1], 10), suffix = m[2] || "", t0 = null, dur = 1400;
    el.textContent = "0" + suffix;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      p = 1 - Math.pow(1 - p, 3); // ease-out
      el.textContent = Math.round(end * p) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    // Fallback: always land on the final value even if animation frames stall
    setTimeout(function () { el.textContent = end + suffix; }, dur + 400);
  }

  /* ---------- Scroll reveal observer (text, media, counters) ---------- */
  var targets = document.querySelectorAll("[data-reveal], .wr, .stat__num");
  if ("IntersectionObserver" in window && targets.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          if (entry.target.classList.contains("stat__num")) runCounter(entry.target);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0, rootMargin: "0px 0px -9% 0px" }
    );
    targets.forEach(function (el) { io.observe(el); });
    // Safety net: if the observer never fires (unusual embedded browsers),
    // reveal everything rather than leave the page hidden.
    setTimeout(function () {
      if (!document.querySelector(".is-visible")) {
        targets.forEach(function (el) {
          el.classList.add("is-visible");
          if (el.classList.contains("stat__num")) runCounter(el);
        });
      }
    }, 2500);
  } else {
    targets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Hero image parallax ---------- */
  if (!reduced) {
    var pimg = document.querySelector(".hero__image img");
    if (pimg) {
      var wrap = pimg.parentElement;
      var ticking = false;
      var started = false;
      function prlx() {
        ticking = false;
        var r = wrap.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        if (!started) { pimg.style.transition = "none"; started = true; }
        var mid = r.top + r.height / 2 - window.innerHeight / 2;
        var y = Math.max(-34, Math.min(34, -mid * 0.08));
        pimg.style.transform = "translateY(" + y + "px) scale(1.1)";
      }
      window.addEventListener("scroll", function () {
        if (!ticking) { ticking = true; requestAnimationFrame(prlx); }
      }, { passive: true });
      setTimeout(function () { requestAnimationFrame(prlx); }, 1500); // start after the reveal finishes
    }
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Contact / careers form handling (Web3Forms) ---------- *
   * Submissions are emailed to you via web3forms.com (free).
   * STEP 1: go to https://web3forms.com -> enter the email that should
   *         RECEIVE submissions -> copy the Access Key they send.
   * STEP 2: paste that key into the hidden "access_key" input inside each
   *         <form> (in contact.html and careers.html).
   * Until then, forms run in DEMO mode and only show a success message.
   * ------------------------------------------------------------------- */
  var DEMO_KEY = "YOUR_WEB3FORMS_ACCESS_KEY";

  document.querySelectorAll("form[data-ajax-form]").forEach(function (form) {
    var status = form.querySelector(".form__status");
    var button = form.querySelector("button[type=submit]");

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      var keyField = form.querySelector("input[name=access_key]");
      var key = keyField ? keyField.value.trim() : "";

      function setStatus(msg, ok) {
        if (!status) return;
        status.textContent = msg;
        status.className = "form__status " + (ok ? "is-ok" : "is-err");
      }

      if (!form.checkValidity()) { form.reportValidity(); return; }

      if (button) { button.disabled = true; button.dataset.label = button.textContent; button.textContent = "Sending…"; }
      setStatus("", true);

      // DEMO mode: no real key yet
      if (!key || key === DEMO_KEY) {
        setTimeout(function () {
          setStatus("✓ Thank you! (Demo mode — add your Web3Forms key to receive real emails.)", true);
          form.reset();
          if (button) { button.disabled = false; button.textContent = button.dataset.label; }
        }, 600);
        return;
      }

      try {
        var res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: new FormData(form),
        });
        var data = await res.json();
        if (data.success) {
          setStatus("✓ Thank you! Your message has been sent. We'll be in touch shortly.", true);
          form.reset();
        } else {
          setStatus("Sorry, something went wrong. Please email us directly.", false);
        }
      } catch (err) {
        setStatus("Network error. Please check your connection or email us directly.", false);
      } finally {
        if (button) { button.disabled = false; button.textContent = button.dataset.label; }
      }
    });
  });
})();
