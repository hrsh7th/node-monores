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
    let dir = process.cwd();
    while (dir !== '/') {
      if (Package.is(dir)) {
        const packageJson = require(path.join(dir, 'package.json'));
        if (packageJson.workspaces) {
          return new Package({ dir });
        }
      }
      dir = path.dirname(dir);
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
        cwd: rootPackage.dir,
        absolute: true,
        ignore: '**/node_modules',
      }).forEach((dir: string) => {
        dir = path.dirname(dir);
        if (Package.is(dir)) {
          const p = new Package({ dir, rootPackage })
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

