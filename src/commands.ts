type CommandContext = {
  history: string[];
  clear: () => void;
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
};

export function handleCommand(command: string, context: CommandContext) {
  const cmd = command.split(' ')[0].toLowerCase();
  const args = command.split(' ').slice(1);

  if (!commands[cmd]) return `${cmd}: command not found`;

  return commands[cmd].handler(args, context);
}
