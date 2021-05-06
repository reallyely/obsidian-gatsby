const slugify = require("slugify")
const notesPath = title => `/${title}`

const supportRenamedWikiLinks = str => {
  const title = str.replace(/\s*\\+/, '')
  const stripAllButLink = new RegExp(/(.+)\|/)

  if (title.includes('|')) {
    // console.log('>>', stripAllButLink.exec(title))
    return stripAllButLink.exec(title)[1]
  }
  return title
}


module.exports = title => {
  return notesPath(slugify(supportRenamedWikiLinks(title)))
}