// SideBarTag.jsx
//  Maintain top-level program data.

// ============================================
// React packages
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

// ============================================
// import react components
import SideBarTagPlum from './SideBarTagPlum.jsx';

// ============================================
// import react redux-action

// ============================================
// import apis
import {getNewID} from '../utils/id.js';
import {splitOnce} from '../utils/string.js';

// ============================================
// import css file

// ============================================
// constants

// ============================================
// react components
class SideBarTag extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    tagids: PropTypes.array,
    title: PropTypes.string,
    showAllTag: PropTypes.bool,
    tagIndex: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.getChildren = this.getChildren.bind(this);

    this.state = {

    };
  }

  render() {
    let children = [];
    if (this.props.tagIndex) {
      children = this.getChildren();
    }

    return (
      <div>
        <i className="fab fa-slack-hash"></i>
        {this.props.title}
        <div style={{paddingLeft: '20px'}}>
          {this.props.showAllTag ? children : children // DEBUG
          }
        </div>
      </div>
    );
  }

  getChildren() {
    let tagDict = {};
    let tagList = [];

    // parse info
    for (let i in this.props.tagids) {
      let id = this.props.tagids[i].i;
      let title = this.props.tagids[i].t;
      let splitted = splitOnce(title, '/');
      let first = splitted[0];
      let last = '';
      if (splitted.length > 1) last = splitted[1];
      if (first in tagDict) {
        tagDict[first].push({
          i: id,
          t: last,
        });
      } else {
        tagDict[first] = [{
          i: id,
          t: last,
        }];
      }
    }

    // console.log(this.props.title, tagDict, this.props.tagids);

    // add element
    for (let i in tagDict) {
      if (i == '') continue;
      console.log(tagDict[i], i);
      tagList.push(
        <SideBarTagPlum
          key={getNewID()}
          tagids={tagDict[i]}
          title={i}
          showAllTag={this.props.showAllTag}
        />
      );
    }

    return tagList;
  }
}

export default connect (state => ({
  tagIndex: state.main.tagIndex,
}))(SideBarTag);
