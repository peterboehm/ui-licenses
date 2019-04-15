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

import stripesForm from '@folio/stripes/form';

import { Spinner } from '@folio/stripes-erm-components';

import {
  LicenseFormInfo,
  LicenseFormCoreDocs,
  LicenseFormTerms,
} from './sections';

import css from './LicenseForm.css';

class LicenseForm extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
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
    }
  }

  getSectionProps(id) {
    const { data } = this.props;

    return {
      data,
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
          id="pane-license-form"
          onClose={this.props.onClose}
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
        <FormattedMessage id="ui-licenses.closeEditLicense">
          {ariaLabel => (
            <IconButton
              icon="times"
              id="close-license-form-button"
              onClick={this.props.onClose}
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
      id = 'clickable-update-license';
      label = <FormattedMessage id="ui-licenses.updateLicense" />;
    } else {
      id = 'clickable-create-license';
      label = <FormattedMessage id="ui-licenses.createLicense" />;
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
        <Pane
          defaultWidth="100%"
          id="pane-license-form"
          firstMenu={this.renderFirstMenu()}
          lastMenu={this.renderLastMenu()}
          paneTitle={id ? name : <FormattedMessage id="ui-licenses.createLicense" />}
        >
          <form id="form-license">
            <div className={css.licenseForm}>
              <AccordionSet>
                <Row end="xs">
                  <Col xs>
                    <ExpandAllButton
                      accordionStatus={this.state.sections}
                      onToggle={this.handleAllSectionsToggle}
                    />
                  </Col>
                </Row>
                <LicenseFormInfo {...this.getSectionProps('licenseFormInfo')} />
                <LicenseFormCoreDocs {...this.getSectionProps('licenseFormDocs')} />
                <LicenseFormTerms {...this.getSectionProps('licenseFormTerms')} />
              </AccordionSet>
            </div>
          </form>
        </Pane>
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
