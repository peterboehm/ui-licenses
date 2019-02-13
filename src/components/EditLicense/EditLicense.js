import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import stripesForm from '@folio/stripes/form';
import { Button, IconButton, Pane, PaneMenu } from '@folio/stripes/components';

import LicenseForm from '../LicenseForm';

const handleSubmit = (agreement, dispatch, props) => {
  props.onUpdate(agreement)
    .then(() => props.onCancel());
};

class EditLicense extends React.Component {
  static propTypes = {
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onRemove: PropTypes.func,
    onUpdate: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    parentResources: PropTypes.object,
    parentMutator: PropTypes.object,
  }

  renderFirstMenu() {
    return (
      <PaneMenu>
        <FormattedMessage id="ui-licenses.closeNewLicense">
          {ariaLabel => (
            <IconButton
              icon="times"
              onClick={this.props.onCancel}
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
      id = 'clickable-updatelicense';
      label = <FormattedMessage id="ui-licenses.updateLicense" />;
    } else {
      id = 'clickable-createlicense';
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
    const { initialValues } = this.props;
    const paneTitle = initialValues && initialValues.id ?
      initialValues.name : <FormattedMessage id="ui-licenses.createLicense" />;

    return (
      <form id="form-license">
        <Pane
          defaultWidth="100%"
          firstMenu={this.renderFirstMenu()}
          lastMenu={this.renderLastMenu()}
          paneTitle={paneTitle}
        >
          <LicenseForm {...this.props} />
        </Pane>
      </form>
    );
  }
}

export default stripesForm({
  form: 'EditLicense',
  onSubmit: handleSubmit,
  navigationCheck: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(EditLicense);
