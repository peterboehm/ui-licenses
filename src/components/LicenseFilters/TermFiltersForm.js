import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form, Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';

import {
  Accordion,
  Button,
  Card,
  Col,
  FilterAccordionHeader,
  IconButton,
  Modal,
  ModalFooter,
  MultiSelection,
  Row,
  Selection,
  TextField,
} from '@folio/stripes/components';

import stripesFinalForm from '@folio/stripes/final-form'

const TERM_TYPE_TEXT = 'com.k_int.web.toolkit.custprops.types.CustomPropertyText'; // eslint-disable-line no-unused-vars
const TERM_TYPE_NUMBER = 'com.k_int.web.toolkit.custprops.types.CustomPropertyInteger';
const TERM_TYPE_SELECT = 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata';

class TermFiltersForm extends React.Component {
  static propTypes = {
    terms: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
      })
    ),
    filterHandlers: PropTypes.shape({
      state: PropTypes.func.isRequired,
    }),
    handleSubmit: PropTypes.func.isRequired,
  };

  state = {
    editingFilters: false,
  }

  renderFooter = () => (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        onClick={event => {
          this.setState({ editingFilters: false });
          this.props.handleSubmit(event, 1, 2, 3);
        }}
      >
        Apply
      </Button>
      <Button
        onClick={() => {
          this.setState({ editingFilters: false });
        }}
      >
        Cancel
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
          Edit term filters
        </Button>
        { editingFilters &&
          <Modal
            dismissible
            enforceFocus={false}
            open
            footer={this.renderFooter()}
            label="Term filter builder"
            size="large"
          >
            <FieldArray name="filters">
              {({ fields }) => fields.map((name, index) => (
                <Card
                  headerStart={`Term filter ${index + 1}`}
                >
                  <Field
                    name={`${name}.customProperty`}
                    component={Selection}
                    dataOptions={terms.map(t => ({ label: t.label, value: t.name }))}
                  />
                  <FieldArray name={`${name}.rules`}>
                    {({ fields: ruleFields }) => ruleFields.map((ruleName, ruleIndex) => {
                      const termDefinition = terms.find(t => t.name === fields.value[index].customProperty);
                      const termType = termDefinition?.type ?? TERM_TYPE_NUMBER;

                      let operatorOptions;
                      let ValueComponent;
                      let valueOptions;
                      let valueType;

                      if (termType === TERM_TYPE_NUMBER) {
                        operatorOptions = [
                          { label: 'equals', value: '==' },
                          { label: 'does not equal', value: '!=' },
                          { label: 'is greater than or equal', value: '>=' },
                          { label: 'is less than or equal', value: '<=' },
                        ];
                        ValueComponent = TextField;
                        valueType = 'number';
                      } else if (termType === TERM_TYPE_SELECT) {
                        operatorOptions = [
                          { label: 'is', value: '==' },
                          { label: 'is not', value: '!=' },
                        ];
                        ValueComponent = Selection;
                        valueOptions = termDefinition.category.values.map(rdv => ({ label: rdv.label, value: rdv.id }));
                      }

                      return (
                        <Row>
                          <Col xs={2}>
                            {ruleIndex === 0 ? null : 'OR'}
                          </Col>
                          <Col xs={4}>
                            <Field
                              name={`${ruleName}.operator`}
                              component={Selection}
                              dataOptions={operatorOptions}
                            />
                          </Col>
                          <Col xs={4}>
                            <Field
                              name={`${ruleName}.value`}
                              component={ValueComponent}
                              dataOptions={valueOptions}
                              type={valueType}
                            />
                          </Col>
                          <Col xs={2}>
                            <IconButton
                              icon="trash"
                              onClick={() => ruleFields.remove(ruleIndex)}
                            />
                          </Col>
                        </Row>
                      );
                    })}
                  </FieldArray>
                  <Button
                    disabled={!fields.value[index]?.customProperty}
                    onClick={() => push(`${name}.rules`)}
                  >
                    Add rule
                  </Button>
                </Card>
              ))}
            </FieldArray>
            <Button onClick={() => push('filters')}>
              Add term filter
            </Button>
          </Modal>
        }
      </>
    );
    /*
    <Button
      onClick={() => {
        filterHandlers.state({
          ...activeFilters,
          customProperties: [
            'customProperties.remoteAccess.value==1883e41b6fe75466016fe7a1bd9e001f||customProperties.remoteAccess.value==1883e41b6fe75466016fe7a1bd90001e',
            'customProperties.concurrentAccess.value>10',
          ].join('&&')
        });
      }}
    >
      Edit Term Filters
    </Button>
    */
  }
}

export default stripesFinalForm({
  enableReinitialize: true,
  navigationCheck: true,
})(TermFiltersForm);
