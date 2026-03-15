const pageMessages = {
    home: [
        "Welcome to Hunter Gottholm's portfolio website.",
        "Explore the site and collect coins.",
        "Security, networking, and web work all live in the same world here."
    ],
    about: [
        "My name is Hunter, and I am an information security and networking enthusiast.",
        "I also have experience in building AI-powered tools and agents, automation, and web design.",
        "My certifications include A+, Network+, Security+, CySA+, SC-300, Splunk Core User, and Splunk Power User.",
        "My strongest languages are JavaScript, Python, HTML, CSS, and SQL."
    ],
    experience: [
        "This page works like a world map.",
        "Hit a block to reveal the stage behind it.",
        "Each role unlocked here adds a coin to the run."
    ],
    skills: [
        "This is the loadout screen.",
        "The stack is practical: scripting, IT fundamentals, SQL, and security-aware thinking.",
        "The cards above provide a visual skill showcase."
    ],
    contact: [
        "This page is intentionally structured but not padded with fake contact data.",
        "Drop in your real email, LinkedIn, GitHub, and resume links when you are ready.",
        "The layout is already prepared for it."
    ]
};

let coinCounter = Number.parseInt(localStorage.getItem("coinCounter") || "0", 10);
let activeClouds = 0;
const maxClouds = 4;

function updateCoinCounter() {
    const counter = document.getElementById("coinCounter");
    if (!counter) return;
    counter.textContent = `Coins: ${coinCounter}`;
    localStorage.setItem("coinCounter", String(coinCounter));
}

function awardCoin(amount = 1) {
    coinCounter += amount;
    updateCoinCounter();
}

function createCoin() {
    const coin = document.createElement("button");
    coin.className = "coin";
    coin.type = "button";
    coin.setAttribute("aria-label", "Collect coin");
    coin.style.left = `${Math.random() * Math.max(window.innerWidth - 56, 40)}px`;
    coin.style.animationDuration = `${4 + Math.random() * 3}s`;

    const coinImage = document.createElement("img");
    coinImage.src = "coin.png";
    coinImage.alt = "";
    coin.appendChild(coinImage);

    const collectCoin = () => {
        if (!coin.isConnected) return;
        awardCoin(1);
        coin.remove();
    };

    coin.addEventListener("pointerenter", collectCoin, { once: true });
    coin.addEventListener("click", collectCoin, { once: true });
    coin.addEventListener("animationend", () => coin.remove(), { once: true });
    document.body.appendChild(coin);
}

function scheduleCoins() {
    setInterval(() => {
        if (document.visibilityState === "visible") {
            createCoin();
        }
    }, 1800);
}

function spawnCloud() {
    if (activeClouds >= maxClouds) return;

    const cloud = document.createElement("img");
    cloud.src = "cloud.png";
    cloud.alt = "";
    cloud.className = "cloud";
    cloud.style.top = `${Math.random() * Math.max(window.innerHeight * 0.45, 140)}px`;
    cloud.style.animationDuration = `${18 + Math.random() * 10}s`;
    activeClouds += 1;

    cloud.addEventListener("animationend", () => {
        activeClouds = Math.max(activeClouds - 1, 0);
        cloud.remove();
    }, { once: true });

    document.body.appendChild(cloud);
}

function scheduleClouds() {
    spawnCloud();
    setInterval(() => {
        if (document.visibilityState === "visible") {
            spawnCloud();
        }
    }, 4000);
}

function typeMessageSequence(element, messages, delay = 30) {
    if (!element || !messages?.length) return;

    let messageIndex = 0;
    let characterIndex = 0;
    let timeoutId;

    const renderNextCharacter = () => {
        const currentMessage = messages[messageIndex];
        characterIndex += 1;
        element.textContent = currentMessage.slice(0, characterIndex);

        if (characterIndex < currentMessage.length) {
            timeoutId = window.setTimeout(renderNextCharacter, delay);
            return;
        }

        timeoutId = window.setTimeout(() => {
            messageIndex = (messageIndex + 1) % messages.length;
            characterIndex = 0;
            element.textContent = "";
            renderNextCharacter();
        }, 1800);
    };

    renderNextCharacter();

    return () => window.clearTimeout(timeoutId);
}

function initSpeech() {
    const page = document.body.dataset.page;
    const speechElement = document.getElementById("speech-text");
    typeMessageSequence(speechElement, pageMessages[page]);
}

function initAboutDialogue() {
    const text = document.getElementById("about-dialogue");
    const button = document.getElementById("about-next");
    if (!text || !button) return;

    let index = 0;
    text.textContent = pageMessages.about[index];

    button.addEventListener("click", () => {
        index = (index + 1) % pageMessages.about.length;
        text.textContent = pageMessages.about[index];
        awardCoin(1);
    });
}

function initExperienceReveal() {
    const blocks = document.querySelectorAll("[data-reveal-target]");
    blocks.forEach((block) => {
        block.addEventListener("click", () => {
            const targetId = block.getAttribute("data-reveal-target");
            const target = document.getElementById(targetId);
            if (!target || target.classList.contains("is-visible")) return;

            target.classList.add("is-visible");
            block.classList.add("is-open");
            block.setAttribute("aria-expanded", "true");
            awardCoin(1);
        });
    });
}

function initRevealOnScroll() {
    const revealItems = document.querySelectorAll(".reveal");
    if (!revealItems.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealItems.forEach((item) => observer.observe(item));
}

function init() {
    updateCoinCounter();
    scheduleCoins();
    scheduleClouds();
    initSpeech();
    initAboutDialogue();
    initExperienceReveal();
    initRevealOnScroll();
}

init();
