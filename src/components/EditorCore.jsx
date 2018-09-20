// EditorCore.jsx
//  Maintain top-level program data.

// ============================================
// React packages
import React from 'react';
// import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

// ============================================
// import react components

// ============================================
// import react redux-action

// ============================================
// import apis

// ============================================
// import css file
import '../styles/EditorCore.css';
import '../styles/hyperMD.css';

// ============================================
// constants

// ============================================
// react components
class EditorCore extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    showTabBar: PropTypes.bool,
    showToolBar: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.state = {
      mac: false,       // if current os is macOS
      content: '<div></div>',
      idPostfix: Math.random().toString(),
      editor: null
    };
  }

  componentDidMount() {
    let myTextarea = document.getElementById('EditorCore-frame' + this.state.idPostfix);

    let editor = HyperMD.fromTextArea(myTextarea, {
      mode: {
        name: 'hypermd',
        hashtag: true,
      },
      hmdFold: {
        image: true,
        link:  true,
        math:  true,
        html:  true, // maybe dangerous
        emoji: true,
      },
      tabSize: 2,
    });
    editor.setSize(null, "100%");
    editor.setValue(
"# HyperMD Documentation\n\
\n\
![HyperMD Logo](http://laobubu.net/HyperMD/demo/logo.png)\n\
\n\
[中文文檔](./zh-CN/index.md)\n\
\n\
```cpp\n\
#include <iostream>\n\
using namespace std;\n\
\n\
int main() {\n\
  printf(\"Hello world!\\n\");\n\
  return 0;\n\
}\n\
```\n\
This is a normal line\n\
>**Notice**\n\
>\n\
>All links are DIRECTLY clickable. Feel free to click without `Ctrl` or `Alt`!\n\
>>Second quote\n\
\n\
>**Notice**\n\
>\n\
>Some document files are auto generated and excluded in source code repository.\n\
>\n\
>Please read this document on\n\
>[HyperMD Demo](https://laobubu.net/HyperMD/?directOpen#./docs/index.md)\n\
>or\n\
>[GitHub gh-pages branch](https://github.com/laobubu/HyperMD/blob/gh-pages/docs/index.md)\n\
\n\
* 123\n\
* 456\n\
321\n\
"
    )
    
    this.setState({
      // detect os version
      mac: (navigator.appVersion.match(/Mac|mac/) !== null) ? true : false,
      // set hypermd
      editor: editor
    });

    // let editable = document.getElementById('EditorCore-frame');
    // editable.addEventListener('input', this.handleInputChar);
  }

  render() {
    let top = 0;
    if (this.props.showTabBar) top += 40;
    if (this.props.showToolBar) top += 40;
    return (
      <div className='EditorCore-frame' style={{top: `${top}px`}} onKeyDown={this.handleKeyDown}>
        <div className='EditorCore-HMD-wrapper'>
          <textarea id={'EditorCore-frame' + this.state.idPostfix}></textarea>
        </div>
      </div>
    );
  }

/**
 * @func handleKeyDown
 * @desc Watch the keyboard event, including typing and shortcuts
 *       Sensor of watcher
 */
  handleKeyDown(e) {
    setTimeout(() => {
      // console.log(this.state.editor.getValue());
    }, 1);
    return;


    // key: 46 for delete key, 8 for backspace
    let key = e.which | e.code;
    let meta = e.metaKey;
    let alt = e.altKey;
    let ctrl = e.ctrlKey;
    let shift = e.shiftKey;
    let prefix = meta || alt || ctrl;

    // prevent any default event except arrow keys, navigation keys, and any shortcut with prefix
    // if ((key > 40 || key < 33) && !prefix) e.preventDefault();

    // prevent default enter event, replace it with shift-enter event, and set a flag 
    //  which represents that this is an event with enter-only
    // if (key === 13 && !shift) {
    //   e.preventDefault();
    // }

    let sel = window.getSelection();

    console.log(`key: ${key}, prefix: ${prefix}, meta: ${meta}, alt: ${alt}, ctrl: ${ctrl}, shift: ${shift}`);

    // // the event is shortcut event or caret movement event
    // if ((key > 40 || key < 33) && !prefix && key !== 13) return;

    let ke = {
      type: 3, // 3 means this is a keyboard event
      key: key,
      prefix: prefix,
      meta: meta,
      alt: alt,
      ctrl: ctrl,
      shift: shift
    };

    // this.handleBold(ke, sel);
  }

  handleBold(ke, sel) {
    this.getCurLine(sel);
    // console.log(sel.anchorNode);
  }

  getCurLine(sel) {
    let curNode = sel.anchorNode;
    let parentNode = curNode.parentNode;
    while (true) {
      if (parentNode.innerText != undefined && 
          (parentNode.innerText.match('\n') !== null ||
           parentNode.id === 'EditorCore-frame')) {
        break;
      }
      curNode = parentNode;
      parentNode = curNode.parentNode;
    }
    console.log(curNode.innerHTML);
  }

/**
 * @func getMode
 * @desc Return mode for undo stack
 * @param key Event from input listener
 * @param sel Event from window.getSelection()
 */
  getMode(key, sel) {
    // when isCollapsed is false, then something is selected
    if (sel.isCollapsed === false) {
      switch (key) {
        case 'deleteContentBackward': case 'deleteContentForward': // backspace, delete
          return 'range delete';
        default:
          return 'replace';
      }
    } else {
      switch (key) {
        case 'deleteContentBackward': // backspace
          return 'back delete';
        case 'deleteContentForward': // delete
          return 'forward delete';
        default: 
          return 'insert';
      }
    }
  }

/**
 * @func getHotkey
 * @desc Return the hotkey pressed currently
 */
  getHotkey(key, meta, alt, ctrl, shift) {
    let cmd = (this.state.mac) ? meta : ctrl;
    // undo
    if (cmd && key === 90) return 'undo';
    // redo
    if (cmd && shift && key === 90) return 'redo';
    // copy 
    // ...
    return null;
  }
}

export default connect (state => ({
  
}))(EditorCore);
