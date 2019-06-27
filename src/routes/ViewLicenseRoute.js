import React from 'react';
import PropTypes from 'prop-types';
import { get, difference } from 'lodash';
import compose from 'compose-function';

import { stripesConnect } from '@folio/stripes/core';

import withFileHandlers from './components/withFileHandlers';
import View from '../components/License';

class ViewLicenseRoute extends React.Component {
  static manifest = Object.freeze({
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
    }).isRequired,
    resources: PropTypes.shape({
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

  getLicenseContacts = () => {
    const { resources } = this.props;
    const contacts = get(resources, 'license.records[0].contacts', []);
    return contacts.map(contact => ({
      ...contact,
      user: get(resources, 'users.records', []).find(u => u.id === contact.user) || { personal: {} },
    }));
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
