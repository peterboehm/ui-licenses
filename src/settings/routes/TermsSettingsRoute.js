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
      clientGeneratePk: false,
      params: {
        sort: 'id;desc'
      }
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
    // loadedAt is used in gDSFP to determine whether to reinit form values
    loadedAt: new Date(), // eslint-disable-line react/no-unused-state
    terms: [],
  }

  static getDerivedStateFromProps(props, state) {
    const resource = get(props, 'resources.terms'); // can't use default value bc of `null`
    if (resource && resource.hasLoaded && resource.loadedAt > state.loadedAt) {
      return {
        loadedAt: resource.loadedAt,
        terms: resource.records.map(term => ({
          ...term,
          category: term.category ? term.category.id : undefined,
          type: term.type.split('com.k_int.web.toolkit.custprops.types.CustomProperty')[1],
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
    const mutator = this.props.mutator.terms;

    const promise = term.id ?
      mutator.PUT(term, { pk: term.id }) :
      mutator.POST(term);

    promise.then(response => {
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
        onDelete={this.handleDelete}
        onSave={this.handleSave}
        onSubmit={this.handleSave}
        terms={terms}
      />
    );
  }
}

export default stripesConnect(TermsSettingsRoute);
