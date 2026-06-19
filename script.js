/* ============================================================================
   OpenImmune  -  script.js
   Progressive enhancement only. The site is fully readable without JavaScript.
   ========================================================================== */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --------------------------------------------------------------------------
     1. Header: add a background once the page is scrolled
     ------------------------------------------------------------------------ */
  var header = document.getElementById("siteHeader");
  if (header && !header.classList.contains("is-scrolled")) {
    var onScroll = function () {
      if (window.scrollY > 24) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
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
     3. Scroll reveals (single observer)
        Elements are only hidden when JS is present, so if anything here fails
        the content is still visible.
     ------------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
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
     4. Contact form (Formspree)
        Works as a normal POST without JS once the action is set. With JS it
        submits in the background and reports status inline.
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

      // Native HTML validation
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var endpoint = (form.getAttribute("action") || "").trim();
      if (!endpoint) {
        setStatus("info", "The contact form is being connected. Please check back shortly.");
        return;
      }

      var btn = form.querySelector("button[type=submit]");
      if (btn) btn.disabled = true;
      setStatus("info", "Sending\u2026");

      fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      })
        .then(function (response) {
          if (response.ok) {
            form.reset();
            setStatus("success", "Thank you. Your message has been sent, and we will be in touch.");
          } else {
            return response.json().then(function (data) {
              var msg = "Something went wrong. Please try again, or write to us another way.";
              if (data && data.errors && data.errors.length) {
                msg = data.errors.map(function (x) { return x.message; }).join(" ");
              }
              setStatus("error", msg);
            });
          }
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
