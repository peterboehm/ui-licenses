import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';

import {
  TermsSettingsRoute,
} from './routes';
//  import GeneralSettings from './general-settings';
import PickListSettings from './PickListSettings';
import PickListValueSettings from './PickListValueSettings';

export default class LicenseSettings extends React.Component {

  sections = [
    {
      label: <FormattedMessage id="ui-licenses.settings.general" />,
      pages: [
        {
          component: TermsSettingsRoute,
          label: <FormattedMessage id="ui-licenses.section.terms" />,
          perm: 'settings.licenses.enabled',
          route: 'terms',
        }
      ]
    },
    {
      label: <FormattedMessage id="ui-licenses.settings.termPickList" />,
      pages: []
    }
  ]

  render() {
    return (
      <Settings
        {...this.props}
        paneTitle={<FormattedMessage id="ui-licenses.meta.title" />}
        sections={this.sections}
      />
    );
  }
}
