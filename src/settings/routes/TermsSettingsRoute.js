import React from 'react';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import TermsSettingsForm from '../components/TermsSettingsForm';

class TermsSettings extends React.Component {
  static manifest = Object.freeze({
    terms: {
      type: 'okapi',
      path: 'licenses/custprops',
    }
  });

  handleSave = (data) => {
    const { terms } = data;
    console.log(terms);
  }

  render() {
    const terms = get(this.props, 'resources.terms.records', []);

    return (
      <TermsSettingsForm
        initialValues={{ terms }}
        onSubmit={this.handleSave}
      />
    );
  }
}

export default stripesConnect(TermsSettings);
