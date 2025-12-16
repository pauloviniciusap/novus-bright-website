(function () {
  const form = document.getElementById("quoteForm");
  const noticeOk = document.getElementById("noticeOk"); // optional, can exist but we won't use it
  const noticeErr = document.getElementById("noticeErr");
  const submitBtn = document.getElementById("submitBtn");
  const yearEl = document.getElementById("year");

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  if (!form) return;

  function show(el) {
    if (!el) return;
    el.style.display = "block";
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function hide(el) {
    if (!el) return;
    el.style.display = "none";
  }

  function requiredValue(name) {
    const el = form.querySelector(`[name="${name}"]`);
    return (el && String(el.value || "").trim()) || "";
  }

  // Netlify encode helper (application/x-www-form-urlencoded)
  function encodeForm(formEl) {
    const data = new URLSearchParams();
    new FormData(formEl).forEach((value, key) => data.append(key, value));
    return data.toString();
  }

  // Success modal
  function openModal() {
    const overlay = document.getElementById("modalOverlay");
    const closeBtn = document.getElementById("modalClose");
    if (!overlay) return;

    overlay.style.display = "flex";
    overlay.setAttribute("aria-hidden", "false");

    function close() {
      overlay.style.display = "none";
      overlay.setAttribute("aria-hidden", "true");
      document.removeEventListener("keydown", onKey);
    }

    function onKey(e) {
      if (e.key === "Escape") close();
    }

    overlay.addEventListener(
      "click",
      (e) => {
        if (e.target === overlay) close();
      },
      { once: true }
    );

    if (closeBtn) closeBtn.addEventListener("click", close, { once: true });
    document.addEventListener("keydown", onKey);

    if (closeBtn) closeBtn.focus();
  }

  form.addEventListener("submit", async (e) => {
    hide(noticeOk);
    hide(noticeErr);

    // Basic client-side required checks
    const must = ["name", "phone", "email", "address", "service_type", "frequency"];
    const missing = must.filter((n) => !requiredValue(n));

    const consent = form.querySelector('[name="consent"]');
    if (!consent || !consent.checked) missing.push("consent");

    if (missing.length) {
      e.preventDefault();
      if (noticeErr) {
        noticeErr.textContent =
          "Please complete all required fields and accept the consent checkbox.";
        show(noticeErr);
      }
      return;
    }

    // Always submit via fetch to Netlify Forms, no redirect, no mailto
    e.preventDefault();

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeForm(form),
      });

      if (!res.ok) throw new Error("Submission failed.");

      form.reset();
      openModal();
    } catch (err) {
      if (noticeErr) {
        noticeErr.textContent = "Could not send your request. Please try again.";
        show(noticeErr);
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Request a quote";
      }
    }
  });
})();
