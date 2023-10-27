import { promises as fsp } from "fs";
import { homedir } from "os";

const vaultImagesPath = homedir() + "/Code/mindstorm/images";
const vaultNotesPath = homedir() + "/Code/mindstorm";
const siteImagesPath = homedir() + "/Code/nick-blogster/public/images";
const siteNotesPath = homedir() + "/Code/nick-blogster/content/blog";

async function getNote(fileName) {
  const noteContent = await fsp.readFile(
    vaultNotesPath + "/" + fileName,
    "utf-8"
  );

  if (noteContent.indexOf("---") != 0) return null;

  const frontmatterText = noteContent.split("---")[1];
  // convert frontmatter to object
  const frontmatter = frontmatterText.split("\n").reduce((object, line) => {
    const [key, value] = line.split(":");
    if (key && value) {
      // some yaml strings are quoted
      if (value.trim().indexOf('"') == 0) {
        object[key.trim()] = value.trim().slice(1, -1);
      } else {
        object[key.trim()] = value.trim();
      }
    }
    return object;
  }, {});

  if (!frontmatter.slug) return null;
  if (frontmatter.note !== "publish") return null;

  return {
    vaultTitle: fileName.split(".md")[0],
    slug: frontmatter.slug,
    content: noteContent,
  };
}

async function readNotes() {
  let noteFileNames = await fsp.readdir(vaultNotesPath);
  noteFileNames = noteFileNames.filter((fileName) => fileName.endsWith(".md"));
  const notes = await Promise.all(
    noteFileNames.map((noteFileName) => getNote(noteFileName))
  );
  // filter out null values
  return notes.filter((note) => note);
}

function processNotes(notes) {
  const regex = /\[\[(.+?)\]\]/g;
  return notes.map((note) => {
    // check for wikilinks
    const matches = note.content.match(regex);
    if (matches) {
      matches.forEach((match) => {
        const link = match.slice(2, -2);
        const linkParts = link.split("|");
        const linkText = linkParts[1] || linkParts[0];
        const linkedNote = notes.find(
          (note) => note.vaultTitle === linkParts[0]
        );
        // if there is a linked note, replace with markdown link
        if (linkedNote) {
          note.content = note.content.replace(
            match,
            `[${linkText}](/${linkedNote.slug}/)`
          );
        } else {
          // if there is no linked note, remove wikilink
          note.content = note.content.replace(match, linkText);
        }
      });
    }
    return note;
  });
}

async function writeNotes() {
  const notes = await readNotes();
  const processedNotes = processNotes(notes);

  return Promise.all(
    processedNotes.map((note) =>
      fsp.writeFile(siteNotesPath + "/" + note.slug + ".md", note.content)
    )
  );
}

async function copyImages() {
  const images = await fsp.readdir(vaultImagesPath);
  return Promise.all(images.map((image) => copyImage(image)));
}

async function copyImage(image) {
  return fsp.copyFile(
    vaultImagesPath + "/" + image,
    siteImagesPath + "/" + image
  );
}

console.log("writing notes...");
await writeNotes();
console.log("done writing notes.");

console.log("copying images...");
await copyImages();
console.log("done copying images.");