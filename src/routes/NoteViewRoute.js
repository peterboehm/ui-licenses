import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { NoteViewPage } from '@folio/stripes/smart-components';

import formatNoteReferrerEntityData from '../components/utilities';

class NoteViewRoute extends Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        noteId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  onEdit = () => {
    const {
      history,
      location,
      match,
    } = this.props;

    history.replace({
      pathname: `/licenses/notes/${match.params.noteId}/edit/`,
      state: location.state,
    });
  };

  navigateBack = () => {
    const {
      history,
      location,
    } = this.props;

    if (location.state) {
      history.goBack();
    } else {
      history.push({
        pathname: '/licenses',
      });
    }
  };

  render() {
    const {
      match,
      location,
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
      <NoteViewPage
        entityTypeTranslationKeys={entityTypeTranslationKeys}
        entityTypePluralizedTranslationKeys={entityTypePluralizedTranslationKeys}
        navigateBack={this.navigateBack}
        onEdit={this.onEdit}
        paneHeaderAppIcon="license"
        referredEntityData={referredEntityData}
        noteId={noteId}
      />
    );
  }
}

export default NoteViewRoute;
