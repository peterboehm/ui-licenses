import React from 'react';
import { FormattedMessage } from 'react-intl';
import { DuplicateModal } from '@folio/stripes-erm-components';

export default class DuplicateLicenseModal extends React.Component {
  cloneableProperties = [
    { key: 'licenseInfo', value: <FormattedMessage id="ui-licenses.duplicateLicenseModal.licenseInfo" /> },
    { key: 'licenseDateInfo', value: <FormattedMessage id="ui-licenses.duplicateLicenseModal.licenseDateInfo" /> },
    { key: 'internalContacts', value: <FormattedMessage id="ui-licenses.duplicateLicenseModal.internalContacts" /> },
    { key: 'organizations', value: <FormattedMessage id="ui-licenses.duplicateLicenseModal.organizations" /> },
    { key: 'coreDocs', value : <FormattedMessage id="ui-licenses.duplicateLicenseModal.coreDocs" /> },
    { key: 'terms', value: <FormattedMessage id="ui-licenses.duplicateLicenseModal.terms" /> },
    { key: 'supplementaryDocs', value: <FormattedMessage id="ui-licenses.duplicateLicenseModal.supplementaryDocs" /> },
  ];

  translationIds = {
    cloneEndpointError: 'ui-licenses.duplicateLicenseModal.cloneEndpointError',
    duplicateModalLabel: 'ui-licenses.duplicateLicenseModal.duplicateLicense',
    duplicateModalMessage: 'ui-licenses.duplicateLicenseModal.duplicateMessage',
    duplicateModalError: 'ui-licenses.duplicateLicenseModal.duplicateModalError',
    invalidResponseError: 'ui-licenses.duplicateLicenseModal.invalidResponseError',
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
