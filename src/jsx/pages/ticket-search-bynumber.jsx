import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import MessageService from '../services/message-service';
import TicketService from './../services/ticket-service';

class TicketByNumber extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ticketnumber: "",
      message: '',
      error: '',
      found: false
    };

    this.handleView = this.handleView.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.search = this.search.bind(this);
  }

  handleKey(evt) {
    this.setState({ ticketnumber: evt.target.value })
  }
  handleView() {
    this.props.history.push(`/ticket/view/${this.state.ticketnumber}`)
  }
  search() {
    TicketService.getTicketWithoutAuth(this.state.ticketnumber, (err, data) => {
      if (err) {
        this.setState({ message: "", error: err, found: false })
      } else {
        this.setState({ message: "found your ticket", error: '', found: true });        
      }
    })
  }
  render() {
    const divs = [];
    if (this.state.message || this.state.error) {
      divs.push(
        <div key="alert-div" className={'alert alert-' + (this.state.message ? 'success' : 'warning')}>
          {this.state.message}
          {this.state.error}
        </div>
      );
    }

    return (
      <div>
        <div className="row">
          <div className="col-sm-12 col-md-10 col-lg-6">
            <h3>Check your ticket by number</h3>
            <ReactCSSTransitionGroup
              transitionName="transition"
              transitionEnterTimeout={700}
              transitionLeaveTimeout={700}>
              {divs}
            </ReactCSSTransitionGroup>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-10 col-lg-6">
            <div className="well">
              <input value={this.state.ticketnumber} onChange={this.handleKey} />
              <button onClick={this.search}>Search</button>
              {this.state.found && <button onClick={this.handleView}>View</button>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TicketByNumber;
