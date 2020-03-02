import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Button,
  Col,
  IconButton,
  Layout,
  Modal,
  ModalFooter,
  Row,
  Selection,
  TextField,
} from '@folio/stripes/components';

import stripesFinalForm from '@folio/stripes/final-form';

import {
  EditCard,
  customPropertyTypes,
  requiredValidator,
} from '@folio/stripes-erm-components';

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
    form: PropTypes.shape({
      mutators: PropTypes.shape({
        push: PropTypes.func.isRequired,
      }),
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
        onClick={values => {
          this.props.handleSubmit(values)
            .then(() => this.setState({ editingFilters: false }))
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
            footer={this.renderFooter()}
            label="Term filter builder"
            onClose={() => this.setState({ editingFilters: false })}
            open
            size="medium"
          >
            <FieldArray name="filters">
              {({ fields }) => fields.map((name, index) => (
                <React.Fragment key={name}>
                  <EditCard
                    header={`Term filter ${index + 1}`}
                    key={name}
                    marginBottom0
                    onDelete={index && (() => fields.remove(index))}
                  >
                    <Field
                      component={Selection}
                      dataOptions={terms.map(t => ({ label: t.label, value: t.name }))}
                      name={`${name}.customProperty`}
                      required
                      validate={requiredValidator}
                    />
                    <FieldArray name={`${name}.rules`}>
                      {({ fields: ruleFields }) => ruleFields.map((ruleFieldName, ruleFieldIndex) => {
                        const termDefinition = terms.find(t => t.name === fields.value[index].customProperty);
                        const termType = termDefinition?.type ?? customPropertyTypes.NUMBER;

                        let operatorOptions;
                        let ValueComponent;
                        const valueComponentProps = {};

                        if (termType === customPropertyTypes.NUMBER) {
                          operatorOptions = [
                            { label: 'equals', value: '==' },
                            { label: 'does not equal', value: '!=' },
                            { label: 'is greater than or equal', value: '>=' },
                            { label: 'is less than or equal', value: '<=' },
                          ];

                          ValueComponent = TextField;
                          valueComponentProps.type = 'number';
                        } else if (termType === customPropertyTypes.SELECT) {
                          operatorOptions = [
                            { label: 'is', value: '==' },
                            { label: 'is not', value: '!=' },
                          ];

                          ValueComponent = Selection;
                          valueComponentProps.dataOptions = termDefinition.category.values.map(rdv => ({ label: rdv.label, value: rdv.id }));
                        } else {
                          operatorOptions = [
                            { label: 'contains', value: '=~' },
                            { label: 'does not contain', value: '!~' },
                          ];

                          ValueComponent = TextField;
                        }

                        return (
                          <Row key={ruleFieldName}>
                            <Col xs={2}>
                              {ruleFieldIndex === 0 ? null : 'OR'}
                            </Col>
                            <Col xs={4}>
                              <Field
                                component={Selection}
                                dataOptions={operatorOptions}
                                name={`${ruleFieldName}.operator`}
                                required
                                validate={requiredValidator}
                              />
                            </Col>
                            <Col xs={4}>
                              <Field
                                component={ValueComponent}
                                name={`${ruleFieldName}.value`}
                                required
                                validate={requiredValidator}
                                {...valueComponentProps}
                              />
                            </Col>
                            <Col xs={2}>
                            { ruleFieldIndex ?
                              <IconButton
                                icon="trash"
                                onClick={() => ruleFields.remove(ruleFieldIndex)}
                              />
                              : null
                            }
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
                  </EditCard>
                  {index <= fields.value.length - 2 && (
                    <Layout className="textCentered">
                      AND
                    </Layout>
                  )}
                </React.Fragment>
              ))}
            </FieldArray>
            <Button onClick={() => push('filters')}>
              Add term filter
            </Button>
          </Modal>
        }
      </>
    );
  }
}

export default stripesFinalForm({
  enableReinitialize: true,
})(TermFiltersForm);
