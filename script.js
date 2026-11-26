const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-link, .nav-contact");
const sections = document.querySelectorAll("main section[id]");

navToggle.addEventListener("click", () => {
  const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isExpanded));
  navToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
  navLinks.classList.toggle("is-open", !isExpanded);
});

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation menu");
    navLinks.classList.remove("is-open");
  });
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll(".nav-link").forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-30% 0px -60% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

const skillObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.style.width = `${entry.target.dataset.level}%`;
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll(".skill-fill").forEach((bar) => skillObserver.observe(bar));

const form = document.querySelector("#contact-form");
const status = document.querySelector("#form-status");
const currentYear = document.querySelector("#current-year");
currentYear.textContent = new Date().getFullYear();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const fields = [
  { input: document.querySelector("#name"), error: document.querySelector("#name-error"), message: "Please enter your name." },
  { input: document.querySelector("#email"), error: document.querySelector("#email-error"), message: "Please enter a valid email address.", validate: (value) => emailPattern.test(value) },
  { input: document.querySelector("#message"), error: document.querySelector("#message-error"), message: "Please add a short message." },
];

function validateField(field) {
  const value = field.input.value.trim();
  const isValid = value.length > 0 && (!field.validate || field.validate(value));
  field.input.setAttribute("aria-invalid", String(!isValid));
  field.error.textContent = isValid ? "" : field.message;
  return isValid;
}

fields.forEach(({ input }) => {
  input.addEventListener("input", () => {
    if (input.hasAttribute("aria-invalid")) {
      const field = fields.find((item) => item.input === input);
      validateField(field);
    }
    status.textContent = "";
    status.classList.remove("error");
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const isValid = fields.map(validateField).every(Boolean);

  if (!isValid) {
    status.textContent = "Please check the highlighted fields and try again.";
    status.classList.add("error");
    fields.find((field) => field.input.getAttribute("aria-invalid") === "true").input.focus();
    return;
  }

  status.textContent = "Thanks for your message! This demo form is ready to connect to an email service.";
  status.classList.remove("error");
  form.reset();
  fields.forEach(({ input }) => input.removeAttribute("aria-invalid"));
});
