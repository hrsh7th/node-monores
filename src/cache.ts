type Key = string | (string | number)[];

export class Cache {

  private entries = new Map<Key, unknown>();

  /**
   * Ensure entry.
   */
  public ensure<T>(key: Key, callback: () => T): T {
    if (!this.entries.has(key)) {
      this.entries.set(key, callback())
    }
    return this.entries.get(key) as T;
  }

  /**
   * Get entry.
   */
  public get<T>(key: Key): T | null {
    return (this.entries.get(key) as T) ?? null;
  }

  /**
   * Set entry.
   */
  public set(key: Key, value: unknown) {
    this.entries.set(key, value);
  }

  /**
   * Delete entry.
   */
  public delete(key: Key) {
    this.entries.delete(key);
  }
  
}

