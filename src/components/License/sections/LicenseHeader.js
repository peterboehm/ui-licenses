import React from 'react';
import PropTypes from 'prop-types';
import { LicenseCard } from '@folio/stripes-erm-components';

import css from './LicenseHeader.css';

export default class LicenseHeader extends React.Component {
  static propTypes = {
    license: PropTypes.object,
  }

  static defaultProps = {
    license: {},
  }

  render() {
    return (
      <LicenseCard
        className={css.licenseHeader}
        license={this.props.license}
        renderName={false}
      />
    );
  }
}
