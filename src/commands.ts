type CommandContext = {
  history: string[];
  clear: () => void;
  output: HTMLElement;
  scrollToInput: () => void;
  afterHandle: (cb: () => void) => void;
};

type Command = {
  description: string;
  handler: (args: string[], context: CommandContext) => string;
};

function tryEval(command: string) {
  try {
    return eval(command);
  } catch (e) {
    return (e as Error).message;
  }
}

const commands: Record<string, Command> = {
  help: {
    description: 'Show help',
    handler: () => {
      return Object.keys(commands).reduce(
        (acc, command) => `${acc}${command}: ${commands[command].description}\n`,
        'Available Commands:\n',
      );
    },
  },
  smiley: {
    description: 'A smiley face',
    handler: () => ':)\n:)',
  },
  history: {
    description: 'Show command history',
    handler: (_, { history }) => history.join('\n'),
  },
  eval: {
    description: 'Evaluate a JavaScript expression',
    handler: (args: string[]) => tryEval(args.join(' ')).toString(),
  },
  clear: {
    description: 'Clear the output',
    handler: (_, { clear }) => {
      clear();
      return 'Cleared!';
    },
  },
  image: {
    description: 'Show an image',
    handler: (args: string[], { output, scrollToInput, afterHandle }) => {
      const [src] = args;
      if (!src) throw new Error('Missing src');

      afterHandle(() => {
        const img = document.createElement('img');
        img.src = src;
        output.appendChild(img);
        scrollToInput();
      });

      return 'Showing image...';
    },
  },
  credits: {
    description: 'Show credits',
    handler: (_, { afterHandle, output }) => {
      afterHandle(() => {
        const creditLink = document.createElement('a');
        creditLink.href = 'https://paripsky.github.io/';
        creditLink.textContent = '@paripsky';
        creditLink.target = '_blank';
        output.lastChild?.childNodes[3]?.appendChild(creditLink);
      });

      return 'Made by ';
    },
  },
};

export type AddCommandOptions = {
  command: string;
  description: string;
  handler: (args: string[], context: CommandContext) => string;
};

export function addCommand({ command, description, handler }: AddCommandOptions) {
  commands[command] = {
    description,
    handler,
  };
}

export function removeCommand(command: string) {
  delete commands[command];
}

export function handleCommand(command: string, context: CommandContext) {
  const cmd = command.split(' ')[0].toLowerCase();
  const args = command.split(' ').slice(1);

  if (!commands[cmd]) throw new Error(`${cmd}: command not found`);

  return commands[cmd].handler(args, context);
}
