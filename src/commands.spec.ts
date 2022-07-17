import { describe, expect, it, vi } from 'vitest';

import { handleCommand } from './commands';

const mockAPI = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  clear: () => {},
  history: [],
};

describe('commands', async () => {
  it('clear', () => {
    const clear = vi.fn();
    const result = handleCommand('clear', { history: [], clear });
    expect(result).toBe('Cleared!');
    expect(clear).toHaveBeenCalled();
  });

  it('history', () => {
    const result = handleCommand('history', { ...mockAPI, history: ['foo', 'bar'] });
    expect(result).toBe('foo\nbar');
  });

  it('help', () => {
    const result = handleCommand('help', { ...mockAPI });
    expect(result).toBe(`Available Commands:
help: Show help
smiley: A smiley face
history: Show command history
eval: Evaluate a JavaScript expression
clear: Clear the output
`);
  });
});
