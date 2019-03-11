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
    level: PropTypes.number,
    width: PropTypes.number,
    toggler: PropTypes.func,
    expended: PropTypes.array,
    prefix: PropTypes.string,
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
          level={this.props.level + 1}
          width={this.props.width}
          toggler={this.props.toggler}
          expended={this.props.expended}
          prefix={this.props.prefix}
        />
      </div>
    );
  }
}

export default connect (state => ({

}))(SideBarTagPlum);
