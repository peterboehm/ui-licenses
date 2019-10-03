import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { requiredValidator } from '@folio/stripes-erm-components';

import {
  Checkbox,
  Col,
  Datepicker,
  Row,
  Select,
  TextArea,
  TextField,
} from '@folio/stripes/components';

export default class LicenseFormInfo extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    data: PropTypes.shape({
      statusValues: PropTypes.array,
      typeValues: PropTypes.array,
    }),
    form: PropTypes.object,
  };

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
    const { data, id, form } = this.props;

    return (
      <div data-test-license-info id={id}>
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
                  validate={requiredValidator}
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
              backendDateStandard="YYYY-MM-DD"
              id="edit-license-start-date"
              name="startDate"
              label={<FormattedMessage id="ui-licenses.prop.startDate" />}
              component={Datepicker}
              dateFormat="YYYY-MM-DD"
            />
          </Col>
          <Col xs={10} md={5}>
            <Field name="endDate" validate={this.validateEndDate}>
              {(props) => {
                const formState = form.getState();
                const { values = {} } = formState;
                return (<Datepicker
                  backendDateStandard="YYYY-MM-DD"
                  id="edit-license-end-date"
                  label={<FormattedMessage id="ui-licenses.prop.endDate" />}
                  dateFormat="YYYY-MM-DD"
                  disabled={values.openEnded}
                  onBlur={props.input.onBlur}
                  input={props.input}
                  meta={props.meta}
                />);
              }}
            </Field>
          </Col>
          <Col xs={2} style={{ paddingTop: 20 }}>
            <Field name="openEnded" type="checkbox">
              {props => {
                return (<Checkbox
                  id="edit-license-open-ended"
                  checked={props.input.value}
                  label={<FormattedMessage id="ui-licenses.prop.openEnded" />}
                  onChange={props.input.onChange}
                  type="checkbox"
                />);
              }}
            </Field>
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
      </div>
    );
  }
}
