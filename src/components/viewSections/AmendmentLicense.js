import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  Col,
  FormattedUTCDate,
  Headline,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

import { LicenseEndDate } from '@folio/stripes-erm-components';

export default class AmendmentLicense extends React.Component {
  static propTypes = {
    license: PropTypes.object.isRequired,
    urls: PropTypes.shape({
      licenseView: PropTypes.func.isRequired,
    }),
  }

  renderLicensor = () => {
    const { license: { orgs = [] } } = this.props;
    const licensor = orgs.find(o => o?.role?.value === 'licensor');
    const licensorName = licensor?.org?.name || <FormattedMessage id="ui-licenses.prop.licensor.notSet" />;

    return licensorName;
  }

  render() {
    const { license, urls } = this.props;
    return (
      <>
        <Row>
          <Col xs={12}>
            <KeyValue label={
              <Headline
                size="medium"
                tag="h3"
              >
                <FormattedMessage id="ui-licenses.prop.parentLicense" />
              </Headline>
            }
            >
              <div data-test-amendment-license-parent-license>
                <Link to={urls.licenseView(license.id)}>
                  {license?.name ?? <NoValue />}
                </Link>
              </div>
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col md={3} xs={6}>
            <KeyValue label={<FormattedMessage id="ui-licenses.prop.status" />}>
              <div data-test-amendment-license-status>
                {license?.status?.label ?? <NoValue />}
              </div>
            </KeyValue>
          </Col>
          <Col md={3} xs={6}>
            <KeyValue label={<FormattedMessage id="ui-licenses.prop.startDate" />}>
              <div data-test-amendment-license-start-date>
                {license.startDate ? <FormattedUTCDate value={license.startDate} /> : <NoValue />}
              </div>
            </KeyValue>
          </Col>
          <Col md={3} xs={6}>
            <KeyValue label={<FormattedMessage id="ui-licenses.prop.endDate" />}>
              <div data-test-amendment-license-end-date>
                <LicenseEndDate license={license} />
              </div>
            </KeyValue>
          </Col>
          <Col md={3} xs={6}>
            <KeyValue label={<FormattedMessage id="ui-licenses.amendments.view.license.licensor" />}>
              <div data-test-amendment-license-licensor-name>
                {this.renderLicensor()}
              </div>
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label={<FormattedMessage id="ui-licenses.prop.description" />}>
              <div data-test-amendment-license-description>
                {license.description || <NoValue />}
              </div>
            </KeyValue>
          </Col>
        </Row>
      </>
    );
  }
}
