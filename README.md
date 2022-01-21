monores
=====

Monorepo management scripts.


Usage
=====

```ts
import { getPackages, getRootPackage, updatePackageVersion,  } from 'monores';

// Update test command only `apps` packages..
getPackages('apps/*').forEach(p => {
  const scripts = p.packageJson.scripts ?? {};
  scripts.test = 'jest --passWithNoTests';
  p.writePackageJson();
});

// Update versions (like lerna's fixed versioning.)
getPackages().forEach(p => {
  updatePackageVersion(p, getRootPackage().packageJson.version);
});
writePackageJsons();
```

