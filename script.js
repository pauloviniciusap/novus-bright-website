(function(){
  const form = document.getElementById("quoteForm");
  const noticeOk = document.getElementById("noticeOk");
  const noticeErr = document.getElementById("noticeErr");
  const submitBtn = document.getElementById("submitBtn");
  const yearEl = document.getElementById("year");

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  function show(el){
    if (!el) return;
    el.style.display = "block";
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function hide(el){
    if (!el) return;
    el.style.display = "none";
  }

  function requiredValue(name){
    const el = form.querySelector(`[name="${name}"]`);
    return (el && String(el.value || "").trim()) || "";
  }

  function toMailtoBody(data){
    const lines = [
      "New cleaning request (Novus Bright)",
      "",
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      `Email: ${data.email}`,
      `Address: ${data.address}`,
      `Service type: ${data.service_type}`,
      `Frequency: ${data.frequency}`,
      `Preferred date: ${data.preferred_date}`,
      `Preferred time: ${data.preferred_time}`,
      `Bedrooms: ${data.bedrooms}`,
      `Bathrooms: ${data.bathrooms}`,
      `Pets: ${data.pets}`,
      "",
      "Notes:",
      data.notes || "(none)"
    ];
    return encodeURIComponent(lines.join("\n"));
  }

  async function submitToFormspree(actionUrl, formData){
    const res = await fetch(actionUrl, {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: formData
    });
    const json = await res.json().catch(()=> ({}));
    if (!res.ok) {
      const msg = (json && json.errors && json.errors[0] && json.errors[0].message) || "Submission failed.";
      throw new Error(msg);
    }
    return true;
  }

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    hide(noticeOk); hide(noticeErr);

    // Basic client-side required checks (helps even if using Netlify)
    const must = ["name","phone","email","address","service_type","frequency"];
    const missing = must.filter(n => !requiredValue(n));
    const consent = form.querySelector('[name="consent"]');
    if (!consent || !consent.checked) missing.push("consent");

    if (missing.length) {
      e.preventDefault();
      noticeErr.textContent = "Please complete all required fields and accept the consent checkbox.";
      show(noticeErr);
      return;
    }

    const action = (form.getAttribute("action") || "").trim();

    // If action is a Formspree endpoint, submit via fetch so we can show an in-page success message.
    if (action.startsWith("https://formspree.io/")) {
      e.preventDefault();

      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      try {
        const formData = new FormData(form);
        await submitToFormspree(action, formData);
        form.reset();
        noticeOk.textContent = "Thanks. We received your request and will contact you shortly.";
        show(noticeOk);
      } catch (err) {
        noticeErr.textContent = err && err.message ? err.message : "Something went wrong. Please try again.";
        show(noticeErr);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Request a quote";
      }

      return;
    }

    // No backend configured. Offer a mailto fallback for local testing.
    if (!action) {
    return;
    }

    // Otherwise let the browser submit normally (good for Netlify Forms).
  });
})();
