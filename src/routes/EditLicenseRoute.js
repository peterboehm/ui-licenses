import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import View from '../components/EditLicense';

class ViewLicenseRoute extends React.Component {
  static manifest = Object.freeze({
    license: {
      type: 'okapi',
      path: 'licenses/licenses/:{id}',
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
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    mutator: PropTypes.shape({
      license: PropTypes.shape({
        PUT: PropTypes.func.isRequired,
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
    const { location, match } = this.props;
    this.props.history.push(`/licenses/${match.params.id}${location.search}`);
  }

  handleSubmit = (license) => {
    this.props.mutator.license.PUT(license);
  }

  fetchIsPending = () => {
    return Object.values(this.props.resources).some(resource => resource.isPending);
  }

  render() {
    const { location, resources } = this.props;

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
