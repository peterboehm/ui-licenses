import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { Field } from 'react-final-form';

import { Button, Col, Row } from '@folio/stripes/components';

import TermField from './TermField';

export default class TermsSettingsList extends React.Component {
  static propTypes = {
    fields: PropTypes.shape({
      unshift: PropTypes.func.isRequired,
      value: PropTypes.array.isRequired,
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  }

  defaultTermValue = {
    weight: 0,
    primary: false,
    defaultInternal: true,
  }

  handleDelete = (index) => {
    const { fields, onDelete } = this.props;
    const term = fields.value[index];

    if (term.id) {
      onDelete(term);
    } else {
      fields.remove(index);
    }
  }

  handleNew = () => {
    this.props.fields.unshift(this.defaultTermValue);
  }

  handleSave = (index) => {
    const term = this.props.fields.value[index];

    this.props.onSave(term);
  }

  render() {
    const { fields, mutators } = this.props;

    return (
      <div>
        <Row end="sm">
          <Col>
            <Button onClick={this.handleNew}>
              New
            </Button>
          </Col>
        </Row>
        {
          fields.value.map((term, i) => (
            <Field
              component={TermField}
              isEqual={isEqual}
              key={term.id || i}
              mutators={mutators}
              name={`${fields.name}[${i}]`}
              onDelete={() => this.handleDelete(i)}
              onSave={() => this.handleSave(i)}
            />
          ))
        }
      </div>
    );
  }
}
