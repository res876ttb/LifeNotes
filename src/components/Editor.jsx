// Editor.jsx
//  Maintain top-level program data.

// ============================================
// React packages
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

// ============================================
// import react components
import EditorToolBar from './EditorToolBar.jsx';
import EditorTabBar from './EditorTabBar.jsx';
import EditorCore from './EditorCore.jsx';

// ============================================
// import react redux-action
import {
  addEditor,
  setActiveEditor,
} from '../states/mainState.js';

// ============================================
// import apis

// ============================================
// import css file
import '../styles/Editor.css';

// ============================================
// constants

// ============================================
// react components
class Editor extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    sideBarWidth: PropTypes.number,
    showToolBar: PropTypes.bool,
    showTabBar: PropTypes.bool,
    editorArr: PropTypes.any,
  }

  constructor(props) {
    super(props);

    this.handleNewEditor = this.handleNewEditor.bind(this);

    this.state = {

    };
  }

  componentDidMount() {
    this.handleNewEditor();
  }

  render() {
    let editorArrSize = Object.keys(this.props.editorArr).length;
    let editorArr = [];
    for (let i in this.props.editorArr) {
      editorArr.push(this.props.editorArr[i]);
    }
    return (
      <div id='Editor-frame' style={{left: `${this.props.sideBarWidth}px`, height: '100%'}}>
        {editorArrSize === 0 ? (
          <div id='Editor-empty-outer'>
            <div id='Editor-empty-middle'>
              <div id='Editor-empty-inner'>
                <div style={{paddingBottom: '10px'}}>No document is opened.</div>
                <Button onClick={this.handleNewEditor} variant="outlined" color="primary">Create a new document</Button>
              </div>
            </div>
          </div>
        ) : editorArr}
        <EditorToolBar />
        <EditorTabBar newEditor={this.handleNewEditor} />
      </div>
    );
  }

  handleNewEditor() {
    let id = Math.random().toString();
    let newEditor = <EditorCore initValue={''} id={id} key={id} />;
    this.props.dispatch(addEditor(newEditor, id));
    this.props.dispatch(setActiveEditor(id));
  }
}

export default connect (state => ({
  sideBarWidth: state.main.sideBarWidth,
  showToolBar: state.main.showToolBar,
  showTabBar: state.main.showTabBar,
  editorArr: state.main.editorArr,
}))(Editor);
