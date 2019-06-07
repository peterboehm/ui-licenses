import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
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

import LicenseFormInternalContacts from './LicenseFormInternalContacts';
import LicenseFormOrganizations from './LicenseFormOrganizations';

import { required } from '../../util/validators';

class LicenseFormInfo extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    data: PropTypes.shape({
      statusValues: PropTypes.array,
      typeValues: PropTypes.array,
    }),
  };

  state = {
    openEnded: false,
  }

  warnEndDate = (_value, allValues) => {
    this.setState({ openEnded: allValues.openEnded });

    if (allValues.openEnded && allValues.endDate) {
      return (
        <div data-test-warn-clear-end-date>
          <FormattedMessage id="ui-licenses.warn.clearEndDate" />
        </div>
      );
    }

    return undefined;
  }

  validateEndDate = (value, allValues) => {
    if (value && allValues.startDate && (allValues.openEnded !== true)) {
      const startDate = new Date(allValues.startDate);
      const endDate = new Date(allValues.endDate);

      if (startDate >= endDate) {
        return (
          <div data-test-error-end-date-too-early>
            <FormattedMessage id="ui-licenses.errors.endDateGreaterThanStartDate" />
          </div>
        );
      }
    }

    return undefined;
  }

  render() {
    const { data, id, onToggle, open } = this.props;

    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-licenses.section.licenseInformation" />}
        open={open}
        onToggle={onToggle}
      >
        <React.Fragment>
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
                    validate={required}
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
                dataOptions={data.typeValues}
                name="type"
                label={<FormattedMessage id="ui-licenses.prop.type" />}
                required
              />
            </Col>
            <Col xs={12} md={6}>
              <Field
                id="edit-license-status"
                component={Select}
                dataOptions={data.statusValues}
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
              />
            </Col>
            <Col xs={10} md={5}>
              <Field
                id="edit-license-end-date"
                name="endDate"
                label={<FormattedMessage id="ui-licenses.prop.endDate" />}
                component={Datepicker}
                dateFormat="YYYY-MM-DD"
                disabled={this.state.openEnded}
                validate={this.validateEndDate}
                warn={this.warnEndDate}
              />
            </Col>
            <Col xs={2} style={{ paddingTop: 20 }}>
              <Field
                id="edit-license-open-ended"
                name="openEnded"
                label={<FormattedMessage id="ui-licenses.prop.openEnded" />}
                component={Checkbox}
                type="checkbox"
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
        </React.Fragment>
        <AccordionSet>
          <LicenseFormInternalContacts data={data} />
          <LicenseFormOrganizations data={data} />
        </AccordionSet>
      </Accordion>
    );
  }
}

export default LicenseFormInfo;
