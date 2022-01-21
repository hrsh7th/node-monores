import glob from 'glob';
import path from 'path';
import { DependencyField } from '.';

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
          return createPackage(dir);
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
          const p = createPackage(dir, rootPackage);
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
 * Update package versions.
 */
export const updatePackageVersion = (target: Package, version: string) => {
  getPackages().forEach((p: Package) => {
    if (p.packageJson.name === target.packageJson.name) {
      p.packageJson.version = version;
    } else {
      Object.values(DependencyField).forEach(depsField => {
        const deps = p.packageJson[depsField];
        if (deps && deps[target.packageJson.name]) {
          deps[target.packageJson.name] = version;
        }
      })
    }
  });
};

/**
 * Write all package.json.
 */
export const writePackageJsons = (filterPattern = '**/*') => {
  getPackages(filterPattern).forEach(p => p.writePackageJson());
};

/**
 * Create and cache package.
 */
const createPackage = (dir: string, rootPackage?: Package) => {
  return cache.ensure(['createPackage', dir], () => {
    return new Package({ dir, rootPackage });
  })
};
