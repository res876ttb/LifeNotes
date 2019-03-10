/**
 * @file UserProfile.jsx
 * @desc User profile block
 */

// ============================================
// React packages
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Tooltip from '@material-ui/core/Tooltip';

// ============================================
// import react components

// ============================================
// import react redux-action

// ============================================
// import apis

// ============================================
// import css file
import '../styles/UserProfile.css';

// ============================================
// constants

// ============================================
// react components
class UserProfile extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    userName: PropTypes.string,
    userImageUrl: PropTypes.string,
    handleSignOutGoogle: PropTypes.func,
    width: PropTypes.number,
  }

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div>
        <Tooltip title={(
          <div>
            Logout. <br/>
            This action will make you unable to synchronize your notes with google drive.
          </div>
        )} placement='right'>
          <div 
            className='UserProfile-userImage text-center' 
            style={{backgroundImage: `url("${this.props.userImageUrl}"`}}
            onClick={this.props.handleSignOutGoogle}
          >
            <i className="fas fa-sign-out-alt UserProfile-userImage-LogoutIcon"></i>  
          </div>
        </Tooltip>
        <Tooltip title={`${this.props.userName}`} placement='right'>
          <div className='UserProfile-userName' style={{maxWidth: `${this.props.width - 60}px`}}>
            Hello, {this.props.userName}
          </div>
        </Tooltip>
      </div>
    );
  }
}

export default connect (state => ({
  userName: state.main.userName,
  userImageUrl: state.main.userImageUrl,
}))(UserProfile);
