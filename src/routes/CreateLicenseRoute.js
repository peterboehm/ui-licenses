import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import View from '../components/EditLicense';

class ViewLicenseRoute extends React.Component {
  static manifest = Object.freeze({
    licenses: {
      type: 'okapi',
      path: 'licenses/licenses',
      fetch: false,
    },
    terms: {
      type: 'okapi',
      path: 'licenses/custprops',
    },
    statusValues: {
      type: 'okapi',
      path: 'licenses/refdata/License/status',
    },
    typeValues: {
      type: 'okapi',
      path: 'licenses/refdata/License/type',
    },
    orgRoleValues: {
      type: 'okapi',
      path: 'licenses/refdata/LicenseOrg/role',
    },
  });

  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
    mutator: PropTypes.shape({
      licenses: PropTypes.shape({
        POST: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      license: PropTypes.object,
      orgRoleValues: PropTypes.object,
      statusValues: PropTypes.object,
      terms: PropTypes.object,
      typeValues: PropTypes.object,
    }).isRequired,
  };

  handleClose = () => {
    const { location } = this.props;
    this.props.history.push(`/licenses${location.search}`);
  }

  handleSubmit = (license) => {
    const { history, location, mutator } = this.props;

    mutator.licenses
      .POST(license)
      .then(({ id }) => {
        history.push(`/licenses/${id}${location.search}`);
      });
  }

  fetchIsPending = () => {
    return Object.values(this.props.resources).some(resource => resource.isPending);
  }

  render() {
    const { resources } = this.props;

    return (
      <View
        data={{
          license: get(resources, 'license.records[0]', {}),
          orgRoleValues: get(resources, 'orgRoleValues.records', []),
          statusValues: get(resources, 'orgRoleValues.records', []),
          terms: get(resources, 'terms.records', []),
          typeValues: get(resources, 'orgRoleValues.records', []),
        }}
        isLoading={this.fetchIsPending()}
        onClose={this.handleClose}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default stripesConnect(ViewLicenseRoute);
