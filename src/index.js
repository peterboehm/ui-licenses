import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import Link from 'react-router-dom/Link';

import { Route } from '@folio/stripes/core';

import LicensesRoute from './routes/LicensesRoute';
import Settings from './settings';

const Licenses = (props) => (
  <div style={{ display: 'flex' }}>
    <div style={{ margin: '1em' }}>Licenses</div>
    <div style={{ margin: '1em' }}>{props.children}</div>
  </div>
);

const CreateLicense = (props) => <div style={{ margin: '1em' }}>Create License</div>;
const ViewLicense = (props) => <div style={{ margin: '1em' }}>View License</div>;
const EditLicense = (props) => <div style={{ margin: '1em' }}>Edit License</div>;
const ViewLicenseAmendments = (props) => <div style={{ margin: '1em' }}>View License Amendments</div>;

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

    const { match: { path } } = this.props;

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
          <Route
            component={CreateLicense}
            exact
            path={`${path}/create`}
          />
          <Route
            component={EditLicense}
            exact
            path={`${path}/:id/edit`}
          />
          <Route
            component={ViewLicenseAmendments}
            exact
            path={`${path}/:id/amendments`}
          />
          <Route
            component={LicensesRoute}
            path={path}
          >
            <Route
              component={ViewLicense}
              exact
              path={`${path}/:id`}
            />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default App;
export { Licenses };
