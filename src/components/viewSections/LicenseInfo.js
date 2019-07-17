import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Col, KeyValue, Row } from '@folio/stripes/components';
import { LicenseEndDate } from '@folio/stripes-erm-components';

class LicenseInfo extends React.Component {
  static propTypes = {
    license: PropTypes.object,
    id: PropTypes.string,
  };

  render() {
    const { id, license } = this.props;

    return (
      <div id={id}>
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
                {get(license, 'type.label', '-')}
              </div>
            </KeyValue>
          </Col>
          <Col xs={6} md={3}>
            <KeyValue label={<FormattedMessage id="ui-licenses.prop.status" />}>
              <div data-test-license-status>
                {get(license, 'status.label', '-')}
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
                <LicenseEndDate license={license} />
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
      </div>
    );
  }
}

export default LicenseInfo;
