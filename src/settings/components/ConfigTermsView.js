import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import { Button, Pane, PaneFooter } from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import TermsSettingsList from './TermsSettingsList';
import ConfigTermsList from './ConfigTermsList';

class TermsSettingsForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.shape({
      terms: PropTypes.arrayOf(PropTypes.object),
    }),
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
  }

  render() {
    const { onDelete, onSave, terms } = this.props;

    const count = get(this.props, 'initialValues.terms.length', 0);

    return (
      <Pane
        defaultWidth="fill"
        id="settings-terms"
        paneTitle={<FormattedMessage id="ui-licenses.section.terms" />}
        paneSub={<FormattedMessage id="ui-licenses.settings.terms.termCount" values={{ count }} />}
      >
        <ConfigTermsList
          onDelete={onDelete}
          onSave={onSave}
          terms={terms}
        />
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
