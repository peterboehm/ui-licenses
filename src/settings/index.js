import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';

import {
  TermsSettings,
  PickListSettings,
  PickListValueSettings,
} from './pages';

export default class LicenseSettings extends React.Component {
  sections = [
    {
      label: <FormattedMessage id="ui-licenses.settings.general" />,
      pages: [
        {
          component: TermsSettings,
          label: <FormattedMessage id="ui-licenses.section.terms" />,
          perm: 'settings.licenses.enabled',
          route: 'terms',
        }
      ]
    },
    {
      label: <FormattedMessage id="ui-licenses.settings.termPickList" />,
      pages: [
        {
          component: PickListSettings,
          label: <FormattedMessage id="ui-licenses.settings.pickLists" />,
          perm: 'settings.licenses.enabled',
          route: 'pick-lists',
        },
        {
          component: PickListValueSettings,
          label: <FormattedMessage id="ui-licenses.settings.pickListValues" />,
          perm: 'settings.licenses.enabled',
          route: 'pick-list-values',
        },
      ]
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
