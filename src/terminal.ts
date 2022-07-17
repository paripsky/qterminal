/**
 * Pluggable & Themable Quake style terminal for the web
 * Animated open with shortcuts
 * customize the css using css or allow to pass css overrides
 * async + deferred, start automatically if has attribute?
 * autocomplete for history and available commands
 * built in themes, etc
 * plugins
 * stackblitz dmeo
 * ssr support?
 * prefers-reduced-motion support
 * persist history in local storage (50 items as default)
 * accessability
 */
import { handleCommand } from './commands';
import html from './html';

type CreateTerminalOptions = {
  el?: HTMLElement;
  listenerContainer?: EventTarget;
  closeOnClickOutside?: boolean;
  startOpen?: boolean;
};

const terminalTemplate = () => `
  <div class="terminal-container">
    <div id="terminal-output"></div>
    <form id="terminal-input-form" class="terminal-input-container">
      &gt;
      <input class="terminal-input" />
    <form>
  </div>
`;

const outputTemplate = (command: string, result: string) => `
  <div>
    <div class="terminal-output-item">&gt;${command}</div>
    <div class="terminal-output-item">${result}</div>
  </div>
`;

export function createTerminal({
  el = document?.body,
  listenerContainer = window,
  closeOnClickOutside = true,
  startOpen = false,
}: CreateTerminalOptions = {}) {
  const terminalRoot = html(terminalTemplate()) as HTMLElement;
  const output = terminalRoot.querySelector('#terminal-output') as HTMLDivElement;
  const inputForm = terminalRoot.querySelector('#terminal-input-form') as HTMLFormElement;
  const input = inputForm.elements[0] as HTMLInputElement;
  const history: string[] = [];
  let isOpen = startOpen;

  function clear() {
    output.replaceChildren();
  }

  function open() {
    isOpen = true;
    el.appendChild(terminalRoot);
    input.focus();
    setTimeout(() => terminalRoot.classList.add('terminal-container--open'));
  }

  function close() {
    isOpen = false;
    terminalRoot.classList.remove('terminal-container--open');
    terminalRoot.addEventListener(
      'transitionend',
      () => {
        if (!isOpen) {
          el.removeChild(terminalRoot);
        }
      },
      { once: true },
    );
  }

  listenerContainer.addEventListener('keydown', (e) => {
    if ((e as KeyboardEvent)?.code === 'Backquote') {
      e.preventDefault();
      isOpen ? close() : open();
    }
  });

  if (closeOnClickOutside) {
    listenerContainer.addEventListener('click', (e) => {
      if (!e.target) return;
      if ((e.target as HTMLElement).closest('.terminal-container') !== terminalRoot) {
        close();
      }
    });
  }

  const context = {
    history,
    clear,
  };

  function onCommand(command: string) {
    const result = handleCommand(command, context);
    output.appendChild(html(outputTemplate(command, result)) as HTMLElement);
    input.scrollIntoView({ behavior: 'smooth' });
    history.push(command);
  }

  inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!input.value) return;

    onCommand(input.value);
    input.value = '';
  });

  if (startOpen) {
    open();
  }

  return {
    isOpen: () => isOpen,
    open,
    close,
  };
}
