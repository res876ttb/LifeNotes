// mainState.js
//  ${Goal and description of this file}.

// ============================================
// import

// ============================================
// functions

// ============================================
// constants
const initMainState = {
  sideBarWidth: 200,
  showToolBar: false,
  showTabBar: true,
  activeEditorId: null,
  editorArr: {},
  activeOrder: [],
  titleArr: {},
  tabArr: [],
}

// ============================================
// reducer
export function main(state=initMainState, action) {
  let tmp = null;
  let tmp1 = null;
  let tmp2 = null;
  switch(action.type) {
    case 'main setSideBarWidth':
      return {
        ...state,
        sideBarWidth: action.newWidth,
      };
    case 'main toggleToolBar':
      return {
        ...state, 
        showToolBar: !state.showToolBar
      };
    case 'main showTabBar':
      return {
        ...state,
        showTabBar: !state.showTabBar
      };
    case 'main setActiveEditor': 
      tmp = state.activeOrder.slice();
      if (tmp.indexOf(action.id) === -1) {
        tmp.unshift(action.id);
      } else {
        tmp2 = tmp.indexOf(action.id);
        tmp.splice(tmp2, 1);
        tmp.unshift(action.id);
      }

      return {
        ...state,
        activeEditorId: action.id,
        activeOrder: tmp,
      };
    case 'main addEditor':
      if (Object.keys(state.editorArr).length === 0) {
        tmp = {};
        tmp[action.id] = action.editor;
      } else {
        tmp = Object.assign({}, state.editorArr);
        tmp[action.id] = action.editor;
      }

      tmp1 = state.tabArr.slice();
      tmp1.push(action.id);
      
      return {
        ...state,
        editorArr: tmp,
        tabArr: tmp1,
      };
    case 'main removeEditor':
      tmp = Object.assign({}, state.editorArr);
      delete tmp[action.id];
      tmp1 = state.tabArr.slice();
      tmp1.splice(tmp1.indexOf(action.id),1);
      tmp2 = state.activeOrder.slice();
      tmp2.splice(tmp2.indexOf(action.id),1);
      
      return {
        ...state,
        editorArr: tmp,
        tabArr: tmp1,
        activeOrder: tmp2,
        activeEditorId: tmp2.length > 0 ? tmp2[0] : null,
      };

    case 'main setTitle':
      tmp = Object.assign({}, state.titleArr);
      tmp[action.id] = action.title;
      return {
        ...state,
        titleArr: tmp,
      };

    case 'main swapTab':
      tmp = state.tabArr.slice();
      tmp1 = tmp.indexOf(action.id1);
      tmp2 = tmp.indexOf(action.id2);
      tmp[tmp1] = action.id2;
      tmp[tmp2] = action.id1;
      return {
        ...state,
        tabArr: tmp,
      }
    default:
      return state;
  }
}

// ============================================
// action
export function setSideBarWidth(newWidth) {
  return {
    type: 'main setSideBarWidth',
    newWidth: newWidth
  };
}

export function toggleToolBar() {
  return {
    type: 'main toggleToolBar'
  };
}

export function toggleTabBar() {
  return {
    type: 'main toggleTabBar'
  };
}

export function setActiveEditor(id) {
  return {
    type: 'main setActiveEditor',
    id: id
  };
}

export function addEditor(editor, id) {
  return {
    type: 'main addEditor',
    editor: editor,
    id: id,
  };
}

export function removeEditor(id) {
  return {
    type: 'main removeEditor',
    id: id,
  };
}

export function setTitle(id, title) {
  return {
    type: 'main setTitle',
    id: id, 
    title: title,
  };
}

export function swapTab(id1, id2) {
  return {
    type: 'main swapTab',
    id1: id1,
    id2: id2
  };
}
