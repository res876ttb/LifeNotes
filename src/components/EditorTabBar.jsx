// EditorTabBar.jsx
//  Maintain top-level program data.

// ============================================
// React packages
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

// ============================================
// import react components
import EditorTabBarItem from './EditorTabBarItem.jsx';

// ============================================
// import react redux-action

// ============================================
// import apis

// ============================================
// import css file
import '../styles/EditorTabBar.css';

// ============================================
// constants

// ============================================
// react components
class EditorTabBar extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    show: PropTypes.bool,
    showToolBar: PropTypes.bool,
    editorArr: PropTypes.any,
    newEditor: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.handleNewEditor = this.handleNewEditor.bind(this);

    this.state = {
      orders: []
    };
  }

  render() {
    let top = 0;
    if (this.props.showToolBar) top += 40;
    let tabs = [];
    
    // get all available tab
    for (let i in this.props.editorArr) {
      tabs.push(<EditorTabBarItem id={i} title={i} key={i}/>);
    }

    // reorder tabs


    return (
      this.props.show ? (
        <div id='EditorTabBar-frame' className='noselect' style={{top: top}}>
          <div className='ETB-xanchor-outer'>
            <div className='ETB-xanchor-inner'>
              <div className='ETB-begin'>&nbsp;</div>
              {tabs}
              <div className='ETB-end'>&nbsp;</div>
              <div className='ETB-new' onClick={this.handleNewEditor}>
                <div className='ETB-new-middle'>
                  <div className='ETB-new-inner'>
                    <i className="fas fa-plus"></i>
                  </div>
                </div>
              </div>
              <div className='ETB-bg'></div>
            </div>
          </div>
        </div>
      ) : <div></div>
    );
  }

  handleNewEditor() {
    this.props.newEditor();
  }
}

export default connect (state => ({
  show: state.main.showTabBar,
  showToolBar: state.main.showToolBar,
  editorArr: state.main.editorArr,
}))(EditorTabBar);

/*
editor: id, editor <= push editor into editorArr
tab: order, id, editorArr
drag&drop: get order of the tab, then change editor order in editorArr
*/