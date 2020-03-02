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
  Selection,
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

  renderFooter = () => (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        onClick={values => {
          this.props.handleSubmit(values)
            .then(() => this.setState({ editingFilters: false }))
        }}
      >
        <FormattedMessage id="ui-licenses.apply" />
      </Button>
      <Button
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
        <Button onClick={() => this.setState({ editingFilters: true })}>
          <FormattedMessage id="ui-licenses.terms.filters.editTermFilters" />
        </Button>
        { editingFilters &&
          <Modal
            dismissible
            enforceFocus={false}
            footer={this.renderFooter()}
            label={<FormattedMessage id="ui-licenses.terms.filters.builder" />}
            onClose={() => this.setState({ editingFilters: false })}
            open
            size="medium"
          >
            <FieldArray name="filters">
              {({ fields }) => fields.map((name, index) => (
                <React.Fragment key={name}>
                  <EditCard
                    deleteButtonTooltipText={<FormattedMessage id="ui-licenses.terms.filters.removeTerm" values={{ index: index + 1 }} />}
                    header={<FormattedMessage id="ui-licenses.terms.filters.termFilterIndex" values={{ index: index + 1 }} />}
                    key={name}
                    marginBottom0={index !== fields.length - 1}
                    onDelete={index && (() => fields.remove(index))}
                  >
                    <Field
                      component={Selection}
                      dataOptions={terms.map(t => ({ label: t.label, value: t.name }))}
                      label={<FormattedMessage id="ui-licenses.term" />}
                      name={`${name}.customProperty`}
                      required
                      validate={requiredValidator}
                    />
                    {/* This next div is rendered so that it can be referred to using aria-labelledby */}
                    <div
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

                        const { intl: { formatMessage }} = this.props;

                        if (termType === customPropertyTypes.NUMBER) {
                          operatorOptions = [
                            { value: '==', label: formatMessage({ id: 'ui-licenses.operator.equals'}) },
                            { value: '!=', label: formatMessage({ id: 'ui-licenses.operator.doesNotEqual'}) },
                            { value: '>=', label: formatMessage({ id: 'ui-licenses.operator.isGreaterThanOrEqual'}) },
                            { value: '<=', label: formatMessage({ id: 'ui-licenses.operator.isLessThanOrEqual'}) },
                          ];

                          ValueComponent = TextField;
                          valueComponentProps.type = 'number';
                        } else if (termType === customPropertyTypes.SELECT) {
                          operatorOptions = [
                            { value: '==', label: formatMessage({ id: 'ui-licenses.operator.is'}) },
                            { value: '!=', label: formatMessage({ id: 'ui-licenses.operator.isNot'}) },
                          ];

                          ValueComponent = Selection;
                          valueComponentProps.dataOptions = termDefinition.category.values.map(rdv => ({ label: rdv.label, value: rdv.id }));
                        } else {
                          operatorOptions = [
                            { value: '=~', label: formatMessage({ id: 'ui-licenses.operator.contains'}) },
                            { value: '!~', label: formatMessage({ id: 'ui-licenses.operator.doesNotContain'}) },
                          ];

                          ValueComponent = TextField;
                        }

                        return (
                          <Row key={ruleFieldName}>
                            <Col xs={2}>
                              <Layout className="textCentered">
                                {ruleFieldIndex === 0 ? null : <FormattedMessage id="ui-licenses.OR" />}
                              </Layout>
                            </Col>
                            <Col xs={4}>
                              <Field
                                aria-labelledby={`selected-term-name-${index} rule-column-header-comparator`}
                                component={Selection}
                                dataOptions={operatorOptions}
                                name={`${ruleFieldName}.operator`}
                                required
                                validate={requiredValidator}
                              />
                            </Col>
                            <Col xs={4}>
                              <Field
                                aria-labelledby={`selected-term-name-${index} rule-column-header-value`}
                                component={ValueComponent}
                                name={`${ruleFieldName}.value`}
                                required
                                validate={requiredValidator}
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
                                    aria-labelledby={ariaIds.text}
                                    icon="trash"
                                    onClick={() => ruleFields.remove(ruleFieldIndex)}
                                    ref={ref}
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
            <Button onClick={() => push('filters', { rules: [{}]})}>
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
})(injectIntl(TermFiltersForm));
