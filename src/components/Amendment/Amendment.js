import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';

import {
  AccordionSet,
  AccordionStatus,
  Button,
  Col,
  ExpandAllButton,
  Icon,
  LoadingPane,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';

import { IfPermission, TitleManager } from '@folio/stripes/core';

import {
  AmendmentInfo,
  AmendmentLicense,
  CoreDocs,
  SupplementaryDocs,
  Terms,
} from '../viewSections';

export default class Amendment extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      amendment: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        status: PropTypes.shape({
          label: PropTypes.string,
        }),
      }).isRequired,
      license: PropTypes.object.isRequired,
      terms: PropTypes.arrayOf(PropTypes.object),
    }),
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
      onDelete: PropTypes.func,
    }),
    isLoading: PropTypes.bool,
    urls: PropTypes.shape({
      editAmendment: PropTypes.func,
    }),
  }

  getSectionProps = (id) => {
    const { data, handlers, urls } = this.props;

    return {
      amendment: data.amendment,
      id,
      handlers,
      license: data.license,
      record: data.amendment,
      recordType: 'amendment',
      terms: data.terms,
      urls,
    };
  }

  getInitialAccordionsState = () => {
    return {
      amendmentCoreDocs: false,
      amendmentSupplementaryDocs: false,
      amendmentTerms: false,
    };
  }

  renderActionMenu = ({ onToggle }) => {
    const { handlers, urls } = this.props;

    if (!urls.editAmendment && !handlers.onDelete) return null;

    return (
      <>
        {urls.editAmendment &&
          <Button
            buttonStyle="dropdownItem"
            id="clickable-dropdown-edit-amendment"
            to={urls.editAmendment()}
          >
            <Icon icon="edit">
              <FormattedMessage id="ui-licenses.edit" />
            </Icon>
          </Button>
        }
        {handlers.onDelete &&
          <Button
            buttonStyle="dropdownItem"
            id="clickable-delete-amendment"
            onClick={() => {
              handlers.onDelete();
              onToggle();
            }}
          >
            <Icon icon="trash">
              <FormattedMessage id="ui-licenses.delete" />
            </Icon>
          </Button>
        }
      </>
    );
  }

  renderEditAmendmentPaneMenu = () => (
    <IfPermission perm="ui-licenses.licenses.edit">
      <PaneMenu>
        <FormattedMessage id="ui-licenses.amendments.create">
          {ariaLabel => (
            <Button
              aria-label={ariaLabel}
              buttonStyle="primary"
              id="clickable-edit-amendment"
              marginBottom0
              to={this.props.urls.editAmendment()}
            >
              <FormattedMessage id="stripes-components.button.edit" />
            </Button>
          )}
        </FormattedMessage>
      </PaneMenu>
    </IfPermission>
  )

  render() {
    const {
      data: { amendment },
      handlers: { onClose },
      isLoading,
    } = this.props;

    const paneProps = {
      defaultWidth: '45%',
      dismissible: true,
      id: 'pane-view-amendment',
      onClose,
    };

    if (isLoading) return <LoadingPane {...paneProps} />;

    return (
      <Pane
        actionMenu={this.renderActionMenu}
        lastMenu={this.renderEditAmendmentPaneMenu()}
        paneTitle={amendment.name}
        {...paneProps}
      >
        <TitleManager record={amendment.name}>
          <AmendmentLicense {...this.getSectionProps()} />
          <AmendmentInfo {...this.getSectionProps()} />
          <AccordionStatus>
            <Row end="xs">
              <Col xs>
                <ExpandAllButton />
              </Col>
            </Row>
            <AccordionSet initialStatus={this.getInitialAccordionsState()}>
              <CoreDocs {...this.getSectionProps('amendmentCoreDocs')} />
              <Terms {...this.getSectionProps('amendmentTerms')} />
              <SupplementaryDocs {...this.getSectionProps('amendmentSupplementaryDocs')} />
            </AccordionSet>
          </AccordionStatus>
        </TitleManager>
      </Pane>
    );
  }
}
