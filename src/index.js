import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';
import { Route } from '@folio/stripes/core';

const LicensesRoute = lazy(() => import('./routes/LicensesRoute'));
const CreateLicenseRoute = lazy(() => import('./routes/CreateLicenseRoute'));
const EditLicenseRoute = lazy(() => import('./routes/EditLicenseRoute'));
const ViewLicenseRoute = lazy(() => import('./routes/ViewLicenseRoute'));

const ViewAmendmentRoute = lazy(() => import('./routes/ViewAmendmentRoute'));
const CreateAmendmentRoute = lazy(() => import('./routes/CreateAmendmentRoute'));
const EditAmendmentRoute = lazy(() => import('./routes/EditAmendmentRoute'));

const NoteCreateRoute = lazy(() => import('./routes/NoteCreateRoute'));
const NoteViewRoute = lazy(() => import('./routes/NoteViewRoute'));
const NoteEditRoute = lazy(() => import('./routes/NoteEditRoute'));

const Settings = lazy(() => import('./settings'));

class App extends React.Component {
  static propTypes = {
    actAs: PropTypes.string.isRequired,
    match: PropTypes.object.isRequired,
    stripes: PropTypes.object.isRequired,
  }

  render() {
    const { actAs, match: { path } } = this.props;

    if (actAs === 'settings') {
      return (
        <Suspense fallback={null}>
          <Settings {...this.props} />
        </Suspense>
      );
    }

    return (
      <Suspense fallback={null}>
        <Switch>
          <Route component={NoteCreateRoute} exact path={`${path}/notes/create`} />
          <Route component={NoteViewRoute} exact path={`${path}/notes/:noteId`} />
          <Route component={NoteEditRoute} exact path={`${path}/notes/:noteId/edit`} />
          <Route component={CreateLicenseRoute} path={`${path}/create`} />
          <Route component={EditLicenseRoute} path={`${path}/:id/edit`} />
          <Route component={CreateAmendmentRoute} path={`${path}/:id/amendments/create`} />
          <Route component={EditAmendmentRoute} path={`${path}/:id/amendments/:amendmentId/edit`} />
          <Route component={LicensesRoute} path={`${path}/:id?`}>
            <Suspense fallback={null}>
              <Switch>
                <Route component={ViewLicenseRoute} exact path={`${path}/:id`} />
                <Route component={ViewAmendmentRoute} exact path={`${path}/:id/amendments/:amendmentId`} />
              </Switch>
            </Suspense>
          </Route>
        </Switch>
      </Suspense>
    );
  }
}

export default App;
export { default as Licenses } from './components/Licenses';
