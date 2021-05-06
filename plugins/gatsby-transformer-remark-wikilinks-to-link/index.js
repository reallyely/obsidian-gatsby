const visit = require("unist-util-visit");
const resolveTitleForLink = require('./src/resolve-title-for-link')
const path = require('path')
// TODO: Remove | from the wikilink brackets
// TODO: Algorithmically determine where the thing is in double brackets
// TODO: Determine if the linked to page exists. If it doesnt, it needs to be handled differently
// TODO: Support navigating to heading ( [[my thing#heading]])
// TODO: Support embedding markdown using ![[syntax]]
//  - issue: the syntax tree currently parses that ![ as a paragraph. Will there need to be a separate initial transformer that converts this?
const slugify = require("slugify");
module.exports = (
  { markdownAST, ...rest},
  { titleToURLPath = undefined, stripBrackets = true }
) => {
  // console.log(Object.getOwnPropertyNames(rest))
  // console.log(rest.files.filter(({dir}) => dir.includes('Journal')))
  // console.log(rest.getNode())
  const titleToURL = titleToURLPath
    ? require(titleToURLPath)
    : (title) => `/${slugify(title)}`;

  //   const thisFileNode = rest.getNode(rest.markdownNode.parent)
  // const linkUrl = thisFileNode.relativePath.replace(/ /g, "-").replace(".md", "")
  const definitions = {};

  visit(markdownAST, `definition`, (node) => {
    if (!node.identifier || typeof node.identifier !== "string") {
      return;
    }
    definitions[node.identifier] = true;
  });

  visit(markdownAST, `linkReference`, (node, index, parent) => {
    if (
      node.referenceType !== "shortcut" ||
      (typeof node.identifier === "string" && definitions[node.identifier])
    ) {
      return;
    }
    const siblings = parent.children;
    if (!siblings || !Array.isArray(siblings)) {
      return;
    }
    const previous = siblings[index - 1];
    const next = siblings[index + 1];

    if (!previous || !next) {
      return;
    }

    if (
      previous.type !== "text" ||
      previous.value[previous.value.length - 1] !== "[" ||
      next.type !== "text" ||
      next.value[0] !== "]"
    ) {
      return;
    }
    if (node.label.includes("{") || node.label.includes("^")) {
      return;
    }

    const shortcutPieces = getPiecesOfShortcut(node.label)

    if (shortcutPieces && shortcutPieces.groups) {
      const {
        groups: {
          fileName = rest.getNode(rest.markdownNode.parent).name,
          alias,
          header
        }
      } = shortcutPieces
      const foundFile = rest.files.find(file => file.name === fileName || file.base === fileName)
      if (foundFile) {
        if (isEmbeddedContent(previous) && isImage(fileName)) {
          node.type = "image";
          node.url = `/${foundFile.relativePath}`
        } else {
          node.type = "link";
          node.url = toRelativeUrl(foundFile.relativePath, header)
        }
      } else {
        node.link = "text"
        node.url = "#"
      }
      previous.value = previous.value.replace(/\!\[|\[/, "");
      next.value = next.value.replace(/^\]/, "");

      node.title = alias || fileName;
      node.value = alias || fileName;
      node.label = alias || fileName;
      delete node.referenceType;
      delete node.identifier;

    }
  });
};

const getPiecesOfShortcut = label => regexToExtractPiecesFromShortcut.exec(label.trim())


const isEmbeddedContent = (previous) => {
  return previous.value.endsWith('![')
}
const isImage = (url) => {
  return [".png", ".jpg", ".svg"].some(ext => url.endsWith(ext))
}

const toRelativeUrl = (relativePath, header) => {
  return `/${relativePath.replace(/ /g, "-").replace(".md", "")}${header ? ('/#' + slugify(header)) : ""}`
}

// don't be afraid
const regexToExtractPiecesFromShortcut = new RegExp(/^(?<fileName>[\w\d]+[ \w\d-_/\;',\.<>#]*){0,1}(?:#(?<header>\w+[ \w\d-_/\;',\.<>#]*)){0,1}(?:\|(?<alias>\w+[ \w\d-_/\;',\.<>#]*)){0,1}$/)