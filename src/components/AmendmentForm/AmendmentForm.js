import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  Button,
  Col,
  ExpandAllButton,
  IconButton,
  Layout,
  Pane,
  PaneMenu,
  Paneset,
  Row,
} from '@folio/stripes/components';
import { TitleManager } from '@folio/stripes/core';
import stripesForm from '@folio/stripes/form';

import { Spinner } from '@folio/stripes-erm-components';

import {
  AmendmentFormInfo,
} from '../formSections';

import css from './AmendmentForm.css';

class AmendmentForm extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
    }),
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
  }

  static defaultProps = {
    initialValues: {},
  }

  state = {
    sections: {
      licenseFormInfo: true,
      licenseFormDocs: false,
      licenseFormTerms: false,
      licenseFormSupplement: false
    }
  }

  getSectionProps(id) {
    const { data, handlers } = this.props;

    return {
      data,
      handlers,
      id,
      onToggle: this.handleSectionToggle,
      open: this.state.sections[id],
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

  renderLoadingPane = () => {
    return (
      <Paneset>
        <Pane
          dismissible
          defaultWidth="100%"
          id="pane-amendment-form"
          onClose={this.props.handlers.onClose}
          paneTitle={<FormattedMessage id="ui-licenses.loading" />}
        >
          <Layout className="marginTop1">
            <Spinner />
          </Layout>
        </Pane>
      </Paneset>
    );
  }

  renderFirstMenu() {
    return (
      <PaneMenu>
        <FormattedMessage id="ui-licenses.amendments.closePane">
          {ariaLabel => (
            <IconButton
              icon="times"
              id="close-amendment-form-button"
              onClick={this.props.handlers.onClose}
              aria-label={ariaLabel}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  renderLastMenu() {
    const { initialValues } = this.props;

    let id;
    let label;
    if (initialValues && initialValues.id) {
      id = 'clickable-update-amendment';
      label = <FormattedMessage id="ui-licenses.amendments.update" />;
    } else {
      id = 'clickable-create-amendment';
      label = <FormattedMessage id="ui-licenses.amendments.create" />;
    }

    return (
      <PaneMenu>
        <Button
          id={id}
          type="submit"
          disabled={this.props.pristine || this.props.submitting}
          onClick={this.props.handleSubmit}
          buttonStyle="primary paneHeaderNewButton"
          marginBottom0
        >
          {label}
        </Button>
      </PaneMenu>
    );
  }

  render() {
    const { initialValues: { id, name }, isLoading } = this.props;

    if (isLoading) return this.renderLoadingPane();

    return (
      <Paneset>
        <FormattedMessage id="ui-licenses.create">
          {create => (
            <Pane
              defaultWidth="100%"
              id="pane-amendment-form"
              firstMenu={this.renderFirstMenu()}
              lastMenu={this.renderLastMenu()}
              paneTitle={id ? name : <FormattedMessage id="ui-licenses.amendments.create" />}
            >
              <TitleManager record={id ? name : create}>
                <form id="form-amendment">
                  <div className={css.amendmentForm}>
                    <AccordionSet>
                      <Row end="xs">
                        <Col xs>
                          <ExpandAllButton
                            accordionStatus={this.state.sections}
                            onToggle={this.handleAllSectionsToggle}
                          />
                        </Col>
                      </Row>
                      <AmendmentFormInfo {...this.getSectionProps('amendmentFormInfo')} />
                      { /* <LicenseFormCoreDocs {...this.getSectionProps('licenseFormDocs')} /> */ }
                      { /* <LicenseFormTerms {...this.getSectionProps('licenseFormTerms')} /> */ }
                      { /* <LicenseFormSupplement {...this.getSectionProps('licenseFormSupplement')} /> */ }
                    </AccordionSet>
                  </div>
                </form>
              </TitleManager>
            </Pane>
          )}
        </FormattedMessage>
      </Paneset>
    );
  }
}

export default stripesForm({
  form: 'EditAmendment',
  navigationCheck: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(AmendmentForm);
