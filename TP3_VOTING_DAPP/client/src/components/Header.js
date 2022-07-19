import React from 'react';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';

export default class Header extends React.Component {
  render() {
    return (
     <b> Connected wallet : {this.props.addr} <br/></b> 
    );
  }
}
