import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { NotesSmartAccordion } from '@folio/stripes/smart-components';
import { get } from 'lodash';

import {
  AccordionSet,
  Button,
  Col,
  ExpandAllButton,
  Icon,
  Layout,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';
import { AppIcon, IfPermission, TitleManager } from '@folio/stripes/core';
import { Spinner } from '@folio/stripes-erm-components';

import {
  LicenseAgreements,
  LicenseAmendments,
  LicenseHeader,
  LicenseInfo,
  CoreDocs,
  SupplementaryDocs,
  Terms,
} from '../viewSections';

class License extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      license: PropTypes.object,
      terms: PropTypes.array,
      users: PropTypes.array,
    }),
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
    }).isRequired,
    isLoading: PropTypes.bool,
    urls: PropTypes.shape({
      edit: PropTypes.func,
    }).isRequired,
    stripes: PropTypes.object,
  };

  state = {
    sections: {
      licenseInfo: true,
      licenseCoreDocs: false,
      licenseAmendments: false,
      licenseTerms: false,
      licenseSupplement: false,
      licenseAgreements: false,
      licenseNotes: false,
    }
  }

  getSectionProps = (id) => {
    const { data, handlers, urls } = this.props;

    return {
      id,
      handlers,
      urls,
      license: data.license,
      onToggle: this.handleSectionToggle,
      open: this.state.sections[id],
      record: data.license,
      terms: data.terms,
      users: data.users,
      pathToNoteCreate: 'notes/create',
      pathToNoteDetails: 'notes',
      domainName: 'licenses',
      entityName: data.license.name,
      entityType: 'license',
      entityId: data.license.id,

    };
  }

  handleSectionToggle = ({ id }) => {
    this.setState((prevState) => ({
      sections: {
        ...prevState.sections,
        [id]: !prevState.sections[id],
      }
    }));
  }

  handleAllSectionsToggle = (sections) => {
    this.setState({ sections });
  }

  getActionMenu = () => {
    const { urls } = this.props;

    if (!urls.edit) return null;

    return (
      <React.Fragment>
        <Button
          buttonStyle="dropdownItem"
          id="clickable-dropdown-edit-license"
          to={urls.edit()}
        >
          <Icon icon="edit">
            <FormattedMessage id="ui-licenses.editLicense" />
          </Icon>
        </Button>
      </React.Fragment>
    );
  }

  renderEditLicensePaneMenu = () => (
    <IfPermission perm="ui-licenses.licenses.edit">
      <PaneMenu>
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
  )

  renderLoadingPane = () => {
    return (
      <Pane
        defaultWidth="45%"
        dismissible
        id="pane-view-license"
        onClose={this.props.handlers.onClose}
        paneTitle={<FormattedMessage id="ui-licenses.loading" />}
      >
        <Layout className="marginTop1">
          <Spinner />
        </Layout>
      </Pane>
    );
  }

  render() {
    const { data, isLoading, handlers } = this.props;

    if (isLoading) return this.renderLoadingPane();

    const licenseId = get(data, ['license', 'id']);
    return (
      <Pane
        actionMenu={this.getActionMenu}
        appIcon={<AppIcon app="licenses" />}
        defaultWidth="45%"
        dismissible
        id="pane-view-license"
        lastMenu={this.renderEditLicensePaneMenu()}
        onClose={handlers.onClose}
        paneTitle={data.license.name}
      >
        <TitleManager record={data.license.name}>
          <LicenseHeader {...this.getSectionProps()} />
          <AccordionSet>
            <Row end="xs">
              <Col xs>
                <ExpandAllButton accordionStatus={this.state.sections} onToggle={this.handleAllSectionsToggle} />
              </Col>
            </Row>
            <LicenseInfo {...this.getSectionProps('licenseInfo')} />
            <CoreDocs {...this.getSectionProps('licenseCoreDocs')} />
            <Terms {...this.getSectionProps('licenseTerms')} />
            <LicenseAmendments {...this.getSectionProps('licenseAmendments')} />
            <SupplementaryDocs {...this.getSectionProps('licenseSupplement')} />
            <LicenseAgreements {...this.getSectionProps('licenseAgreements')} />
            {
              licenseId &&
              <NotesSmartAccordion {...this.getSectionProps('licenseNotes')} />
            }
          </AccordionSet>
        </TitleManager>
      </Pane>
    );
  }
}

export default License;
