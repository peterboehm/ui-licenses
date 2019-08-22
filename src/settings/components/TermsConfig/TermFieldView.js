import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { Card, Col, Row, KeyValue } from '@folio/stripes/components';

const TYPE_CLASS_PREFIX = 'com.k_int.web.toolkit.custprops.types.CustomProperty';
const REFDATA_CLASS_NAME = 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata';

export default class TermFieldView extends React.Component {
  static propTypes = {
    actionButtons: PropTypes.node.isRequired,
    input: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.shape({
        id: PropTypes.string,
        type: PropTypes.string,
      }).isRequired,
    }).isRequired,
    meta: PropTypes.shape({
      invalid: PropTypes.bool,
      pristine: PropTypes.bool,
      submitting: PropTypes.bool,
    }),
    pickLists: PropTypes.arrayOf(PropTypes.object),
  }

  renderType = () => {
    const type = this.props.input.value.type.split(TYPE_CLASS_PREFIX)[1].toLowerCase();
    const translationKey = `ui-licenses.settings.terms.type.${type}`;
    return <FormattedMessage id={translationKey} />;
  }

  renderPickList = () => {
    const pickList = this.props.pickLists.find(p => p.value === get(this.props, 'input.value.category'));

    return pickList ? pickList.label : '-';
  }

  render() {
    const { input: { name, value } } = this.props;

    return (
      <Card
        data-test-term-name={name}
        headerStart={<strong><FormattedMessage id="ui-licenses.terms.term" /></strong>}
        headerEnd={this.props.actionButtons}
      >
        <Row>
          <Col xs={6}>
            <KeyValue
              data-test-term-label
              label={<FormattedMessage id="ui-licenses.settings.terms.term.label" />}
              value={value.label}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              data-test-term-name
              label={<FormattedMessage id="ui-licenses.settings.terms.term.name" />}
              value={value.name}
            />
          </Col>
        </Row>
        <KeyValue
          data-test-term-description
          label={<FormattedMessage id="ui-licenses.settings.terms.term.description" />}
          value={value.description}
        />
        <Row>
          <Col xs={4}>
            <KeyValue
              data-test-term-weight
              label={<FormattedMessage id="ui-licenses.settings.terms.term.orderWeight" />}
              value={value.weight}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              data-test-term-primary
              label={<FormattedMessage id="ui-licenses.settings.terms.term.primaryTerm" />}
              value={<FormattedMessage id={value.primary ? 'ui-licenses.yes' : 'ui-licenses.no'} />}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              data-test-term-defaultinternal
              label={<FormattedMessage id="ui-licenses.settings.terms.term.defaultVisibility" />}
              value={<FormattedMessage id={value.defaultInternal ? 'ui-licenses.term.internalTrue' : 'ui-licenses.term.internalFalse'} />}
            />
          </Col>
          <Col xs={6}>
            { value.type && value.type.indexOf(TYPE_CLASS_PREFIX) === 0 &&
              <KeyValue
                data-test-term-type
                label={<FormattedMessage id="ui-licenses.settings.terms.term.type" />}
                value={this.renderType()}
              />
            }
          </Col>
          <Col xs={6}>
            { value.type === REFDATA_CLASS_NAME &&
              <KeyValue
                data-test-term-picklist
                label={<FormattedMessage id="ui-licenses.settings.terms.term.pickList" />}
                value={this.renderPickList()}
              />
            }
          </Col>
        </Row>
      </Card>
    );
  }
}
