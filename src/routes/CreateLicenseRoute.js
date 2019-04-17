import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import View from '../components/LicenseForm';
import NoPermissions from '../components/NoPermissions';

class CreateLicenseRoute extends React.Component {
  static manifest = Object.freeze({
    licenses: {
      type: 'okapi',
      path: 'licenses/licenses',
      fetch: false,
    },
    terms: {
      type: 'okapi',
      path: 'licenses/custprops',
      shouldRefresh: () => false,
    },
    statusValues: {
      type: 'okapi',
      path: 'licenses/refdata/License/status',
      shouldRefresh: () => false,
    },
    typeValues: {
      type: 'okapi',
      path: 'licenses/refdata/License/type',
      shouldRefresh: () => false,
    },
    orgRoleValues: {
      type: 'okapi',
      path: 'licenses/refdata/LicenseOrg/role',
      shouldRefresh: () => false,
    },
    documentCategories: {
      type: 'okapi',
      path: 'licenses/refdata/DocumentAttachment/atType',
      shouldRefresh: () => false,
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
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      hasPerms: props.stripes.hasPerm('ui-licenses.licenses.edit'),
    };
  }

  getInitialValues = () => {
    const { resources } = this.props;

    const status = get(resources, 'statusValues.records', []).find(v => v.value === 'active') || {};
    const type = get(resources, 'typeValues.records', []).find(v => v.value === 'local') || {};

    const customProperties = {};
    get(resources, 'terms.records', [])
      .filter(term => term.primary)
      .forEach(term => { customProperties[term.name] = ''; });

    return {
      status: status.value,
      type: type.value,
      customProperties,
    };
  }

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
    return Object.values(this.props.resources)
      .filter(resource => resource)
      .some(resource => resource.isPending);
  }

  render() {
    const { resources } = this.props;

    if (!this.state.hasPerms) return <NoPermissions />;

    return (
      <View
        data={{
          documentCategories: get(resources, 'documentCategories.records', []),
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

export default stripesConnect(CreateLicenseRoute);
