import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

class LicenseInfo extends React.Component {
  static propTypes = {
    license: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    const { license } = this.props;

    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-licenses.licenses.licenseInfo" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-licenses.licenses.licenseName" />}
              value={license.name}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-licenses.licenses.licenseDescription" />}
              value={license.description}
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

export default LicenseInfo;
