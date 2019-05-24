import React from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, difference, get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import Form from '../components/LicenseForm';
import NoPermissions from '../components/NoPermissions';

import {
  handleDeleteFile,
  handleDownloadFile,
  handleUploadFile,
} from './handlers/file';

class EditLicenseRoute extends React.Component {
  static manifest = Object.freeze({
    license: {
      type: 'okapi',
      path: 'licenses/licenses/:{id}',
      shouldRefresh: () => false,
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
    contactRoleValues: {
      type: 'okapi',
      path: 'licenses/refdata/InternalContact/role',
      shouldRefresh: () => false,
    },
    users: {
      type: 'okapi',
      path: '/users',
      fetch: false,
      accumulate: true,
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
      okapi: PropTypes.object.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      hasPerms: props.stripes.hasPerm('ui-licenses.licenses.edit'),
    };
  }

  componentDidMount() {
    const contacts = get(this.props.resources, 'license.records[0].contacts', []);
    if (contacts.length) {
      this.fetchUsers(contacts);
    }
  }

  componentDidUpdate(prevProps) {
    const prevLicense = get(prevProps.resources, 'license.records[0]', {});
    const currLicense = get(this.props.resources, 'license.records[0]', {});
    const prevContacts = prevLicense.contacts || [];
    const currContacts = currLicense.contacts || [];
    const newContacts = difference(currContacts, prevContacts);
    if (prevLicense.id !== currLicense.id || newContacts.length) {
      this.fetchUsers(newContacts);
    }
  }

  fetchUsers = (newContacts) => {
    const { mutator } = this.props;
    newContacts.forEach(contact => mutator.users.GET({ path: `users/${contact.user}` }));
  }

  getInitialValues = () => {
    const { resources } = this.props;
    const license = get(resources, 'license.records[0]', {});
    const initialValues = cloneDeep(license);
    const {
      contacts = [],
      orgs = [],
      status = {},
      supplementaryDocs = [],
      type = {},
    } = initialValues;

    // Set the values of dropdown-controlled props as values rather than objects.
    initialValues.status = status.value;
    initialValues.type = type.value;
    initialValues.contacts = contacts.map(c => ({ ...c, role: c.role.value }));
    initialValues.orgs = orgs.map(o => ({ ...o, role: o.role ? o.role.value : undefined }));
    initialValues.supplementaryDocs = supplementaryDocs.map(o => ({ ...o, atType: get(o, 'atType.value') }));

    // Add the default terms to the already-set terms.
    initialValues.customProperties = initialValues.customProperties || {};
    const terms = get(resources, 'terms.records', []);
    terms
      .filter(t => t.primary && initialValues.customProperties[t.name] === undefined)
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

  handleDeleteFile = (file) => {
    return handleDeleteFile(file, this.props.stripes.okapi);
  }

  handleDownloadFile = (file) => {
    handleDownloadFile(file, this.props.stripes.okapi);
  }

  handleUploadFile = (file) => {
    return handleUploadFile(file, this.props.stripes.okapi);
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
          contactRoleValues: get(resources, 'contactRoleValues.records', []),
          documentCategories: get(resources, 'documentCategories.records', []),
          orgRoleValues: get(resources, 'orgRoleValues.records', []),
          statusValues: get(resources, 'statusValues.records', []),
          terms: get(resources, 'terms.records', []),
          typeValues: get(resources, 'typeValues.records', []),
          users: get(resources, 'users.records', []),
        }}
        handlers={{
          onDeleteFile: this.handleDeleteFile,
          onDownloadFile: this.handleDownloadFile,
          onUploadFile: this.handleUploadFile,
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
