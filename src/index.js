import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import { Route } from '@folio/stripes/core';

import LicensesRoute from './routes/LicensesRoute';
import CreateLicenseRoute from './routes/CreateLicenseRoute';
import EditLicenseRoute from './routes/EditLicenseRoute';
import ViewLicenseRoute from './routes/ViewLicenseRoute';

import ViewAmendmentRoute from './routes/ViewAmendmentRoute';
import CreateAmendmentRoute from './routes/CreateAmendmentRoute';
import EditAmendmentRoute from './routes/EditAmendmentRoute';

import NoteCreateRoute from './routes/NoteCreateRoute';
import NoteViewRoute from './routes/NoteViewRoute';
import NoteEditRoute from './routes/NoteEditRoute';

import Settings from './settings';

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
      <Switch>
        <Route path={`${path}/notes/create`} exact component={NoteCreateRoute} />
        <Route path={`${path}/notes/:noteId`} exact component={NoteViewRoute} />
        <Route path={`${path}/notes/:noteId/edit`} exact component={NoteEditRoute} />
        <Route path={`${path}/create`} component={CreateLicenseRoute} />
        <Route path={`${path}/:id/edit`} component={EditLicenseRoute} />
        <Route path={`${path}/:id/amendments/create`} component={CreateAmendmentRoute} />
        <Route path={`${path}/:id/amendments/:amendmentId/edit`} component={EditAmendmentRoute} />
        <Route path={path} component={LicensesRoute}>
          <Switch>
            <Route path={`${path}/:id`} exact component={ViewLicenseRoute} />
            <Route path={`${path}/:id/amendments/:amendmentId`} exact component={ViewAmendmentRoute} />
          </Switch>
        </Route>
      </Switch>
    );
  }
}

export default App;
export { default as Licenses } from './components/Licenses';
