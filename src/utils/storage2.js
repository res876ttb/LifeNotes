/**
 * @name storage.js
 * @desc Store user notes and data. 
 *       The storage.js is based on PouchDB, which use IndexedDB by default.
 */

// import
// I dont know why `require(...packages)` does not work...
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import {getNewID} from './id.js';
import {getCurTime} from './date.js';
import {printc} from './output.js';

// constant
const dbname = 'LifeNoteDB';
const library = { // only library shelf can own other shelves, other shelves can only handle notebooks
  _id: 'library', 
  type: 'shelf', 
  name: 'library', 
  shelfid: null,
  notebooks: [],
  shelfs: []
};
const inbox = {
  _id: 'inbox', 
  type: 'notebook', 
  name: 'inbox', 
  shelfid: 'library', 
  notes: []
};

// global variable
var db;

// function

/**
 * @public @func initDB
 * @desc Initialize the database
 * @param {func} callback This function will be called after initializing
 * @returns null
 */
export function initDB(callback) {
  // set up plugin for PouchDB
  PouchDB.plugin(PouchDBFind);

  // init pouchdb
  db = new PouchDB(dbname);
  // create index for shelf 
  db.createIndex({
    index: {fields: ['_id', 'type', 'name', 'shelfid', 'notebooks', 'shelfs']}
  }).then(result => {
    printc(`Shelf index status: ${result.result}`);
    // create index for notebook
    db.createIndex({
      index: {fields: ['_id', 'type', 'name', 'shelfid', 'notes']}
    }).then(result => {
      printc(`Notebook index status: ${result.result}`);
      // create index for note
      db.createIndex({
        index: {fields: ['_id', 'type', 'title', 'tags', 'content', 'notebookid', 'lastModifiedDate', 'createDate']}
      }).then(result => {
        printc(`Note index status: ${result.result}`);
        // create index for tags
        db.createIndex({
          index: {fields: ['_id', 'type', 'name', 'notes']}
        }).then(result => {
          printc(`Tag index status: ${result.result}`);
          // BUG: check if default shelf/notebook exists, then create it if it doesn't
          ifShelfExist('library', res => {
            if (!res) {
              // create default shelf, which is not able to be deleted
              db.put(library).then(res => {
                printc(`Default shelf is created`);
                // check if notebook inbox is in database
                ifNotebookExist('inbox', res => {
                  if (!res) {
                    // create default notebook, which is not able to be deleted
                    db.put(inbox).then(res => {
                      printc('A new notebook is posted successfully');
                      addNotebookToShelf('inbox', 'library', callback);
                    });
                  } else {
                    if (callback) callback();
                  }
                });
              });
            } else {
              // check if notebook inbox is in database
              ifNotebookExist('inbox', res => {
                if (!res) {
                  // create default notebook, which is not able to be deleted
                  db.put(inbox).then(res => {
                    printc('A new notebook is posted successfully');
                    addNotebookToShelf('inbox', 'library', callback);
                  });
                } else {
                  if (callback) callback();
                }
              });
            }
          });
        });
      });
    });
  });
}

/**
 * @public @func newShelf
 * @desc Create a new shelf 
 * @param {string} shelfid The shelfid which new shelf belongs to
 * @param {string} name The name of the new shelf
 * @param {func} callback This function will be called after creating the new shelf.
 * @returns {object} The shelf just created
 */
export function newShelf(shelfid, name, callback) {
  let id = getNewID();
  let shelf = {
    _id: id,
    type: 'shelf',
    name: name,
    shelfid: shelfid,
    notebooks: [],
    shelfs: []
  };
  db.put(shelf).then(res => {
    printc('A new shelf is posted successfully');
    addShelfToShelf(id, shelfid, () => {
      if (callback) callback(shelf);
    });
  }).catch(err => {
    console.error(err);
  });
}

/**
 * @public @func deleteShelf
 * @desc Remove a shelf and all its notes from database (including the related tags)
 * @param {string} shelfid The shelf which will be deleted
 * @param {func} callback This function will be called after deleting finishes
 * @returns null
 */
