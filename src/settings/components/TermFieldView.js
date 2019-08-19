import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { Card, Col, Row, KeyValue, Button } from '@folio/stripes/components';

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

  render() {
    const { input: { name, value } } = this.props;

    return (
      <Card
        headerStart={<strong>Term</strong>}
        headerEnd={this.props.actionButtons}
      >
        <Row>
          <Col xs={6}>
            <KeyValue
              label="Label"
              value={value.label}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label="Name"
              value={value.name}
            />
          </Col>
        </Row>
        <KeyValue
          label="Description"
          value={value.description}
        />
        <Row>
          <Col xs={4}>
            <KeyValue
              label="Order weight"
              value={value.weight}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              dataOptions={[
                { label: 'Yes', value: 'true' },
                { label: 'No', value: 'false' },
              ]}
              label="Primary term"
              value={value.primary ? 'Yes' : 'No'}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label="Default visibility"
              value={value.defaultInternal ? 'Internal' : 'Public'}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label="Type"
              value={value.type}
            />
          </Col>
          <Col xs={6}>
            { value.type === 'Refdata' &&
              <KeyValue
                label="Pick list"
                value={name.category}
              />
            }
          </Col>
        </Row>
      </Card>
    );
  }
}
