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

    return (
      <Col xs={3}>
        <KeyValue label={<FormattedMessage id="ui-licenses.header.licensor" />}>
          <div data-test-licensor-name>{licensorName}</div>
        </KeyValue>
      </Col>
    );
  }

  render() {
    const { license: { startDate, endDate, openEnded } } = this.props;

    return (
      <Row className={css.licenseHeader}>
        { this.renderLicensor()}
      </Row>
    );
  }
}
