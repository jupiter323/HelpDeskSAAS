import Request from './request';

const TicketService = {

  /**
   * Get Tickets
   *
   * @param {string}   query query string with paging options
   * @param {function} callback (err, data)
                       The function that is called after a service call
                       error {object}: null if no error
                       data {object}: The data set of a succesful call
   */
  getTickets: (query, callback) => {
    if (!$.isFunction(callback)) throw new Error('callback function is required');
    query = query || '';
    Request.get(`/api/tickets${query}`, callback);
  },

  /**
   * Search Tickets
   *
   * @param {string}   query query string with paging options
   * @param {function} callback (err, data)
                       The function that is called after a service call
                       error {object}: null if no error
                       data {object}: The data set of a succesful call
   */
  searchTickets: (query, callback) => {
    if (!$.isFunction(callback)) throw new Error('callback function is required');
    query = query || '';
    Request.get(`/api/tickets/search${query}`, callback);
  },


  /**
   * Get Ticket by id
   *
   * @param {string}   id ticket id
   * @param {function} callback (err, data)
                       The function that is called after a service call
                       error {object}: null if no error
                       data {object}: The data set of a succesful call
   */
  getTicket: (id, callback) => {
    if (!$.isFunction(callback)) throw new Error('callback function is required');
    Request.get(`/api/tickets/${id}`, callback);
  },


  /**
   * Get Ticket by id without auth
   *
   * @param {string}   id ticket id
   * @param {function} callback (err, data)
                       The function that is called after a service call
                       error {object}: null if no error
                       data {object}: The data set of a succesful call
   */
  getTicketWithoutAuth: (id, callback) => {
    if (!$.isFunction(callback)) throw new Error('callback function is required');
    Request.get(`/api/tickets/search/${id}`, callback);
  },


  /**
   * Get Company by id
   *
   * @param {string}   subdomain company subdomain
   * @param {function} callback (err, data)
                       The function that is called after a service call
                       error {object}: null if no error
                       data {object}: The data set of a succesful call
   */
  getCompanyBySubdomain: (subdomain, callback) => {
    if (!$.isFunction(callback)) throw new Error('callback function is required');
    Request.get(`/api/companies/subdomain/${subdomain}`, callback);
  },

  /**
   * Add new ticket
   *
   * @param {object}   company company object to add
   * @param {function} callback (err, data)
                       The function that is called after a service call
                       error {object}: null if no error
                       data {object}: The data set of a succesful call
   */
  newTicket: (ticket, callback) => {
    if (!$.isFunction(callback)) throw new Error('callback function is required');
    Request.post('/api/tickets', JSON.stringify({ ticket /* :ticket */ }), callback);
  },

    /**
   * Add new ticketemail
   *
   * @param {object}   company company object to add
   * @param {function} callback (err, data)
                       The function that is called after a service call
                       error {object}: null if no error
                       data {object}: The data set of a succesful call
   */
  newTicketEmail: (ticket, callback) => {
    if (!$.isFunction(callback)) throw new Error('callback function is required');
    Request.post('/api/tickets/email', JSON.stringify({ ticket /* :ticket */ }), callback);
  },

  /**
   * Update a ticket
   *
   * @param {object}   ticket ticket object to update
   * @param {function} callback (err, data)
                       The function that is called after a service call
                       error {object}: null if no error
                       data {object}: The data set of a succesful call
   */
  updateTicket: (ticket, callback) => {
    if (!$.isFunction(callback)) throw new Error('callback function is required');
    Request.put('/api/tickets', JSON.stringify({ ticket /* :ticket */ }), callback);
  },

  /**
   * Delete a ticket
   *
   * @param {string}   id ticket id
   * @param {function} callback (err, data)
                       The function that is called after a service call
                       error {object}: null if no error
                       data {object}: The data set of a succesful call
   */
  deleteTicket: (id, callback) => {
    if (!$.isFunction(callback)) throw new Error('callback function is required');
    Request.delete(`/api/tickets/${id}`, callback);
  }
};

export default TicketService;
