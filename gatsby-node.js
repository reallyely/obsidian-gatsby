const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  if (node.internal.type === `Mdx`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const notesTemplate = require.resolve(`./src/templates/noteTemplate.js`)

  const result = await graphql(`
  {
    allMdx(filter: {frontmatter: {doctype: {ne: "person"}, tags: {nin: "private"}}}) {
      edges {
        node {
          slug
        }
      }
    }
  }
`)

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  result.data.allMdx.edges.forEach(({ node }) => {
    const slug = node.slug
    createPage({
      path: `${slug}`,
      component: notesTemplate,
      context: {
        // additional data can be passed via context
        slug,
      },
    })
  })
}