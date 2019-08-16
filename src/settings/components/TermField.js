import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { Card, Col, Row, Select, TextArea, TextField, Button } from '@folio/stripes/components';

import TermFieldEdit from './TermFieldEdit';
import TermFieldView from './TermFieldView';

import { required } from '../../util/validators';

export default class TermField extends React.Component {
  static propTypes = {
    onDelete: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    input: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    meta: PropTypes.shape({
      invalid: PropTypes.bool,
      pristine: PropTypes.bool,
      submitting: PropTypes.bool,
    })
  }

  constructor(props) {
    super(props);

    const { value } = props.input;

    this.state = {
      editing: !(value && value.id),
      initialValue: value,
    };
  }

  handleEdit = () => {
    this.props.mutators.resetTermState(this.props.input.name);

    this.setState({
      initialValue: this.props.input.value,
      editing: true,
    });
  }

  handleCancelEdit = () => {
    this.props.mutators.setTermValue(this.props.input.name, this.state.initialValue);

    this.setState({
      editing: false,
    });
  }

  handleSave = (term) => {
    this.setState({
      editing: false,
    });

    this.props.onSave(term);
  }

  renderActionButtons = () => {
    const {
      input: { value },
      meta,
      onDelete,
      onSave
    } = this.props;

    const { editing } = this.state;

    if (editing) {
      return (
        <span>
          <Button
            buttonStyle="danger"
            disabled={value.primary}
            marginBottom0
            onClick={onDelete}
          >
            Delete
          </Button>
          <Button
            disabled={value.id === undefined}
            marginBottom0
            onClick={this.handleCancelEdit}
          >
            Cancel
          </Button>
          <Button
            disabled={meta.invalid || meta.pristine || meta.submitting}
            marginBottom0
            onClick={onSave}
          >
            Save
          </Button>
        </span>
      );
    } else {
      return (
        <span>
          <Button
            marginBottom0
            onClick={this.handleEdit}
          >
            Edit
          </Button>
        </span>
      );
    }
  }

  render() {
    const { input: { name, value }, mutators } = this.props;
    const TermComponent = this.state.editing ? TermFieldEdit : TermFieldView;

    return (
      <TermComponent
        {...this.props}
        actionButtons={this.renderActionButtons()}
      />
    );
  }
}
