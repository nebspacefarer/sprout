export function textToParam(text: string) {
    return text.toLowerCase().replace(" ", "_");
}

export function paramToText(url: string) {
    return url.replace("_", " ");
}

export function toFallback(text: string) {
    return text.substring(0, 2).toUpperCase();
}
