export default function covertStringtoHTML(string) {
    return document.createRange().createContextualFragment(string)
}