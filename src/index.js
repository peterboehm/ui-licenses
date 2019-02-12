import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import Licenses from './routes/Licenses';
import Settings from './settings';

class App extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool,
    stripes: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.connectedLicenses = props.stripes.connect(Licenses);
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
      </Switch>
    );
  }
}

export default App;
