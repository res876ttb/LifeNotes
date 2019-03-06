/**
 * @name storage.js
 * @desc Store user notes and data. 
 *       The storage.js is based on PouchDB, which use IndexedDB by default.
 */

// ===================================================================================
// import
// I dont know why `require(...packages)` does not work...
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import {getNewID} from './id.js';
import {getCurTime} from './date.js';
import {printc} from './output.js';

// ===================================================================================
// constant
const welcomeNotesId = getNewID();
const ct = getCurTime();
const dbname = 'LifeNoteDB';

const exampleNotes = {
  i: welcomeNotesId,
  // content: '# Welcome to LifeNotes\n#Welcome #Example\nThis is a tutorial for LifeNotes usage.\n',
  lmt: ct, // last modified time
  ct: ct, // created time
  d: '0',
  t: 'Welcome to LifeNotes',
  ta: ['Welcome', 'Example']
};
const exampleDirectory = {
  i: 'id of this directory',                                  // id
  p: 'id of parent of current directory',                     // parent
  na: 'name of current directory',                            // name
  no: ['note id 1', 'note id 2', 'note id 3'],                // notes
  d: ['directory id 1', 'directory id 2', 'directory id 3'],  // directory
  mt: ct                                                      // last modified time
}

// record info of all notes
const defaultDirectoryIndexingFile = {
  '0': { // directory: /
    i: '0',
    p: null,
    na: null,
    no: ['4'],
    d: ['1'],
    mt: ct,
  },
  '1': { // directory: /Inbox
    i: '1',
    p: '0',
    na: 'Inbox',
    no: [],
    d: [],
    mt: ct,
  }
};

// record tags of all notes
const defaultTagsIndexingFile = {
  '0': { // all root tags will be stored in this object
    i: '0',
    na: null,
    no: null,
    t: ['0', '1']
  },
  '1': {
    i: '1',
    na: 'Welcome', 
    no: ['4'],
    t: []
  },
  '2': {
    i: '2',
    na: 'Example',
    no: ['4'],
    t: [],
  }
};

// record header of all notes
const defaultNoteIndexingFile = {
  '4': {
    _id: '4',
    d: '0',
    t: 'Welcome to LifeNotes',
    ta: ['Welcome', 'Example'],
    lmt: ct,
    ct: ct,
  }
}

// ===================================================================================
// global variable
var db;

// ===================================================================================
// private function

/**
 * @private @func createDirectoryIndexingFile
 * @desc A sub-function of initialization. ID of the directory indexing file is '0'
 * @param {string} callback
 * @returns {null}
 */
function createDirectoryIndexingFile(callback) {
  db.find({
    selector: {$and: [
      {'_id': {$eq: '0'}}
    ]}
  }).then(result => {
    if (result.docs.length == 0) {
      db.put({
        _id: '0',
        content: defaultDirectoryIndexingFile,
      }).then(result => {
        printc('Directory-indexing file is created');
        callback();
      });
    } else {
      printc('Note-indexing file has been created');
      callback();
    }
  })
}

/**
 * @private @func createNoteIndexingFile
 * @desc A sub-function of initialization. ID of note indexing file is "1"
 * @param {func} callback This function will be called after creating finishes
 * @return {null}
 */
function createNoteIndexingFile(callback) {
  db.find({
    selector: {$and: [
      {'_id': {$eq: '1'}}
    ]}
  }).then(result => {
    if (result.docs.length == 0) {
      db.put({
        _id: '1', 
        content: defaultNoteIndexingFile
      }).then(result => {
        printc('Note-indexing file is created');
        callback();
      });
    } else {
      printc('Note-indexing file has been created');
      callback();
    }
  });
}

/**
 * @private @func createTagIndexingFile
 * @desc A sub-function of initialization. ID of tag indexing file is "2"
 * @param {func} callback This function will be called after creating finishes
 * @return {null}
 */
function createTagIndexingFile(callback) {
  db.find({
    selector: {$and: [
      {'_id': {$eq: '2'}}
    ]}
  }).then(result => {
    if (result.docs.length == 0) {
      db.put({
        _id: '2',
        content: defaultTagsIndexingFile
      }).then(result => {
        printc('Tags-indexing file is created');
        callback();
      });
    } else {
      printc('Tags-indexing file has been created');
      callback();
    }
  });
}

