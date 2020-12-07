import React from 'react';
import { FormattedMessage } from 'react-intl';
import { DuplicateModal } from '@folio/stripes-erm-components';

export default class DuplicateAmendmentModal extends React.Component {
  cloneableProperties = [
    { key: 'amendmentInfo', value: <FormattedMessage id="ui-licenses.duplicateAmendmentModal.amendmentInfo" /> },
    { key: 'amendmentDateInfo', value: <FormattedMessage id="ui-licenses.duplicateAmendmentModal.amendmentDateInfo" /> },
    { key: 'coreDocs', value : <FormattedMessage id="ui-licenses.duplicateAmendmentModal.coreDocs" /> },
    { key: 'terms', value: <FormattedMessage id="ui-licenses.duplicateAmendmentModal.terms" /> },
    { key: 'supplementaryDocs', value: <FormattedMessage id="ui-licenses.duplicateAmendmentModal.supplementaryDocs" /> },
  ];

  translationIds = {
    cloneEndpointError: 'ui-licenses.duplicateAmendmentModal.cloneEndpointError',
    duplicateModalLabel: 'ui-licenses.duplicateAmendmentModal.duplicateAmendment',
    duplicateModalMessage: 'ui-licenses.duplicateAmendmentModal.duplicateMessage',
    duplicateModalError: 'ui-licenses.duplicateAmendmentModal.duplicateModalError',
    invalidResponseError: 'ui-licenses.duplicateAmendmentModal.invalidResponseError',
  };

  render() {
    return (
      <DuplicateModal
        {...this.props}
        cloneableProperties={this.cloneableProperties}
        translationIds={this.translationIds}
      />
    );
  }
}
