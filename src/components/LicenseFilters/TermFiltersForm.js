import React from 'react';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Button,
  Col,
  IconButton,
  Label,
  Layout,
  Modal,
  ModalFooter,
  Row,
  Select,
  TextField,
  Tooltip,
} from '@folio/stripes/components';

import stripesFinalForm from '@folio/stripes/final-form';

import {
  EditCard,
  customPropertyTypes,
  requiredValidator,
} from '@folio/stripes-erm-components';

class TermFiltersForm extends React.Component {
  static propTypes = {
    intl: intlShape,
    filterHandlers: PropTypes.shape({
      state: PropTypes.func.isRequired,
    }),
    form: PropTypes.shape({
      mutators: PropTypes.shape({
        push: PropTypes.func.isRequired,
      }),
    }),
    handleSubmit: PropTypes.func.isRequired,
    terms: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
      })
    ),
  };

  state = {
    editingFilters: false,
  }

  isValidNumber = (value) => {
    return !value ? <FormattedMessage id="stripes-erm-components.errors.customPropertyInvalidNumber" />
      :
      undefined;
  }

  renderFooter = () => (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        data-test-apply-filters
        onClick={values => {
          const promise = this.props.handleSubmit(values);
          promise?.then(() => this.setState({ editingFilters: false })); // eslint-disable-line no-unused-expressions
        }}
      >
        <FormattedMessage id="ui-licenses.apply" />
      </Button>
      <Button
        data-test-cancel-filters
        onClick={() => this.setState({ editingFilters: false })}
      >
        <FormattedMessage id="ui-licenses.cancel" />
      </Button>
    </ModalFooter>
  );

  render() {
    const {
      form: {
        mutators: { push },
      },
      terms
    } = this.props;
    const { editingFilters } = this.state;

    return (
      <>
        <Button
          data-test-open-custprops-filters
          onClick={() => this.setState({ editingFilters: true })}
        >
          <FormattedMessage id="ui-licenses.terms.filters.editTermFilters" />
        </Button>
        { editingFilters &&
          <Modal
            dismissible
            enforceFocus={false}
            footer={this.renderFooter()}
            id="term-filters-modal"
            label={<FormattedMessage id="ui-licenses.terms.filters.builder" />}
            onClose={() => this.setState({ editingFilters: false })}
            open
            size="medium"
          >
            <FieldArray name="filters">
              {({ fields }) => fields.map((name, index) => (
                <React.Fragment key={name}>
                  <EditCard
                    key={name}
                    data-test-term-filter
                    deleteButtonTooltipText={<FormattedMessage id="ui-licenses.terms.filters.removeTerm" values={{ index: index + 1 }} />}
                    header={<FormattedMessage id="ui-licenses.terms.filters.termFilterIndex" values={{ index: index + 1 }} />}
                    marginBottom0={index !== fields.length - 1}
                    onDelete={() => fields.remove(index)}
                  >
                    <Field
                      component={Select}
                      data-test-term
                      dataOptions={terms.map(t => ({ label: t.label, value: t.name }))}
                      id={`input-term-${index}`}
                      label={<FormattedMessage id="ui-licenses.term" />}
                      name={`${name}.customProperty`}
                      placeholder=" "
                      required
                      validate={requiredValidator}
                    />
                    {/* This next div is rendered so that it can be referred to using aria-labelledby */}
                    <div
                      data-test-selected-term-name
                      id={`selected-term-name-${index}`}
                      style={{ display: 'none' }}
                    >
                      {terms.find(t => t.name === fields.value[index]?.customProperty)?.label ?? ''}
                    </div>
                    <Row>
                      <Col xs={2} />
                      <Col xs={4}>
                        <Label id="rule-column-header-comparator" required>
                          <FormattedMessage id="ui-licenses.terms.filters.comparator" />
                        </Label>
                      </Col>
                      <Col xs={4}>
                        <Label id="rule-column-header-value" required>
                          <FormattedMessage id="ui-licenses.terms.filters.value" />
                        </Label>
                      </Col>
                      <Col xs={2} />
                    </Row>
                    <FieldArray name={`${name}.rules`}>
                      {({ fields: ruleFields }) => ruleFields.map((ruleFieldName, ruleFieldIndex) => {
                        const termDefinition = terms.find(t => t.name === fields.value[index].customProperty);
                        const termType = termDefinition?.type ?? customPropertyTypes.NUMBER;

                        let operatorOptions;
                        let ValueComponent;
                        const valueComponentProps = {};

                        const { intl: { formatMessage } } = this.props;

                        if (termType === customPropertyTypes.NUMBER || termType === customPropertyTypes.DECIMAL) {
                          operatorOptions = [
                            { value: '==', label: formatMessage({ id: 'ui-licenses.operator.equals' }) },
                            { value: '!=', label: formatMessage({ id: 'ui-licenses.operator.doesNotEqual' }) },
                            { value: '>=', label: formatMessage({ id: 'ui-licenses.operator.isGreaterThanOrEqual' }) },
                            { value: '<=', label: formatMessage({ id: 'ui-licenses.operator.isLessThanOrEqual' }) },
                          ];

                          ValueComponent = TextField;
                          valueComponentProps.type = 'number';
                        } else if (termType === customPropertyTypes.SELECT) {
                          operatorOptions = [
                            { value: '==', label: formatMessage({ id: 'ui-licenses.operator.is' }) },
                            { value: '!=', label: formatMessage({ id: 'ui-licenses.operator.isNot' }) },
                          ];

                          ValueComponent = Select;
                          valueComponentProps.dataOptions = termDefinition.category.values.map(rdv => ({ label: rdv.label, value: rdv.id }));
                          valueComponentProps.placeholder = ' ';
                        } else {
                          operatorOptions = [
                            { value: '=~', label: formatMessage({ id: 'ui-licenses.operator.contains' }) },
                            { value: '!~', label: formatMessage({ id: 'ui-licenses.operator.doesNotContain' }) },
                          ];

                          ValueComponent = TextField;
                        }

                        return (
                          <Row
                            key={ruleFieldName}
                            data-test-rule-row
                          >
                            <Col xs={2}>
                              <Layout className="textCentered">
                                {ruleFieldIndex === 0 ? null : <FormattedMessage id="ui-licenses.OR" />}
                              </Layout>
                            </Col>
                            <Col xs={4}>
                              <Field
                                aria-labelledby={`selected-term-name-${index} rule-column-header-comparator`}
                                component={Select}
                                data-test-rule-operator
                                dataOptions={operatorOptions}
                                name={`${ruleFieldName}.operator`}
                                placeholder=" "
                                required
                                validate={requiredValidator}
                              />
                            </Col>
                            <Col xs={4}>
                              <Field
                                aria-labelledby={`selected-term-name-${index} rule-column-header-value`}
                                component={ValueComponent}
                                data-test-rule-value
                                name={`${ruleFieldName}.value`}
                                required
                                validate={
                                  termType === customPropertyTypes.NUMBER || termType === customPropertyTypes.DECIMAL
                                    ? this.isValidNumber :
                                    requiredValidator
                                }
                                {...valueComponentProps}
                              />
                            </Col>
                            <Col xs={2}>
                              { ruleFieldIndex ? (
                                <Tooltip
                                  id={uniqueId('delete-rule-btn')}
                                  text={<FormattedMessage id="ui-licenses.terms.filters.removeRule" values={{ index: ruleFieldIndex + 1 }} />}
                                >
                                  {({ ref, ariaIds }) => (
                                    <IconButton
                                      ref={ref}
                                      aria-labelledby={ariaIds.text}
                                      data-test-delete-rule-btn
                                      icon="trash"
                                      onClick={() => ruleFields.remove(ruleFieldIndex)}
                                    />
                                  )}
                                </Tooltip>
                              ) : null}
                            </Col>
                          </Row>
                        );
                      })}
                    </FieldArray>
                    <Button
                      data-test-add-rule-btn
                      disabled={!fields.value[index]?.customProperty}
                      onClick={() => push(`${name}.rules`)}
                    >
                      <FormattedMessage id="ui-licenses.terms.filters.addRule" />
                    </Button>
                  </EditCard>
                  {index < fields.value.length - 1 && (
                    <Layout className="textCentered">
                      <FormattedMessage id="ui-licenses.AND" />
                    </Layout>
                  )}
                </React.Fragment>
              ))}
            </FieldArray>
            <Button
              data-test-add-term-filter-btn
              onClick={() => push('filters', { rules: [{}] })}
            >
              <FormattedMessage id="ui-licenses.terms.filters.addTermFilter" />
            </Button>
          </Modal>
        }
      </>
    );
  }
}

export default stripesFinalForm({
  enableReinitialize: true,
})((injectIntl(TermFiltersForm)));