/**
 * @private @func createSettingFile
 * @desc Create the file which stores the user setting. ID of this file is "3"
 * @param {func} callback This function will be called after creating finishes
 * @returns {null}
 */
function createSettingFile(callback) {
  db.find({
    selector: {$and: [
      {'_id': {$eq: '3'}}
    ]}
  }).then(result => {
    if (result.docs.length == 0) {
      db.put({
        _id: '3',
        content: {}, // The setting objects should be stored in this attribute
      }).then(result => {
        printc('Setting file is created');
        callback();
      })
    } else {
      printc('Setting file has been created');
      callback();
    }
  })
}

/**
 * @private @func createTutorialNote
 * @desc Create the tutorial note. ID of tutorial note is "4"
 * @param {func} callback This function will be called after creating finishes
 * @returns {null}
 */
function createTutorialNote(callback) {
  db.find({
    selector: {$and: [
      {'_id': {$eq: '4'}}
    ]}
  }).then(result => {
    if (result.docs.length == 0) {
      db.put({
        _id: '4',
        content: '# Welcome to LifeNotes\n#Welcome #Example\nThis is a tutorial for LifeNotes usage.\n',
      }).then(result => {
        printc('Tutorial note is created');
        callback();
      });
    } else {
      printc('Tutorial note has been created');
      callback();
    }
  });
}

/**
 * @private @func ifNoteExist
 * @desc Check if a note exists in database
 * @param {string} noteid The noteid to be checked
 * @param {object} noteIndex The note index object which stores the index of all notes
 * @param {func} callback This function will be called after query finishes
 * @returns {boolean} Result of if the note exists
 */
function ifNoteExist(noteid, noteIndex, callback) {
  db.find({
    selector: {$and: [
      {type: {$eq: 'note'}},
      {_id: {$eq: noteid}},
    ]},
  }).then(result => {
    printc(`Number of query result: ${result.docs.length}`);
    if (callback) callback(result.docs.length > 0);
  });
}

/**
 * @private @func deleteNoteFromDatabase
 * @param {object} id Note id
 * @param {func} callback Callback function
 * @returns null
 */
function deleteNoteFromDatabase(id, callback) {
  db.get(id).then(note => {
    printc(`Get info of note ${note._id} from database successfully`);
    db.remove(note).then(res => {
      printc(`Note ${note._id} is deleted from database successfully`);
      if (callback) callback();
    });
  });
}

/**
 * @private @func deleteNoteFromNoteIndexingFile
 * @desc Delete note from note indexing file
 * @param {object} noteIndex
 * @param {string} id
 * @param {fcun} callback Param: newNoteIndex
 * @returns {null}
 */
function deleteNoteFromNoteIndexingFile(noteIndex, id, callback) {
  delete noteIndex[id];
  if (callback) callback(noteIndex);
}

/**
 * @private @func traverseDirectory
 * @desc Traverse the directory to find all the notes and directories belong to a directory
 * @param {object} dir
 * @param {object} directoryIndex
 * @param {func} callback Param: notes, dirs
 * @returns null
 */
function traverseDirectory(dir, directoryIndex, callback) {
  let allNotes = dir.no;
  let allDirs = dir.d;
  for (let iid in dir.d) {
    traverseDirectory(directoryIndex[dir.d[iid]], directoryIndex, (notes, dirs) => {
      allNotes = allNotes.concat(notes);
      allDirs = allDirs.concat(dirs);
    });
  }
  callback(allNotes, allDirs);
}

/**
 * @private @func isChildDirectory
 * @desc Check if a destDir is a child directory of srcDir
 * @param {string} srcDID ID of source directory
 * @param {string} destDID ID of destination directory
 * @param {object} directoryIndex Indexing file of directory
 * @param {func} callback Param: result
 * @returns {null}
 */
function isChildDirectory(srcDID, destDID, directoryIndex, callback) {
  let result = false;
  console.log(directoryIndex, srcDID);
  console.log(directoryIndex[srcDID]);
  console.log(directoryIndex[srcDID].d);
  if (directoryIndex[srcDID].d.indexOf(destDID) !== -1) {
    callback(true);
    return;
  }
  for (let i in directoryIndex[srcDID].d) {
    isChildDirectory(directoryIndex[srcDID].d[i], destDID, directoryIndex, res => {
      result |= res;
    });
  }
  callback(result);
}

