import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import { Callout, Pane } from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import TermsListFieldArray from './TermsListFieldArray';

class TermsConfigForm extends React.Component {
  static propTypes = {
    initialValues: PropTypes.shape({
      terms: PropTypes.arrayOf(PropTypes.object),
    }),
    form: PropTypes.shape({
      mutators: PropTypes.object.isRequired,
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    pickLists: PropTypes.arrayOf(PropTypes.object),
  }

  sendCallout = (operation, outcome) => {
    this.callout.sendCallout({
      type: outcome,
      message: <FormattedMessage id={`ui-licenses.settings.terms.callout.${operation}.${outcome}`} />
    });
  }

  handleDelete = (...rest) => {
    this.props.onDelete(...rest)
      .then(() => this.sendCallout('delete', 'success'))
      .catch(() => this.sendCallout('delete', 'error'));
  }

  handleSave = (...rest) => {
    this.props.onSave(...rest)
      .then(() => this.sendCallout('save', 'success'))
      .catch(() => this.sendCallout('save', 'error'));
  }

  render() {
    const {
      form: { mutators },
      pickLists,
    } = this.props;

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
            component={TermsListFieldArray}
            mutators={mutators}
            name="terms"
            onDelete={this.handleDelete}
            onSave={this.handleSave}
            pickLists={pickLists}
          />
        </form>
        <Callout ref={ref => { this.callout = ref; }} />
      </Pane>
    );
  }
}

export default stripesFinalForm({
  enableReinitialize: true,
  keepDirtyOnReinitialize: false,
  mutators: {
    setTermValue: (args, state, tools) => {
      tools.changeValue(state, args[0], () => args[1]);
    },
  },
  navigationCheck: true,
})(TermsConfigForm);
