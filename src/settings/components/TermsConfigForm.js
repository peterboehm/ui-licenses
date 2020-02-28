import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { Callout, Pane } from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import { CustomPropertiesConfigListFieldArray } from '@folio/stripes-erm-components';

class TermsConfigForm extends React.Component {
  static propTypes = {
    initialValues: PropTypes.shape({
      customProperties: PropTypes.arrayOf(PropTypes.object),
    }),
    form: PropTypes.shape({
      mutators: PropTypes.object.isRequired,
    }).isRequired,
    match: PropTypes.shape({
      url: PropTypes.string,
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    pickLists: PropTypes.arrayOf(PropTypes.object),
  };

  sendCallout = (operation, outcome, error = '', custPropName = '') => {
    this.callout.sendCallout({
      type: outcome,
      message: (
        <SafeHTMLMessage
          id={`ui-licenses.terms.callout.${operation}.${outcome}`}
          values={{ error, name: custPropName }}
        />
      ),
      timeout: error ? 0 : undefined, // Don't autohide callouts with a specified error message.
    });
  };

  sendCalloutInUse = () => {
    return this.callout.sendCallout({
      type: 'error',
      message: (
        <SafeHTMLMessage id="ui-licenses.terms.callout.delete.termInUse" />
      ),
      timeout: 0,
    });
  };

  handleDelete = customProperty => {
    return this.props
      .onDelete(customProperty)
      .then(() => this.sendCallout('delete', 'success', '', customProperty.name))
      .catch(response => {
        // Attempt to show an error message if we got JSON back with a message.
        // If json()ification fails, show the generic error callout.
        response
          .json()
          .then(error => {
            const pattern = new RegExp(
              'violates foreign key constraint.*is still referenced from table',
              's'
            );
            if (pattern.test(error.message)) {
              this.sendCalloutInUse();
            } else {
              this.sendCallout('delete', 'error', error.message, customProperty?.name);
            }
          })
          .catch(() => this.sendCallout('delete', 'error', '', customProperty?.name));

        // Return a rejected promise to break any downstream Promise chains.
        return Promise.reject();
      });
  };

  handleSave = customProperty => {
    return this.props
      .onSave(customProperty)
      .then(() => this.sendCallout('save', 'success', '', customProperty?.name))
      .catch(response => {
        // Attempt to show an error message if we got JSON back with a message.
        // If json()ification fails, show the generic error callout.
        response
          .json()
          .then(error => this.sendCallout('save', 'error', error.message, customProperty?.name))
          .catch(() => this.sendCallout('save', 'error', '', customProperty?.name));

        // Return a rejected promise to break any downstream Promise chains.
        return Promise.reject();
      });
  };

  render() {
    const {
      form: { mutators },
      pickLists,
    } = this.props;

    const count = get(this.props, 'initialValues.customProperties.length', 0);

    return (
      <Pane
        defaultWidth="fill"
        id="settings-terms"
        paneTitle={<FormattedMessage id="ui-licenses.section.terms" />}
        paneSub={
          <FormattedMessage id="ui-licenses.terms.count" values={{ count }} />
        }
      >
        <form>
          <FieldArray
            component={CustomPropertiesConfigListFieldArray}
            mutators={mutators}
            name="customProperties"
            onDelete={customProperty => this.handleDelete(customProperty)}
            onSave={customProperty => this.handleSave(customProperty)}
            pickLists={pickLists}
            translationKey="term"
          />
        </form>
        <Callout
          ref={ref => {
            this.callout = ref;
          }}
        />
      </Pane>
    );
  }
}

export default stripesFinalForm({
  enableReinitialize: true,
  keepDirtyOnReinitialize: false,
  mutators: {
    setCustomPropertyValue: (args, state, tools) => {
      tools.changeValue(state, args[0], () => args[1]);
    },
  },
  navigationCheck: true,
})(TermsConfigForm);
