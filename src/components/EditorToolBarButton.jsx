// EditorToolBarButton.jsx
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

// ============================================
// import react redux-action

// ============================================
// import apis

// ============================================
// import css file
import '../styles/EditorToolBarButton.css';

// ============================================
// constants
const styles = theme => ({
  button: {
    width: '36px',
    minWidth: '36px',
    height: '36px',
    backgroundColor: 'white',
    color: '',
    boxShadow: 'none',
    fontSize: '16px',
    '&:hover': {
      backgroundColor: 'rgb(220,220,220)'
    }
  },
});

// ============================================
// react components
class EditorToolBarButton extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    icon: PropTypes.object,
    click: PropTypes.func,
    active: PropTypes.bool,
    style: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);

    this.state = {

    };
  }

  render() {
    return (
      <div className='ETBB-frame'>
        <Button className={this.props.classes.button}
          style={this.props.style}
        >
          {this.props.icon}
        </Button>
      </div>
    );
  }

  handleClick() {
    this.props.click();
  }
}

export default connect (state => ({

}))( withStyles(styles)(EditorToolBarButton) );
