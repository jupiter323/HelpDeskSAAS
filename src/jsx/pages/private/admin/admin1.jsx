import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import MessageService from '../../../services/message-service';

import CompanyService from '../../../services/company-service';

import PictureUpload from '../../../components/picture-upload.jsx';
const currentCSS = require('../../../../client-branding/company123/site-branding.scss');
class Admin1 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logourl: '',
      company: {},
      message: '',
      error: '',
      currentCSS,
      editCSS: JSON.stringify(currentCSS)
    };

    this.componentWillMount = this.componentWillMount.bind(this);
    this.handleImageUrl = this.handleImageUrl.bind(this);
    this.handleCSS = this.handleCSS.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    const { company } = this.props;
    CompanyService.getCompanyBySubdomain(company.subdomain, (err, data) => {
      if (err) {
        this.setState({ message: '', error: err });
      } else {
        this.setState({
          currentCSS: data.data.css,
          editCSS: data.data.css,
          company:
            { id: data.data.id, name: data.data.name, subdomain: data.data.subdomain, css: data.data.css, logo: data.data.logo }
        });
      }
    });
  }
  handleImageUrl(file) {
    // upload endpoint
    const { company } = this.state;
    const data = new FormData();
    data.append('file', file, file.fileName);
    CompanyService.uploadLogo(data, (err, data) => {
      if (err) {
        this.setState({ message: '', error: err });
      } else {
        company.log = data.data;
        this.setState({ message: 'success upload!', error: '', logourl: data.data });
      }

    });

  }

  isCSS(cssString) {
    try {
      JSON.parse(cssString);
      return true;
    } catch (err) {
      return false;
    }

  }
  handleCSS(e) {

    this.setState({ editCSS: e.target.value });
  }
  handleSubmit() {
    const { editCSS, company, logourl } = this.state;
    if (this.isCSS(editCSS)) { this.setState({ currentCSS: JSON.parse(editCSS) }); } else return this.setState({ error: 'please correct input your css' });
    if (!logourl) { return this.setState({ error: 'please upload your new logo' }); }
    company.css = editCSS;
    company.logo = logourl;
    this.setState(company);

    CompanyService.updateCompanyCustom(company, (err, data) => {
      if (err) { this.setState({ message: '', error: err }); } else if (data && data.success) { this.setState({ message: 'Changed your style and logo' }); }
    });
  }

  render() {
    const { editCSS, company } = this.state;
    const embedCode = `<script type="text/javascript" src="/js/main.js"></script><iframe src="http://${this.props.company.subdomain}.mernsaas.com:3000/companyuser/tickets"></iframe>`;
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
            <h3>Admin Page 1</h3>

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
              <PictureUpload receiveUrl={this.handleImageUrl} image={company.logo} />
              <textarea value={editCSS} onChange={this.handleCSS} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-10 col-lg-6">
            <button onClick={this.handleSubmit}>Submit</button>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 col-12">
            <label className="control-label" htmlFor="name">Embed Code</label>
          </div>
          <div className="col-sm-12 col-md-9 col-lg-9">
            <pre>
              {embedCode}
            </pre>

          </div>
        </div>
      </div>
    );
  }
}

export default Admin1;
