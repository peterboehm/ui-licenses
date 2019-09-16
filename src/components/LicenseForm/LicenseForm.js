import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { setSubmitFailed, stopSubmit } from 'redux-form';

import {
  AccordionSet,
  Button,
  Col,
  ExpandAllButton,
  IconButton,
  Layout,
  Pane,
  PaneFooter,
  PaneMenu,
  Paneset,
  Row,
} from '@folio/stripes/components';
import { AppIcon, TitleManager } from '@folio/stripes/core';
import stripesForm from '@folio/stripes/form';

import { Spinner } from '@folio/stripes-erm-components';

import {
  LicenseFormInfo,
  LicenseFormInternalContacts,
  LicenseFormOrganizations,
  FormCoreDocs,
  FormSupplementaryDocs,
  FormTerms,
} from '../formSections';

import css from './LicenseForm.css';

class LicenseForm extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    dispatch: PropTypes.func,
    handlers: PropTypes.PropTypes.shape({
      onClose: PropTypes.func.isRequired,
    }),
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
  }

  static defaultProps = {
    initialValues: {},
  }

  state = {
    sections: {
      licenseFormInternalContacts: true,
      licenseFormOrganizations: true,
      licenseFormDocs: true,
      licenseFormTerms: true,
      licenseFormSupplementaryDocs: true
    }
  }

  getSectionProps(id) {
    const { data, handlers } = this.props;

    return {
      data,
      handlers: {
        ...handlers,
        onError: this.handleError,
      },
      id,
      onToggle: this.handleSectionToggle,
      open: this.state.sections[id],
    };
  }

  handleError = (error, fieldName, formName) => {
    const { dispatch } = this.props;
    // stopSubmit reports the error to redux-form and sets invalid flag to true which helps us in disabling the submit button
    if (error) {
      dispatch(stopSubmit(formName, { [fieldName]: error }));
      dispatch(setSubmitFailed(formName, fieldName));
    }
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
          id="pane-license-form"
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

  renderPaneFooter() {
    const {
      handleSubmit,
      initialValues,
      pristine,
      submitting,
      invalid
    } = this.props;

    let id;
    if (initialValues && initialValues.id) {
      id = 'clickable-update-license';
    } else {
      id = 'clickable-create-license';
    }

    const startButton = (
      <Button
        buttonStyle="default mega"
        id="clickable-cancel"
        marginBottom0
        onClick={this.props.handlers.onClose}
      >
        <FormattedMessage id="stripes-components.cancel" />
      </Button>
    );

    const endButton = (
      <Button
        buttonStyle="primary mega"
        disabled={pristine || submitting || invalid}
        id={id}
        marginBottom0
        onClick={handleSubmit}
        type="submit"
      >
        <FormattedMessage id="stripes-components.saveAndClose" />
      </Button>
    );

    return (
      <PaneFooter
        renderStart={startButton}
        renderEnd={endButton}
      />
    );
  }

  renderFirstMenu() {
    return (
      <PaneMenu>
        <FormattedMessage id="ui-licenses.closeEditLicense">
          {ariaLabel => (
            <IconButton
              icon="times"
              id="close-license-form-button"
              onClick={this.props.handlers.onClose}
              aria-label={ariaLabel}
            />
          )}
        </FormattedMessage>
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
              appIcon={<AppIcon app="licenses" />}
              defaultWidth="100%"
              footer={this.renderPaneFooter()}
              firstMenu={this.renderFirstMenu()}
              id="pane-license-form"
              paneTitle={id ? name : <FormattedMessage id="ui-licenses.createLicense" />}
            >
              <TitleManager record={id ? name : create}>
                <form id="form-license">
                  <div className={css.licenseForm}>
                    <AccordionSet>
                      <Row end="xs">
                        <Col xs>
                          <ExpandAllButton
                            accordionStatus={this.state.sections}
                            id="clickable-expand-all"
                            onToggle={this.handleAllSectionsToggle}
                          />
                        </Col>
                      </Row>
                      <LicenseFormInfo {...this.getSectionProps('licenseFormInfo')} />
                      <LicenseFormInternalContacts {...this.getSectionProps('licenseFormInternalContacts')} />
                      <LicenseFormOrganizations {...this.getSectionProps('licenseFormOrganizations')} />
                      <FormCoreDocs {...this.getSectionProps('licenseFormDocs')} />
                      <FormTerms {...this.getSectionProps('licenseFormTerms')} />
                      <FormSupplementaryDocs {...this.getSectionProps('licenseFormSupplementaryDocs')} />
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
  form: 'EditLicense',
  navigationCheck: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(LicenseForm);
