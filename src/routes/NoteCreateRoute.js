import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Redirect } from 'react-router-dom';

import { NoteCreatePage } from '@folio/stripes/smart-components';
import { formatNoteReferrer, urls } from '../components/utils';

export default class NoteCreateRoute extends Component {
  static propTypes = {
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
    location: ReactRouterPropTypes.location.isRequired,
  };

  renderCreatePage() {
    const { history } = this.props;

    return (
      <NoteCreatePage
        domain="licenses"
        entityTypeTranslationKeys={{ license: 'ui-licenses.license' }}
        navigateBack={history.goBack}
        paneHeaderAppIcon="licenses"
        referredEntityData={formatNoteReferrer(this.props.location.state)}
      />
    );
  }

  render() {
    const { location } = this.props;

    return location.state
      ? this.renderCreatePage()
      : <Redirect to={urls.licenses()} />;
  }
}
