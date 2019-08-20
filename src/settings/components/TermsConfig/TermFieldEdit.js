import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { Card, Col, Row, Select, TextArea, TextField } from '@folio/stripes/components';
import { IntlConsumer } from '@folio/stripes/core';

import { required } from '../../../util/validators';

export default class TermFieldEdit extends React.Component {
  static propTypes = {
    actionButtons: PropTypes.node.isRequired,
    input: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    meta: PropTypes.shape({
      invalid: PropTypes.bool,
      pristine: PropTypes.bool,
      submitting: PropTypes.bool,
    }),
    pickLists: PropTypes.arrayOf(PropTypes.object),
  }

  booleanToString = booleanValue => booleanValue.toString()

  stringToBoolean = stringValue => stringValue === 'true'

  render() {
    const {
      input: { name, value },
      pickLists,
    } = this.props;

    return (
      <IntlConsumer>
        {intl => (
          <Card
            headerStart={(
              <strong>
                {value.id ?
                  <FormattedMessage id="ui-licenses.settings.terms.editLicenseTerm" /> :
                  <FormattedMessage id="ui-licenses.settings.terms.newLicenseTerm" />}
              </strong>
            )}
            headerEnd={this.props.actionButtons}
          >
            <Row>
              <Col xs={6}>
                <Field
                  component={TextField}
                  label={<FormattedMessage id="ui-licenses.settings.terms.term.label" />}
                  name={`${name}.label`}
                  required
                  validate={required}
                />
              </Col>
              <Col xs={6}>
                <Field
                  component={TextField}
                  label={<FormattedMessage id="ui-licenses.settings.terms.term.name" />}
                  name={`${name}.name`}
                  required
                  validate={required}
                />
              </Col>
            </Row>
            <Field
              component={TextArea}
              label={<FormattedMessage id="ui-licenses.settings.terms.term.description" />}
              name={`${name}.description`}
              required
              validate={required}
            />
            <Row>
              <Col xs={4}>
                <Field
                  component={TextField}
                  label={<FormattedMessage id="ui-licenses.settings.terms.term.orderWeight" />}
                  name={`${name}.weight`}
                  required
                  validate={required}
                  type="number"
                />
              </Col>
              <Col xs={4}>
                <Field
                  component={Select}
                  dataOptions={[
                    { label: intl.formatMessage({ id: 'ui-licenses.yes' }), value: 'true' },
                    { label: intl.formatMessage({ id: 'ui-licenses.no' }), value: 'false' },
                  ]}
                  format={this.booleanToString}
                  label={<FormattedMessage id="ui-licenses.settings.terms.term.primaryTerm" />}
                  name={`${name}.primary`}
                  parse={this.stringToBoolean}
                  required
                  validate={required}
                />
              </Col>
              <Col xs={4}>
                <Field
                  component={Select}
                  dataOptions={[
                    { label: intl.formatMessage({ id: 'ui-licenses.term.internalTrue' }), value: 'true' },
                    { label: intl.formatMessage({ id: 'ui-licenses.term.internalFalse' }), value: 'false' },
                  ]}
                  format={this.booleanToString}
                  label={<FormattedMessage id="ui-licenses.settings.terms.term.defaultVisibility" />}
                  name={`${name}.defaultInternal`}
                  parse={this.stringToBoolean}
                  required
                  validate={required}
                />
              </Col>
            </Row>
            { /* Users can only configure the type of a term when creating it, not when editing it */ }
            { value.id === undefined &&
              <Row>
                <Col xs={6}>
                  <Field
                    component={Select}
                    dataOptions={[
                      { label: '', value: '' },
                      { label: intl.formatMessage({ id: 'ui-licenses.terms.type.decimal' }), value: 'Decimal' },
                      { label: intl.formatMessage({ id: 'ui-licenses.terms.type.integer' }), value: 'Integer' },
                      { label: intl.formatMessage({ id: 'ui-licenses.terms.type.pickList' }), value: 'Refdata' },
                      { label: intl.formatMessage({ id: 'ui-licenses.terms.type.text' }), value: 'Text' },
                    ]}
                    label={<FormattedMessage id="ui-licenses.settings.terms.term.type" />}
                    name={`${name}.type`}
                    required
                    validate={required}
                  />
                </Col>
                <Col xs={6}>
                  { value.type === 'Refdata' &&
                    <Field
                      component={Select}
                      dataOptions={[
                        { label: '', value: '' },
                        ...pickLists
                      ]}
                      label={<FormattedMessage id="ui-licenses.settings.terms.term.pickList" />}
                      name={`${name}.category`}
                      required
                      validate={required}
                    />
                  }
                </Col>
              </Row>
            }
          </Card>
        )}
      </IntlConsumer>
    );
  }
}
