import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import Licenses from './Licenses';
import Settings from './settings';

const NoMatch = () => (
  <div>
    <h2>{this.props.stripes.intl.formatMessage({ id: 'ui-licenses.errors.noMatch.oops' })}</h2>
    <p>{this.props.stripes.intl.formatMessage({ id: 'ui-licenses.errors.noMatch.how' }, { location: <tt>{this.props.location.pathname}</tt> })}</p>
  </div>
);

class App extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool,
    stripes: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.connectedLicenses = props.stripes.connect(Licenses)
  }

  render() {
    if (this.props.showSettings) {
      return <Settings {...this.props} />;
    }

    return (
      <Switch>
        <Route
          path={`${this.props.match.path}`}
          render={() => <this.connectedLicenses {...this.props} />}
        />
        <Route component={NoMatch} />
      </Switch>
    );
  }
}

export default App;
