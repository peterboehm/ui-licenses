import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  IconButton,
  Label,
  Row,
  Select,
  TextArea,
  TextField,
} from '@folio/stripes/components';


const TERM_TYPE_TEXT = 'com.k_int.web.toolkit.custprops.types.CustomPropertyText'; // eslint-disable-line no-unused-vars
const TERM_TYPE_NUMBER = 'com.k_int.web.toolkit.custprops.types.CustomPropertyInteger';
const TERM_TYPE_SELECT = 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata';

export default class TermsListField extends React.Component {
  static propTypes = {
    input: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
      onChange: PropTypes.func,
    }),
    meta: PropTypes.object,
    availableTerms: PropTypes.arrayOf(PropTypes.shape({
      description: PropTypes.string,
      label: PropTypes.string.isRequired,
      options: PropTypes.array,
      type: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })).isRequired,
  };

  state = {
    terms: [], // This is the list of terms we're currently displaying for edit.
  }

  static getDerivedStateFromProps(props, state) {
    const {
      input: { value },
      meta: { pristine },
      availableTerms
    } = props;

    // When the user loads this form, we want to init the list of terms
    // we're displaying (state.terms) with the list of terms that have been set
    // either via defaults or previously-saved data. Since that data may come in
    // _after_ we have mounted this component, we need to check if new data has come in
    // while the form is still marked as pristine.
    //
    // redux-form unsets `pristine` after its `onChange` is called, but we also dirty
    // the component when we add/remove rows. That happens _before_ `onChange` is called,
    // so internally we use `state.dirtying` to show that we just initiated an action
    // that will result in a dirty component.
    if (pristine && !state.dirtying) {
      return {
        terms: availableTerms.filter(term => value[term.value] !== undefined),
      };
    }

    return null;
  }

  getTerm = (termValue) => {
    return this.props.availableTerms.find(term => term.value === termValue);
  }

  renderTermName = (term, i) => {
    const { availableTerms, input: { onChange, value } } = this.props;

    const unsetTerms = availableTerms.filter(t => {
      const termValue = value[t.value];

      // The term is unset and has no value.
      if (termValue === undefined) return true;

      // The term is set but is marked for deletion. Allow reuse.
      if (termValue[0] && termValue[0]._delete) return true;

      return false;
    });

    return (
      <Select
        data-test-term-name
        dataOptions={[term, ...unsetTerms]} // The selected term, and the available unset terms
        id={`edit-term-${i}-name`}
        onChange={e => {
          const newValue = e.target.value;

          // Update `state.terms` which controls what terms are being edited.
          this.setState(prevState => {
            const newTerms = [...prevState.terms];
            newTerms[i] = this.getTerm(newValue);

            return { terms: newTerms };
          });

          // Update redux-form (which tracks what the values for a given term are) because
          // in essence we're deleting a term and creating a new term.
          // We do this by 1) marking the current term for deletion and 2) initing
          // the new term to an empty object.
          const currentValue = value[term.value] ? value[term.value][0] : {};
          onChange({
            ...value,
            [term.value]: [{
              id: currentValue.id,
              _delete: true,
            }],
            [newValue]: [{}],
          });
        }}
        required
        value={term.value}
      />
    );
  }

  validateNoteField = (values, termValue) => {
    const val = values ? values[termValue] : [];
    const { note, value } = val ? val[0] : {};
    if(note && !value) return <FormattedMessage id="ui-licenses.terms.setValue" />
    else return undefined;
  }


  renderTermValue = (term, i) => {
    const { input: { onChange, value, name } } = this.props;
    const currentValue = value[term.value] ? value[term.value][0] : {};

    // Initialise to just the value (for text/number values)
    // and then check if it's an object (for Select/refdata values).
    let controlledFieldValue = currentValue.value;
    if (controlledFieldValue && controlledFieldValue.value) {
      controlledFieldValue = controlledFieldValue.value;
    }

    // Figure out which component we're rendering and specify its unique props.
    let FieldComponent = TextArea;
    const fieldProps = {};
    if (term.type === TERM_TYPE_SELECT) {
      FieldComponent = Select;
      fieldProps.dataOptions = term.options;
    }

    if (term.type === TERM_TYPE_NUMBER) {
      FieldComponent = TextField;
      fieldProps.type = 'number';
    }

    const handleChange = e => {
      onChange({
        ...value,
        [term.value]: [{
          ...currentValue,
          _delete: e.target.value === '' ? true : undefined, // Delete term if removing the value.
          value: e.target.value
        }],
      });
    };

    const err = this.validateNoteField(value, term.value);  
    return (
      <FieldComponent
        data-test-term-value
        id={`edit-term-${i}-value`}
        onChange={handleChange}
        value={controlledFieldValue}
        error={err}
        {...fieldProps}
      />
    );
  }

  renderTermDelete = (term, i) => {
    const { input: { onChange, value } } = this.props;
    const currentValue = value[term.value] ? value[term.value][0] : {};

    return (
      <IconButton
        data-test-term-delete-btn
        icon="trash"
        id={`edit-term-${i}-delete`}
        onClick={() => {
          this.setState(prevState => {
            const newTerms = [...prevState.terms];
            newTerms.splice(i, 1);
            return {
              dirtying: true,
              terms: newTerms
            };
          });

          onChange({
            ...value,
            [term.value]: [{
              ...currentValue,
              _delete: true,
            }],
          });
        }}
      />
    );
  }

  renderTermNote = (term, i) => {
    const { input: { onChange, value } } = this.props;
    const termObject = value[term.value] ? value[term.value][0] : {};
    const { note } = termObject;

    const handleChange = e => {
      onChange({
        ...value,
        [term.value]: [{
          ...termObject,
          note: e.target.value
        }],
      });
    };

    return (
      <div>
        <Label htmlFor={`edit-term-${i}-note`}>
          <FormattedMessage id="ui-licenses.prop.termNote" />
        </Label>
        <TextArea
          data-test-term-note
          fullWidth
          id={`edit-term-${i}-note`}
          onChange={handleChange}
          value={note}
        />
      </div>
    );
  }

  renderAddTerm = () => {
    return (
      <Button
        id="add-term-btn"
        onClick={() => {
          this.setState(prevState => {
            return {
              dirtying: true,
              terms: [...prevState.terms, {}],
            };
          });
        }}
      >
        <FormattedMessage id="ui-licenses.terms.add" />
      </Button>
    );
  }

  render() {
    
    return (
      <div>
        { this.state.terms.map((term, i) => (
          <React.Fragment key={term.value}>
            <Row>
              <Col xs={5}>
                {this.renderTermName(term, i)}
              </Col>
              <Col xs={6}>
                { this.renderTermValue(term, i) }
              </Col>
              <Col xs={1}>
                {this.renderTermDelete(term, i)}
              </Col>
            </Row>
            <Row>
              <Col xs={6} xsOffset={5}>
                {this.renderTermNote(term, i)}
              </Col>
            </Row>
          </React.Fragment>
        ))}
        {this.renderAddTerm()}
      </div>
    );
  }
}
