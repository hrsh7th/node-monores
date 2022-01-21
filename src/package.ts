import fs from 'fs';
import path from 'path';
import minimatch from 'minimatch';
import { Dependency, DependencyField, PackageJson } from '.';

export class Package {

  /**
   * dir.
   */
  public readonly dir: string;

  /**
   * package.json.
   */
  public packageJson: PackageJson;


  /**
   * root package.
   */
  private rootPackage?: Package;

  /**
   * Return the dir is module or not.
   */
  public static is(dir: string) {
    return fs.existsSync(path.join(dir, 'package.json'));
  }

  public constructor(args: {
    dir: string;
    rootPackage?: Package,
  }) {
    this.dir = args.dir;
    this.packageJson = require(path.resolve(args.dir, 'package.json'));
    this.rootPackage = args.rootPackage;
  }
  
  /**
   * match by glob pattern.
   */
  match(pattern: string) {
    if (!this.rootPackage) {
      return false;
    }
    return minimatch(path.relative(this.rootPackage.dir, this.dir), pattern);
  }

  /**
   * Find dependencies.
   */
  findDependencies(option: { fields?: DependencyField[], pattern: RegExp }): Dependency[] {
    return (option.fields ?? Object.values(DependencyField)).reduce((dependencies, field) => {
      Object.entries(this.packageJson[field] ?? {}).forEach(([name, version]) => {
        if (option.pattern.test(name)) {
          dependencies.push({
            field: field,
            name: name,
            version: version,
          });
        }
      });
      return dependencies;
    }, [] as Dependency[]);
  }

  /**
   * Get dependency.
   */
  getDependency(field: DependencyField, name: string): Dependency | null {
    if (this.packageJson[field]) {
      if (this.packageJson[field]?.[name]) {
        return {
          field: field,
          name: name,
          version: this.packageJson[field]![name],
        }
      }
    }
    return null;
  }

  /**
   * Set dependency.
   */
  setDependency(field: DependencyField, name: string, version: string | null) {
    this.packageJson[field] = this.packageJson[field] ?? {};
    if (version) {
      this.packageJson[field]![name] = version;
    } else {
      delete this.packageJson[field]?.[name];
    }
  }

  /**
   * Write package.json.
   */
  writePackageJson() {
    fs.writeFileSync(path.join(this.dir, 'package.json'), JSON.stringify(this.packageJson, null, 2));
  }

}

