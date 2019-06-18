import React, { Component } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';

import { NoteEditPage } from '@folio/stripes/smart-components';

import formatNoteReferrerEntityData from '../components/utils/formatNoteReferrer';

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
    const {
      match,
      history,
      location,
    } = this.props;

    const { noteId } = match.params;
    const noteViewUrl = `/licenses/notes/${noteId}`;

    history.replace({
      pathname: noteViewUrl,
      state: location.state,
    });
  }

  render() {
    const {
      location,
      match,
    } = this.props;

    const entityTypeTranslationKeys = {
      license: 'ui-licenses.notes.entityType.license',
    };

    const entityTypePluralizedTranslationKeys = {
      license: 'ui-licenses.notes.entityType.license.pluralized',
    };

    const { noteId } = match.params;

    const referredEntityData = formatNoteReferrerEntityData(location.state);

    return (
      <NoteEditPage
        referredEntityData={referredEntityData}
        entityTypeTranslationKeys={entityTypeTranslationKeys}
        entityTypePluralizedTranslationKeys={entityTypePluralizedTranslationKeys}
        paneHeaderAppIcon="license"
        domain="licenses"
        navigateBack={this.goToNoteView}
        noteId={noteId}
      />
    );
  }
}
