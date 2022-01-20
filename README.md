monores
=====

Monorepo management scripts.


Usage
=====

```ts
import { getPackages, getRootPackage, updateVersion } from 'monores';

// Update test command only `apps` packages..
getPackages('apps/*').forEach(p => {
  p.packageJson.scripts = p.packageJson.scripts ?? {};
  p.packageJson.scripts.test = 'jest --passWithNoTests';
  p.writePackageJson();
});

// Update versions (like lerna's fixed versioning.)
const version = getRootPackage().packageJson.version;
getPackages().forEach(p => {
  updateVersion(p, version);
});
```

