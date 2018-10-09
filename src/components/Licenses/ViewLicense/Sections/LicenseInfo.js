import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  Accordion,
  AccordionSet,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import css from './LicenseInfo.css';

class LicenseInfo extends React.Component {

  static propTypes = {
    license: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    stripes: PropTypes.object,
  };

  state = {
    sections: {
      internalContacts: false,
      contentReviews: false,
      trials: false,
      reviewHistory: false,
    }
  }

  handleSectionToggle = ({ id }) => {
    this.setState((prevState) => ({
      sections: {
        ...prevState.sections,
        [id]: !prevState.sections[id],
      }
    }));
  }

  render() {
    const { license, stripes: { intl } } = this.props;

    return (
      <Accordion
        id={this.props.id}
        label={intl.formatMessage({ id: 'ui-licenses.licenses.licenseInfo' })}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={12}>
            <KeyValue
              label={intl.formatMessage({ id: 'ui-licenses.licenses.licenseName' })}
              value={license.name}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={intl.formatMessage({ id: 'ui-licenses.licenses.licenseDescription' })}
              value={license.description}
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

export default LicenseInfo;
