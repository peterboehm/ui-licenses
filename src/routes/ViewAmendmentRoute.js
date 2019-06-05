import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import View from '../components/Amendment';

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
    mutator: PropTypes.shape({
      license: PropTypes.shape({
        PUT: PropTypes.func.isRequired,
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

  getAmendment = () => {
    const { match, resources } = this.props;
    const amendments = get(resources, 'license.records[0].amendments', []);
    const selectedAmendmentId = get(match, 'params.amendmentId');
    const selectedAmendment = amendments.find(a => a.id === selectedAmendmentId) || {};

    return selectedAmendment;
  }

  handleClose = () => {
    const { location, match } = this.props;
    this.props.history.push(`/licenses/${match.params.id}${location.search}`);
  }

  handleDelete = () => {
    const license = get(this.props.resources, 'license.records[0]', {});
    const { match: { params } } = this.props;

    this.props.mutator.license
      .PUT({
        ...license,
        amendments: [{
          id: params.amendmentId,
          _delete: true,
        }],
      })
      .then(this.handleClose);
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
    editAmendment: this.props.stripes.hasPerm('ui-licenses.licenses.edit') && (() => `/licenses/${this.props.match.params.id}/amendments/${this.props.match.params.amendmentId}/edit${this.props.location.search}`),
  }

  render() {
    const { resources } = this.props;

    return (
      <View
        data={{
          amendment: this.getAmendment(),
          license: get(resources, 'license.records[0]', {}),
          terms: get(resources, 'terms.records', []),
        }}
        handlers={{
          onClose: this.handleClose,
          onDelete: this.props.stripes.hasPerm('ui-licenses.licenses.edit') && this.handleDelete,
          onDownloadFile: this.handleDownloadFile,
        }}
        isLoading={get(resources, 'license.isPending')}
        urls={this.urls}
      />
    );
  }
}

export default stripesConnect(ViewAmendmentsRoute);
