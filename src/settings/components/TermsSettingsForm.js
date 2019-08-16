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
    onDelete: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
  }

  render() {
    const { form: { mutators }, onDelete, onSave, terms } = this.props;

    const count = get(this.props, 'initialValues.terms.length', 0);

    return (
      <Pane
        defaultWidth="fill"
        id="settings-terms"
        paneTitle={<FormattedMessage id="ui-licenses.section.terms" />}
        paneSub={<FormattedMessage id="ui-licenses.settings.terms.termCount" values={{ count }} />}
      >
        <form>
          <FieldArray
            component={TermsSettingsList}
            mutators={mutators}
            name="terms"
            onDelete={onDelete}
            onSave={onSave}
          />
        </form>
        {/* <ConfigTermsList
          onDelete={onDelete}
          onSave={onSave}
          terms={terms}
        /> */}
      </Pane>
    );
  }
}

export default stripesFinalForm({
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  mutators: {
    resetTermState: (args, state, tools) => {
      tools.resetFieldState(args[0]);
    },
    setTermValue: (args, state, tools) => {
      tools.changeValue(state, args[0], () => args[1]);
    },
  },
  navigationCheck: true,
  validateOnBlur: true,
})(TermsSettingsForm);
