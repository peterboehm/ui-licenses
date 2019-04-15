import React from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import Form from '../components/LicenseForm';

class EditLicenseRoute extends React.Component {
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

  getInitialValues = () => {
    const { resources } = this.props;
    const license = get(resources, 'license.records[0]', {});
    const initialValues = cloneDeep(license);
    const {
      orgs = [],
      status = {},
      type = {},
    } = initialValues;

    // Set the values of dropdown-controlled props as values rather than objects.
    initialValues.orgs = orgs.map(o => ({ ...o, role: o.role.value }));
    initialValues.status = status.value;
    initialValues.type = type.value;

    // Add the default terms to the already-set terms.
    initialValues.customProperties = initialValues.customProperties || {};
    const terms = get(resources, 'terms.records', []);
    terms
      .filter(t => t.primary)
      .forEach(t => { initialValues.customProperties[t.name] = ''; });

    return initialValues;
  }


  handleClose = () => {
    const { location, match } = this.props;
    this.props.history.push(`/licenses/${match.params.id}${location.search}`);
  }

  handleSubmit = (license) => {
    this.props.mutator.license
      .PUT(license)
      .then(this.handleClose);
  }

  fetchIsPending = () => {
    return Object.values(this.props.resources)
      .filter(resource => resource)
      .some(resource => resource.isPending);
  }

  render() {
    const { resources } = this.props;

    return (
      <Form
        data={{
          orgRoleValues: get(resources, 'orgRoleValues.records', []),
          statusValues: get(resources, 'statusValues.records', []),
          terms: get(resources, 'terms.records', []),
          typeValues: get(resources, 'typeValues.records', []),
        }}
        initialValues={this.getInitialValues()}
        isLoading={this.fetchIsPending()}
        onClose={this.handleClose}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default stripesConnect(EditLicenseRoute);
