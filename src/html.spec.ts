import { describe, expect, it } from 'vitest';

import html from './html';

describe('html creates dom elements', async () => {
  it('should match snapshot', () => {
    const dom = html('<div>test div creation</div>');
    expect(dom).toMatchSnapshot();
  });

  it('returns only the first child', () => {
    const dom = html('<div>test div creation</div><div>2</div>');
    expect(dom).toMatchSnapshot();
  });
});
