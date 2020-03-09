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

import { parseDateOnlyString } from '../utils';

export default class LicenseFormInfo extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      statusValues: PropTypes.array,
      typeValues: PropTypes.array,
    }),
    id: PropTypes.string,
    mutators: PropTypes.object,
    values: PropTypes.object
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
    const { data, id, mutators, values } = this.props;

    return (
      <div data-test-license-info id={id}>
        <Row>
          <Col xs={12}>
            <Field
              autoFocus
              component={TextField}
              id="edit-license-name"
              label={<FormattedMessage id="ui-licenses.prop.name" />}
              maxLength={255}
              name="name"
              required
              validate={requiredValidator}
            />
          </Col>
        </Row>
        <Row>
          <Col md={6} xs={12}>
            <Field
              component={Select}
              dataOptions={data.typeValues}
              id="edit-license-type"
              label={<FormattedMessage id="ui-licenses.prop.type" />}
              name="type"
              required
            />
          </Col>
          <Col md={6} xs={12}>
            <Field
              component={Select}
              dataOptions={data.statusValues}
              id="edit-license-status"
              label={<FormattedMessage id="ui-licenses.prop.status" />}
              name="status"
              required
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} xs={12}>
            <Field
              backendDateStandard="YYYY-MM-DD"
              component={Datepicker}
              id="edit-license-start-date"
              label={<FormattedMessage id="ui-licenses.prop.startDate" />}
              name="startDate"
              parse={v => v} // Lets us pass an empty string instead of `undefined`
              parser={parseDateOnlyString}
            />
          </Col>
          <Col md={5} xs={10}>
            <Field
              backendDateStandard="YYYY-MM-DD"
              component={Datepicker}
              disabled={values.openEnded}
              id="edit-license-end-date"
              label={<FormattedMessage id="ui-licenses.prop.endDate" />}
              name="endDate"
              parse={v => v} // Lets us pass an empty string instead of `undefined`
              parser={parseDateOnlyString}
              validate={this.validateEndDate}
            />
          </Col>
          <Col style={{ paddingTop: 20 }} xs={2}>
            <Field name="openEnded" type="checkbox">
              {props => {
                return (<Checkbox
                  checked={props.input.value}
                  id="edit-license-open-ended"
                  label={<FormattedMessage id="ui-licenses.prop.openEnded" />}
                  onChange={e => {
                    props.input.onChange(e);
                    mutators.setFieldData('endDate', {
                      warning: e.target.checked ? (
                        <div data-test-warn-clear-end-date>
                          <FormattedMessage id="ui-licenses.warn.clearEndDate" />
                        </div>
                      ) : undefined
                    });
                  }}
                  type="checkbox"
                />);
              }}
            </Field>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Field
              component={TextArea}
              id="edit-license-description"
              label={<FormattedMessage id="ui-licenses.prop.description" />}
              name="description"
              parse={v => v} // Lets us pass an empty string instead of `undefined`
            />
          </Col>
        </Row>
      </div>
    );
  }
}
