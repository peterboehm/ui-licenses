import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Col, Headline, KeyValue, MultiColumnList, NoValue, Row } from '@folio/stripes/components';

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
                {license.description || <NoValue />}
              </div>
            </KeyValue>
          </Col>
        </Row>
        {license?.alternateNames?.length !== 0 &&
          <MultiColumnList
            columnMapping={{ name: <FormattedMessage id="ui-licenses.alternativeNames" /> }}
            contentData={license.alternateNames}
            visibleColumns={['name']}
          />
        }
      </div>
    );
  }
}

export default LicenseInfo;