export function deleteShelf(shelfid, callback) {
  getAllNotebookOfShelf(shelfid, notebooks => {
    deleteShelfDeleteNotebook(notebooks, 0, () => {
      getShelf(shelfid, shelf => {
        removeShelfFromShelf(shelfid, shelf.shelfid, res => {
          db.remove(shelf).then(res => {
            printc(`Shelf ${shelfid} is deleted successfully`);
            if (callback) callback();
          });
        });
      })
    });
  })
} 

/**
 * @private @func deleteShelfDeleteNotebook
 * @desc A subfunction function of deleteShelf which is recursively called to delete notebooks and to prevent async operation on database
 * @param {array} notebooks
 * @param {number} ind
 * @param {func} callback
 * @returns null
 */
function deleteShelfDeleteNotebook(notebooks, ind, callback) {
  if (ind < notebooks.length) {
    deleteNotebook(notebooks[ind]._id, res => {
      deleteShelfDeleteNotebook(notebooks, ind + 1, callback);
    })
  } else {
    if (callback) callback();
  }
}

/**
 * @private @func getShelf
 * @desc Get a shelf with its shelf id
 * @param {string} shelfid 
 * @param {func} callback 
 * @returns {object} The shelf with given shelfid
 */
function getShelf(shelfid, callback) {
  db.get(shelfid).then(res => {
    if (callback) callback(res);
  });
}

/**
 * @public @func newNotebook
 * @desc Create a new notebook
 * @param {string} shelfid The shelf this notebook belongs to
 * @param {string} name The name of notebook
 * @param {function} callback This function will be called after creating notebook
 * @returns {object} The notebook just created
 */
export function newNotebook(shelfid, name, callback) {
  let id = getNewID();
  let notebook = {
    _id: id, 
    type: 'notebook',
    name: name, 
    shelfid: shelfid, 
    notes: []
  };
  db.put(notebook).then(res => {
    printc('A new notebook is posted successfully');
    addNotebookToShelf(id, shelfid, () => {
      if (callback) callback(notebook);
    });
  });
}

/**
 * @public @func deleteNotebook
 * @desc Delete a notebook and all its notes
 * @param {string} notebookid The notebook which will be deleted
 * @param {func} callback This function will be called after deleting finishes
 * @returns null
 */
export function deleteNotebook(notebookid, callback) {
  getAllNoteOfNotebook(notebookid, notes => {
    deleteNotebookDeleteNote(notes, 0, () => {
      getNotebook(notebookid, notebook => {
        removeNotebookFromShelf(notebookid, notebook.shelfid, res => {
          db.remove(notebook).then(res => {
            printc(`Notebook ${notebookid} is deleted successfully`);
            if (callback) callback();
          });
        });
      })
    });
  })
}

/**
 * @private @func deleteNotebookDeleteNote
 * @desc A subfunction function of deleteNotebook which is recursively called to delete notes and to prevent async operation on database
 * @param {array} notes 
 * @param {number} ind 
 * @param {func} callback 
 * @returns null
 */
function deleteNotebookDeleteNote(notes, ind, callback) {
  if (ind < notes.length) {
    deleteNote(notes[ind], res => {
      deleteNotebookDeleteNote(notes, ind + 1, callback);
    })
  } else {
    if (callback) callback();
  }
}

/**
 * @private @func getNotebook
 * @desc Get info of a notebook with its notebookid
 * @param {string} notebookid
 * @param {func} callback
 * @returns {object} The note with given notebookid
 */
function getNotebook(notebookid, callback) {
  db.get(notebookid).then(res => {
    if (callback) callback(res);
  });
}

/**
 * @public @func newNote
 * @desc Create a new note in PouchDB 
 * @param {string} notebookid The notebook which new note belongs to
 * @param {function} callback This function will be called after creating a new note.
 * @returns {object} The note just created
 */
