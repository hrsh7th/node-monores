import { Cache } from "./cache";

import { describe, it, expect, vi } from 'vitest';

describe('cache', () => {

  it('#ensure', () => {
    const ensure = vi.fn(() => 1);
    const cache = new Cache();
    expect(cache.ensure('a', ensure)).toBe(1);
    expect(ensure).toHaveBeenCalledTimes(1);
    expect(cache.ensure('a', ensure)).toBe(1);
    expect(ensure).toHaveBeenCalledTimes(1);
  })

  it('#{get,set,delete}', () => {
    const cache = new Cache();
    expect(cache.get('a')).toBe(null);
    cache.set('a', 1);
    expect(cache.get('a')).toBe(1);
    cache.delete('a');
    expect(cache.get('a')).toBe(null);
  });

});
