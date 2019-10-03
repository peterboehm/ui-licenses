import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';

import {
  TermsConfigRoute,
  PickListSettings,
  PickListValueSettings,
} from './routes';

export default class LicenseSettings extends React.Component {
  sections = [
    {
      label: <FormattedMessage id="ui-licenses.settings.general" />,
      pages: [
        {
          component: TermsConfigRoute,
          label: <FormattedMessage id="ui-licenses.section.terms" />,
          perm: 'ui-licenses.terms.manage',
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
          perm: 'ui-licenses.picklists.manage',
          route: 'pick-lists',
        },
        {
          component: PickListValueSettings,
          label: <FormattedMessage id="ui-licenses.settings.pickListValues" />,
          perm: 'ui-licenses.picklists.manage',
          route: 'pick-list-values',
        },
      ]
    }
  ]

  render() {
    return (
      <Settings
        {...this.props}
        navPaneWidth="20%"
        paneTitle={<FormattedMessage id="ui-licenses.meta.title" />}
        sections={this.sections}
      />
    );
  }
}
