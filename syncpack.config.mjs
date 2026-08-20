// @ts-check

/** @type {import("syncpack").RcFile} */
export default {
  dependencyTypes: ['dev', 'prod', 'peer'],
  filter: '.',
  indent: '  ',
  semverGroups: [
    {
      range: '^',
      dependencies: ['**'],
      packages: ['**'],
    },
  ],
  versionGroups: [
    {
      label: 'Internal workspace packages must use workspace:*',
      dependencies: ['@lang-flow/**'],
      dependencyTypes: ['dev', 'prod'],
      pinVersion: 'workspace:*',
    },
    {
      label:
        'All external dependencies must have identical versions across the monorepo',
      dependencies: ['**'],
      packages: ['**'],
    },
  ],
  sortAz: [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'resolutions',
    'keywords',
  ],
  sortFirst: ['name', 'version', 'private', 'type', 'scripts'],
};
