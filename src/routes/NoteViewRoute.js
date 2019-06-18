import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { NoteViewPage } from '@folio/stripes/smart-components';

import { formatNoteReferrer, urls } from '../components/utils';

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
    const { history, location, match } = this.props;

    history.replace({
      pathname: urls.noteEdit(match.params.noteId),
      state: location.state,
    });
  };

  navigateBack = () => {
    const { history, location } = this.props;

    if (location.state) {
      history.goBack();
    } else {
      history.push({
        pathname: urls.licenses(),
      });
    }
  };

  render() {
    const { location, match } = this.props;

    return (
      <NoteViewPage
        entityTypeTranslationKeys={{ license: 'ui-licenses.license' }}
        entityTypePluralizedTranslationKeys={{ license: 'ui-licenses.licensePlural' }}
        navigateBack={this.navigateBack}
        onEdit={this.onEdit}
        paneHeaderAppIcon="license"
        referredEntityData={formatNoteReferrer(location.state)}
        noteId={match.params.noteId}
      />
    );
  }
}

export default NoteViewRoute;
