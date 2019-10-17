import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TicketService from '../../../services/ticket-service';
import TicketEditForm from '../../../components/ticket-edit-form';
import CompanyService from '../../../services/company-service';

class TicketNew extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      company: null,
      css: null,
      ticket: { name: '', messages: [], newMessage: '' }
    };

    this.submit = this.submit.bind(this);
  }
  componentWillMount() {
    if (this.props.company && this.props.company.subdomain)
      CompanyService.getCompanyBySubdomain(this.props.company.subdomain, (err, data) => {
        if (err) {
          this.setState({ errors: [err.message] })
        } else {
          this.setState({ company: data.data, css: JSON.parse(data.data.css) })
        }

      })
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
    var { company, css } = this.state
    return (
      <div style={css && { background: css.background, color: css.color }}>
        <div className="row">
          <div className="col-sm-12 col-md-1 col-lg-1 logoImage">
            <img src={company && company.logo} />
          </div>
          <div className="col-sm-12 col-md-5 col-lg-5 form-header">
            <h4>Add Ticket</h4>

          </div>
        </div>
        <div className="row mt-4">
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
