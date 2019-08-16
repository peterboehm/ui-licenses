import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { Field } from 'react-final-form';

import { Button, Layout } from '@folio/stripes/components';

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
    const { fields } = this.props;

    return (
      <div>
        <Layout end="sm">
          <Button onClick={this.handleNew}>
            New
          </Button>
        </Layout>
        {
          fields.map((name, i) => (
            <Field
              component={TermField}
              isEqual={isEqual}
              key={name}
              name={name}
              onDelete={() => this.handleDelete(i)}
              onSave={() => this.handleSave(i)}
            />
          ))
        }
      </div>
    );
  }
}
