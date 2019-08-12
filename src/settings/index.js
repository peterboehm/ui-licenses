import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';
//  import GeneralSettings from './general-settings';
import PickListSettings from './pick-list-settings';
import PickListValueSettings from './pick-list-value-settings';

/*
  STRIPES-NEW-APP
  Your app's settings pages are defined here.
  The pages "general" and "some feature" are examples. Name them however you like.
*/

export default class LicensesSettings extends React.Component {
  constructor(props) {
    super(props);

    this.sections = [
      {
        label: <FormattedMessage id="ui-licenses.settings.pickListSetup" />,
        pages: [
          {
            route: 'PickLists',
            label: <FormattedMessage id="ui-licenses.settings.pickLists" />,
            component: PickListSettings,
            //  perm
          },
          {
            route: 'PickListValues',
            label: <FormattedMessage id="ui-licenses.settings.pickListValues" />,
            component: PickListValueSettings,
            //  perm:
          },
        ]
      }
    ];
  }

  render() {
    return (
      <Settings
        {...this.props}
        sections={this.sections}
        paneTitle={<FormattedMessage id="ui-licenses.licenses.label" />}
      />
    );
  }
}
