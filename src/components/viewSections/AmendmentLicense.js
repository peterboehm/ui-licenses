import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Headline } from '@folio/stripes/components';
import { LicenseCard } from '@folio/stripes-erm-components';

export default class AmendmentLicense extends React.Component {
  static propTypes = {
    license: PropTypes.object.isRequired,
  }

  render() {
    return (
      <React.Fragment>
        <Headline
          faded
          margin="none"
          size="large"
        >
          <FormattedMessage id="ui-licenses.section.licenseInformation" />
        </Headline>
        <LicenseCard license={this.props.license} />
      </React.Fragment>
    );
  }
}
