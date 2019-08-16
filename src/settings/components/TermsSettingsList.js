import React from 'react';
import PropTypes from 'prop-types';

import { Button, Layout } from '@folio/stripes/components';

import TermField from './TermField';

export default class TermsSettingsList extends React.Component {
  static propTypes = {
    fields: PropTypes.shape({
      unshift: PropTypes.func.isRequired,
      update: PropTypes.func.isRequired,
      value: PropTypes.array.isRequired,
    }).isRequired,
  }

  defaultTermValue = {
    weight: 0,
    primary: false,
    defaultInternal: true,
  }

  render() {
    const { fields } = this.props;

    return (
      <div>
        <Layout end="sm">
          <Button
            onClick={() => fields.unshift(this.defaultTermValue)}
          >
            New
          </Button>
          {
            fields.value.map((term, i) => (
              !term._delete &&
                <TermField
                  key={i}
                  name={`terms[${i}]`}
                  onDelete={() => fields.update(i, { id: term.id, _delete: true })}
                  term={term}
                />
            ))
          }
        </Layout>
      </div>
    );
  }
}
