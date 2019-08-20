import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { Card, Col, Row, KeyValue } from '@folio/stripes/components';

const TYPE_CLASS_PREFIX = 'com.k_int.web.toolkit.custprops.types.CustomProperty';

export default class TermFieldView extends React.Component {
  static propTypes = {
    actionButtons: PropTypes.node.isRequired,
    input: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    meta: PropTypes.shape({
      invalid: PropTypes.bool,
      pristine: PropTypes.bool,
      submitting: PropTypes.bool,
    })
  }

  render() {
    const { input: { value } } = this.props;

    return (
      <Card
        headerStart={<strong><FormattedMessage id="ui-licenses.terms.term" /></strong>}
        headerEnd={this.props.actionButtons}
      >
        <Row>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-licenses.settings.terms.term.label" />}
              value={value.label}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-licenses.settings.terms.term.name" />}
              value={value.name}
            />
          </Col>
        </Row>
        <KeyValue
          label={<FormattedMessage id="ui-licenses.settings.terms.term.description" />}
          value={value.description}
        />
        <Row>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-licenses.settings.terms.term.orderWeight" />}
              value={value.weight}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-licenses.settings.terms.term.primaryTerm" />}
              value={<FormattedMessage id={value.primary ? 'ui-licenses.yes' : 'ui-licenses.no'} />}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-licenses.settings.terms.term.defaultVisibility" />}
              value={<FormattedMessage id={value.defaultInternal ? 'ui-licenses.term.internalTrue' : 'ui-licenses.term.internalFalse'} />}
            />
          </Col>
          <Col xs={6}>
            { value.type && value.type.indexOf(TYPE_CLASS_PREFIX) === 0 &&
              <KeyValue
                label={<FormattedMessage id="ui-licenses.settings.terms.term.type" />}
                value={value.type.split(TYPE_CLASS_PREFIX)[1]}
              />
            }
          </Col>
          <Col xs={6}>
            { value.type === `${TYPE_CLASS_PREFIX}Refdata` &&
              <KeyValue
                label={<FormattedMessage id="ui-licenses.settings.terms.term.pickList" />}
                value={get(value, 'category.desc', '-')}
              />
            }
          </Col>
        </Row>
      </Card>
    );
  }
}
