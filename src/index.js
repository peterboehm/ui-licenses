import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import Link from 'react-router-dom/Link';

import { Route } from '@folio/stripes/core';

import LicensesRoute from './routes/LicensesRoute';
import ViewLicenseRoute from './routes/ViewLicenseRoute';

import Settings from './settings';

const CreateLicenseRoute = (props) => <div style={{ margin: '1em' }}>Create License</div>;
const EditLicenseRoute = (props) => <div style={{ margin: '1em' }}>Edit License</div>;
const ViewLicenseAmendmentsRoute = (props) => <div style={{ margin: '1em' }}>View License Amendments</div>;

class App extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool,
    stripes: PropTypes.object.isRequired,
  }

  render() {
    if (this.props.showSettings) {
      return <Settings {...this.props} />;
    }

    const { match: { path }, stripes } = this.props;

    return (
      <div>
        <div>
          <span style={{ margin: '1em' }}><Link to="/licenses">/licenses</Link></span>
          <span style={{ margin: '1em' }}><Link to="/licenses/create">/licenses/create</Link></span>
          <span style={{ margin: '1em' }}><Link to="/licenses/123">/licenses/123</Link></span>
          <span style={{ margin: '1em' }}><Link to="/licenses/123/edit">/licenses/123/edit</Link></span>
          <span style={{ margin: '1em' }}><Link to="/licenses/123/amendments">/licenses/123/amendments</Link></span>
        </div>
        <Switch>
          <Route path={path} component={LicensesRoute}>
            <Route path={`${path}/create`} exact component={CreateLicenseRoute} />
            <Route path={`${path}/:id`} exact component={ViewLicenseRoute} />
            <Route path={`${path}/:id/edit`} exact component={EditLicenseRoute} />
            <Route path={`${path}/:id/amendments`} exact component={ViewLicenseAmendmentsRoute} />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default App;
export { LicensesRoute as Licenses };
