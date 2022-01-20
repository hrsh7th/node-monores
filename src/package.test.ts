import path from "path";
import { Package } from ".";

describe('package', () => {

  it('.is', () => {
    expect(Package.is(path.resolve(__dirname, '../fixtures/apps'))).toBe(false);
    expect(Package.is(path.resolve(__dirname, '../fixtures/apps/debugger'))).toBe(true);
  })

  it('match', () => {
    const rootPackage = new Package({
      filepath: path.resolve(__dirname, '../fixtures')
    })
    const appsPackage = new Package({
      filepath: path.resolve(__dirname, '../fixtures/apps/debugger'),
      rootPackage: rootPackage
    });
    expect(appsPackage.match('apps/*')).toBe(true);
    expect(appsPackage.match('packages/*')).toBe(false);
  });
  
});

