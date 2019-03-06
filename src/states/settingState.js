// settingState.js
//  Store application setting.

// ============================================
// import

// ============================================
// functions

// ============================================
// constants
const defaultSaveInterval = 60000;
const initSettingState = {
  defaultNotePath: '1',
  saveInterval: 60000, // ms
};

// ============================================
// reducer
export function setting(state=initSettingState, action) {
  switch(action.type) {
    case 'setting setDefaultNotePath':
      return {
        ...state,
        defaultNotePath: action.dirpath,
      };

    case 'setting setSaveInterval':
      return {
        ...state,
        saveInterval: action.saveInterval,
      };
      
    default:
      return state;
  }
}

// ============================================
// action
export function setDefaultNotePath(dirpath) {
  return {
    type: 'setting setDefaultNotePath',
    dirpath: dirpath,
  };
}

export function setSaveInterval(saveInterval) {
  return {
    type: 'setting setSaveInterval',
    saveInterval: saveInterval,
  };
}
