import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

class LicenseCustomProperties extends React.Component {
  static camelCaseSplit = /([A-Z])(?![A-Z])/gm;
  
  customProperties ( license ) {
    const cp = license['customProperties']
    console.log (cp)
    console.log (cp.walkInAccess)
    
    return <div>{propertyList}</div>;
    
  }

  render() {
    const { license } = this.props;

    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-licenses.licenses.customProperties" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        { this.customProperties(license) }
      </Accordion>
    );
  }
}

export default LicenseCustomProperties;
