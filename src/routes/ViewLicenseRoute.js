import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

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
    },
    terms: {
      type: 'okapi',
      path: 'licenses/custprops',
      shouldRefresh: () => false,
    },
    query: {},
  });

  static propTypes = {
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
    }).isRequired,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
  };

  handleClose = () => {
    this.props.history.push(`/licenses${this.props.location.search}`);
  }

  handleTogglerHelper = (helper) => {
    const { mutator, resources } = this.props;
    const currentHelper = resources.query.helper;
    const nextHelper = currentHelper !== helper ? helper : null;

    mutator.query.update({ helper: nextHelper });
  }

  render() {
    const { location, resources, stripes } = this.props;

    return (
      <View
        data={{
          license: {
            ...get(resources, 'license.records[0]', {}),
            linkedAgreements: get(resources, 'linkedAgreements.records', []),
          },
          terms: get(resources, 'terms.records', []),
        }}
        editUrl={stripes.hasPerm('ui-licenses.licenses.edit') && `${location.pathname}/edit${location.search}`}
        isLoading={get(resources, 'license.isPending')}
        onClose={this.handleClose}
        onToggleHelper={this.handleTogglerHelper}
      />
    );
  }
}

export default stripesConnect(ViewLicenseRoute);
