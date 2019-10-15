import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TicketService from '../../../services/ticket-service';
import TicketEditForm from '../../../components/ticket-edit-form';

class TicketReply extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.match.params.id,
      errors: [],
      ticket: { name: '', messages: [], newMessage: "" },
      isFetching: true
    };

    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    TicketService.getTicket(this.state.id, (err, data) => {
      if (data && data.success) {
        this.setState({ ticket: { name: data.data.name, messages: data.data.messages, id: data.data.id, newMessage: "" }, isFetching: false });

      } else if (err) {
        this.setState({ errors: [err.message] });
      }
    });
  }

  submit(evt) {
    evt.preventDefault();

    TicketService.updateTicket(this.state.ticket, (err, data) => {
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
            <h4>Reply Ticket</h4>
          </div>
        </div>
        <div className="row">
          <TicketEditForm
            reply
            ticket={this.state.ticket}
            submit={this.submit}
            errors={this.state.errors}
            history={this.props.history}
            isFetching={this.state.isFetching} />
        </div>
      </div>
    );
  }
}
TicketReply.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default TicketReply;
