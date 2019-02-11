import React from 'react';
import PropTypes from 'prop-types';
import { Pluggable } from '@folio/stripes/core';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

class LicenseInfo extends React.Component {
  static propTypes = {
    license: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  onSetParentLicense(license) {
    this.props.license.parent = { id : license.id, name: license.name };
  }


  render() {
    const { license } = this.props;

    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-licenses.section.licenseInformation" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-licenses.prop.name" />}
              value={license.name}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label={<FormattedMessage id="ui-licenses.prop.parentLicense" />}>
              <Pluggable
                aria-haspopup="true"
                type="find-license"
                dataKey="license"
                searchLabel="+"
                searchButtonStyle="default"
                selectLicense={lic => this.onSetParentLicense(lic)}
                {...this.props}
              >
                <span>[no license-selection plugin]</span>
              </Pluggable>
              {' '}
              {(license.parent || {}).name}
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-licenses.prop.description" />}
              value={license.description}
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

export default LicenseInfo;
