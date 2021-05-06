module.exports = (str) => {
  const title = str.replace(/\s*\\+/, '')
  const stripAllButLink = new RegExp(/(.+)\|/)

  if (title.includes('|')) {
    // console.log('>>', stripAllButLink.exec(title))
    // console.log(stripAllButLink.exec(title)[1])
    return stripAllButLink.exec(title)[1]
  }
  return title
}
