export function logToDom(text: string, elem: HTMLElement) {
    elem.appendChild(document.createTextNode(text));
    elem.appendChild(document.createElement('br'));
}
