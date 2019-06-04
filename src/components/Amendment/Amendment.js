import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

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

import { IfPermission, TitleManager } from '@folio/stripes/core';

import { Spinner } from '@folio/stripes-erm-components';

import {
  AmendmentInfo,
  AmendmentLicense,
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

  state = {
    sections: {
      amendmentTerms: false,
    }
  }

  getSectionProps = (id) => {
    const { data, handlers, urls } = this.props;

    return {
      amendment: data.amendment,
      id,
      handlers,
      license: data.license,
      onToggle: this.handleSectionToggle,
      open: this.state.sections[id],
      record: data.amendment,
      terms: data.terms,
      urls,
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

  renderActionMenu = ({ onToggle }) => {
    const { handlers, urls } = this.props;

    if (!urls.editAmendment && !handlers.onDelete) return null;

    return (
      <React.Fragment>
        {urls.editAmendment &&
          <Button
            buttonStyle="dropdownItem"
            id="clickable-dropdown-edit-amendment"
            to={urls.editAmendment()}
          >
            <Icon icon="edit">
              <FormattedMessage id="ui-licenses.amendments.edit" />
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
              <FormattedMessage id="ui-licenses.amendments.delete" />
            </Icon>
          </Button>
        }
      </React.Fragment>
    );
  }

  renderLoadingPane = () => {
    return (
      <Pane
        defaultWidth="45%"
        dismissible
        id="pane-view-amendment"
        onClose={this.props.handlers.onClose}
        paneTitle={<FormattedMessage id="ui-licenses.loading" />}
      >
        <Layout className="marginTop1">
          <Spinner />
        </Layout>
      </Pane>
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

    if (isLoading) return this.renderLoadingPane();

    return (
      <Pane
        actionMenu={this.renderActionMenu}
        defaultWidth="45%"
        dismissible
        id="pane-view-amendment"
        lastMenu={this.renderEditAmendmentPaneMenu()}
        onClose={onClose}
        paneTitle={amendment.name}
      >
        <TitleManager record={amendment.name}>
          <AmendmentLicense {...this.getSectionProps()} />
          <AmendmentInfo {...this.getSectionProps()} />
          <AccordionSet>
            <Row end="xs">
              <Col xs>
                <ExpandAllButton accordionStatus={this.state.sections} onToggle={this.handleAllSectionsToggle} />
              </Col>
            </Row>
            <Terms {...this.getSectionProps('amendmentTerms')} />
          </AccordionSet>
        </TitleManager>
      </Pane>
    );
  }
}
