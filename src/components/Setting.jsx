/**
 * @file Setting.jsx
 * @desc description
 */

// ============================================
// React packages
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Switch from '@material-ui/core/Switch';

import PerfectScrollbar from 'react-perfect-scrollbar';

// ============================================
// import react components

// ============================================
// import react redux-action
import {
  setSaveInterval,
  setAutoSync,
} from '../states/settingState.js';

// ============================================
// import apis

// ============================================
// import css file

// ============================================
// constants

// ============================================
// react components
class Setting extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    open: PropTypes.bool,
    toggleSetting: PropTypes.func,
    saveInterval: PropTypes.number,
    autoSync: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.handleChangeSaveInterval = this.handleChangeSaveInterval.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleToggleAutoSync = this.handleToggleAutoSync.bind(this);

    this.state = {
      saveInterval: this.props.saveInterval / 1000,
      autoSync: this.props.autoSync,
    };
  }

  render() {
    return (
      <div className='noSelect'>
        <Dialog onClose={this.handleDialogClose} open={this.props.open}>
          <DialogTitle id="simple-dialog-title">Setting</DialogTitle>
          <div style={{minWidth: '450px', maxWidth: '1200px', maxHeight: '70vh', overflow: 'scroll'}}>
            <PerfectScrollbar>
              <div style={{padding: '0px 22px 22px 22px'}}>
                <table style={{width: '100%'}}>
                  <tbody>
                    <tr>
                      <td>
                        Save Interval
                      </td>
                      <td>
                        <div style={{textAlign: 'right'}}>
                          <Input
                            type='number'
                            value={this.state.saveInterval}
                            onChange={this.handleChangeSaveInterval}
                            endAdornment={<InputAdornment position="end">Seconds</InputAdornment>}
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div>
                  <Switch 
                    checked={this.state.autoSync}
                    onChange={this.handleToggleAutoSync}
                    color="primary"
                  />
                  Synchronize notes to Google drive periodically.
                </div>
              </div>
            </PerfectScrollbar>
          </div>
        </Dialog>
      </div>
    );
  }

  handleChangeSaveInterval(e) {
    this.setState({
      saveInterval: e.target.value,
    });
  }

  handleToggleAutoSync() {
    this.setState({
      autoSync: this.state.autoSync ? false : true,
    });
  }

  handleDialogClose(e) {
    if (this.state.saveInterval !== '') {
      this.props.dispatch(setSaveInterval(parseInt(this.state.saveInterval, 10)));
    }
    this.props.dispatch(setAutoSync(this.state.autoSync));
    this.props.toggleSetting();
  }
}

export default connect (state => ({
  saveInterval: state.setting.saveInterval,
  autoSync: state.setting.autoSync,
}))(Setting);
