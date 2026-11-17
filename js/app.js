const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const introScreen = document.querySelector("#intro-screen");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const finishIntro = () => {
    if (!introScreen) return;
    introScreen.classList.add("is-exiting");
    document.body.classList.remove("intro-pending");
    window.setTimeout(() => introScreen.remove(), prefersReducedMotion ? 0 : 800);
};

window.setTimeout(finishIntro, 2000);

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

const sections = document.querySelectorAll("main section[id]");
const sectionLinks = document.querySelectorAll(".nav-links a[href^='#']");
if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            sectionLinks.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
            });
        });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach((section) => sectionObserver.observe(section));
}

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.setProperty("--reveal-delay", `${entry.target.dataset.revealIndex || 0}ms`);
                entry.target.classList.add("visible");
                currentObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    revealItems.forEach((item, index) => {
        item.dataset.revealIndex = String((index % 4) * 90);
        observer.observe(item);
    });
} else {
    revealItems.forEach((item) => item.classList.add("visible"));
}

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector(".form-status");
contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.checkValidity()) {
        formStatus.textContent = "Please complete your name, email and message.";
        contactForm.reportValidity();
        return;
    }
    const data = new FormData(contactForm);
    const message = `Hi Sushant,\n\nMy name is ${data.get("name")} (${data.get("email")}).\n\n${data.get("message")}`;
    navigator.clipboard.writeText(message).then(() => {
        formStatus.textContent = "Message copied. Opening LinkedIn...";
        window.open("https://www.linkedin.com/in/sushant-gautam-328a83284/", "_blank", "noopener,noreferrer");
    }).catch(() => {
        formStatus.textContent = "Could not copy automatically. Please use LinkedIn to send your message.";
        window.open("https://www.linkedin.com/in/sushant-gautam-328a83284/", "_blank", "noopener,noreferrer");
    });
});

document.querySelector("#current-year").textContent = String(new Date().getFullYear());
