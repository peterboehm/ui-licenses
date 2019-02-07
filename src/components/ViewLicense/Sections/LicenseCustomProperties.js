import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion, Col, Layout, Row } from '@folio/stripes/components';

export default class LicenseCustomProperties extends React.Component {
  static propTypes = {
    license: PropTypes.shape({ customProperties: PropTypes.object }),
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  renderPropertyName = (propName) => {
    const afterLowercase = /([a-z])([A-Z])/gm;
    const afterCapsBeforeLowercase = /([A-Z])([A-Z])([a-z])/gm;

    let formattedName = propName
      .replace(afterLowercase, '$1 $2')
      .replace(afterCapsBeforeLowercase, '$1 $2$3')
      .replace('_', ' ');
    let testSonar = 0;

    formattedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);

    return (
      <Col xs={12} md={4}>
        <strong>{formattedName}</strong>
      </Col>
    );
  }

  renderPropertyValues = (propValues) => {
    return propValues.map((entry, index) => (
      <Col key={index} xs={12} md={8} mdOffset={(index > 0 ? 4 : undefined)}>
        {entry.type.endsWith('CustomPropertyRefdata') ? entry.value.value : entry.value }
      </Col>
    ));
  }

  renderProperties = () => {
    return Object.entries(this.props.license.customProperties)
      .map(([propName, propValues], index) => (
        <Layout className="padding-top-gutter" key={index}>
          <Row>
            {this.renderPropertyName(propName)}
            {this.renderPropertyValues(propValues)}
          </Row>
        </Layout>
      ));
  }

  render() {
    const { id, license, onToggle, open } = this.props;
    if (!license.customProperties || Object.keys(license.customProperties).length === 0) return null;

    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-licenses.licenses.customProperties" />}
        open={open}
        onToggle={onToggle}
      >
        {this.renderProperties(license.customProperties)}
      </Accordion>
    );
  }
}
