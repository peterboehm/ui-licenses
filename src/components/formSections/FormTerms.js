import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { get, isEmpty } from 'lodash';
import { Field } from 'redux-form';
import {
  Accordion,
  Col,
  Label,
  Row,
} from '@folio/stripes/components';

import { TermsListField } from './components';

class FormTerms extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    intl: intlShape.isRequired,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    data: PropTypes.shape({
      terms: PropTypes.array,
    }),
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
            type: term.type,
            options,
            value: term.name,
          };
        }),
      };
    }

    return null;
  }

  validate = (values) => {
    const errors = {};
    if (!isEmpty(values)) {
      errors.customProperties = {};
      Object.keys(values).forEach(key => {
        const val = values[key];
        if (val !== '') {
          const { note, value } = val[0];
          if (note && !value) {
            const error = { [key]: [{ 'value': { err: <FormattedMessage id="ui-licenses.errors.termNoteWithoutValue" /> } }] };
            errors.customProperties = { ...errors.customProperties, ...error };
          }
        }
      });
    }
    return (isEmpty(errors) || isEmpty(errors.customProperties)) ? undefined : errors;
  };

  render() {
    const { id, onToggle, open } = this.props;
    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-licenses.section.terms" />}
        open={open}
        onToggle={onToggle}
      >
        <Row>
          <Col xs={5}>
            <Label tagName="span">
              <FormattedMessage id="ui-licenses.prop.termName" />
            </Label>
          </Col>
          <Col xs={6}>
            <Label tagName="span">
              <FormattedMessage id="ui-licenses.prop.termValue" />
            </Label>
          </Col>
          <Col xs={1}>
            <FormattedMessage id="stripes-core.button.delete" />
          </Col>
        </Row>
        <Field
          name="customProperties"
          component={TermsListField}
          availableTerms={this.state.terms}
          validate={this.validate}
        />
      </Accordion>
    );
  }
}

export default injectIntl(FormTerms);
