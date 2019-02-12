import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { Field } from 'redux-form';

import {
  Accordion,
  AccordionSet,
  Checkbox,
  Col,
  Datepicker,
  Row,
  Select,
  TextArea,
  TextField,
} from '@folio/stripes/components';

class LicenseFormInfo extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    parentMutator: PropTypes.object,
    parentResources: PropTypes.shape({
      statusValues: PropTypes.object,
      typeValues: PropTypes.object,
      endDateSemanticsValues: PropTypes.object,
    }),
  };

  getStatusValues() {
    return get(this.props.parentResources.statusValues, ['records'], [])
      .map(({ id, label }) => ({ label, value: id }));
  }

  getTypeValues() {
    return get(this.props.parentResources.typeValues, ['records'], [])
      .map(({ id, label }) => ({ label, value: id }));
  }

  getEndDateOpenEnded() {
    return get(this.props.parentResources.endDateSemanticsValues, ['records'], [])
      .find(v => v.value === 'open_ended') || {};
  }

  getSectionProps() {
    return {
      parentMutator: this.props.parentMutator,
      parentResources: this.props.parentResources,
    };
  }

  render() {
    const sectionProps = this.getSectionProps();

    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-agreements.agreements.agreementInfo" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={12}>
            <FormattedMessage id="ui-licenses.placeholder.licenseName">
              {placeholder => (
                <Field
                  id="edit-license-name"
                  name="name"
                  label={<FormattedMessage id="ui-licenses.prop.name" />}
                  component={TextField}
                  placeholder={placeholder}
                  required
                />
              )}
            </FormattedMessage>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <Field
              id="edit-license-type"
              component={Select}
              dataOptions={this.getTypeValues()}
              name="type"
              label={<FormattedMessage id="ui-licenses.prop.type" />}
              required
            />
          </Col>
          <Col xs={12} md={6}>
            <Field
              id="edit-license-status"
              component={Select}
              dataOptions={this.getStatusValues()}
              name="status"
              label={<FormattedMessage id="ui-licenses.prop.status" />}
              required
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={5}>
            <Field
              id="edit-license-start-date"
              name="startDate"
              label={<FormattedMessage id="ui-licenses.prop.startDate" />}
              component={Datepicker}
              dateFormat="YYYY-MM-DD"
              backendDateStandard="YYYY-MM-DD"
            />
          </Col>
          <Col xs={10} md={5}>
            <Field
              id="edit-license-end-date"
              name="endDate"
              label={<FormattedMessage id="ui-licenses.prop.endDate" />}
              component={Datepicker}
              dateFormat="YYYY-MM-DD"
              backendDateStandard="YYYY-MM-DD"
            />
          </Col>
          <Col xs={2} style={{ paddingTop: 20 }}>
            <Field
              id="edit-license-end-date-semantics"
              name="endDateSemantics"
              label={<FormattedMessage id="ui-licenses.prop.endDateSemantics" />}
              component={Checkbox}
              type="checkbox"
              parse={v => (v ? 'open_ended' : 'explicit')}
              format={v => {
                if (typeof v === 'string') return v === 'open_ended';

                if (typeof v === 'object' && v.id) {
                  const openEndedValue = this.getEndDateOpenEnded();
                  return v.id === openEndedValue.id;
                }

                return v;
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <FormattedMessage id="ui-licenses.placeholder.licenseDescription">
              {placeholder => (
                <Field
                  id="edit-license-description"
                  name="description"
                  label={<FormattedMessage id="ui-licenses.prop.description" />}
                  placeholder={placeholder}
                  component={TextArea}
                />
              )}
            </FormattedMessage>
          </Col>
        </Row>
        <AccordionSet>
          <Accordion label={<FormattedMessage id="ui-licenses.section.organizations" />}>
            Organizations component will be rendered here.
            Pass a de-structured `sectionProps` object into it as props.
            See how AgreementFormInfo in ui-agreements renders the AgreementFormInternalContacts
          </Accordion>
        </AccordionSet>
      </Accordion>
    );
  }
}

export default LicenseFormInfo;
