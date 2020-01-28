import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
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
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool,
    stripes: PropTypes.object.isRequired,
  }

  render() {
    if (this.props.showSettings) {
      return (
        <Suspense fallback={null}>
          <Settings {...this.props} />
        </Suspense>
      );
    }

    const { match: { path } } = this.props;

    return (
      <Suspense fallback={null}>
        <Switch>
          <Route path={`${path}/notes/create`} exact component={NoteCreateRoute} />
          <Route path={`${path}/notes/:noteId`} exact component={NoteViewRoute} />
          <Route path={`${path}/notes/:noteId/edit`} exact component={NoteEditRoute} />
          <Route path={`${path}/create`} component={CreateLicenseRoute} />
          <Route path={`${path}/:id/edit`} component={EditLicenseRoute} />
          <Route path={`${path}/:id/amendments/create`} component={CreateAmendmentRoute} />
          <Route path={`${path}/:id/amendments/:amendmentId/edit`} component={EditAmendmentRoute} />
          <Route path={`${path}/:id?`} component={LicensesRoute}>
            <Suspense fallback={null}>
              <Switch>
                <Route path={`${path}/:id`} exact component={ViewLicenseRoute} />
                <Route path={`${path}/:id/amendments/:amendmentId`} exact component={ViewAmendmentRoute} />
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
