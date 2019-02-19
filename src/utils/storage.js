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
const welcomeNotesCreateTime = getCurTime();
const dbname = 'LifeNoteDB';

const exampleNotes = {
  id: welcomeNotesId,
  // content: '# Welcome to LifeNotes\n#Welcome #Example\nThis is a tutorial for LifeNotes usage.\n',
  lastModifiedTime: welcomeNotesCreateTime,
  createdTime: welcomeNotesCreateTime,
  ppath: '/Inbox',
  title: 'Welcome to LifeNotes',
  tags: ['Welcome', 'Example']
};
const exampleDirectory = {
  name: 'directory name',
  ppath: '/path/to/current_directory/but/ NOT /include/the/current_one',
  directories: ['the sub-directories', 'of current directory'],
  notes: [{
    // the note header object
  }]
};

// record info of all notes
const defaultNoteIndexingFile = {
  directories: [{
    name: 'Inbox',
    ppath: '/',
    directories: [],
    notes: []
  }],
  history: [], // max number of history should be within 200
  name: '/',
  ppath: '/',
  notes: [{
    _id: '4',
    ppath: '/',
    title: 'Welcome to LifeNotes',
    tags: ['Welcome', 'Example'],
    lastModifiedTime: welcomeNotesCreateTime,
    createdTime: welcomeNotesCreateTime,
  }]
};
// record tags of all notes
const defaultTagsIndexingFile = {
  tags: [{
    name: 'Welcome', 
    notes: ['4']
  }, {
    name: 'Example', 
    notes: ['4']
  }],
  history: [], // max number of history should be within 200
};

// ===================================================================================
// global variable
var db;

// ===================================================================================
// private function

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
      printc('Note-indexing file has been created')
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
 * @private @func findDir
 * @desc Traverse and find the target directory by dirlist
 * @param {array} dirlist
 * @param {number} ind The index of dirlist
 * @param {object} indexobj The index object
 * @param {func} callback The function which will be called after finding the target,
 *                        Which means that if no target is found, then the callback
 *                         parameter will be 'false' instead of target object
 * @returns {null}
 */
function findDir (dirlist, ind, indexobj, callback) {
  let find = false;
  if (ind === dirlist.length || dirlist[ind] === '') {
    find = true;
    callback(indexobj);
    return true;
  } else {
    for (let i in indexobj.directories) {
      let d = indexobj.directories[i];
      if (d.name === dirlist[ind]) {
        find = findDir(dirlist, ind + 1, d, callback);
        break;
      }
    }
    if (ind !== 1) {
      return find;
    }
  }
  if (find === false && ind === 1) {
    callback(false);
  }
}

/**
 * @private @func updateNoteIndexHistory
 * @param {string} optType The type of updating policy.
 * @param {string} noteid The note which is created, deleted, or moved
 * @param {string} dirpath The dirpath of a directory which is created, deleted, or moved.
 *                         Or, the old name of a directory
 * @param {string} ndirpath The dirpath of a directory which a note or a directory is moved to.
 *                          Or, the new name of a directory
 * @param {func} callback The function which will be called after updating finishes
 * @returns {null}
 */
function updateNoteIndexHistory(optType, noteid, dirpath, ndirpath, callback) {
  let timeStamp = getCurTime();
  switch(optType) {
    case 'newNote':
      break;
    case 'deleteNote':
      break;
    case 'moveNote':
      break;
    case 'newDirectory':
      break;
    case 'deleteDirectory':
      break;
    case 'moveDirectory':
      break;
    case 'renameDirectory':
      break;
    default:
      printc('Something unknown goes wrong when updating file index');
  }
}

/**
 * @private @func updateNoteIndexHistoryCore
 * @desc Update the history of note indexing file
 * @param {object} historyObj The history object
 * @param {func} callback This function will be called after updating finishes
 */