export function newNote(notebookid, callback) {
  let curTime = getCurTime();
  let note = {
    _id: getNewID(),
    type: 'note',
    title: 'Untitled',
    tags: [],
    content: '',
    notebookid: notebookid === null ? 'inbox' : notebookid,
    lastModifiedDate: curTime,
    createDate: curTime,
  };
  db.put(note).then(res => {
    printc('A new note is posted successfully');
    addNoteToNotebook(note._id, notebookid, () => {
      if (callback) callback(note);
    });
  }).catch(err => {
    console.error(err);
  });
}

/**
 * @public @func updateNote
 * @desc Update a note.
 * @param {object} note Following information should be provided in note: 
 *                      {_id, type, title, tags, content, notebookid} 
 * @param {function} callback This callback function which will be called after updating
 * @returns {object} The note just updated.
 */
export function updateNote(note, callback) {
  db.get(note._id).then(res => {
    let newNote = {
      _id: res._id,
      type: note.type,
      title: note.title,
      tags: note.tags,
      content: note.content,
      notebookid: note.notebookid,
      lastModifiedDate: getCurTime(),
      createDate: res.createDate,
      _rev: res._rev,
    };
    db.put(newNote, {force: true}).then(res => {
      printc(`Note ${note._id} is updated successfully`);
      if (callback) callback(newNote);
    }).catch(err => {
      console.error(err);
    });
  }).catch(err => {
    console.error(`Cannot find note with id: ${note._id}, ${err}`);
  });
}

/**
 * @public @func deleteNote 
 * @desc Delete a note.
 * @param {string} noteid The note you want to delete. 
 * @param {func} callback This function will be called after deleting successfully
 * @returns null
 */
export function deleteNote(noteid, callback) {
  db.get(noteid).then(note => {
    printc(`Successfully get info of note ${noteid}`);
    db.remove(note).then(res => {
      printc(`Note ${note._id} is deleted successfully`);
      removeNoteFromNotebook(note._id, note.notebookid, callback);
    });
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
      {type: {$eq: 'note'}},
    ]},
  }).then(result => {
    printc(result.docs);
    if (callback) callback(result.docs);
  });
}

/**
 * @public @func getAllNotebooks
 * @desc Get all notebooks in database and pass them into the callback function.
 * @param {func} callback This function will be called after get all notebooks.
 * @returns {array} An array with all notebook objects
 */
export function getAllNotebooks(callback) {
  db.find({
    selector: {$and: [
      {type: {$eq: 'notebook'}},
    ]},
  }).then(result => {
    printc(result.docs);
    if (callback) callback(result.docs);
  });
}

/**
 * @public @function getAllShelf
 * @desc Get all shelf of root shelf ('library')
 * @param {func} callback
 * @returns {array} All shelves in database
 */
export function getAllShelf(callback) {
  db.get('library').then(res => {
    if (callback) callback(res.shelfs);
  })
}

/**
 * @public @func getShelfTree
 * @desc Get the shelf tree from the database and pass them into the callback function.
 * @param {func} callback This function will be called after get the shelf tree.
 * @returns {object} Shelf tree
 */
export function getShelfTree(callback) {
  db.find({
    selector: {$and: [
      {type: {$eq: 'shelf'}}
    ]},
  }).then(res => {
    let dic = {};
    for (let i in res.docs) {
      dic[res.docs[i]._id] = res.docs[i];
    }
    callback(_getShelfTree('library', dic));
  })
}

/**
 * @private @func _getShelfTree
 * @desc Traverse all shelves of a shelf
 * @param {object} dic
 * @param {string} id
 * @return {object} Traverse result from its children shelves
 */
function _getShelfTree(id, dic) {
  let result = {};
  for (let i in dic[id].shelfs) {
    let s = dic[id].shelfs[i];
    result[s] = _getShelfTree(s, dic);
  }
  return result;
}

/**
 * @public @func getAllNotebookidOfShelf
 * @desc Get all notebook os a shelf
 * @param {string} shelfid
 * @param {func} callback 
 * @returns {array} The notebookid of given shelf
 */