/**
 * @private @func formatDirpath
 * @desc Format dirpath variable such that the last char of dirpath always is '/'
 * @param {string} dirpath
 * @returns {string} newDirPath
 */
function formatDirpath(dirpath) {
  if (dirpath[dirpath.length - 1] === '/') {
    return dirpath;
  } else {
    return dirpath + '/';
  }
}

/**
 * @private @func sortDirectory
 * @desc Sort all directories under a directory
 * @param {string} id ID of the directory to be sorted
 * @param {object} directoryIndex
 * @param {func} callback Param: newDirectoryIndex
 * @returns null
 */
function sortDirectory(id, directoryIndex, callback) {
  let dir = directoryIndex[id];
  dir.d.sort((a, b) => {
    return directoryIndex[a].na.localeCompare(directoryIndex[b].na);
  })
  callback(directoryIndex);
}

/**
 * @private @func sortNotes
 * @desc Sort all notes under a directory
 * @param {string} id ID of the directory to be sorted
 * @param {object} directoryIndex
 * @param {object} noteIndex
 * @param {func} callback Param: directoryIndex
 * @returns null
 */
function sortNotes(id, directoryIndex, noteIndex, callback) {
  // 1. Get note title from noteIndex by directoryIndex
  let titles = [];
  for (let i in directoryIndex[id].no) {
    let nid = directoryIndex[id].no[i];
    titles.push({
      title: noteIndex[nid].t,
      id: nid,
    });
  }

  // 2. Sort it
  // NOTE: if want to sort by other option, such last modified time, change the lambda function
  titles.sort((a, b) => {
    return a.title.localeCompare(b.title);
  });

  // 3. Rearrange ID in directoryIndex
  let newNotes = []
  for (let i in titles) {
    newNotes.push(titles[i].id);
  }
  directoryIndex[id].no = newNotes;

  callback(directoryIndex);
}

/**
 * @private @func removeNoteFromDirectory
 * @param {object} note The note object
 * @param {object} directoryIndex Note index file
 * @param {func} callback Callback function. Param: newNoteIndex
 * @returns null
 */
function removeNoteFromDirectory(note, directoryIndex, callback) {
  if (!note.d in directoryIndex) {
    callback(false);
    console.error(`Directory ${note.d} is not found!`);
    return;
  }
  let dir = directoryIndex[note.d];
  if (dir.no.indexOf(note._id) === -1) {
    callback(false);
    console.error(`Note ${note._id} is not found!`);
    return;
  }
  dir.no.splice(dir.no.indexOf(note._id), 1);
  callback(directoryIndex);
}

/**
 * @private @func createTagsTrie
 * @desc Create a trie for indexng tags
 * @param tagIndex
 * @param callback Param: tagTrie
 * @returns {null}
 */
function createTagsTrie(tagIndex, callback) {
  if (callback) callback(null);
}

// ===================================================================================
// public function

/**
 * @public @func initDB
 * @desc Initialize the database
 * @param {func} callback Params: noteIndex, tagIndex, directoryIndex
 * @returns {null} 
 */
