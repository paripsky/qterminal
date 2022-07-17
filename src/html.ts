/**
 * Create a dom node from a string.
 * @param html html code
 * @returns the dom element, if more than one root element is created, returns the first one
 */
function html(html: string) {
  const root = document.createElement('div');
  root.innerHTML = html.trim();
  return root.firstChild as HTMLElement;
}

export default html;
