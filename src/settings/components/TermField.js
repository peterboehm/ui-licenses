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

  handleCancel = () => {
    const {
      input: { name, value },
      onDelete,
    } = this.props;

    if (value.id) {
      this.props.mutators.setTermValue(name, this.state.initialValue);
    } else {
      onDelete();
    }


    this.setState({
      editing: false,
    });
  }

  handleSave = () => {
    this.setState({
      editing: false,
    });

    this.props.onSave();
  }

  renderActionButtons = () => {
    const {
      input: { value },
      meta,
      onDelete,
    } = this.props;

    const { editing } = this.state;

    if (editing) {
      return (
        <span>
          <Button
            marginBottom0
            onClick={this.handleCancel}
          >
            Cancel
          </Button>
          <Button
            buttonStyle="primary"
            disabled={meta.invalid || meta.pristine || meta.submitting}
            marginBottom0
            onClick={this.handleSave}
          >
            Save
          </Button>
        </span>
      );
    } else {
      return (
        <span>
          <Button
            buttonStyle="danger"
            marginBottom0
            onClick={onDelete}
          >
            Delete
          </Button>
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
