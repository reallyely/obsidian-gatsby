import React from "react"
import { Link, graphql } from "gatsby"
import { path } from 'ramda'

import DataTable from 'react-data-table-component';

const columns = [
  {
    name: 'Name',
    selector: 'name',
    sortable: true,
    cell: row => <Link to={row.slug} title={row.name}>{row.name}</Link>
  },
  {
    name: 'Modified',
    selector: 'modified',
    sortable: true,
    format: ({ modified }) => `${modified.toISOString().substring(0, 10)}`,
    right: true,
  },
  {
    name: 'DocType',
    selector: 'doctype',
    sortable: true
  }
];

const Home = ({
  data: {
    allMdx: { nodes },
  },
}) => {
  const notes = nodes.sort((a, b) => {
    const dateA = new Date(path(['parent', 'mtime'], a));
    const dateB = new Date(path(['parent', 'mtime'], b));
    return dateA.getTime() < dateB.getTime() ? 1 : -1;
  })
    .map(node => ({
      id: path(['id'], node),
      slug: `/${path(['slug'], node)}`,
      name: path(['parent', 'name'], node),
      modified: new Date(path(['parent', 'mtime'], node)),
      doctype: path(['frontmatter', 'doctype'], node)
    }))

  return <div className="container">
    <DataTable dense compact title="Stephen's very cool notes" style={{ maxWidth: '800px' }} customStyles={customStyles} columns={columns} data={notes}></DataTable>
  </div>
}

const customStyles = {
  header: {
    style: {
      background: 'transparent',
      color: 'var(--text-normal)'
    },
  },
  head: {
    style: {
      backgroundColor: "var(--background-dark-half)",
      border: 0,
      height: '1.5em',
      padding: '.2em',
    }
  },
  headCells: {
    style: {
      color: "var(--text-normal)",
      textAlign: 'left',
      fontFamily: 'Roboto',
      fontWeight: 500,
      fontSize: '1.2em',
      background: "transparent",
      '&:hover': {
        color: "var(--text-error)"
      }
    },
    activeSortStyle: {
      color: "var(--text-accent)",
      '&:hover': {
        outline: 'none',
        color: "var(--text-accent-hover)"
      },
      '&:hover:not(:focus)': {
        color: "var(--text-accent)"
      },
    },
    inactiveSortStyle: {
      color: "var(--text-accent)",
      '&:focus': {
        outline: 'none',
      },
      '&:hover': {
        color: "var(--text-accent-hover)"
      },
    },
  },
  headRow: {
    style: {
      background: "transparent"
    }
  },
  cells: {
    style: {
      color: "var(--text-normal)",
      background: "transparent",
      border: 'none'
    }
  },
  rows: {
    style: {
      background: 'transparent',
      borderBottom: 'none'
    }
  },
  table: {
    style: {
      background: "transparent"
    }
  },
  tableWrapper: {
    style: {
      background: "transparent"
    }
  },
}
export default Home

export const pageQuery = graphql`
  query MyQuery
    {
    allMdx {
      nodes {
        id
        slug
        frontmatter {
          doctype
        }
        parent {
          ... on File {
            name
            id
            mtime
          }
        }
      }
    }
  }
`
