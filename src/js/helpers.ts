export function logToDom(text: string, elem: HTMLElement) {
    elem.appendChild(document.createTextNode(text));
    elem.appendChild(document.createElement('br'));
}

export const wait = (ms: number) => new Promise((r, j) => setTimeout(r, ms));
