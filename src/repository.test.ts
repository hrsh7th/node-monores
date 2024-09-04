import path from "path";
import { getPackages, getRootPackage, updatePackageVersion } from ".";

import { describe, it, expect } from 'vitest';

describe('repository', () => {

  it('getRootPackage', () => {
    process.chdir(path.resolve(__dirname, '../fixtures/apps/debugger'));
    expect(getRootPackage().dir).toBe(path.resolve(__dirname, '../fixtures'));
  });

  it('getPackages', () => {
    process.chdir(path.resolve(__dirname, '../fixtures/apps/debugger'));
    expect(getPackages()).toHaveLength(3);
    expect(getPackages('apps/*')).toHaveLength(1);
    expect(getPackages('packages/*')).toHaveLength(2);
  });

  it('updatePackageVersion', () => {
    process.chdir(path.resolve(__dirname, '../fixtures/apps/debugger'));
    const aPackage = getPackages('packages/**/package-a').pop();
    updatePackageVersion(aPackage!, '1.0.0');
    const debuggerPackage = getPackages('apps/**/debugger').pop()!;
    expect(debuggerPackage.findDependencies({ pattern: /^@example\/package-a/ }).pop()!.version).toBe('1.0.0');
  });

});
