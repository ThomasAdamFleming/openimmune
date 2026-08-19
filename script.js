/* ============================================================================
   OpenImmune  -  script.js
   Progressive enhancement only. The site is fully readable without JavaScript.
   Every motion effect is calm by default and respects prefers-reduced-motion.
   ----------------------------------------------------------------------------
   1. Header background on scroll
   2. Mobile navigation
   3. Scroll reveals + kinetic headings (single observer)
   4. Scroll-progress signal bar
   5. Pointer parallax (hero) and card spotlight
   6. Contact form (Web3Forms)
   ========================================================================== */
(function () {
  "use strict";

  var mqReduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)");
  var prefersReduced = mqReduced && mqReduced.matches;

  var mqFine = window.matchMedia &&
    window.matchMedia("(hover: hover) and (pointer: fine)");
  var finePointer = mqFine && mqFine.matches;

  var raf = window.requestAnimationFrame || function (cb) { return setTimeout(cb, 16); };

  /* --------------------------------------------------------------------------
     1. Header: add a background once the page is scrolled
     ------------------------------------------------------------------------ */
  var header = document.getElementById("siteHeader");
  if (header && !header.classList.contains("is-scrolled")) {
    var onHeaderScroll = function () {
      if (window.scrollY > 24) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    };
    onHeaderScroll();
    window.addEventListener("scroll", onHeaderScroll, { passive: true });
  }

  /* --------------------------------------------------------------------------
     2. Mobile navigation toggle
     ------------------------------------------------------------------------ */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("primaryNav");
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (!open) {
        nav.querySelectorAll("[data-nav-group].is-open").forEach(function (g) {
          g.classList.remove("is-open");
          var b = g.querySelector(".nav-group__toggle");
          if (b) b.setAttribute("aria-expanded", "false");
        });
      }
    };
    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("is-open")) return;
      if (!nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });
  }

  /* --------------------------------------------------------------------------
     3a. Kinetic headings: split into word-spans so they can rise in sequence.
         Runs before observing. Skipped entirely for reduced motion.
     ------------------------------------------------------------------------ */
  if (!prefersReduced) {
    var kinetics = document.querySelectorAll(".kinetic");
    kinetics.forEach(function (el) {
      // Only split plain-text headings; skip if it already holds markup.
      if (el.querySelector("*")) return;
      var words = el.textContent.split(/(\s+)/);
      var frag = document.createDocumentFragment();
      var i = 0;
      words.forEach(function (chunk) {
        if (/^\s+$/.test(chunk)) {
          frag.appendChild(document.createTextNode(chunk));
        } else if (chunk.length) {
          var span = document.createElement("span");
          span.className = "word";
          span.style.setProperty("--i", i++);
          span.textContent = chunk;
          frag.appendChild(span);
        }
      });
      el.textContent = "";
      el.appendChild(frag);
    });
  }

  /* --------------------------------------------------------------------------
     3b. Scroll reveals + kinetic + dimension ticks (single observer).
         Elements are only hidden when JS is present, so if anything here fails
         the content is still fully visible.
     ------------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll(".reveal, .reveal-stagger, .kinetic, .dimension");
  if (revealEls.length) {
    if (prefersReduced || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* --------------------------------------------------------------------------
     4. Scroll-progress signal bar
     ------------------------------------------------------------------------ */
  var progress = document.querySelector(".scroll-progress");
  if (progress) {
    var ticking = false;
    var updateProgress = function () {
      var doc = document.documentElement;
      var max = (doc.scrollHeight - doc.clientHeight) || 1;
      var ratio = Math.min(1, Math.max(0, window.scrollY / max));
      progress.style.transform = "scaleX(" + ratio + ")";
      ticking = false;
    };
    var onProgressScroll = function () {
      if (!ticking) { ticking = true; raf(updateProgress); }
    };
    updateProgress();
    window.addEventListener("scroll", onProgressScroll, { passive: true });
    window.addEventListener("resize", onProgressScroll, { passive: true });
  }

  /* --------------------------------------------------------------------------
     5a. Pointer parallax on the hero: the aperture and field lean gently
         towards the cursor. Fine pointers only, and never under reduced motion.
     ------------------------------------------------------------------------ */
  var hero = document.querySelector(".hero");
  if (hero && finePointer && !prefersReduced) {
    var pending = false, px = 0, py = 0;
    var applyParallax = function () {
      hero.style.setProperty("--px", px.toFixed(3));
      hero.style.setProperty("--py", py.toFixed(3));
      pending = false;
    };
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width - 0.5) * 2;   // -1 .. 1
      py = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!pending) { pending = true; raf(applyParallax); }
    });
    hero.addEventListener("pointerleave", function () {
      px = 0; py = 0; raf(applyParallax);
    });
  }

  /* --------------------------------------------------------------------------
     5b. Card spotlight: a soft aurora glow follows the cursor across cards.
     ------------------------------------------------------------------------ */
  if (finePointer && !prefersReduced) {
    var spotlit = document.querySelectorAll(".card, .member, .matter-card, .matter-lead, .impact-card, .stat, .topic-nav a");
    spotlit.forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", (e.clientX - r.left) + "px");
        el.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* --------------------------------------------------------------------------
     5c. "Why this matters" dropdown. On desktop, hover and focus-within open it
         via CSS; the chevron toggles it for touch and keyboard. Closes on
         Escape and on an outside click.
     ------------------------------------------------------------------------ */
  var navGroups = document.querySelectorAll("[data-nav-group]");
  navGroups.forEach(function (group) {
    var gBtn = group.querySelector(".nav-group__toggle");
    if (!gBtn) return;
    var setGroupOpen = function (open) {
      group.classList.toggle("is-open", open);
      gBtn.setAttribute("aria-expanded", open ? "true" : "false");
    };
    gBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      setGroupOpen(!group.classList.contains("is-open"));
    });
    group.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && group.classList.contains("is-open")) {
        setGroupOpen(false);
        gBtn.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (!group.contains(e.target)) setGroupOpen(false);
    });
  });

  /* --------------------------------------------------------------------------
     5d. Evidence stats: numbers count up once, when they scroll into view.
         The final value is already in the HTML, so without JS nothing is lost.
     ------------------------------------------------------------------------ */
  var animateCount = function (el) {
    var raw = el.getAttribute("data-to");
    var target = parseFloat(raw);
    if (isNaN(target)) return;
    var node = el.firstChild;                       // leading text node holds the number
    if (!node || node.nodeType !== 3) return;
    var decimals = (raw.split(".")[1] || "").length;
    var dur = 1100, start = null;
    var easeOutCubic = function (t) { return 1 - Math.pow(1 - t, 3); };
    var step = function (ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      node.nodeValue = (target * easeOutCubic(p)).toFixed(decimals);
      if (p < 1) raf(step);
      else node.nodeValue = target.toFixed(decimals);
    };
    raf(step);
  };
  var counters = document.querySelectorAll(".stat__num[data-to]");
  if (counters.length && !prefersReduced && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        cio.unobserve(entry.target);
        animateCount(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* --------------------------------------------------------------------------
     6. Contact form (Web3Forms)
        Without JS the form posts straight to Web3Forms and the browser lands on
        thank-you.html, which is what the hidden "redirect" field is for. With JS
        we submit in the background and report status inline, so the redirect
        field is stripped from the payload before sending.
     ------------------------------------------------------------------------ */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  if (form && status) {
    var setStatus = function (state, message) {
      status.setAttribute("data-state", state);
      status.textContent = message;
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var endpoint = (form.getAttribute("action") || "").trim();
      if (!endpoint) {
        setStatus("info", "The contact form is being connected. Please check back shortly.");
        return;
      }

      var payload = new FormData(form);
      payload.delete("redirect");

      var btn = form.querySelector("button[type=submit]");
      if (btn) btn.disabled = true;
      setStatus("info", "Sending\u2026");

      fetch(endpoint, {
        method: "POST",
        body: payload,
        headers: { "Accept": "application/json" }
      })
        .then(function (response) {
          return response.json().catch(function () { return null; }).then(function (data) {
            var ok = response.ok && (!data || data.success !== false);
            if (ok) {
              form.reset();
              setStatus("success", "Thank you. Your message has been sent, and we will be in touch.");
            } else {
              /* Web3Forms returns { success: false, message: "..." }. That text is
                 for diagnosis, not for visitors, so it goes to the console only. */
              if (data && data.message && window.console && console.warn) {
                console.warn("Contact form: " + data.message);
              }
              setStatus("error", "Something went wrong. Please try again, or write to us another way.");
            }
          });
        })
        .catch(function () {
          setStatus("error", "Something went wrong sending your message. Please try again in a moment.");
        })
        .then(function () {
          if (btn) btn.disabled = false;
        });
    });
  }

})();
