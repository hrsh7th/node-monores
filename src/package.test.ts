import path from "path";
import { Package } from ".";

describe('package', () => {

  it('.is', () => {
    expect(Package.is(path.resolve(__dirname, '../fixtures/apps'))).toBe(false);
    expect(Package.is(path.resolve(__dirname, '../fixtures/apps/debugger'))).toBe(true);
  })

  it('#match', () => {
    const rootPackage = new Package({
      dir: path.resolve(__dirname, '../fixtures')
    })
    const appsPackage = new Package({
      dir: path.resolve(__dirname, '../fixtures/apps/debugger'),
      rootPackage: rootPackage
    });
    expect(appsPackage.match('apps/*')).toBe(true);
    expect(appsPackage.match('packages/*')).toBe(false);
  });

  it('#getDependency', () => {
    const rootPackage = new Package({
      dir: path.resolve(__dirname, '../fixtures')
    })
    const appsPackage = new Package({
      dir: path.resolve(__dirname, '../fixtures/apps/debugger'),
      rootPackage: rootPackage
    });
    expect(appsPackage.getDependency('dependencies', '@example/package-a')).toEqual({
      field: 'dependencies',
      name: '@example/package-a',
      version: '0.0.0'
    });
  });

  it('#setDependency', () => {
    const rootPackage = new Package({
      dir: path.resolve(__dirname, '../fixtures')
    })
    const appsPackage = new Package({
      dir: path.resolve(__dirname, '../fixtures/apps/debugger'),
      rootPackage: rootPackage
    });
    appsPackage.setDependency('dependencies', 'lodash', '1.0.0');
    expect(appsPackage.packageJson.dependencies?.['lodash']).toBe('1.0.0');
    appsPackage.setDependency('dependencies', 'lodash', null);
    expect(appsPackage.packageJson.dependencies).not.toHaveProperty('lodash');
  });

  it('#findDependency', () => {
    const rootPackage = new Package({
      dir: path.resolve(__dirname, '../fixtures')
    })
    const appsPackage = new Package({
      dir: path.resolve(__dirname, '../fixtures/apps/debugger'),
      rootPackage: rootPackage
    });
    expect(appsPackage.findDependencies({ pattern: /^@example\// })).toEqual([{
      field: 'dependencies',
      name: '@example/package-a',
      version: '0.0.0'
    }, {
      field: 'dependencies',
      name: '@example/package-b',
      version: '0.0.0'
    }]);
    expect(appsPackage.findDependencies({ pattern: /^$/ })).toEqual([]);
  });
  
});

