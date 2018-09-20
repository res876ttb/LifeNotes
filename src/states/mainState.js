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
  showToolBar: true,
  showTabBar: true,
}

// ============================================
// reducer
export function main(state=initMainState, action) {
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
  }
}

export function toggleTabBar() {
  return {
    type: 'main toggleTabBar'
  }
}
