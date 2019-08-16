import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import TermsSettingsForm from '../components/TermsSettingsForm';

class TermsSettingsRoute extends React.Component {
  static manifest = Object.freeze({
    terms: {
      type: 'okapi',
      path: 'licenses/custprops',
    }
  });

  static propTypes = {
    resources: PropTypes.shape({
      terms: PropTypes.object,
    }),
    mutator: PropTypes.shape({
      terms: PropTypes.shape({
        DELETE: PropTypes.func.isRequired,
        POST: PropTypes.func.isRequired,
        PUT: PropTypes.func.isRequired,
      }),
    }),
  }

  state = {
    terms: [],
  }

  static getDerivedStateFromProps(props, state) {
    const newTerms = get(props, 'resources.terms.records', []);
    const oldTerms = state.terms;

    if (newTerms.length !== oldTerms.length) {
      return {
        terms: newTerms.map(term => ({
          ...term,
          category: term.category ? term.category.id : undefined,
        })),
      };
    }

    return null;
  }

  handleDelete = (term) => {
    this.props.mutator.terms.DELETE(term)
      .then(response => {
        console.log(response);
      });
  }

  handleSave = (term) => {
    const { id } = term;
    const mutator = id ? this.props.mutator.terms.PUT : this.props.mutator.terms.POST;

    mutator(term, { pk: term.id })
      .then(response => {
        console.log(response);
      });
  }

  handleSubmit = ({ terms }) => {
    console.log(terms);
  }

  render() {
    const { terms } = this.state;

    return (
      <TermsSettingsForm
        initialValues={{ terms }}
        onSubmit={this.handleSubmit}
        onDelete={this.handleDelete}
        onSave={this.handleSave}
        terms={terms}
      />
    );
  }
}

export default stripesConnect(TermsSettingsRoute);
