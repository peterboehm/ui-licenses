import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import compose from 'compose-function';

import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { CalloutContext, stripesConnect } from '@folio/stripes/core';

import withFileHandlers from './components/withFileHandlers';
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
    handlers: PropTypes.object,
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

  static defaultProps = {
    handlers: {},
  }

  static contextType = CalloutContext;

  getInitialValues = () => {
    const { resources } = this.props;

    const status = get(resources, 'statusValues.records', []).find(v => v.value === 'active') || {};

    const customProperties = {};
    get(resources, 'terms.records', [])
      .filter(term => term.primary)
      .forEach(term => { customProperties[term.name] = ''; });

    return {
      status: status.value,
      customProperties,
    };
  }

  handleClose = () => {
    const { location, match } = this.props;
    this.props.history.push(`/licenses/${match.params.id}${location.search}`);
  }

  handleSubmit = (amendment) => {
    const { location, match } = this.props;
    const license = get(this.props.resources, 'license.records[0]', {});
    const originalAmendmentIds = {};
    (license.amendments || []).forEach(a => { originalAmendmentIds[a.id] = 1; });
    const name = amendment?.name;

    return this.props.mutator.license
      .PUT({
        ...license,
        amendments: [amendment]
      })
      .then(updatedLicense => {
        let newAmendmentId;
        (updatedLicense.amendments || []).forEach(a => {
          if (originalAmendmentIds[a.id] === undefined) {
            newAmendmentId = a.id;
          }
        });
        this.context.sendCallout({ message: <SafeHTMLMessage id="ui-licenses.amendments.create.callout" values={{ name }} /> });
        this.props.history.push(`/licenses/${match.params.id}/amendments/${newAmendmentId}${location.search}`);
      });
  }

  fetchIsPending = () => {
    return Object.values(this.props.resources)
      .filter(r => r && r.resource !== 'licenses')
      .some(r => r.isPending);
  }

  render() {
    const { handlers, resources } = this.props;

    return (
      <Form
        data={{
          license: get(resources, 'license.records[0]', {}),
          documentCategories: get(resources, 'documentCategories.records', []),
          statusValues: get(resources, 'statusValues.records', []),
          terms: get(resources, 'terms.records', []),
        }}
        handlers={{
          ...handlers,
          onClose: this.handleClose,
        }}
        initialValues={this.getInitialValues()}
        isLoading={this.fetchIsPending()}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default compose(
  withFileHandlers,
  stripesConnect
)(CreateAmendmentRoute);
