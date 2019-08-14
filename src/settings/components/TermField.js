import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { Button, Layout, TextArea, TextField } from '@folio/stripes/components';
import { EditCard } from '@folio/stripes-erm-components';

export default class TermField extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
    term: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }

  render() {
    const { name, onDelete, term } = this.props;

    return (
      <EditCard
        header={term.id ? 'Edit license term' : 'New license term'}
        onDelete={onDelete}
      >
        <Field
          component={TextField}
          label="Label"
          name={`${name}.label`}
          required
        />
        <Field
          component={TextArea}
          label="Description"
          name={`${name}.description`}
          required
        />
      </EditCard>
    );
  }
}
