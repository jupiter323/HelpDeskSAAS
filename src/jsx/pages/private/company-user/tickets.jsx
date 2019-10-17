import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import ReactTable from 'react-table';

import FormSubmitErrors from '../../../components/form-submit-errors';

import TicketService from '../../../services/ticket-service';

class Tickets extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      data: [],
      pages: null,
      loading: true
    };

    this.fetchData = this.fetchData.bind(this);
  }

  fetchData(state, /* instance */) {

    let sort = '';
    state.sorted.forEach((item) => {
      const dir = item.desc ? '-' : '';
      sort += dir + item.id + ' ';
    });

    const query = `?page=${state.page + 1}&limit=${state.pageSize}&sort=${sort}&filter=${JSON.stringify(state.filtered)}`;

    TicketService.getTickets(query, (err, data) => {
      if (err) {
        this.setState({ errors: [err.message] });
      } else {
        this.setState({
          errors: [],
          data: data.docs,
          pages: data.pages,
          loading: false
        });
      }
    });
  }

  render() {
    const { data, pages, loading } = this.state;
    const columns = [
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'Action',
        accessor: 'id',
        sortable: false,
        filterable: false,
        /* eslint-disable arrow-body-style */
        Cell: row => (
          <div>
            <NavLink className="btn btn-default btn-xs" to={`/companyuser/tickets/reply/${row.value}`}>
              <span className="glyphicon glyphicon-pencil" aria-hidden="true" />
              Reply
            </NavLink>
            <NavLink className="btn btn-default btn-xs m-l-xs" to={`/companyuser/tickets/delete/${row.value}`}>
              <span className="glyphicon glyphicon-trash" aria-hidden="true" />
              Delete
            </NavLink>
            <select className="btn btn-default btn-xs m-l-xs">
              <option key="1" value="user1">Assigned user1</option>
              <option key="2" value="user1">Assigned user2</option>
            </select>
          </div>
        )
        /* eslint-enable arrow-body-style */
      }
    ];
    
    return (
      <div>
        <div>
          <NavLink className="btn btn-default btn-xs m-b-sm" to={'/companyuser/tickets/new'}>
            <span className="glyphicon glyphicon-plus" aria-hidden="true" />
            Add new Ticket
          </NavLink>
        </div>
        <FormSubmitErrors errors={this.state.errors} />
        <ReactTable
          columns={columns}
          defaultSorted={[{ id: 'name', desc: false }]}
          manual // Forces table not to paginate or sort automatically, handle it server-side
          data={data}
          pages={pages} // Display the total number of pages
          loading={loading} // Display the loading overlay when we need it
          onFetchData={this.fetchData} // Request new data when things change
          filterable
          defaultPageSize={5}
          className="-striped -highlight" />
     
      </div>
    );
  }
}

export default Tickets;
