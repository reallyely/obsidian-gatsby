/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */
const contentDir = "C:/Users/212635452/dev/omnibus-content"

module.exports = {
  pathPrefix: `/pages/212635452/`,
  /* Your site config here */
  plugins: [
    `gatsby-remark-autolink-headers`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-remark-images`,
    `gatsby-remark-mermaid`,
    `gatsby-transformer-remark-wikilinks-to-link`,
    `gatsby-remark-prismjs`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.md`],
        gatsbyRemarkPlugins: [
          // so url#header navigation works
          {
            resolve: require.resolve(`gatsby-remark-autolink-headers`),
            options: {
              isIconAfterHeader: true,
              maintainCase: true,
            }
          },
          // to render mermaid diagrams written in ```mermaid code fences
          // `gatsby-remark-mermaid`,
          // to transform [[]] links to hyperlinks
          {
            resolve: require.resolve(`./plugins/gatsby-transformer-remark-wikilinks-to-link`),
            options: { titleToURLPath: `${__dirname}/src/slugify-wiki-links.js` }
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1080,
              defaultQuality: 100,
              backgroundColor: 'rgba(0,0,0,0)',

            }
          },
          {
            resolve: `gatsby-remark-prismjs`,
          }
        ]
      },
    },
    // to get markdown files as a data source
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `notes`,
        path: contentDir,
        ignore: ['/templates/**', '**/\.*']
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `assets`,
        path: `${contentDir}/assets/`,
      },
    },
    // to detect inbound and outbound references made in markdown files with [[]]
    {
      resolve: `gatsby-transformer-markdown-references`,
      options: {
        types: ["Mdx"], // or [`RemarkMarkdown`] (or both)
      },
    },
    // to improve page load times
    `gatsby-plugin-catch-links`,

  ],
}
