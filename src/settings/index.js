import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';
//  import GeneralSettings from './general-settings';
import PickListSettings from './PickListSettings';
import PickListValueSettings from './PickListValueSettings';

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
