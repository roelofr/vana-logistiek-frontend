const eventName = 'reactAppConfetti';

export function fireConfetti(): void {
    const event = new CustomEvent(eventName);
    document.dispatchEvent(event);
}

export function addConfettiListener(listener: () => void): void {
    document.addEventListener(eventName, listener, {passive: true});
}

export function removeConfettiListener(listener: () => void): void {
    document.removeEventListener(eventName, listener);
}
