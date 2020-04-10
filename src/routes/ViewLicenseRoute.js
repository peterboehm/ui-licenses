import React from 'react';
import PropTypes from 'prop-types';
import { get, flatten, uniqBy } from 'lodash';
import compose from 'compose-function';

import { CalloutContext, stripesConnect } from '@folio/stripes/core';
import { withTags } from '@folio/stripes/smart-components';
import { Tags } from '@folio/stripes-erm-components';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

import withFileHandlers from './components/withFileHandlers';
import View from '../components/License';
import { urls } from '../components/utils';
import { errorTypes } from '../constants';

class ViewLicenseRoute extends React.Component {
  static manifest = Object.freeze({
    interfaces: {
      type: 'okapi',
      path: 'organizations-storage/interfaces',
      params: (_q, _p, _r, _l, props) => {
        const orgs = get(props.resources, 'license.records[0].orgs', []);
        const interfaces = flatten(orgs.map(o => get(o, 'org.orgsUuid_object.interfaces', [])));
        const query = [
          ...new Set(interfaces.map(i => `id==${i}`))
        ].join(' or ');

        return query ? { query } : {};
      },
      fetch: props => !!props.stripes.hasInterface('organizations-storage.interfaces', '2.0'),
      permissionsRequired: 'storage.interfaces.collection.get',
      records: 'interfaces',
    },
    interfacesCredentials: {
      clientGeneratePk: false,
      throwErrors: false,
      path: 'organizations-storage/interfaces/%{interfaceRecord.id}/credentials',
      type: 'okapi',
      pk: 'FAKE_PK',  // it's done to fool stripes-connect not to add cred id to the path's end.
      permissionsRequired: 'organizations-storage.interfaces.credentials.item.get',
      fetch: props => !!props.stripes.hasInterface('organizations-storage.interfaces', '1.0 2.0'),
    },
    license: {
      type: 'okapi',
      path: 'licenses/licenses/:{id}',
      shouldRefresh: (resource, action) => {
        if (resource.name !== 'license') return true;
        return !action.meta.originatingActionType?.includes('DELETE');
      },
    },
    linkedAgreements: {
      type: 'okapi',
      path: 'licenses/licenses/:{id}/linkedAgreements',
      params: {
        sort: 'owner.startDate;desc'
      },
      limitParam: 'perPage',
      perRequest: 100,
      recordsRequired: '1000',
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
      params: (_q, _p, _r, _l, props) => {
        const query = get(props.resources, 'license.records[0].contacts', [])
          .filter(contact => contact.user)
          .map(contact => `id==${contact.user}`)
          .join(' or ');

        return query ? { query } : {};
      },
      fetch: props => !!props.stripes.hasInterface('users', '15.0'),
      permissionsRequired: 'users.collection.get',
      records: 'users',
    },
    interfaceRecord: {},
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
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired
    }).isRequired,
    mutator: PropTypes.shape({
      interfaceRecord: PropTypes.shape({
        replace: PropTypes.func,
      }),
      license: PropTypes.shape({
        DELETE: PropTypes.func.isRequired,
      }),
      query: PropTypes.shape({
        update: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      interfaces: PropTypes.object,
      linkedAgreements: PropTypes.object,
      license: PropTypes.object,
      query: PropTypes.shape({
        helper: PropTypes.string,
      }),
      terms: PropTypes.object,
      users: PropTypes.object,
    }).isRequired,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
      okapi: PropTypes.object.isRequired,
    }).isRequired,
    tagsEnabled: PropTypes.bool,
  };

  static defaultProps = {
    handlers: {},
  }

  static contextType = CalloutContext;

  getCompositeLicense = () => {
    const { resources } = this.props;
    const license = get(resources, 'license.records[0]', {
      contacts: [],
      orgs: [],
    });

    const contacts = license.contacts.map(c => ({
      ...c,
      user: this.getRecord(c.user, 'users') || c.user,
    }));

    const interfacesCredentials = uniqBy(get(resources, 'interfacesCredentials.records', []), 'id');

    const orgs = license.orgs.map(o => ({
      ...o,
      interfaces: get(o, 'org.orgsUuid_object.interfaces', [])
        .map(id => ({
          ...this.getRecord(id, 'interfaces') || {},
          credentials: interfacesCredentials.find(cred => cred.interfaceId === id)
        })),
    }));

    return {
      ...license,
      contacts,
      linkedAgreements: get(resources, 'linkedAgreements.records', []),
      orgs,
    };
  }

  getHelperApp = () => {
    const { match, resources } = this.props;
    const helper = resources.query.helper;
    if (!helper) return null;

    let HelperComponent = null;

    if (helper === 'tags') HelperComponent = Tags;

    if (!HelperComponent) return null;

    return (
      <HelperComponent
        link={`licenses/licenses/${match.params.id}`}
        onToggle={() => this.handleToggleHelper(helper)}
      />
    );
  }

  getRecord = (id, resourceType) => {
    return get(this.props.resources, `${resourceType}.records`, [])
      .find(i => i.id === id);
  }

  handleClone = (cloneableProperties) => {
    const { history, location, match, stripes: { okapi } } = this.props;

    return fetch(`${okapi.url}/licenses/licenses/${match.params.id}/clone`, {
      method: 'POST',
      headers: {
        'X-Okapi-Tenant': okapi.tenant,
        'X-Okapi-Token': okapi.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cloneableProperties),
    }).then(response => {
      if (response.ok) {
        return response.text(); // Parse it as text
      } else {
        throw new Error(errorTypes.JSON_ERROR);
      }
    }).then(text => {
      const data = JSON.parse(text); // Try to parse it as json
      if (data.id) {
        return Promise.resolve(history.push(`${urls.licensesEdit(data.id)}${location.search}`));
      } else {
        throw new Error(errorTypes.INVALID_JSON_ERROR); // when the json response body doesn't contain an id
      }
    }).catch(error => {
      throw error;
    });
  }

  handleClose = () => {
    this.props.history.push(`/licenses${this.props.location.search}`);
  }

  handleDelete = () => {
    const { sendCallout } = this.context;
    const { history, location, mutator } = this.props;
    const license = this.getCompositeLicense();

    if (license.linkedAgreements.length) {
      sendCallout({ type: 'error', timeout: 0, message: <SafeHTMLMessage id="ui-licenses.errors.noDeleteHasLinkedAgreements" /> });
      return;
    }

    mutator.license.DELETE(license)
      .then(() => {
        history.push(`${urls.licenses()}${location.search}`);
        sendCallout({ message: <SafeHTMLMessage id="ui-licenses.deletedLicense" values={{ name : license.name }} /> });
      })
      .catch(error => {
        sendCallout({ type: 'error', timeout: 0, message: <SafeHTMLMessage id="ui-licenses.errors.noDeleteLicenseBackendError" values={{ message: error.message }} /> });
      });
  }

  handleFetchCredentials = (id) => {
    const { mutator } = this.props;
    mutator.interfaceRecord.replace({ id });
  }

  handleToggleHelper = (helper) => {
    const { mutator, resources } = this.props;
    const currentHelper = resources.query.helper;
    const nextHelper = currentHelper !== helper ? helper : null;

    mutator.query.update({ helper: nextHelper });
  }

  handleToggleTags = () => {
    this.handleToggleHelper('tags');
  }

  viewAmendment = (id) => {
    this.props.history.push(this.urls.viewAmendment(id));
  }

  urls = {
    edit: this.props.stripes.hasPerm('ui-licenses.licenses.edit') && (() => `${this.props.location.pathname}/edit${this.props.location.search}`),
    addAmendment: this.props.stripes.hasPerm('ui-licenses.licenses.edit') && (() => `${this.props.location.pathname}/amendments/create${this.props.location.search}`),
    viewAmendment: amendmentId => `${this.props.location.pathname}/amendments/${amendmentId}${this.props.location.search}`,
  }

  render() {
    const { handlers, resources, tagsEnabled } = this.props;

    return (
      <View
        data={{
          license: this.getCompositeLicense(),
          terms: get(resources, 'terms.records', []),
        }}
        handlers={{
          ...handlers,
          onClone: this.handleClone,
          onClose: this.handleClose,
          onDelete: this.handleDelete,
          onFetchCredentials: this.handleFetchCredentials,
          onAmendmentClick: this.viewAmendment,
          onToggleHelper: this.handleToggleHelper,
          onToggleTags: tagsEnabled ? this.handleToggleTags : undefined,
        }}
        helperApp={this.getHelperApp()}
        isLoading={get(resources, 'license.isPending', true)}
        urls={this.urls}
      />
    );
  }
}

export default compose(
  withFileHandlers,
  stripesConnect,
  withTags,
)(ViewLicenseRoute);
