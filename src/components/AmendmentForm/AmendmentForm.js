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
import { TitleManager } from '@folio/stripes/core';
import stripesForm from '@folio/stripes/form';

import { Spinner } from '@folio/stripes-erm-components';

import {
  AmendmentFormInfo,
  FormCoreDocs,
  FormSupplementaryDocs,
  FormTerms,
} from '../formSections';

import css from './AmendmentForm.css';

class AmendmentForm extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    dispatch: PropTypes.func,
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
    }),
    isLoading: PropTypes.bool,
    initialValues: PropTypes.object,
    invalid: PropTypes.bool,
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
      amendmentFormCoreDocs: true,
      amendmentFormSupplementaryDocs: true,
      amendmentFormTerms: true,
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
      id = 'clickable-update-amendment';
    } else {
      id = 'clickable-create-amendment';
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
        buttonStyle="primary paneHeaderNewButton"
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
    const {
      handleSubmit,
      initialValues,
      pristine,
      submitting,
      invalid
    } = this.props;

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
          disabled={pristine || submitting || invalid}
          onClick={handleSubmit}
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
              footer={this.renderPaneFooter()}
              paneTitle={id ? name : <FormattedMessage id="ui-licenses.amendments.create" />}
            >
              <TitleManager record={id ? name : create}>
                <form id="form-amendment">
                  <div className={css.amendmentForm}>
                    <AmendmentFormInfo {...this.getSectionProps()} />
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
                      <FormCoreDocs {...this.getSectionProps('amendmentFormCoreDocs')} />
                      <FormTerms {...this.getSectionProps('amendmentFormTerms')} />
                      <FormSupplementaryDocs {...this.getSectionProps('amendmentFormSupplementaryDocs')} />
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
