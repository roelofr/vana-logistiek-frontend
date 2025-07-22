const eventName = 'reactAppConfetti';

export function fireConfetti(count: number = 100): void {
    const event = new CustomEvent(eventName, {detail: count});
    document.dispatchEvent(event);
}

export function addConfettiListener(listener: (event: CustomEvent<number>) => void): void {
    document.addEventListener(eventName, listener as EventListener, {passive: true});
}

export function removeConfettiListener(listener: (event: CustomEvent<number>) => void): void {
    document.removeEventListener(eventName, listener as EventListener);
}
