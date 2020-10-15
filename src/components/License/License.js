import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { NotesSmartAccordion } from '@folio/stripes/smart-components';

import {
  AccordionSet,
  AccordionStatus,
  Button,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  Icon,
  IconButton,
  LoadingPane,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';
import { AppIcon, IfPermission, TitleManager } from '@folio/stripes/core';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import DuplicateLicenseModal from '../DuplicateLicenseModal';

import {
  LicenseAgreements,
  LicenseAmendments,
  LicenseHeader,
  LicenseInfo,
  LicenseInternalContacts,
  LicenseOrganizations,
  CoreDocs,
  SupplementaryDocs,
  Terms,
} from '../viewSections';

class License extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      license: PropTypes.object,
      terms: PropTypes.arrayOf(PropTypes.object),
      users: PropTypes.arrayOf(PropTypes.object),
    }),
    handlers: PropTypes.shape({
      onClone: PropTypes.func.isRequired,
      onClose: PropTypes.func.isRequired,
      onDelete: PropTypes.func.isRequired,
      onToggleTags: PropTypes.func,
    }).isRequired,
    helperApp: PropTypes.node,
    isLoading: PropTypes.bool,
    urls: PropTypes.shape({
      edit: PropTypes.func,
    }).isRequired,
    stripes: PropTypes.object,
  };

  state = {
    showDeleteConfirmationModal: false,
    showDuplicateLicenseModal: false,
  }

  getSectionProps = (id) => {
    const { data, handlers, urls } = this.props;

    return {
      id,
      handlers,
      urls,
      license: data.license,
      record: data.license,
      recordType: 'license',
      terms: data.terms,
      users: data.users,
    };
  }

  openDeleteConfirmationModal = () => {
    this.setState({ showDeleteConfirmationModal: true });
  }

  closeDeleteConfirmationModal = () => {
    this.setState({ showDeleteConfirmationModal: false });
  }

  openDuplicateLicenseModal = () => {
    this.setState({ showDuplicateLicenseModal: true });
  }

  closeDuplicateLicenseModal = () => {
    this.setState({ showDuplicateLicenseModal: false });
  }

  getActionMenu = ({ onToggle }) => {
    const { urls } = this.props;

    if (!urls.edit) return null;

    return (
      <>
        <IfPermission perm="ui-licenses.licenses.edit">
          <Button
            buttonStyle="dropdownItem"
            id="clickable-dropdown-edit-license"
            to={urls.edit()}
          >
            <Icon icon="edit">
              <FormattedMessage id="ui-licenses.edit" />
            </Icon>
          </Button>
          <Button
            buttonStyle="dropdownItem"
            id="clickable-dropdown-duplicate-license"
            onClick={() => {
              this.openDuplicateLicenseModal();
              onToggle();
            }}
          >
            <Icon icon="duplicate">
              <FormattedMessage id="ui-licenses.licenses.duplicate" />
            </Icon>
          </Button>
        </IfPermission>
        <IfPermission perm="ui-licenses.licenses.delete">
          <Button
            buttonStyle="dropdownItem"
            id="clickable-dropdown-delete-licenses"
            onClick={() => {
              this.openDeleteConfirmationModal();
              onToggle();
            }}
          >
            <Icon icon="trash">
              <FormattedMessage id="ui-licenses.delete" />
            </Icon>
          </Button>
        </IfPermission>

      </>
    );
  }

  getInitialAccordionsState = () => {
    return {
      licenseInternalContacts: false,
      licenseOrganizations: false,
      licenseCoreDocs: false,
      licenseAmendments: false,
      licenseTerms: false,
      licenseSupplement: false,
      licenseAgreements: false,
      licenseNotes: false,
    };
  }

  renderLastMenu = () => {
    const {
      data: { license },
      handlers
    } = this.props;

    return (
      <IfPermission perm="ui-licenses.licenses.edit">
        <PaneMenu>
          {handlers.onToggleTags &&
            <FormattedMessage id="ui-licenses.showTags">
              {ariaLabel => (
                <IconButton
                  ariaLabel={ariaLabel}
                  badgeCount={license?.tags?.length ?? 0}
                  icon="tag"
                  id="clickable-show-tags"
                  onClick={handlers.onToggleTags}
                />
              )}
            </FormattedMessage>
          }
          <FormattedMessage id="ui-licenses.editLicense">
            {ariaLabel => (
              <Button
                aria-label={ariaLabel}
                buttonStyle="primary"
                id="clickable-edit-license"
                marginBottom0
                to={this.props.urls.edit()}
              >
                <FormattedMessage id="stripes-components.button.edit" />
              </Button>
            )}
          </FormattedMessage>
        </PaneMenu>
      </IfPermission>
    );
  }

  render() {
    const { data, isLoading, handlers, helperApp } = this.props;

    const paneProps = {
      defaultWidth: '45%',
      dismissible: true,
      id: 'pane-view-license',
      onClose: handlers.onClose,
    };

    if (isLoading) return <LoadingPane {...paneProps} />;

    return (
      <>
        <Pane
          actionMenu={this.getActionMenu}
          appIcon={<AppIcon app="licenses" />}
          lastMenu={this.renderLastMenu()}
          paneTitle={data.license.name}
          {...paneProps}
        >
          <TitleManager record={data.license.name}>
            <LicenseHeader {...this.getSectionProps()} />
            <LicenseInfo {...this.getSectionProps('licenseInfo')} />
            <AccordionStatus>
              <Row end="xs">
                <Col xs>
                  <ExpandAllButton />
                </Col>
              </Row>
              <AccordionSet initialStatus={this.getInitialAccordionsState()}>
                <LicenseInternalContacts {...this.getSectionProps('licenseInternalContacts')} />
                <LicenseOrganizations {...this.getSectionProps('licenseOrganizations')} />
                <CoreDocs {...this.getSectionProps('licenseCoreDocs')} />
                <Terms {...this.getSectionProps('licenseTerms')} />
                <LicenseAmendments {...this.getSectionProps('licenseAmendments')} />
                <SupplementaryDocs {...this.getSectionProps('licenseSupplement')} />
                <LicenseAgreements {...this.getSectionProps('licenseAgreements')} />
                <NotesSmartAccordion
                  {...this.getSectionProps('licenseNotes')}
                  domainName="licenses"
                  entityId={data.license.id}
                  entityName={data.license.name}
                  entityType="license"
                  pathToNoteCreate="notes/create"
                  pathToNoteDetails="notes"
                />
              </AccordionSet>
            </AccordionStatus>
          </TitleManager>
        </Pane>
        {helperApp}
        { this.state.showDuplicateLicenseModal &&
          <DuplicateLicenseModal
            onClone={(obj) => handlers.onClone(obj)}
            onClose={this.closeDuplicateLicenseModal}
          />
        }
        <ConfirmationModal
          buttonStyle="danger"
          confirmLabel={<FormattedMessage id="ui-licenses.delete" />}
          data-test-delete-confirmation-modal
          heading={<FormattedMessage id="ui-licenses.deleteLicense" />}
          id="delete-agreement-confirmation"
          message={<SafeHTMLMessage id="ui-licenses.delete.confirmMessage" values={{ name: data.license?.name }} />}
          onCancel={this.closeDeleteConfirmationModal}
          onConfirm={() => {
            handlers.onDelete();
            this.closeDeleteConfirmationModal();
          }}
          open={this.state.showDeleteConfirmationModal}
        />
      </>
    );
  }
}

export default License;
