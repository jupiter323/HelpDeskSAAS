import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TicketService from '../../../services/ticket-service';
import TicketEditForm from '../../../components/ticket-edit-form';

class TicketNew extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      ticket: { name: '', messages: [], newMessage: "" }
    };

    this.submit = this.submit.bind(this);
  }

  submit(evt) {
    evt.preventDefault();

    TicketService.newTicket(this.state.ticket, (err, data) => {
      if (err || (data && !data.success)) {
        this.setState({ errors: data && data.errors ? data.errors : [err.message] });
      } else if (data && data.success) {
        this.props.history.push('/companyuser/tickets');
      }
    });
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-sm-5 col-md-5 col-lg-5 form-header">
            <h4>Add Ticket</h4>
          </div>
        </div>
        <div className="row">
          <TicketEditForm
            ticket={this.state.ticket}
            submit={this.submit}
            errors={this.state.errors}
            history={this.props.history}
            isFetching={false} />
        </div>
      </div>
    );
  }
}
TicketNew.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default TicketNew;
