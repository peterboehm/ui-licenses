import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Col, Headline, KeyValue, Row } from '@folio/stripes/components';

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
            <div data-test-license-name>
              <Headline
                size="xx-large"
                tag="h2"
              >
                {license.name}
              </Headline>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label={<FormattedMessage id="ui-licenses.prop.description" />}>
              <div data-test-license-description style={{ whiteSpace: 'pre-wrap' }}>
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
