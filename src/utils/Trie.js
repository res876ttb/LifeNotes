import { notEqual } from "assert";

// modified from https://gist.github.com/tpae/72e1c54471e88b689f85ad2b3940a8f0
// Trie.js - super simple JS implementation
// https://en.wikipedia.org/wiki/Trie

// -----------------------------------------

// we start with the TrieNode
function TrieNode(key) {
  // the "key" value will be the character in sequence
  this.key = key;
  
  // we keep a reference to parent
  this.parent = null;
  
  // we have hash of children
  this.children = {};
  
  // check to see if the node is at the end
  this.end = false;

  // store id of tags
  this.ids = [];
}

// iterates through the parents to get the word.
// time complexity: O(k), k = word length
TrieNode.prototype.getWord = function() {
  var output = [];
  var node = this;
  
  while (node !== null) {
    output.unshift(node.key);
    node = node.parent;
  }
  
  return output.join('');
};

// -----------------------------------------

// we implement Trie with just a simple root with null value.
export function Trie() {
  this.root = new TrieNode(null);
}

// inserts a word into the trie.
// time complexity: O(k), k = word length
Trie.prototype.insert = function(word, id) {
  var node = this.root; // we start at the root 😬
  
  // for every character in the word
  for(var i = 0; i < word.length; i++) {
    // check to see if character node exists in children.
    if (!node.children[word[i]]) {
      // if it doesn't exist, we then create it.
      node.children[word[i]] = new TrieNode(word[i]);
      
      // we also assign the parent to the child node.
      node.children[word[i]].parent = node;
    }
    
    // proceed to the next depth in the trie.
    node = node.children[word[i]];
    
    // finally, we check to see if it's the last word.
    if (i == word.length-1) {
      // if it is, we set the end flag to true.
      node.end = true;

      // record the id of a tag
      node.ids.push(id);
    }
  }
};

// check if it contains a whole word.
// time complexity: O(k), k = word length
// return the id of a tag if the tag exists in the trie
Trie.prototype.contains = function(word) {
  var node = this.root;
  
  // for every character in the word
  for(var i = 0; i < word.length; i++) {
    // check to see if character node exists in children.
    if (node.children[word[i]]) {
      // if it exists, proceed to the next depth of the trie.
      node = node.children[word[i]];
    } else {
      // doesn't exist, return false since it's not a valid word.
      return [];
    }
  }
  
  // we finished going through all the words, but is it a whole word?
  if (node.end) {
    return node.ids;
  } else { // no tag exists. return an empty array
    return [];
  }
};

// delete a word from trie
// return true if success
Trie.prototype.remove = function(word) {
  var node = this.root;

  // record the deepest node which has more than 1 child
  let lastone = null;
  
  // find the lastone
  for (let i = 0; i < word.length; i++) {
    // check to see if character node exists in children
    if (node.children[word[i]]) {
      // check number of children of this node
      if (Object.keys(node).length > 1) {
        lastone = node;
      }

      // proceed to tne next depth of the trie.
      node = node.children[word[i]];
    } else {
      return false;
    }
  }

  // we finished going through all the words, then check if it a whole word
  if (node.end) {
    // we got it! start to remove node from the lastone node
    let prevone = node.parent;
    let key = node.key;

    // traverse back to find the node and delete it
    while (prevone != lastone) {
      key = prevone.key;
      prevone = prevone.parent;
    }
    delete lastone.children[key];

    return true;
  }
}

// returns every word with given prefix
// time complexity: O(p + n), p = prefix length, n = number of child paths
Trie.prototype.find = function(prefix) {
  var node = this.root;
  var output = [];
  
  // for every character in the prefix
  for(var i = 0; i < prefix.length; i++) {
    // make sure prefix actually has words
    if (node.children[prefix[i]]) {
      node = node.children[prefix[i]];
    } else {
      // there's none. just return it.
      return output;
    }
  }
  
  // recursively find all words in the node
  findAllWords(node, output);
  
  return output;
};

// recursive function to find all words in the given node.
function findAllWords(node, arr) {
  // base case, if node is at a word, push to output
  if (node.end) {
    arr.unshift(node.getWord());
  }
  
  // iterate through each children, call recursive findAllWords
  for (var child in node.children) {
    findAllWords(node.children[child], arr);
  }
}