export function initDB(callback) {
  // set up plugin for PouchDB
  PouchDB.plugin(PouchDBFind); // find plugin

  // init pouchdb
  db = new PouchDB(dbname);
  // create index for indexing file
  // there are 2 indexing file. The first one stores the info about notes structures;
  // the second one stores the info about 
  db.createIndex({
    index: {fields: ['_id', 'content']}
  }).then(result => {
    printc('Index for indexing file and notes is created');
    // create note-index file and tags file
    // index 1: note-indexing file
    // index 2: tags-indexing file
    createDirectoryIndexingFile(() => {
      createNoteIndexingFile(() => {
        createTagIndexingFile(() => {
          createSettingFile(() => {
            createTutorialNote(() => {
              db.get('0').then(directoryIndex => {
                db.get('1').then(noteIndex => {
                  db.get('2').then(tagIndex => {
                    createTagsTrie(tagIndex.content, tagTrie => {
                      callback(noteIndex.content, tagIndex.content, directoryIndex.content, tagTrie);
                    })
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}

/**
 * @public @func newDirectory
 * @desc Create a new directory 
 * @param {string} id The id of current directory
 * @param {string} name The name of the new directory
 * @param {object} directoryIndex The note index object which stores the index of all notes
 * @param {func} callback Param: newDirectoryIndex
 * @returns {null}
 */
export function newDirectory(id, name, directoryIndex, callback) {
  let dirHeader = directoryIndex[id];
  console.log(dirHeader);
  let i = getNewID();
  while (i in directoryIndex) {
    i = getNewID();
  }
  let newDir = {
    i: i,
    p: directoryIndex[id].i,
    na: name,
    no: [],
    d: [],
    mt: getCurTime(),
  };
  directoryIndex[i] = newDir;
  dirHeader.d.push(newDir.i);
  
  sortDirectory(id, directoryIndex, newDirectoryIndex => {
    callback(newDirectoryIndex);
  });
}

/**
 * @public @func renameDirectory
 * @desc Rename a directory
 * @param {string} id Id of current directory
 * @param {string} name The new name of current directory
 * @param {object} directoryIndex
 * @param {func} callback Param: newDirectoryIndex
 * @returns {null}
 */
export function renameDirectory(id, name, directoryIndex, callback) {
  console.log(directoryIndex, directoryIndex[id], id);
  directoryIndex[id].na = name;
  sortDirectory(directoryIndex[id].p, directoryIndex, newDirectoryIndex => {
    callback(newDirectoryIndex);
  });
}

/**
 * @public @func deleteDirectory
 * @desc Remove a directory and all its notes/sub directory from database (including the related tags)
 * @param {string} id ID of the directory you want to remove
 * @param {object} directoryIndex The directory index object which stores the index of all directories
 * @param {object} noteIndex The note index object
 * @param {func} callback Params: directoryIndex, noteIndex
 * @returns null
 */
export function deleteDirectory(id, directoryIndex, noteIndex, callback) {
  // find all notes and directories which are going to be deleted
  traverseDirectory(directoryIndex[id], directoryIndex, (notes, dirs) => {
    // then, delete them
    for (let n in notes) {
      deleteNoteFromDatabase(notes[n], null);
      delete noteIndex[notes[n]];
    }
    for (let d in dirs) {
      delete directoryIndex[dirs[d]];
    }
    // remove directory from parent directories
    let pid = directoryIndex[id].p;
    directoryIndex[pid].d.splice(directoryIndex[pid].d.indexOf(id), 1);
    delete directoryIndex[id];
    callback(directoryIndex, noteIndex);
  });
}

/**
 * @public @func newNote
 * @desc Create a new note in PouchDB 
 * @param {string} id ID of the directory in which a new note will be created
 * @param {object} directoryIndex The directory index object which stores the index of all notes
 * @param {object} noteIndex The note index object 
 * @param {func} callback Param: directoryIndex, noteIndex, noteHeader, note
 * @returns null
 */
export function newNote(id, directoryIndex, noteIndex, callback) {
  console.log(`id is ${id}`);
  let curTime = getCurTime();
  let note = {
    _id: getNewID(),
    content: '',
  };
  db.put(note).then(res => {
    getNote(note._id, note => {
      let noteHeader = {
        _id: note._id,
        d: id,
        t: 'Untitled',
        ta: [],
        lmt: curTime,
        ct: curTime,
      };
      noteIndex[note._id] = noteHeader;
      directoryIndex[id].no.push(note._id);
      sortNotes(id, directoryIndex, noteIndex, newDirectoryIndex => {
        callback(newDirectoryIndex, noteIndex, noteHeader, note);
      });
    });
  }).catch(err => {
    console.error(err);
  });
}

/**
 * @public @func updateNote
 * @desc Update content of a note.
 * @param {object} noteid ID of the note in database
 * @param {string} noteContent Content of the note 
 * @param {func} callback This callback function which will be called after updating
 * @returns {object} The note just updated.
 */
export function updateNote(noteid, noteContent, callback) {
  db.get(noteid).then(res => {
    let newNote = {
      _id: res._id,
      content: noteContent,
      _rev: res._rev,
    };
    db.put(newNote, {force: true}).then(res => {
      printc(`Note ${noteid} is updated successfully`);
      if (callback) callback();
    }).catch(err => {
      console.error(err);
    });
  }).catch(err => {
    console.error(`Cannot find note with id: ${note._id}, ${err}`);
  });
}

/**
 * @public @func updateTitle
 * @desc Only update title of a note
 * @param {string} newTitle 
 * @param {string} id ID of the directory the note to be updated belongs to
 * @param {string} noteid ID of the note to be updated
 * @param {object} noteIndex
 * @param {object} directoryIndex
 * @param {func} callback Param: newNoteIndex, newDirectoryIndex
 * @returns null
 */
export function updateTitle(newTitle, id, noteid, noteIndex, directoryIndex, callback) {
  noteIndex[noteid].t = newTitle;
  sortNotes(id, directoryIndex, noteIndex, newDirectoryIndex => {
    callback(noteIndex, newDirectoryIndex);
  });
}

/**
 * @public @func moveNote
 * @desc Move a note from source directory to dest directory
 * @param {string} id ID of the moved note
 * @param {string} srcDID ID of the source directory
 * @param {string} destDID ID of the destination directory
 * @param {object} noteIndex The noteIndex file
 * @param {object} directoryIndex The directoryIndex file
 * @param {func} callback Param: (ifUpdate, newDirectoryIndex, newNoteIndex)
 * @returns {null}
 */
export function moveNote(id, srcDID, destDID, noteIndex, directoryIndex, callback) {
  if (srcDID === destDID) {
    console.log(`Note ${id} is moved within the same directory--${srcDir} and ${destDir}. Operation is canceled.`);
    callback(false, null);
  } else {
    let srcD = directoryIndex[srcDID];
    let destD = directoryIndex[destDID];
    noteIndex[id].d = destDID;
    destD.no.push(id);
    srcD.no.splice(srcD.no.indexOf(id), 1);
    sortNotes(destDID, directoryIndex, noteIndex, newDirectoryIndex => {
      callback(true, newDirectoryIndex, noteIndex);
    })
  }
}

/**
 * @public @func moveDirectory
 * @desc Move a directory from source directory to dest directory
 * @param {string} id ID of the directory to be moved
 * @param {string} srcDID ID of the source directory
 * @param {string} destDID ID of the destination directory
 * @param {object} directoryIndex The directoryIndex file
 * @param {object} noteIndex The noteIndex file
 * @param {func} callback Param: (ifUpdate, newDirectoryIndex, newNoteIndex)
 * @returns {null}
 */
export function moveDirectory(id, srcDID, destDID, directoryIndex, noteIndex, callback) {
  if (srcDID === destDID) {
    console.log(`Directory ${id} is moved within the same directory--${srcDID} and ${destDID}. Operation is canceled.`);
    callback(false, null);
  } else {
    isChildDirectory(id, destDID, directoryIndex, res => { // check if destination is a child directory
      if (res) {
        console.log(`Directory ${destDir} belongs to directory ${srcDir}. Operation is canceled.`);
        callback(false, null);
      } else {
        let srcD = directoryIndex[srcDID];
        let destD = directoryIndex[destDID];
        destD.d.push(id);
        srcD.d.splice(srcD.d.indexOf(id), 1);
        directoryIndex[id].p = destDID;
        sortDirectory(destDID, directoryIndex, newDirectoryIndex => {
          callback(true, newDirectoryIndex, noteIndex);
        });
      }
    })
  }
}

/**
 * @public @func deleteNote
 * @desc Delete a note.
 * @param {object} note The note header object
 * @param {object} noteIndex The note index object which stores the index of all notes
 * @param {object} directoryIndex The directory index object which stores the index of all notes
 * @param {func} callback Param: newDirectoryIndex, newNoteIndex
 * @returns null
 */
export function deleteNote(note, noteIndex, directoryIndex, callback) {
  removeNoteFromDirectory(note, directoryIndex, result => {
    if (result === false) {
      callback(directoryIndex);
      return;
    }
    deleteNoteFromNoteIndexingFile(noteIndex, note._id, newNoteIndex => {
      deleteNoteFromDatabase(note._id, () => {
        callback(directoryIndex, newNoteIndex);
      });
    });
  });
}

/**
 * @public @func getNote
 * @desc Get content of a note.
 * @param {string} noteid The id of the note
 * @param {func} callback Callback function. Param: noteContent
 * @returns null
 */
export function getNote(noteid, callback) {
  db.get(noteid).then(note => {
    callback(note);
  });
}

/**
 * @public @func getAllNotes
 * @desc Get all notes in database and pass them into the callback function.
 * @param {func} callback This function will be called after get all notes.
 * @returns {array} An array with all note objects
 */
export function getAllNotes(callback) {
  db.find({
    selector: {$and: [
      {_id: {$ne: '0'}}, // note indexing file
      {_id: {$ne: '1'}}, // directory indexing file
      {_id: {$ne: '2'}}, // tag indexing file
      {_id: {$ne: '3'}}, // settings file
    ]},
  }).then(result => {
    printc(result.docs);
    if (callback) callback(result.docs);
  });
}

/**
 * @public @func updateNoteIndexFile
 * @param {object} noteIndex Noteindex file
 * @returns null
 */
export function updateNoteIndexFile(noteIndex) {
  if (noteIndex === null) return;
  db.get('0').then(res => {
    let newNoteIndex = {
      content: noteIndex,
      _id: res._id,
      _rev: res._rev,
    };
    db.put(newNoteIndex, {force: true}).then(res => {
      printc(`Noteindex file is updated successfully`);
    }).catch(err => {
      console.error(err);
    });
  }).catch(err => {
    console.error(`Cannot update noteindex file!`);
  });
}

/**
 * @public @func updateDirectoryIndexFile
 * @param {object} directoryIndex Noteindex file
 * @returns null
 */
export function updateDirectoryIndexFile(directoryIndex) {
  if (directoryIndex === null) return;
  db.get('1').then(res => {
    let newDirectoryIndex = {
      content: directoryIndex,
      _id: res._id,
      _rev: res._rev,
    };
    db.put(newDirectoryIndex, {force: true}).then(res => {
      printc(`DirectoryIndex file is updated successfully`);
    }).catch(err => {
      console.error(err);
    });
  }).catch(err => {
    console.error(`Cannot update directoryIndex file!`);
  });
}

/**
 * @public @func updateTagIndexFile
 * @param {object} tagIndex 
 * @returns null
 */
export function updateTagIndexFile(tagIndex) {
  if (tagIndex === null) return;
  db.get('2').then(res => {
    let newTagIndex = {
      content: tagIndex,
      _id: res._id,
      _rev: res._rev,
    };
    db.put(newTagIndex, {force: true}).then(res => {
      printc(`Tagindex file is updated successfully`);
    }).catch(err => {
      console.error(err);
    });
  }).catch(err => {
    console.error(`Cannot update tagIndex file!`);
  });
}

/**
 * @public @func cleanDB
 * @desc Cleanup the database
 * @param {func} callback This function will be called after cleaning the database
 * @returns null
 */
export function cleanDB(callback) {
  return db.destroy().then(() => {
    printc('Indexeddb has been cleaned.');
    if (callback) callback();
  }).catch(e => {
    console.error(`Error occurs when cleaning DB: ${e}`, error=true);
  });
}

/**
 * @public @func updateTags
 * @desc Only update title of a note
 * @param {object} tags
 * @param {string} noteid
 * @param {object} noteIndex
 * @param {object} tagIndex
 * @param {func} callback Param: noteIndex, newTagIndex
 * @returns null
 */
export function updateTags(tags, noteid, noteIndex, tagIndex, callback) {
  // steps: 
  // 1. find all corresponding tags
  // 1.1. find with noteid <= used for removement
  // 1.2. find with keyword <= used for appending
  // 2. update tags indexing file
  // 2.1. remove unused tags
  // 2.2. remove id from used tags
  // 2.3. add id to used tags
  // 2.4. add new tags
  // 3. update noteIndex

  // find all corresponding tags
  findTagsWithKeyword(tags, tagIndex, cts => { // corresponding tags

  });
  findTagsWithNoteid();
}

/**
 * @private @func findTagsWithKeyword
 * @param {array} tags The keywords we want to search
 * @param {object} tagIndex 
 * @param {}
 */
function findTagsWithKeyword(tags, tagIndex, callback) {

}

export function runTest(noteIndex, tagIndex, callback) {
  
}

/*
function list: 
  initDB,
  newDirectory,
  renameDirectory
  deleteDirectory
  newNote
  updateNote
  updateTitle
  moveNote
  moveDirectory
  deleteNote
  getNote
  removeNoteFromDirectory
  getAllNotes
  updateNoteIndexFile
  cleanDB
 */