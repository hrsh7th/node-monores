import glob from 'glob';
import path from 'path';

import { Cache } from './cache';
import { Package } from './package';

const cache = new Cache();

/**
 * Get monorepo root package.
 */
export const getRootPackage = () => {
  return cache.ensure<Package>('getRootPackage', () => {
    let filepath = process.cwd();
    while (filepath !== '/') {
      if (Package.is(filepath)) {
        const packageJson = require(path.join(filepath, 'package.json'));
        if (packageJson.workspaces) {
          return new Package({ filepath });
        }
      }
      filepath = path.dirname(filepath);
    }
    throw new Error(`can't detect workspace root directory.`);
  })
};

/**
 * Get all managed package.
 */
export const getPackages = (filterPattern = '**/*') => {
  return cache.ensure<Package[]>(['getPackages', filterPattern], () => {
    const rootPackage = getRootPackage()
    const workspaces = rootPackage.packageJson.workspaces!;
    const patterns = Array.isArray(workspaces) ? workspaces : workspaces.packages ?? [];
    return patterns.reduce((packages: Package[], pattern: string) => {
      glob.sync(`${pattern}/package.json`, {
        cwd: rootPackage.filepath,
        absolute: true,
        ignore: '**/node_modules',
      }).forEach((filepath: string) => {
        filepath = path.dirname(filepath);
        if (Package.is(filepath)) {
          const p = new Package({ filepath, rootPackage })
          if (p.match(filterPattern)) {
            packages.push(p)
          }
        }
      })
      return packages;
    }, []);
  });
};

/**
 * Update version.
 */
export const updateVersion = (target: Package, version: string) => {
  getPackages().forEach((p: Package) => {
    if (p.packageJson.name === target.packageJson.name) {
      p.packageJson.version = version;
    } else {
      (['dependencies', 'devDependencies', 'peerDependencies', 'acceptDependencies'] as const).forEach(depsField => {
        const deps = p.packageJson[depsField];
        if (deps && deps[target.packageJson.name]) {
          deps[target.packageJson.name] = version;
        }
      })
    }
    p.writePackageJson();
  });
};

