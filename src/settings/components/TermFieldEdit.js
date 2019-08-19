import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { Card, Col, Row, Select, TextArea, TextField, Button } from '@folio/stripes/components';

import { required } from '../../util/validators';

export default class TermField extends React.Component {
  static propTypes = {
    onDelete: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
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
    })
  }

  booleanToString = booleanValue => booleanValue.toString()

  stringToBoolean = stringValue => stringValue === 'true'

  render() {
    const { input: { name, value } } = this.props;

    return (
      <Card
        headerStart={<strong>{value.id ? 'Edit license term' : 'New license term'}</strong>}
        headerEnd={this.props.actionButtons}
      >
        <Row>
          <Col xs={6}>
            <Field
              component={TextField}
              label="Label"
              name={`${name}.label`}
              required
              validate={required}
            />
          </Col>
          <Col xs={6}>
            <Field
              component={TextField}
              label="Name"
              name={`${name}.name`}
              required
              validate={required}
            />
          </Col>
        </Row>
        <Field
          component={TextArea}
          label="Description"
          name={`${name}.description`}
          required
          validate={required}
        />
        <Row>
          <Col xs={4}>
            <Field
              component={TextField}
              label="Order weight"
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
                { label: 'Yes', value: 'true' },
                { label: 'No', value: 'false' },
              ]}
              format={this.booleanToString}
              label="Primary term"
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
                { label: 'Internal', value: 'true' },
                { label: 'Public', value: 'false' },
              ]}
              format={this.booleanToString}
              label="Default visibility"
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
                  { label: 'Decimal', value: 'Decimal' },
                  { label: 'Integer', value: 'Integer' },
                  { label: 'Pick list', value: 'Refdata' },
                  { label: 'Text', value: 'Text' },
                ]}
                label="Type"
                name={`${name}.type`}
                required
                validate={required}
              />
            </Col>
            <Col xs={6}>
              { value.type === 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata' &&
                <Field
                  component={Select}
                  dataOptions={[
                    { label: '', value: '' },
                    { label: 'Yes/No/Other', value: '1883e41b6c61e626016c61ed2be70000' },
                    { label: 'Permitted/Prohibited', value: '1883e41b6c61e626016c61ed2c700008' },
                  ]}
                  disabled={value.type !== 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'}
                  label="Pick list"
                  name={`${name}.category`}
                  required
                  validate={required}
                />
              }
            </Col>
          </Row>
        }
      </Card>
    );
  }
}
