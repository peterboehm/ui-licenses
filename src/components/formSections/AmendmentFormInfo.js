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

class AmendmentFormInfo extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      statusValues: PropTypes.array,
      typeValues: PropTypes.array,
    }),
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
    const { data, mutators, values } = this.props;

    return (
      <div
        id="amendment-form-info"
        label={<FormattedMessage id="ui-licenses.section.amendmentInformation" />}
      >
        <Row>
          <Col xs={12}>
            <FormattedMessage id="ui-licenses.placeholder.amendmentName">
              {placeholder => (
                <Field
                  id="edit-amendment-name"
                  name="name"
                  label={<FormattedMessage id="ui-licenses.prop.name" />}
                  component={TextField}
                  maxLength={255}
                  placeholder={placeholder}
                  required
                  validate={requiredValidator}
                />
              )}
            </FormattedMessage>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Field
              id="edit-amendment-status"
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
              id="edit-amendment-start-date"
              name="startDate"
              label={<FormattedMessage id="ui-licenses.prop.startDate" />}
              component={Datepicker}
              dateFormat="YYYY-MM-DD"
            />
          </Col>
          <Col xs={10} md={5}>
            <Field
              backendDateStandard="YYYY-MM-DD"
              component={Datepicker}
              dateFormat="YYYY-MM-DD"
              disabled={values.openEnded}
              id="edit-amendment-end-date"
              label={<FormattedMessage id="ui-licenses.prop.endDate" />}
              name="endDate"
              validate={this.validateEndDate}
            />
          </Col>
          <Col xs={2} style={{ paddingTop: 20 }}>
            <Field name="openEnded" type="checkbox">
              {props => {
                return (<Checkbox
                  id="edit-amendment-open-ended"
                  checked={props.input.value}
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
                  }
                  }
                  type="checkbox"
                />);
              }}
            </Field>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <FormattedMessage id="ui-licenses.placeholder.amendmentDescription">
              {placeholder => (
                <Field
                  id="edit-amendment-description"
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

export default AmendmentFormInfo;
