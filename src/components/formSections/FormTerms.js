import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { get } from 'lodash';

import { Field } from 'redux-form';
import { Accordion } from '@folio/stripes/components';

import { TermsListField } from './components';

class FormTerms extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      terms: PropTypes.array,
    }),
    handlers: PropTypes.shape({
      onError: PropTypes.func.isRequired,
    }).isRequired,
    id: PropTypes.string,
    intl: intlShape.isRequired,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  state = {
    terms: [],
  }

  static getDerivedStateFromProps(props, state) {
    const { terms } = props.data;
    if (terms.length !== state.terms.length) {
      return {
        terms: terms.map((term) => {
          let options = get(term.category, ['values']);
          if (options) {
            options = [{
              label: props.intl.formatMessage({ id: 'ui-licenses.notSet' }),
              value: '',
            },
            ...options];
          }

          return {
            description: term.description,
            label: term.label,
            primary: term.primary,
            type: term.type,
            options,
            value: term.name,
            defaultInternal: term.defaultInternal,
          };
        }),
      };
    }

    return null;
  }

  render() {
    const { handlers, id, onToggle, open } = this.props;
    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-licenses.section.terms" />}
        open={open}
        onToggle={onToggle}
      >
        <Field
          name="customProperties"
          component={TermsListField}
          availableTerms={this.state.terms}
          onError={handlers.onError}
        />
      </Accordion>
    );
  }
}

export default injectIntl(FormTerms);
