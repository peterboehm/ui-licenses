import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedDate, FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  Icon,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import css from './LicenseHeader.css';

export default class LicenseHeader extends React.Component {
  static propTypes = {
    license: PropTypes.shape({
      orgs: PropTypes.arrayOf(
        PropTypes.shape({
          org: PropTypes.shape({
            name: PropTypes.string,
          }),
          role: PropTypes.shape({
            value: PropTypes.string,
          }),
        }),
      ),
    }),
  }

  static defaultProps = {
    license: {},
  }

  renderLicensor = () => {
    const { license: { orgs = [] } } = this.props;
    const licensor = orgs.find(o => get(o, ['role', 'value']) === 'licensor');
    const licensorName = get(licensor, ['org', 'name']) || <FormattedMessage id="ui-licenses.notSet" />;

    return licensorName;
  }

  renderEndDate() {
    const { license } = this.props;
    if (license.openEnded) return <FormattedMessage id="ui-licenses.prop.openEnded" />;
    if (license.endDate) return <FormattedDate value={license.endDate} />;

    return '-';
  }

  render() {
    const { license } = this.props;

    return (
      <Row className={css.licenseHeader}>
        <Col xs={2}>
          <KeyValue label={<FormattedMessage id="ui-licenses.prop.type" />}>
            <div data-test-header-type>
              {get(license, ['type', 'label'], '-')}
            </div>
          </KeyValue>
        </Col>
        <Col xs={2}>
          <KeyValue label={<FormattedMessage id="ui-licenses.prop.status" />}>
            <div data-test-header-status>
              {get(license, ['status', 'label'], '-')}
            </div>
          </KeyValue>
        </Col>
        <Col xs={2}>
          <KeyValue label={<FormattedMessage id="ui-licenses.prop.startDate" />}>
            <div data-test-header-start-date>
              {license.startDate ? <FormattedDate value={license.startDate} /> : '-'}
            </div>
          </KeyValue>
        </Col>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-licenses.prop.endDate" />}>
            <div data-test-header-end-date>
              {this.renderEndDate()}
            </div>
          </KeyValue>
        </Col>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-licenses.header.licensor" />}>
            <div data-test-header-licensor-name>{this.renderLicensor()}</div>
          </KeyValue>
        </Col>
      </Row>
    );
  }
}
