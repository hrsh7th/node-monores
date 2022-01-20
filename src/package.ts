import fs from 'fs';
import path from 'path';
import minimatch from 'minimatch';
import type { PackageJson } from '.';

export class Package {

  /**
   * filepath.
   */
  public readonly filepath: string;

  /**
   * package.json.
   */
  public packageJson: PackageJson;


  /**
   * root package.
   */
  private rootPackage?: Package;

  /**
   * Return the filepath is module or not.
   */
  public static is(filepath: string) {
    return fs.existsSync(path.join(filepath, 'package.json'));
  }

  public constructor(args: {
    filepath: string;
    rootPackage?: Package,
  }) {
    this.filepath = args.filepath;
    this.packageJson = require(path.resolve(args.filepath, 'package.json'));
    this.rootPackage = args.rootPackage;
  }
  
  /**
   * match by glob pattern.
   */
  match(pattern: string) {
    if (!this.rootPackage) {
      return false;
    }
    return minimatch(path.relative(this.rootPackage.filepath, this.filepath), pattern);
  }

  /**
   * Write package.json.
   */
  writePackageJson() {
    fs.writeFileSync(path.join(this.filepath, 'package.json'), JSON.stringify(this.packageJson, null, 2));
  }

}

