(() => {
  const languageButtons = Array.from(document.querySelectorAll("[data-language]"));
  const vietnameseCopy = Array.from(document.querySelectorAll(".copy-vi"));
  const englishCopy = Array.from(document.querySelectorAll(".copy-en"));

  function setLanguage(language, remember = true) {
    const useEnglish = language === "en";
    document.documentElement.lang = useEnglish ? "en" : "vi";
    document.title = useEnglish
      ? "Nguyen Duc Thien | IT Support & Systems Operations Specialist"
      : "Nguyễn Đức Thiện | Hỗ trợ CNTT & Vận hành Hệ thống";

    vietnameseCopy.forEach((element) => { element.hidden = useEnglish; });
    englishCopy.forEach((element) => { element.hidden = !useEnglish; });
    languageButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.language === (useEnglish ? "en" : "vi")));
    });

    if (remember) {
      try {
        window.localStorage.setItem("profile-language", useEnglish ? "en" : "vi");
      } catch (_) {
        // The language switch still works if browser storage is unavailable.
      }
    }
  }

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
  });

  let initialLanguage = "vi";
  try {
    const savedLanguage = window.localStorage.getItem("profile-language");
    if (savedLanguage === "en" || savedLanguage === "vi") initialLanguage = savedLanguage;
  } catch (_) {
    // Vietnamese is the default if browser storage is unavailable.
  }

  setLanguage(initialLanguage, false);

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const emailCopyButton = document.getElementById("emailCopyButton");
  const emailToast = document.getElementById("emailToast");
  let emailToastTimer;

  async function copyToClipboard(value) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        return true;
      }
    } catch (_) {
      // Fall back for local files or browsers without clipboard access.
    }

    const field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    field.style.pointerEvents = "none";
    field.style.left = "-9999px";
    document.body.appendChild(field);
    field.select();

    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (_) {
      copied = false;
    }
    field.remove();
    return copied;
  }

  if (emailCopyButton && emailToast) {
    emailCopyButton.addEventListener("click", async () => {
      const copied = await copyToClipboard(emailCopyButton.dataset.copyEmail);
      const viMessage = emailToast.querySelector(".copy-vi");
      const enMessage = emailToast.querySelector(".copy-en");
      viMessage.textContent = copied ? "Đã sao chép email" : "Không thể tự sao chép email:";
      enMessage.textContent = copied ? "Email copied" : "Could not copy automatically:";
      emailToast.hidden = false;
      window.requestAnimationFrame(() => emailToast.classList.add("is-visible"));
      window.clearTimeout(emailToastTimer);
      emailToastTimer = window.setTimeout(() => {
        emailToast.classList.remove("is-visible");
        window.setTimeout(() => { emailToast.hidden = true; }, 220);
      }, 3800);
    });
  }
})();