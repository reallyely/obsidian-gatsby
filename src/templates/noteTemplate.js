import React from "react"
import { graphql, Link, withPrefix } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { MDXProvider } from '@mdx-js/react'

export default function noteTemplate({ data }) {
  const { mdx } = data

  return (
    <div className="container note-container">
      <section className="comfortable-width">
        <div className="nav">
          <Link to="/">Go Back Home</Link>
        </div>

        <article>
          <MDXProvider components={components}>
            <MDXRenderer>{mdx.body}</MDXRenderer>
          </MDXProvider>
        </article>

        <div className="discovery">
          <hr />
          {mdx.inboundReferences.length > 0 ? <h5>This page is referenced in:</h5> : ""}
          <ul>
            {mdx.inboundReferences.map(referenceLink)}
          </ul>
          {mdx.outboundReferences.length > 0 ? <h5>This page makes references to:</h5> : ""}
          <ul>
            {mdx.outboundReferences.map(referenceLink)}
          </ul>
        </div>
      </section>
    </div>
  )
}

const referenceLink = ref => (
  <li key={ref.parent.id}>
    <Link to={`/${ref.slug}`} title={ref.parent.name}>{ref.parent.name}</Link>
  </li>
)

const components = {
  a: props => {
    if (props.href.startsWith("http")) {
      return <a {...props} />
    }
    return <Link to={props.href} {...props} />
  },
  img: props => <img {...props} src={withPrefix(props.url)} />

}


export const query = graphql`
  query($slug: String!) {
    mdx(slug: { eq: $slug }) {
      body
      slug
      inboundReferences {
          ... on Mdx {
            slug
            parent {
              ... on File {
                id
                name
              }
            }
          }
        }
        outboundReferences {
          ... on Mdx {
            slug
            parent {
              ... on File {
                id
                name
              }
            }
          }
        }
    }
  }
`