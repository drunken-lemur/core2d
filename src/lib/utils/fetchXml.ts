export const fetchXml = (input: string) =>
  fetch(input)
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"));
