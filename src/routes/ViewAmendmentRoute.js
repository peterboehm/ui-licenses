import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import compose from 'compose-function';
import { FormattedMessage } from 'react-intl';

import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { CalloutContext, stripesConnect } from '@folio/stripes/core';
import { ConfirmationModal } from '@folio/stripes/components';

import withFileHandlers from './components/withFileHandlers';
import View from '../components/Amendment';

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
    handlers: PropTypes.object,
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

  static defaultProps = {
    handlers: {},
  }

  static contextType = CalloutContext;

  state = { showConfirmDelete: false };

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
    const name = license?.amendments.filter(obj => obj.id === params?.amendmentId)[0]?.name;

    this.props.mutator.license
      .PUT({
        ...license,
        amendments: [{
          id: params.amendmentId,
          _delete: true,
        }],
      })
      .then(() => {
        this.context.sendCallout({ message: <SafeHTMLMessage id="ui-licenses.amendments.delete.callout" values={{ name }} /> });
        this.handleClose();
      });
  }

  showDeleteConfirmationModal = () => this.setState({ showConfirmDelete: true });

  hideDeleteConfirmationModal = () => this.setState({ showConfirmDelete: false });

  fetchIsPending = () => {
    return Object.values(this.props.resources)
      .filter(r => r && r.resource !== 'licenses')
      .some(r => r.isPending);
  }

  urls = {
    editAmendment: this.props.stripes.hasPerm('ui-licenses.licenses.edit') && (() => `/licenses/${this.props.match.params.id}/amendments/${this.props.match.params.amendmentId}/edit${this.props.location.search}`),
  }

  render() {
    const { handlers, resources } = this.props;
    const amendment = this.getAmendment();
    const name = amendment?.name;
    return (
      <>
        <View
          data={{
            amendment,
            license: get(resources, 'license.records[0]', {}),
            terms: get(resources, 'terms.records', []),
          }}
          handlers={{
            ...handlers,
            onClose: this.handleClose,
            onDelete: this.props.stripes.hasPerm('ui-licenses.licenses.edit') && this.handleDelete && this.showDeleteConfirmationModal,
          }}
          isLoading={get(resources, 'license.isPending')}
          urls={this.urls}
        />
        {this.state.showConfirmDelete && (
          <ConfirmationModal
            buttonStyle="danger"
            confirmLabel={<FormattedMessage id="ui-licenses.amendments.delete.confirmLabel" />}
            heading={<FormattedMessage id="ui-licenses.amendments.delete.confirmHeading" />}
            id="delete-job-confirmation"
            message={<SafeHTMLMessage id="ui-licenses.amendments.delete.confirmMessage" values={{ name }} />}
            onCancel={this.hideDeleteConfirmationModal}
            onConfirm={this.handleDelete}
            open
          />
        )}
      </>
    );
  }
}

export default compose(
  withFileHandlers,
  stripesConnect
)(ViewAmendmentsRoute);
