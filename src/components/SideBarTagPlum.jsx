// SideBarTagPlum.jsx
//  Used for recursive SideBarTag

// ============================================
// React packages
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

// ============================================
// import react components
import SideBarTag from './SideBarTag.jsx';

// ============================================
// import react redux-action

// ============================================
// import apis

// ============================================
// import css file

// ============================================
// constants

// ============================================
// react components
class SideBarTagPlum extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    tagids: PropTypes.array,
    title: PropTypes.string,
    showAllTag: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div>
        <SideBarTag
          tagids={this.props.tagids}
          title={this.props.title}
          showAllTag={this.props.showAllTag}
        />
      </div>
    );
  }
}

export default connect (state => ({

}))(SideBarTagPlum);
