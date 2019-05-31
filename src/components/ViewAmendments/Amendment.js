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

import {
  LicenseCard,
  LicenseEndDate,
} from '@folio/stripes-erm-components';

export default class Amendment extends React.Component {
  static propTypes = {
    amendment: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.shape({
        label: PropTypes.string.isRequired,
      }).isRequired,
    }),
    license: PropTypes.object,
  }

  render() {
    const { amendment, license } = this.props;

    return (
      <div>
        <LicenseCard
          license={license}
          renderName={false}
        />
        <Accordion
          id="amendment-info-accordion"
          label={<FormattedMessage id="ui-licenses.amendments.amendmentInfo" />}
        >
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
                  {amendment.startDate ? <FormattedDate value={amendment.startDate} /> : '-'}
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
        </Accordion>
      </div>
    );
  }
}
