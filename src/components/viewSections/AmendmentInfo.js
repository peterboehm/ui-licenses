import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  FormattedUTCDate,
  Headline,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

import { LicenseEndDate } from '@folio/stripes-erm-components';

export default class AmendmentInfo extends React.Component {
  static propTypes = {
    amendment: PropTypes.shape({
      description: PropTypes.string,
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
        <Row>
          <Col xs={12}>
            <div data-test-amendment-name>
              <Headline
                size="xx-large"
                tag="h2"
              >
                {amendment.name}
              </Headline>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={3} xs={6}>
            <KeyValue label={<FormattedMessage id="ui-licenses.amendments.view.status" />}>
              <div data-test-amendment-status>
                {amendment?.status?.label ?? <NoValue />}
              </div>
            </KeyValue>
          </Col>
          <Col md={3} xs={6}>
            <KeyValue label={<FormattedMessage id="ui-licenses.amendments.view.startDate" />}>
              <div data-test-amendment-start-date>
                {amendment.startDate ? <FormattedUTCDate value={amendment.startDate} /> : <NoValue />}
              </div>
            </KeyValue>
          </Col>
          <Col md={3} xs={6}>
            <KeyValue label={<FormattedMessage id="ui-licenses.amendments.view.endDate" />}>
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
                {amendment.description || <NoValue />}
              </div>
            </KeyValue>
          </Col>
        </Row>
      </div>
    );
  }
}
