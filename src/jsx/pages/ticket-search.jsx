import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import ReactTable from 'react-table';

import TicketService from '../services/ticket-service';

class SearchTickets extends Component {
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

    TicketService.searchTickets(query, (err, data) => {
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
            <NavLink className="btn btn-default btn-xs" to={`/ticket/view/${row.value}`}>
              <span className="glyphicon glyphicon-pencil" aria-hidden="true" />
              View
            </NavLink>
          </div>
        )
        /* eslint-enable arrow-body-style */
      }
    ];

    return (
      <div>
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

export default SearchTickets;
