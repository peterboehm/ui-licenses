import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  FormattedUTCDate,
  Headline,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import { LicenseEndDate } from '@folio/stripes-erm-components';

export default class AmendmentInfo extends React.Component {
  static propTypes = {
    amendment: PropTypes.shape({
      endDate: PropTypes.string,
      id: PropTypes.string,
      name: PropTypes.string,
      startDate: PropTypes.string,
      status: PropTypes.shape({
        label: PropTypes.string,
      }),
    }).isRequired,
  }

  render() {
    const { amendment } = this.props;
    return (
      <div id="amendment-info">
        <Headline
          faded
          margin="none"
          size="large"
        >
          <FormattedMessage id="ui-licenses.amendments.amendmentInfo" />
        </Headline>
        <Row>
          <Col xs={12}>
            <KeyValue label={<FormattedMessage id="ui-licenses.prop.name" />}>
              <div data-test-amendment-name>
                {amendment.name || amendment.id}
              </div>
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col xs={6} md={3}>
            <KeyValue label={<FormattedMessage id="ui-licenses.prop.status" />}>
              <div data-test-amendment-status>
                {get(amendment, ['status', 'label'], '-')}
              </div>
            </KeyValue>
          </Col>
          <Col xs={6} md={3}>
            <KeyValue label={<FormattedMessage id="ui-licenses.prop.startDate" />}>
              <div data-test-amendment-start-date>
                {amendment.startDate ? <FormattedUTCDate value={amendment.startDate} /> : '-'}
              </div>
            </KeyValue>
          </Col>
          <Col xs={6} md={3}>
            <KeyValue label={<FormattedMessage id="ui-licenses.prop.endDate" />}>
              <div data-test-amendment-end-date>
                <LicenseEndDate license={amendment} />
              </div>
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label={<FormattedMessage id="ui-licenses.prop.description" />}>
              <div data-test-amendment-description>
                {amendment.description || '-'}
              </div>
            </KeyValue>
          </Col>
        </Row>
      </div>
    );
  }
}
