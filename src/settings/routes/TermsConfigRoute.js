import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import TermsConfigForm from '../components/TermsConfig/TermsConfigForm';

class TermsConfigRoute extends React.Component {
  static manifest = Object.freeze({
    terms: {
      type: 'okapi',
      path: 'licenses/custprops',
      clientGeneratePk: false,
      params: {
        sort: 'id;desc'
      }
    },
    pickLists: {
      type: 'okapi',
      path: 'licenses/refdata',
      params: {
        perPage: '100',
        sort: 'desc;asc',
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
    pickLists: [],
    terms: [],
  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};

    const terms = get(props, 'resources.terms'); // can't use default value bc of `null`
    if (terms && terms.hasLoaded && terms.loadedAt > state.loadedAt) {
      newState.loadedAt = terms.loadedAt;
      newState.terms = terms.records.map(term => ({
        ...term,
        category: term.category ? term.category.id : undefined,
      }));
    }

    const pickLists = get(props, 'resources.pickLists.records', []);
    if (pickLists.length !== state.pickLists.length) {
      newState.pickLists = pickLists.map(p => ({
        label: p.desc,
        value: p.id,
      }));
    }

    return Object.keys(newState).length ? newState : null;
  }

  handleDelete = (term) => {
    return this.props.mutator.terms.DELETE(term)
      .then(response => {
        console.log(response);
      });
  }

  handleSave = (term) => {
    const mutator = this.props.mutator.terms;

    const promise = term.id ?
      mutator.PUT(term, { pk: term.id }) :
      mutator.POST(term);

    return promise.then(response => {
      console.log(response);
    });
  }

  render() {
    const { pickLists, terms } = this.state;

    return (
      <TermsConfigForm
        initialValues={{ terms }}
        pickLists={pickLists}
        onDelete={this.handleDelete}
        onSave={this.handleSave}
        onSubmit={this.handleSave}
      />
    );
  }
}

export default stripesConnect(TermsConfigRoute);
