// Native effects inspired by React Bits Spotlight Card, Blur Text, and Count Up.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const activeCounters = new WeakMap();

if (!reducedMotion.matches && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll("[data-spotlight]").forEach(card => {
        card.addEventListener("pointermove", event => {
            if (event.pointerType === "touch") return;
            const { left, top } = card.getBoundingClientRect();
            card.style.setProperty("--pointer-x", `${event.clientX - left}px`);
            card.style.setProperty("--pointer-y", `${event.clientY - top}px`);
        });
    });
}

function createStatusBadge(status) {
    const badge = document.createElement("span");
    badge.className = "status-pill";
    badge.dataset.status = status;
    badge.textContent = status;
    return badge;
}

function updateCounter(element, target) {
    cancelAnimationFrame(activeCounters.get(element));
    const initial = Number(element.textContent);
    if (reducedMotion.matches || initial === target) {
        element.textContent = target;
        return;
    }

    const startTime = performance.now();
    function tick(now) {
        const progress = Math.min((now - startTime) / 380, 1);
        element.textContent = Math.round(initial + (target - initial) * (1 - (1 - progress) ** 3));
        if (progress < 1) activeCounters.set(element, requestAnimationFrame(tick));
    }
    activeCounters.set(element, requestAnimationFrame(tick));
}
