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
    resources: PropTypes.shape({
      license: PropTypes.object,
      terms: PropTypes.object,
    }).isRequired,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
      okapi: PropTypes.object.isRequired,
    }).isRequired,
  };

  state = {
    selectedAmendment: {}
  }

  static getDerivedStateFromProps(props, state) {
    const { match, resources } = props;
    const amendments = get(resources, 'license.records[0].amendments', []);
    const selectedAmendmentId = get(match, 'params.amendmentId');
    const selectedAmendment = amendments.find(a => a.id === selectedAmendmentId);
    if (selectedAmendment && selectedAmendment.id !== state.selectedAmendment.id) {
      return { selectedAmendment };
    }

    return null;
  }

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
    viewLicense: () => `/licenses/${this.props.match.params.id}${this.props.location.search}`,
    editAmendment: () => `/licenses/${this.props.match.params.id}/amendments/${this.props.match.params.amendmentId}/edit${this.props.location.search}`,
  }

  render() {
    const { resources } = this.props;
    const { selectedAmendment } = this.state;

    return (
      <View
        data={{
          amendment: selectedAmendment,
          license: get(resources, 'license.records[0]', {}),
          terms: get(resources, 'terms.records', []),
        }}
        handlers={{
          onClose: this.handleClose,
          onDownloadFile: this.handleDownloadFile,
        }}
        isLoading={get(resources, 'license.isPending')}
        urls={this.urls}
      />
    );
  }
}

export default stripesConnect(ViewAmendmentsRoute);
