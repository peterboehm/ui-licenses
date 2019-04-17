import React from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import Form from '../components/LicenseForm';
import NoPermissions from '../components/NoPermissions';

class EditLicenseRoute extends React.Component {
  static manifest = Object.freeze({
    license: {
      type: 'okapi',
      path: 'licenses/licenses/:{id}',
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
    const license = get(resources, 'license.records[0]', {});
    const initialValues = cloneDeep(license);
    const {
      orgs = [],
      status = {},
      supplementaryDocs = [],
      type = {},
    } = initialValues;

    // Set the values of dropdown-controlled props as values rather than objects.
    initialValues.status = status.value;
    initialValues.type = type.value;
    initialValues.orgs = orgs.map(o => ({ ...o, role: o.role.value }));
    initialValues.supplementaryDocs = supplementaryDocs.map(o => ({ ...o, atType: get(o, 'atType.value') }));

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

    if (!this.state.hasPerms) return <NoPermissions />;

    return (
      <Form
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

export default stripesConnect(EditLicenseRoute);
