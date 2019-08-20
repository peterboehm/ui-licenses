import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Button } from '@folio/stripes/components';

import TermFieldEdit from './TermFieldEdit';
import TermFieldView from './TermFieldView';

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
    }),
    mutators: PropTypes.shape({
      setTermValue: PropTypes.func.isRequired,
    }).isRequired,
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
            <FormattedMessage id="stripes-core.button.cancel" />
          </Button>
          <Button
            buttonStyle="primary"
            disabled={meta.invalid || meta.pristine || meta.submitting}
            marginBottom0
            onClick={this.handleSave}
          >
            <FormattedMessage id="stripes-core.button.save" />
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
            <FormattedMessage id="stripes-core.button.delete" />
          </Button>
          <Button
            marginBottom0
            onClick={this.handleEdit}
          >
            <FormattedMessage id="stripes-core.button.edit" />
          </Button>
        </span>
      );
    }
  }

  render() {
    const TermComponent = this.state.editing ? TermFieldEdit : TermFieldView;

    return (
      <TermComponent
        {...this.props}
        actionButtons={this.renderActionButtons()}
      />
    );
  }
}