function updateNoteIndexHistoryCore(historyObj, callback) {
  
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
 * @param {object} note Note header
 * @param {func} callback Callback function
 * @returns null
 */
function deleteNoteFromDatabase(note, callback) {
  db.get(note._id).then(note => {
    printc(`Get info of note ${note._id} from database successfully`);
    db.remove(note).then(res => {
      printc(`Note ${note._id} is deleted from database successfully`);
      callback();
    });
  });
}

/**
 * @private @func _deleteDirectory
 * @desc Traverse the directory to find all the notes to be deleted
 * @param {object} dir
 * @param {object} noteIndex
 * @param {func} callback Param: notes
 * @returns null
 */
function _deleteDirectory(dir, noteIndex, callback) {
  let allNotes = dir.notes;
  for (let d in dir.directories) {
    _deleteDirectory(dir.directories[d], noteIndex, (notes) => {
      allNotes = allNotes.concat(notes);
    });
  }
  callback(allNotes);
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
 * @param {string} ppath
 * @param {object} noteIndex
 * @param {func} callback
 * @returns null
 */
function sortDirectory(ppath, noteIndex, callback) {
  findDir(ppath.split('/'), 1, noteIndex, dir => {
    dir.directories.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    callback(noteIndex);
  })
}

/**
 * @private @func sortNotes
 * @desc Sort all notes under a directory
 * @param {string} ppath
 * @param {object} noteIndex
 * @param {func} callback
 * @returns null
 */
function sortNotes(ppath, noteIndex, callback) {
  findDir(ppath.split('/'), 1, noteIndex, dir => {
    dir.notes.sort((a, b) => {
      return a.title.localeCompare(b.title);
    });
    callback(noteIndex);
  })
}

// ===================================================================================
// public function

/**
 * @public @func initDB
 * @desc Initialize the database
 * @param {func} callback This function will be called after initializing
 * @returns {object} Return the tags indexing file and notes indexng file
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
    createNoteIndexingFile(() => {
      createTagIndexingFile(() => {
        createSettingFile(() => {
          createTutorialNote(() => {
            db.get('1').then(noteIndex => {
              db.get('2').then(tagIndex => {
                callback(noteIndex.content, tagIndex.content);
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
 * @param {string} dirpath Where the directory locates
 * @param {string} name The name of the new directory
 * @param {object} noteIndex The note index object which stores the index of all notes
 * @param {func} callback This function will be called after creating the new directory
 * @returns {null}
 */
export function newDirectory(dirpath, name, noteIndex, callback) {
  findDir(dirpath.split('/'), 1, noteIndex, dir => {
    let newDir = {
      name: name,
      ppath: formatDirpath(dirpath),
      directories: [],
      notes: []
    };
    findDir((formatDirpath(dirpath) + name).split('/'), 1, noteIndex, nonexistent => {
      if (nonexistent !== false) {
        console.error(`Folder ${dir.ppath + name} has existed! Please use another name for this folder.`)
      } else {
        dir.directories.push(newDir);
        callback(noteIndex);
      }
    })
  });
}

/**
 * @public @func renameDirectory
 * @desc Rename a directory
 * @param {string} dirpath
 * @param {string} name
 * @param {object} noteIndex
 * @param {func} callback
 * @returns {null}
 */
export function renameDirectory(dirpath, name, noteIndex, callback) {
  findDir(dirpath.split('/'), 1, noteIndex, dir => {
    dir.name = name;

    let d = dirpath.split('/');
    d.pop();
    console.log(d.join('/'));
    d = d.join('/');
    if (d === '') d = '/';
    sortDirectory(d, noteIndex, callback);
  })
}

/**
 * @public @func deleteDirectory
 * @desc Remove a directory and all its notes/sub directory from database (including the related tags)
 * @param {string} dirpath The directory which will be deleted
 * @param {object} noteIndex The note index object which stores the index of all notes
 * @param {func} callback This function will be called after deleting finishes
 * @returns null
 */
export function deleteDirectory(dirpath, noteIndex, callback) {
  findDir(dirpath.split('/'), 1, noteIndex, dir => {
    if (dir === false) console.error(`Error: Cannot find directory ${dirpath}!`);
    // find all notes to be deleted
    _deleteDirectory(dir, noteIndex, notes => {
      // delete notes from database
      for (let n in notes) {
        deleteNoteFromDatabase(notes[n], () => {});
      }
      // delete directory
      findDir(dir.ppath.split('/'), 1, noteIndex, dir2 => {
        dir2.directories.splice(dir2.directories.indexOf(dir), 1);
        callback(noteIndex);
      })
    });
  });
}

/**
 * @public @func newNote
 * @desc Create a new note in PouchDB 
 * @param {string} dirpath The directory which new note will locate
 * @param {object} noteIndex The note index object which stores the index of all notes
 * @param {func} callback This function will be called after creating a new note. Param: noteIndex, noteHeader, note
 * @returns null
 */
export function newNote(dirpath, noteIndex, callback) {
  let curTime = getCurTime();
  let note = {
    _id: getNewID(),
    content: '',
  };
  db.put(note).then(res => {
    getNote(note._id, note => {
      findDir(dirpath.split('/'), 1, noteIndex, dir => {
        let noteHeader = {
          _id: note._id,
          ppath: dirpath,
          title: 'Untitled',
          tags: [],
          lastModifiedTime: curTime,
          createdTime: curTime,
        };
        dir.notes.push(noteHeader);
        printc('A new note is created successfully');
        sortNotes(dirpath, noteIndex, newNoteIndex => {
          callback(newNoteIndex, noteHeader, note);
        });
      });
    });
  }).catch(err => {
    console.error(err);
  });
}

/**
 * @public @func updateNote
 * @desc Update a note.
 * @param {object} noteid ID of the note in database
 * @param {string} noteContent Content of the note 
 * @param {object} noteIndex The note index object which stores the index of all notes
 * @param {func} callback This callback function which will be called after updating
 * @returns {object} The note just updated.
 */
export function updateNote(noteid, noteContent, noteIndex, callback) {
  db.get(noteid).then(res => {
    let newNote = {
      _id: res._id,
      content: noteContent,
      _rev: res._rev,
    };
    db.put(newNote, {force: true}).then(res => {
      printc(`Note ${noteid} is updated successfully`);
      // TODO: update note info in note index file 
      if (callback) callback(noteIndex);
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
 * @param {string} ppath
 * @param {string} noteid
 * @param {object} noteIndex
 * @param {func} callback
 * @returns null
 */
export function updateTitle(newTitle, ppath, noteid, noteIndex, callback) {
  findDir(ppath.split('/'), 1, noteIndex, dir => {
    for (let i in dir.notes) {
      if (dir.notes[i]._id === noteid) {
        dir.notes[i].title = newTitle;
        sortNotes(ppath, noteIndex, callback);
        break;
      }
    }
  });
}

/**
 * @public @func moveNote
 * @desc Move a note from source directory to dest directory
 * @param {string} id ID of the moved note
 * @param {string} srcDir ppath of the moved note
 * @param {string} destDir Path of the dest directory
 * @param {object} noteIndex The noteIndex file
 * @param {func} callback Param: (ifUpdate, newNoteIndex)
 * @returns {null}
 */
export function moveNote(id, srcDir, destDir, noteIndex, callback) {
  if (srcDir === destDir) {
    console.log(`Note ${id} is moved within the same directory--${srcDir} and ${destDir}. Operation is canceled.`);
    callback(false, null);
  } else {
    findDir(srcDir.split('/'), 1, noteIndex, srcD => {
      findDir(destDir.split('/'), 1, noteIndex, destD => {
        for (let i in srcD.notes) {
          if (srcD.notes[i]._id === id) {
            srcD.notes[i].ppath = destDir;
            if (srcD.notes[i].ppath[srcD.notes[i].ppath.length - 1] !== '/') {
              srcD.notes[i].ppath += '/';
            }
            destD.notes.push(srcD.notes[i]);
            srcD.notes.splice(i, 1);
            sortNotes(destDir, noteIndex, newNoteIndex => {
              callback(true, newNoteIndex);
            });
            return;
          }
        }
      })
    })
  }
}

/**
 * @public @func moveDirectory
 * @desc Move a directory from source directory to dest directory
 * @param {string} name Namd of the moved directory
 * @param {string} srcDir ppath of the moved note
 * @param {string} destDir Path of the dest directory
 * @param {object} noteIndex The noteIndex file
 * @param {func} callback Param: (ifUpdate, newNoteIndex)
 * @returns {null}
 */
export function moveDirectory(name, srcDir, destDir, noteIndex, callback) {
  let re = RegExp(`^${srcDir + name}`);
  if (srcDir === destDir) {
    console.log(`Directory ${name} is moved within the same directory--${srcDir} and ${destDir}. Operation is canceled.`);
    callback(false, null);
  } else if ((destDir).match(re) !== null) {
    console.log(`Directory ${destDir} belongs to directory ${srcDir}. Operation is canceled.`);
    callback(false, null);
  } else {
    findDir(srcDir.split('/'), 1, noteIndex, srcD => {
      findDir(destDir.split('/'), 1, noteIndex, destD => {
        for (let i in srcD.directories) {
          if (srcD.directories[i].name === name) {
            srcD.directories[i].ppath = destDir;
            destD.directories.push(srcD.directories[i]);
            srcD.directories.splice(i, 1);
            sortDirectory(destDir, noteIndex, newNoteIndex => {
              callback(true, newNoteIndex);
            });
            return;
          }
        }
      })
    })
  }
}

/**
 * @public @func deleteNote 
 * @desc Delete a note.
 * @param {object} note The note header object
 * @param {object} noteIndex The note index object which stores the index of all notes
 * @param {func} callback This function will be called after deleting successfully. Param: newNoteIndex
 * @returns null
 */
export function deleteNote(note, noteIndex, callback) {
  removeNoteFromDirectory(note, noteIndex, result => {
    if (result === false) console.error('Something error occurs when deleting note!');
    deleteNoteFromDatabase(note, () => {
      callback(noteIndex);
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
 * @public @func removeNoteFromDirectory
 * @param {object} note The note object
 * @param {object} noteIndex Note index file
 * @param {func} callback Callback function. Param: newNoteIndex
 * @returns null
 */
export function removeNoteFromDirectory(note, noteIndex, callback) {
  findDir(note.ppath.split('/'), 1, noteIndex, dir => {
    if (dir === false) {
      console.error(`Directory ${note.ppath} does not exist!`);
      callback(false);
    } else {
      let index = null;
      for (index in dir.notes) {
        if (dir.notes[index]._id === note._id) {
          break;
        }
      }
      if (index === null) {
        console.error(`Cannot find note ${note._id} in directory ${dir.name}!`);
        callback(false);
      } else {
        dir.notes.splice(index, 1);
        callback(noteIndex);
      }
    }
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
      {_id: {$ne: '1'}},
      {_id: {$ne: '2'}},
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
  db.get('1').then(res => {
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
 * @public @func ifDirectoryExist
 * @desc Check if a directory exists in database
 * @param {string} dirpath
 * @param {object} noteIndex The note index object which stores the index of all notes
 * @param {func} callback This functino will be called after query finishes
 * @returns {boolean} Result of if the directory exists
 */
export function ifDirectoryExist(dirpath, noteIndex, callback) {
  findDir(dirpath.split('/'), 1, noteIndex, res => {
    if (res === false) {
      callback(false);
    } else {
      callback(true);
    }
  });
}

export function runTest(noteIndex, tagIndex, callback) {
  newDirectory('/Inbox', 'test', noteIndex, () => {
    newDirectory('/Inbox/test', 'nestedFolder', noteIndex, () => {
      newNote('/Inbox', noteIndex, () => {
        // console.log(noteIndex);
        // callback(noteIndex);
        genNotes('/Inbox/test', noteIndex, 5, () => {
          genNotes('/Inbox/test/nestedFolder', noteIndex, 5, () => {
            callback(noteIndex);
          });
        });
      });
    });
  });
}

function genNotes(dirpath, noteIndex, ind, callback) {
  if (ind === 0) {
    callback(noteIndex);
  } else {
    newNote(dirpath, noteIndex, () => {
      genNotes(dirpath, noteIndex, ind - 1, callback);
    });
  }
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