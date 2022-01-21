import path from "path";
import { getPackages, getRootPackage } from ".";

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
  
});
