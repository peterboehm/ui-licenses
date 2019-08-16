import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { Col, Row, Select, TextArea, TextField } from '@folio/stripes/components';
import { EditCard } from '@folio/stripes-erm-components';

import { required } from '../../util/validators';

export default class TermField extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
    term: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }

  booleanToString = booleanValue => booleanValue.toString()

  stringToBoolean = stringValue => stringValue === 'true'

  render() {
    const { name, onDelete, term } = this.props;

    return (
      <EditCard
        header={term.id ? 'Edit license term' : 'New license term'}
        onDelete={term.primary ? undefined : onDelete} // Disallow deleting primary terms
      >
        <Row>
          <Col xs={6}>
            <Field
              component={TextField}
              label="Name"
              name={`${name}.name`}
              required
              validate={required}
            />
          </Col>
          <Col xs={6}>
            <Field
              component={TextField}
              label="Label"
              name={`${name}.label`}
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
          <Col xs={6}>
            <Field
              component={Select}
              dataOptions={[
                { label: '', value: '' },
                { label: 'Decimal', value: 'com.k_int.web.toolkit.custprops.types.CustomPropertyDecimal' },
                { label: 'Integer', value: 'com.k_int.web.toolkit.custprops.types.CustomPropertyInteger' },
                { label: 'Pick list', value: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata' },
                { label: 'Text', value: 'com.k_int.web.toolkit.custprops.types.CustomPropertyText' },
              ]}
              label="Type"
              name={`${name}.type`}
              placeholder=""
              required
              validate={required}
            />
          </Col>
          <Col xs={6}>
            { term.type === 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata' &&
              <Field
                component={Select}
                dataOptions={[
                  { label: 'Yes/No/Other', value: '1883e41b6c61e626016c61ed2be70000' },
                  { label: 'Permitted/Prohibited', value: '1883e41b6c61e626016c61ed2c700008' },
                ]}
                disabled={term.type !== 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'}
                label="Pick list"
                name={`${name}.category`}
              />
            }
          </Col>
        </Row>
      </EditCard>
    );
  }
}
