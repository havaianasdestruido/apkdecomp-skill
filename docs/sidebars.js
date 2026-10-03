/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Start here',
      collapsed: false,
      items: ['overview', 'getting-started', 'how-it-works', 'responsible-use'],
    },
    {
      type: 'category',
      label: 'Analysis guides',
      collapsed: false,
      items: [
        'guides/triage',
        'guides/static-analysis',
        'guides/managed-frameworks',
        'guides/deobfuscation',
        'guides/native-analysis',
        'guides/dynamic-analysis',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'reference/tool-selection',
        'reference/commands',
        'reference/project-structure',
        'reference/troubleshooting',
        'reference/glossary',
      ],
    },
    {
      type: 'category',
      label: 'Contributing',
      items: ['contributing/index', 'contributing/skill-authoring', 'contributing/website'],
    },
  ],
};

module.exports = sidebars;
