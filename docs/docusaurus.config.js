const {themes: prismThemes} = require('prism-react-renderer');

const repositoryUrl = 'https://github.com/havaianasdestruido/apkdecomp-skill';
const productionSiteUrl = 'https://havaianasdestruido.github.io/apkdecomp-skill/';
const docsBaseUrl = process.env.DOCS_BASE_URL || '/docs/';
const siteBaseUrl = process.env.SITE_BASEURL;
const projectHomeUrl =
  siteBaseUrl === undefined ? productionSiteUrl : `${siteBaseUrl.replace(/\/+$/, '')}/`;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'APKDecomp Documentation',
  tagline: 'Choose the right layer. Verify the output.',
  favicon: 'img/favicon.svg',

  url: 'https://havaianasdestruido.github.io',
  baseUrl: docsBaseUrl,
  trailingSlash: true,

  organizationName: 'havaianasdestruido',
  projectName: 'apkdecomp-skill',

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'content',
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: `${repositoryUrl}/edit/main/docs/content/`,
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: false,
        pages: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.6,
        },
      },
    ],
  ],

  themes: [
    '@docusaurus/theme-mermaid',
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexDocs: true,
        indexBlog: false,
        indexPages: false,
        docsRouteBasePath: '/',
        docsDir: 'content',
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],

  themeConfig: {
    image: 'img/docs-card.png',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    announcementBar: {
      id: 'authorized_use',
      content:
        `<strong>Authorized analysis only.</strong> Use these workflows on software you own or have explicit permission to assess. <a href="${docsBaseUrl}responsible-use/">Read the policy →</a>`,
      backgroundColor: '#c8ff65',
      textColor: '#07110f',
      isCloseable: true,
    },
    navbar: {
      title: 'APKDecomp',
      logo: {
        alt: 'APKDecomp geometric package mark',
        src: 'img/logo.svg',
      },
      hideOnScroll: false,
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Guides',
        },
        {
          to: '/reference/tool-selection/',
          label: 'Tool matrix',
          position: 'left',
        },
        {
          href: projectHomeUrl,
          label: 'Project home',
          position: 'right',
        },
        {
          href: repositoryUrl,
          label: 'GitHub',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Learn',
          items: [
            {label: 'Get started', to: '/getting-started/'},
            {label: 'Triage a package', to: '/guides/triage/'},
            {label: 'Command reference', to: '/reference/commands/'},
          ],
        },
        {
          title: 'Project',
          items: [
            {label: 'Project home', href: projectHomeUrl},
            {label: 'Source code', href: repositoryUrl},
            {label: 'Contribute', to: '/contributing/'},
          ],
        },
        {
          title: 'Policy',
          items: [
            {label: 'Responsible use', to: '/responsible-use/'},
            {label: 'MIT license', href: `${repositoryUrl}/blob/main/LICENSE`},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} APKDecomp contributors. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'java', 'python', 'json', 'groovy'],
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 3,
    },
    metadata: [
      {name: 'keywords', content: 'APK, Android, reverse engineering, jadx, apktool, Docusaurus'},
    ],
  },
};

module.exports = config;
