import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Utils from '../common/utils';
import FormValidationErrors from './form-validation-errors';
import FormSubmitErrors from './form-submit-errors';

class TicketEditForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            validation: {
                name: {
                    valid: false,
                    touched: false,
                    message: 'Name is required'
                },
                newMessage: {
                    valid: false,
                    touched: false,
                    message: 'New Message is required'
                },
                formValid: false
            }
        };

        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.changeInput = this.changeInput.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    componentDidMount() {
        Utils.focusFirstInput();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.isFetching !== this.props.isFetching) {
            // Validate form after inputs are loaded
            Object.keys(this.props.ticket).forEach((key) => {
                this.validate(key, this.props.ticket[key]);
            });

            Utils.focusFirstInput();
        }
    }

    changeInput(evt) {
        const field = evt.target.name;
        const value = evt.target.value;
        const ticket = this.props.ticket;
        ticket[field] = value;

        this.setState({
            errors: []
        });
        this.validate(field, value);
    }

    validate(field, value) {
        const validation = this.state.validation;
        if (validation[field]) validation[field].touched = true;

        switch (field) {
            case 'name':
                validation.name.valid = value.length > 0;
                break;
            case 'newMessage':
                validation.newMessage.valid = value.length > 0;
                break;
        }

        validation.formValid = true;
        Object.keys(validation).forEach((key) => {
            if (typeof validation[key].valid === 'boolean' && !validation[key].valid) {
                validation.formValid = false;
            }
        });

        this.setState({ validation: validation }); // eslint-disable-line object-shorthand
    }

    cancel() {
        this.props.history.goBack();
    }

    render() {
        const validation = this.state.validation;
        return (
            <div>
                <div className="col-sm-4 col-md-4 col-lg-4">
                    <fieldset disabled={this.props.isFetching ? 'disabled' : ''}>
                        <form className="form-horizontal" action="/" onSubmit={this.props.submit}>
                            <div className="form-group">
                                <label className="col-sm-3 control-label" htmlFor="name">Name</label>
                                <div className="col-sm-9">
                                    <input type="text" className="form-control" readOnly={this.props.reply} id="name" name="name" value={this.props.ticket.name} placeholder="Ticket Name" onChange={this.changeInput} />
                                </div>
                            </div>
                            {this.props.ticket.messages.map((message, index) =>
                                <div key={index} className="form-group">

                                    <label className="col-sm-4 control-label" htmlFor="message">Message {index}</label>

                                    <div className="col-sm-8">
                                        <input type="text" className="form-control" id="messages" name="messages" readOnly={true} value={message} placeholder="Message" onChange={() => true} />
                                    </div>


                                </div>
                            )}
                            <div className="form-group">
                                <label className="col-sm-4 control-label" htmlFor="message">Message</label>

                                <div className="col-sm-8">
                                    <input type="text" className="form-control" id="newMessage" name="newMessage" value={this.props.ticket.newMessage} placeholder="New Message" onChange={this.changeInput} />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-sm-offset-3 col-sm-9">
                                    <button disabled={!validation.formValid} type="submit" className="btn btn-primary">Submit</button>
                                    <button type="button" className="btn btn-default m-l-sm" onClick={this.cancel}>Cancel</button>
                                </div>
                            </div>
                        </form>
                    </fieldset>
                </div>
                <div className="col-sm-4 col-md-4 col-lg-4">
                    <FormValidationErrors validation={validation} />
                    <FormSubmitErrors errors={this.props.errors} />
                </div>
            </div>
        );
    }
}
TicketEditForm.propTypes = {
    ticket: PropTypes.shape({
        name: PropTypes.string.isRequired,
        messages: PropTypes.array.isRequired,
        newMessage: PropTypes.string.isRequired
    }).isRequired,
    submit: PropTypes.func.isRequired,
    errors: PropTypes.arrayOf(PropTypes.string).isRequired,
    history: PropTypes.shape({
        goBack: PropTypes.func.isRequired
    }).isRequired,
    isFetching: PropTypes.bool.isRequired
};

export default TicketEditForm;

