// EditorToolBar.jsx
//  Maintain top-level program data.

// ============================================
// React packages
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';

// ============================================
// import react components
import EditorToolBarButton from './EditorToolBarButton.jsx';

// ============================================
// import react redux-action

// ============================================
// import apis

// ============================================
// import css file
import '../styles/EditorToolBar.css';

// ============================================
// constants

// ============================================
// react components
class EditorToolBar extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    show: PropTypes.bool,
    editor: PropTypes.any,
  }

  constructor(props) {
    super(props);

    this.handleBold = this.handleBold.bind(this);

    this.state = {

    };
  }

  render() {
    return (
      <div>{this.props.show ? (
        <div id='EditorToolBar-frame'>
          <div id='EditorToolBar-xanchor-outer'>
            <div id='EditorToolBar-xanchor-inner'>
              <div style={{width: '2px', display: 'inline-block', height: '10px'}}></div>
              <EditorToolBarButton icon={(<i className="fas fa-undo"></i>)} />
              <EditorToolBarButton icon={(<i className="fas fa-redo"></i>)} />
              <div style={{width: '10px', display: 'inline-block', height: '10px'}}></div>
              <EditorToolBarButton click={this.handleBold} icon={(<i className="fas fa-bold"></i>)} />
              <EditorToolBarButton icon={(<i className="fas fa-italic"></i>)} />
              <EditorToolBarButton icon={(<i className="fas fa-underline"></i>)} style={{paddingBottom: '6px'}}/>
              <EditorToolBarButton icon={(<i className="fas fa-strikethrough"></i>)} />
              <EditorToolBarButton icon={(<i className="fas fa-list-ul"></i>)} />
              <EditorToolBarButton icon={(<i className="fas fa-list-ol"></i>)} />
              <EditorToolBarButton icon={(<i className="far fa-check-square"></i>)} />
              <EditorToolBarButton icon={(<i className="fas fa-quote-right"></i>)} />
              <EditorToolBarButton icon={(<i className="fas fa-code"></i>)} />
              <EditorToolBarButton icon={(<i className="fas fa-table"></i>)} />
              <EditorToolBarButton icon={(<i className="fas fa-link"></i>)} />
              <EditorToolBarButton icon={(<i className="fas fa-images"></i>)} />
            </div>
          </div>
        </div>
      ) : null}</div>
    );
  }

  handleBold() {
    console.log(this.props.editor.getRange());

    // this.props.editor.execCommand('hmdTab');
  }
}

export default connect (state => ({
  editor: state.main.activeEditor,
  show: state.main.showToolBar,
}))(EditorToolBar);
