import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import { Button, Pane, PaneFooter } from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import TermsSettingsList from './TermsSettingsList';

class TermsSettingsForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.shape({
      terms: PropTypes.arrayOf(PropTypes.object),
    }),
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
  }

  renderFooter = () => (
    <PaneFooter>
      <Button
        buttonStyle="primary mega"
        disabled={this.props.pristine || this.props.submitting}
        id="clickable-save-settings-terms"
        onClick={(a, b, c) => this.props.handleSubmit(a, b, c)}
        style={{ marginLeft: 'auto' }}
      >
        <FormattedMessage id="stripes-core.button.save" />
      </Button>
    </PaneFooter>
  )

  render() {
    const count = get(this.props, 'initialValues.terms.length', 0);
    return (
      <Pane
        defaultWidth="fill"
        footer={this.renderFooter()}
        id="settings-terms"
        paneTitle={<FormattedMessage id="ui-licenses.section.terms" />}
        paneSub={<FormattedMessage id="ui-licenses.settings.terms.termCount" values={{ count }} />}
      >
        <form>
          <FieldArray
            component={TermsSettingsList}
            name="terms"
          />
        </form>
      </Pane>
    );
  }
}

export default stripesFinalForm({
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  navigationCheck: true,
  validateOnBlur: true,
})(TermsSettingsForm);
