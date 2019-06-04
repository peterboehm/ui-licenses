import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import {
  handleDeleteFile,
  handleDownloadFile,
  handleUploadFile,
} from './handlers/file';

import Form from '../components/AmendmentForm';

class CreateAmendmentRoute extends React.Component {
  static manifest = Object.freeze({
    license: {
      type: 'okapi',
      path: 'licenses/licenses/:{id}',
      shouldRefresh: () => false,
    },
    documentCategories: {
      type: 'okapi',
      path: 'licenses/refdata/DocumentAttachment/atType',
      shouldRefresh: () => false,
    },
    statusValues: {
      type: 'okapi',
      path: 'licenses/refdata/License/status',
      shouldRefresh: () => false,
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
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    mutator: PropTypes.shape({
      license: PropTypes.shape({
        PUT: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      documentCategories: PropTypes.object,
      license: PropTypes.object,
      statusValues: PropTypes.object,
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

  handleSubmit = (amendment) => {
    const license = get(this.props.resources, 'license.records[0]', {});

    this.props.mutator.license
      .PUT({
        ...license,
        amendments: [amendment]
      })
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
      .filter(r => r && r.resource !== 'licenses')
      .some(r => r.isPending);
  }

  render() {
    const { resources } = this.props;

    return (
      <Form
        data={{
          license: get(resources, 'license.records[0]', {}),
          documentCategories: get(resources, 'documentCategories.records', []),
          statusValues: get(resources, 'statusValues.records', []),
          terms: get(resources, 'terms.records', []),
        }}
        handlers={{
          onDeleteFile: this.handleDeleteFile,
          onDownloadFile: this.handleDownloadFile,
          onUploadFile: this.handleUploadFile,
        }}
        isLoading={get(resources, 'license.isPending')}
        onClose={this.handleClose}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default stripesConnect(CreateAmendmentRoute);
