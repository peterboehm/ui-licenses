import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import View from '../components/ViewAmendments';

import { handleDownloadFile } from './handlers/file';

class ViewAmendmentsRoute extends React.Component {
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
        amendmentId: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      license: PropTypes.object,
      terms: PropTypes.object,
    }).isRequired,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
      okapi: PropTypes.object.isRequired,
    }).isRequired,
  };

  handleClose = () => {
    const { location, match } = this.props;
    this.props.history.push(`/licenses/${match.params.id}${location.search}`);
  }

  handleDownloadFile = (file) => {
    handleDownloadFile(file, this.props.stripes.okapi);
  }

  fetchIsPending = () => {
    return Object.values(this.props.resources)
      .filter(r => r && r.resource !== 'licenses')
      .some(r => r.isPending);
  }

  urls = {
    createAmendment: () => `/licenses/${this.props.match.params.id}/amendments/create${this.props.location.search}`,
    editAmendment: () => `/licenses/${this.props.match.params.id}/amendments/${this.props.match.params.amendmentId}/edit${this.props.location.search}`,
    viewAmendment: amendmentId => `/licenses/${this.props.match.params.id}/amendments/${amendmentId}${this.props.location.search}`,
  }

  render() {
    const { match, resources } = this.props;

    return (
      <View
        data={{
          license: get(resources, 'license.records[0]', {}),
          terms: get(resources, 'terms.records', []),
        }}
        handlers={{
          onDownloadFile: this.handleDownloadFile,
        }}
        isLoading={get(resources, 'license.isPending')}
        onClose={this.handleClose}
        onSubmit={this.handleSubmit}
        selectedAmendmentId={match.params.amendmentId}
        urls={this.urls}
      />
    );
  }
}

export default stripesConnect(ViewAmendmentsRoute);