export function getAllNotebookidOfShelf(shelfid, callback) {
  db.get(shelfid).then(res => {
    if (callback) callback(res.notebooks);
  });
}

/**
 * @public @func getAllNoteidOfNotebook
 * @desc Get all notebook os a shelf
 * @param {string} notebookid
 * @param {func} callback 
 * @returns {array} The noteid of given notebook
 */
export function getAllNoteidOfNotebook(notebookid, callback) {
  db.get(notebookid).then(res => {
    if (callback) callback(res.notes);
  });
}

/**
 * @public @func getAllNotebookOfShelf
 * @desc Get all notebooks instance of a shelf
 * @param {string} shelfid 
 * @param {func} callback 
 * @returns {array} The notebook is given shelf
 */
export function getAllNotebookOfShelf(shelfid, callback) {
  getAllNotebookidOfShelf(shelfid, res => {
    let query = [];
    res.forEach(ele => {
      query.push({_id: {$eq: ele}});
    });
    db.find({
      selector: {$or: query}
    }).then(res => {
      callback(res.docs);
    });
  });
}

/**
 * @public @func getAllNoteOfNotebook
 * @param {string} notebookid 
 * @param {func} callback 
 * @returns {array} The notes of given notebook
 */
export function getAllNoteOfNotebook(notebookid, callback) {
  getAllNoteidOfNotebook(notebookid, res => {
    printc(res);
    let query = [];
    res.forEach(ele => {
      query.push({_id: {$eq: ele}});
    });
    db.find({
      selector: {$or: query}
    }).then(res => {
      callback(res.docs);
    });
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
 * @private @func ifNoteExist
 * @desc Check if a note exists in database
 * @param {string} noteid The noteid to be checked
 * @param {func} callback This function will be called after query finishes.
 * @returns {boolean} Result of if the note exists
 */
function ifNoteExist(noteid, callback) {
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
 * @private @func ifNotebookExist
 * @desc Check if a notebook exists in database
 * @param {string} notebookid The notebookid to be checked
 * @param {func} callback This function will be called after query finishes.
 * @returns {boolean} Result of if the notebook exists.
 */
function ifNotebookExist(notebookid, callback) {
  db.find({
    selector: {$and: [
      {type: {$eq: 'notebook'}},
      {_id: {$eq: notebookid}},
    ]},
  }).then(result => {
    printc(`Number of query result: ${result.docs.length}`);
    if (callback) callback(result.docs.length > 0);
  });
}

/**
 * @private @func ifShelfExist
 * @desc Check if a shelf exists in database
 * @param {string} shelfid The shelfid to be checked
 * @param {func} callback This function will be called after query finishes.
 * @returns {boolean} Result of if the shelf exists
 */
function ifShelfExist(shelfid, callback) {
  db.find({
    selector: {$and: [
      {type: {$eq: 'shelf'}},
      {_id: {$eq: shelfid}},
    ]},
  }).then(result => {
    printc(`Number of query result: ${result.docs.length}`);
    if (callback) callback(result.docs.length > 0);
  });
}

/**
 * @private @func addNoteToNotebook
 * @desc Add a note into a notebook
 * @param {string} noteid The note to be added into a notebook
 * @param {string} notebookid The notebook will own the note
 * @param {func} callback The function will be called after adding the note into the notebook
 * @returns null
 */
function addNoteToNotebook(noteid, notebookid, callback) {
  // get the notebook
  db.get(notebookid).then(res => {
    printc(`Successfully get info of notebook ${notebookid}`);
    // put current note id into the notebook
    res.notes.push(noteid);
    db.put(res, {force: true}).then(res => {
      printc(`Successfully update notebook ${notebookid}`);
      if (callback) callback();
    });
  });
}

/**
 * @private @func removeNoteFromNotebook
 * @desc Remove note from its notebook
 * @param {string} noteid The note that has been deleted in database
 * @param {string} notebookid The notebook which owns the deleted note
 * @param {func} callback The function will be called after removing the note from the notebook
 * @returns null
 */
function removeNoteFromNotebook(noteid, notebookid, callback) {
  db.get(notebookid).then(res => {
    printc(`Successfully get info of notebook ${notebookid}`);
    res.notes.splice(res.notes.indexOf(noteid),1);
    db.put(res, {force: true}).then(res => {
      printc(`Note ${noteid} is deleted from notebook ${notebookid} successfully`);

      if (callback) callback();
    });
  }).catch(res => {
    printc(`Warning: notebook ${notebookid} is not found! It may be deleted earlier.`);
    if (callback) callback();
  });
}

/**
 * @private @func addNotebookToShelf
 * @desc Add a new notebook to a shelf
 * @param {string} notebookid The notebook which will be added to the shelf
 * @param {string} shelfid The shelf which the notebook belongs to
 * @param {func} callback This function will be called after adding finishes
 * @returns null
 */
function addNotebookToShelf(notebookid, shelfid, callback) {
  db.get(shelfid).then(res => {
    printc(`Successfully get info of shelf ${shelfid}`);
    res.notebooks.push(notebookid);
    db.put(res, {force: true}).then(res => {
      printc(`Successfully update shelf ${shelfid}`);
      if (callback) callback();
    });
  })
}

/**
 * @private @func removeNotebookFromShelf
 * @desc Remove a notebook from shelf
 * @param {string} notebookid The notebook which will be deleted from the shelf
 * @param {string} shelfid The shelf which the notebook belongs to
 * @param {func} callback This function will be called after removing
 * @returns null
 */
function removeNotebookFromShelf(notebookid, shelfid, callback) {
  db.get(shelfid).then(res => {
    printc(`Successfully get info of shelf ${shelfid}`);
    res.notebooks.splice(res.notebooks.indexOf(notebookid), 1);
    db.put(res, {force: true}).then(res => {
      printc(`Successfully update shelf ${shelfid}`);
      if (callback) callback();
    });
  })
}

/**
 * @private @func addShelfToShelf
 * @desc Add a shelf to a shelf
 * @param {string} shelfid1 The shelf which will be added into another shelf
 * @param {string} shelfid2 The shelf which the new shelf belongs to
 * @param {func} callback This function will be called after adding finishes
 * @returns null
 */
function addShelfToShelf(shelfid1, shelfid2, callback) {
  db.get(shelfid2).then(res => {
    printc(`Successfully get info of shelf ${shelfid2}`);
    res.shelfs.push(shelfid1);
    db.put(res, {force: true}).then(res => {
      printc(`Successfully update shelf ${shelfid2}`);
      if (callback) callback();
    })
  })
}

/**
 * @private @func removeShelfFromShelf
 * @desc Remove a shelf from a shelf
 * @param {string} shelfid1 The shelf which will be deleted from another shelf
 * @param {string} shelfid2 The shelf which owns the deleted shelf
 * @param {func} callback This function will be called after removing finishes
 * @returns null
 */
function removeShelfFromShelf(shelfid1, shelfid2, callback) {
  db.get(shelfid2).then(res => {
    printc(`Successfully get info of shelf ${shelfid2}`);
    res.shelfs.splice(res.shelfs.indexOf(shelfid1), 1);
    db.put(res, {force: true}).then(res => {
      printc(`Successfully update shelf ${shelfid2}`);
      if (callback) callback();
    })
  })
}

export function runTest() {
  
}

/*
function list: 
  initDB,
  newShelf,
  deleteShelf,
  newNotebook,
  deleteNotebook,
  newNote,
  updateNote,
  deleteNote,
  getAllNotes,
  getAllNotebooks,
  getAllShelf,
  getShelfTree,
  getAllNotebookidOfShelf,
  getAllNoteidOfNotebook,
  getAllNotebookOfShelf,
  getAllNoteOfNotebook,
  cleanDB
 */