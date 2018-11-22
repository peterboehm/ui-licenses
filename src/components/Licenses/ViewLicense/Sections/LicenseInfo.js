import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
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
    console.log("onSetParentLicense(%o)",license);
    this.props.license.parent = { id : license.id, name: license.name }
  }


  render() {
    const { license } = this.props;

    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-licenses.licenses.licenseInfo" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-licenses.licenses.licenseName" />}
              value={license.name}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
	    <KeyValue label={<FormattedMessage id="ui-licenses.licenses.parentLicense" />}>
  	      <Pluggable
                aria-haspopup="true"
                type="find-license"
                dataKey="license"
                searchLabel="+"
                searchButtonStyle="default"
                selectLicense={license => this.onSetParentLicense(license)}
                {...this.props}
              >
                <span>[no license-selection plugin]</span>
              </Pluggable> {(license.parent || {}).name}
	    </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-licenses.licenses.licenseDescription" />}
              value={license.description}
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

export default LicenseInfo;
