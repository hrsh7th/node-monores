export * from './package';
export * from './repository';

export interface PackageJson {
  name: string;
  version: string;
  workspaces?: string[] | {
    packages?: string[];
  };
  main?: string;
  module?: string;
  typings?: string;
  scripts?: Record<string, string>,
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  acceptDependencies?: Record<string, string>;
}

