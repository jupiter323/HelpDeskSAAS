import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TicketService from '../services/ticket-service';
import TicketEditForm from '../components/ticket-edit-form';
import CompanyService from '../services/company-service';
class TicketNew extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      ticket: { name: '', messages: [], newMessage: '', email: "", company: "" }
    };

    this.submit = this.submit.bind(this);
  }
  componentWillMount() {
    CompanyService.getCompanyBySubdomain(this.props.company.subdomain, (err, data) => {
      if (err)
        this.setState({ errors: [err.message] })
      else {
        var ticket = { name: '', messages: [], newMessage: '', email: "", company: data.data.id }
        this.setState({ ticket })
      }
    })
  }
  submit(evt) {
    evt.preventDefault();

    // create a string for an HTTP body message
    var { ticket } = this.state
    var { email } = ticket
    var nameByEmail = email.split("@")[0]
    const name = encodeURIComponent(nameByEmail);
    const bodyemail = encodeURIComponent(email);
    const password = encodeURIComponent("12345678");
    const formData = `name=${name}&email=${bodyemail}&password=${password}`;

    const xhr = new XMLHttpRequest();
    xhr.open('post', '/auth/signup');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', (err, data) => {
      if (xhr.status === 200) {

        this.setState({ errors: [] });

        // create new ticket
        ticket.startBy = xhr.response.user.id;
        this.setState({ticket})
        TicketService.newTicketEmail(ticket, (err, data) => {
          if (err || (data && !data.success)) {
            this.setState({ errors: data && data.errors ? data.errors : [err.message] });
          } else if (data && data.success) {
            this.props.history.goBack();
          }
        });

      } else {

        const errors = [];
        if (xhr.response && xhr.response.message) {
          errors.push(xhr.response.message); // Summary
          const errObj = xhr.response.errors ? xhr.response.errors : {};
          Object.keys(errObj).forEach((key) => {
            errors.push(errObj[key]);
          });
        } else {
          errors.push(`${xhr.status} ${xhr.statusText}`);
        }

        this.setState({ errors: errors }); // eslint-disable-line object-shorthand
      }
    });
    xhr.send(formData);
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
            email
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
