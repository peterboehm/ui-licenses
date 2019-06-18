import React, { Component } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';

import { NoteEditPage } from '@folio/stripes/smart-components';

import { formatNoteReferrer, urls } from '../components/utils';

export default class NoteEditRoute extends Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        noteId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  goToNoteView = () => {
    const { history, location, match } = this.props;

    history.replace({
      pathname: urls.noteView(match.params.noteId),
      state: location.state,
    });
  }

  render() {
    const { location, match } = this.props;

    return (
      <NoteEditPage
        referredEntityData={formatNoteReferrer(location.state)}
        entityTypeTranslationKeys={{ license: 'ui-licenses.license' }}
        entityTypePluralizedTranslationKeys={{ license: 'ui-licenses.licensePlural' }}
        paneHeaderAppIcon="license"
        domain="licenses"
        navigateBack={this.goToNoteView}
        noteId={match.params.noteId}
      />
    );
  }
}
