import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TicketService from '../../../services/ticket-service';
import FormSubmitErrors from '../../../components/form-submit-errors';

class TicketDelete extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.match.params.id,
      errors: [],
      ticket: { name: '', messages: [] }
    };

    this.delete = this.delete.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentWillMount() {
    TicketService.getTicket(this.state.id, (err, data) => {
      if (data && data.success) {
        this.setState({ ticket: data.data });
      } else if (err) {
        this.setState({ errors: [err.message] });
      }
    });
  }

  delete() {
    TicketService.deleteTicket(this.state.id, (err, data) => {
      if (err || (data && !data.success)) {
        this.setState({ errors: data && data.errors ? data.errors : [err.message] });
      } else if (data && data.success) {
        this.props.history.goBack();
      }
    });
  }

  cancel() {
    this.props.history.goBack();
  }

  render() {
    const ticket = this.state.ticket;
    return (
      <div className="m-l">
        <div className="row">
          <div className="col-sm-1 col-md-1 col-lg-1" />
          <div className="col-sm-4 col-md-4 col-lg-4 m-l-sm p-xs">
            <h4><strong>Delete Ticket</strong></h4>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-1 col-md-1 col-lg-1" />
          <div className="col-sm-4 col-md-4 col-lg-4">
            <div className="row">
              <strong className="col-xs-6 col-sm-8 col-md-6 col-lg-4">Ticket Name</strong>
              <div className="col-xs-4 col-sm-4 col-md-6">{ticket.name}</div>
            </div>
            {ticket.messages.map((message, index) => {
              return (<div key={index} className="row m-t-xs">
                <strong className="col-xs-6 col-sm-8 col-md-6 col-lg-4">Message {index}</strong>
                <div className="col-xs-4 col-sm-4 col-md-6">{message}</div>
              </div>);
            }
            )}
            <div className="row m-t-md">
              <div className="col-xs-12 col-sm-12 col-md-12">
                <strong>Are you sure you want to delete ticket?</strong><br />
                <div className="m-t">
                  <button type="button" className="btn btn-danger" onClick={this.delete}>Delete</button>
                  <button type="button" className="btn btn-default m-l-sm" onClick={this.cancel}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-4 col-md-4 col-lg-4">
            <FormSubmitErrors errors={this.state.errors} />
          </div>
        </div>
      </div>
    );
  }
}
TicketDelete.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired,
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }).isRequired
};

export default TicketDelete;
