export {
  getPackages,
  getRootPackage,
  writePackageJsons,
  updatePackageVersion
} from './repository';
export { Package } from './package';

export type { PackageJson } from 'type-fest';

export const DependencyField = {
  Dependencies: 'dependencies',
  DevDependencies: 'devDependencies',
  PeerDependencies: 'peerDependencies',
} as const;
export type DependencyField = typeof DependencyField[keyof typeof DependencyField];

export interface Dependency {
  field: DependencyField;
  name: string;
  version: string
}

