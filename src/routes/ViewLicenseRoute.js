import React from 'react';
import PropTypes from 'prop-types';
import { get, difference, flatten } from 'lodash';
import compose from 'compose-function';

import { stripesConnect } from '@folio/stripes/core';

import withFileHandlers from './components/withFileHandlers';
import View from '../components/License';

class ViewLicenseRoute extends React.Component {
  static manifest = Object.freeze({
    interfaces: {
      type: 'okapi',
      path: 'organizations-storage/interfaces',
      records: 'interfaces',
      accumulate: true,
      fetch: false,
    },
    license: {
      type: 'okapi',
      path: 'licenses/licenses/:{id}',
    },
    linkedAgreements: {
      type: 'okapi',
      path: 'licenses/licenses/:{id}/linkedAgreements',
      params: {
        sort: 'owner.startDate;desc'
      },
      throwErrors: false,
    },
    terms: {
      type: 'okapi',
      path: 'licenses/custprops',
      shouldRefresh: () => false,
    },
    users: {
      type: 'okapi',
      path: 'users',
      fetch: false,
      accumulate: true,
      shouldRefresh: () => false,
    },
    query: {},
  });

  static propTypes = {
    handlers: PropTypes.object,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string.isRequired,
    }).isRequired,
    mutator: PropTypes.shape({
      query: PropTypes.shape({
        update: PropTypes.func.isRequired,
      }).isRequired,
      interfaces: PropTypes.shape({
        GET: PropTypes.func.isRequired,
      }),
    }).isRequired,
    resources: PropTypes.shape({
      interfaces: PropTypes.object,
      linkedAgreements: PropTypes.object,
      license: PropTypes.object,
      terms: PropTypes.object,
      users: PropTypes.object,
    }).isRequired,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
      okapi: PropTypes.object.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    handlers: {},
  }

  componentDidMount() {
    this.fetchInterfaces();
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

    const prevOrgs = get(prevProps.resources, 'license.records[0].orgs', []);
    const currOrgs = get(this.props.resources, 'license.records[0].orgs', []);
    const newOrgs = difference(currOrgs, prevOrgs);
    if (newOrgs.length) {
      this.fetchInterfaces(newOrgs);
    }
  }

  fetchInterfaces = (newOrgs) => {
    const orgs = newOrgs || get(this.props.resources, 'license.records[0].orgs', []);
    const interfaces = flatten(orgs.map(o => get(o, 'org.orgsUuid_object.interfaces', [])));
    const query = [
      ...new Set(interfaces.map(i => `id==${i}`))
    ].join(' or ');

    if (!query) return;
    this.props.mutator.interfaces.GET({ params: { query } });
  }

  fetchUsers = (newContacts) => {
    const { mutator } = this.props;
    newContacts.forEach(contact => mutator.users.GET({ path: `users/${contact.user}` }));
  }

  getOrgs = () => {
    const { resources } = this.props;
    const orgs = get(resources, 'license.records[0].orgs', []);

    return orgs.map(o => ({
      ...o,
      interfaces: get(o, 'org.orgsUuid_object.interfaces', [])
        .map(id => this.getRecord(id, 'interfaces') || id)
    }));
  }

  getLicenseContacts = () => {
    const { resources } = this.props;
    const contacts = get(resources, 'license.records[0].contacts', []);
    return contacts.map(contact => ({
      ...contact,
      user: get(resources, 'users.records', []).find(u => u.id === contact.user) || { personal: {} },
    }));
  }

  getRecord = (id, resourceType) => {
    return get(this.props.resources, `${resourceType}.records`, [])
      .find(i => i.id === id);
  }

  handleClose = () => {
    this.props.history.push(`/licenses${this.props.location.search}`);
  }

  handleTogglerHelper = (helper) => {
    const { mutator, resources } = this.props;
    const currentHelper = resources.query.helper;
    const nextHelper = currentHelper !== helper ? helper : null;

    mutator.query.update({ helper: nextHelper });
  }

  urls = {
    edit: this.props.stripes.hasPerm('ui-licenses.licenses.edit') && (() => `${this.props.location.pathname}/edit${this.props.location.search}`),
    addAmendment: this.props.stripes.hasPerm('ui-licenses.licenses.edit') && (() => `${this.props.location.pathname}/amendments/create${this.props.location.search}`),
    viewAmendment: amendmentId => `${this.props.location.pathname}/amendments/${amendmentId}${this.props.location.search}`,
  }

  render() {
    const { handlers, resources } = this.props;

    return (
      <View
        data={{
          license: {
            ...get(resources, 'license.records[0]', {}),
            contacts: this.getLicenseContacts(),
            linkedAgreements: get(resources, 'linkedAgreements.records', []),
            orgs: this.getOrgs(),
          },
          terms: get(resources, 'terms.records', []),
        }}
        handlers={{
          ...handlers,
          onClose: this.handleClose,
          onToggleHelper: this.handleTogglerHelper,
        }}
        isLoading={get(resources, 'license.isPending', true)}
        urls={this.urls}
      />
    );
  }
}

export default compose(
  withFileHandlers,
  stripesConnect
)(ViewLicenseRoute);
