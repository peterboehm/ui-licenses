import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';

import Licenses from './routes/Licenses';

export default class LicensesModule extends React.Component {

  static manifest = Object.freeze({
    query: {},
    resultCount: {},
  });

  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }),
    match: PropTypes.shape({
      path: PropTypes.string,
    }),
    mutator: PropTypes.object,
    resources: PropTypes.object,
    stripes: PropTypes.shape({
      connect: PropTypes.func,
    }),
  };

  constructor(props) {
    super(props);

    this.connectedLicenses = props.stripes.connect(Licenses);
  }

  getCurrentPage(props) {
    const { match, location } = props;
    const lStripped = location.pathname.substring(match.path.length + 1);
    const rStripped = lStripped.split('/')[0];

    return rStripped;
  }

  render() {
    const { stripes, match } = this.props;
    const currentPage = this.getCurrentPage(this.props);

    return (
      <React.Fragment>
        <Switch>
          <Route
            path={`${match.path}/licenses`}
            render={() => <this.connectedLicenses stripes={stripes} />}
          />
          <Redirect
            exact
            from={`${match.path}`}
            to={`${match.path}/licenses`}
          />
        </Switch>
      </React.Fragment>
    );
  }
}
