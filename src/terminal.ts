import { handleCommand } from './commands';
import html from './html';

const defaultPromptMessage = '&gt;';

type TerminalTemplateOptions = {
  promptMessage?: string;
};

const terminalTemplate = ({
  promptMessage = defaultPromptMessage,
}: TerminalTemplateOptions = {}) => `
  <div class="terminal-container">
    <div id="terminal-output"></div>
    <form id="terminal-input-form" class="terminal-input-container">
      ${promptMessage}
      <input class="terminal-input" />
    <form>
  </div>
`;

type outputTemplateOptions = {
  promptMessage?: string;
  error?: boolean;
};

const outputTemplate = (
  command: string,
  result: string,
  { promptMessage = defaultPromptMessage, error = false }: outputTemplateOptions = {},
) => `
  <div>
    <div class="terminal-output-item">${promptMessage}${command}</div>
    <div class="terminal-output-item ${
      error ? 'terminal-output-item--error' : ''
    }">${result}</div>
  </div>
`;

type CreateTerminalOptions = {
  el?: HTMLElement;
  listenerContainer?: EventTarget;
  closeOnClickOutside?: boolean;
  startOpen?: boolean;
  promptMessage?: string;
  toggleShortcut?: string;
};

export function createTerminal({
  el = document?.body,
  listenerContainer = window,
  closeOnClickOutside = true,
  startOpen = false,
  promptMessage = defaultPromptMessage,
  toggleShortcut = 'Backquote',
}: CreateTerminalOptions = {}) {
  const terminalRoot = html(terminalTemplate({ promptMessage })) as HTMLElement;
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

  const openEventListener = (e: Event) => {
    if ((e as KeyboardEvent)?.code === toggleShortcut) {
      e.preventDefault();
      if (isOpen && input !== document.activeElement) {
        input.focus();
        return;
      }

      isOpen ? close() : open();
    }
  };

  listenerContainer.addEventListener('keydown', openEventListener);

  let clickOutsideEventListener: (e: Event) => void;
  if (closeOnClickOutside) {
    clickOutsideEventListener = (e) => {
      if (!e.target) return;
      if ((e.target as HTMLElement).closest('.terminal-container') !== terminalRoot) {
        close();
      }
    };

    listenerContainer.addEventListener('click', clickOutsideEventListener);
  }

  function scrollToInput() {
    input.scrollIntoView({ behavior: 'smooth' });
  }

  const context = {
    history,
    clear,
    output,
    scrollToInput,
  };

  function onCommand(command: string) {
    let afterHandleHook: (() => void) | undefined;

    try {
      const result = handleCommand(command, {
        ...context,
        afterHandle(cb: () => void) {
          afterHandleHook = cb;
        },
      });
      output.appendChild(
        html(outputTemplate(command, result, { promptMessage })) as HTMLElement,
      );

      if (afterHandleHook) {
        afterHandleHook();
      }
    } catch (err) {
      output.appendChild(
        html(
          outputTemplate(command, (err as Error).message, { promptMessage, error: true }),
        ) as HTMLElement,
      );
    } finally {
      scrollToInput();
      history.push(command);
    }
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

  const destroy = () => {
    listenerContainer.removeEventListener('keydown', openEventListener);
    if (closeOnClickOutside) {
      listenerContainer.removeEventListener('click', clickOutsideEventListener);
    }
    terminalRoot.remove();
  };

  return {
    isOpen: () => isOpen,
    open,
    close,
    destroy,
  };
}
