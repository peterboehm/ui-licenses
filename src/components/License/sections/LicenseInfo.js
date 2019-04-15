import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedDate, FormattedMessage } from 'react-intl';
import {
  Accordion,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import LicenseOrganizations from './LicenseOrganizations';

class LicenseInfo extends React.Component {
  static propTypes = {
    license: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  renderEndDate(license) {
    if (license.openEnded) return <FormattedMessage id="ui-licenses.prop.openEnded" />;
    if (license.endDate) return <FormattedDate value={license.endDate} />;

    return '-';
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
        <React.Fragment>
          <Row>
            <Col xs={12}>
              <KeyValue label={<FormattedMessage id="ui-licenses.prop.name" />}>
                <div data-test-license-name>
                  {license.name}
                </div>
              </KeyValue>
            </Col>
          </Row>
          <Row>
            <Col xs={6} md={3}>
              <KeyValue label={<FormattedMessage id="ui-licenses.prop.type" />}>
                <div data-test-license-type>
                  {get(license, ['type', 'label'], '-')}
                </div>
              </KeyValue>
            </Col>
            <Col xs={6} md={3}>
              <KeyValue label={<FormattedMessage id="ui-licenses.prop.status" />}>
                <div data-test-license-status>
                  {get(license, ['status', 'label'], '-')}
                </div>
              </KeyValue>
            </Col>
            <Col xs={6} md={3}>
              <KeyValue label={<FormattedMessage id="ui-licenses.prop.startDate" />}>
                <div data-test-license-start-date>
                  {license.startDate ? <FormattedDate value={license.startDate} /> : '-'}
                </div>
              </KeyValue>
            </Col>
            <Col xs={6} md={3}>
              <KeyValue label={<FormattedMessage id="ui-licenses.prop.endDate" />}>
                <div data-test-license-end-date>
                  {this.renderEndDate(license)}
                </div>
              </KeyValue>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <KeyValue label={<FormattedMessage id="ui-licenses.prop.description" />}>
                <div data-test-license-description>
                  {license.description || '-'}
                </div>
              </KeyValue>
            </Col>
          </Row>
        </React.Fragment>
        <LicenseOrganizations license={this.props.license} />
      </Accordion>
    );
  }
}

export default LicenseInfo;
