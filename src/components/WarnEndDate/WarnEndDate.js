import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FormSpy } from 'react-final-form';

export default class WarnEndDate extends React.Component {
  static propTypes = {
    mutators: PropTypes.object.isRequired,
  };

  render() {
    const { mutators: { setFieldData } } = this.props;
    return (
      <FormSpy
        subscription={{ values: true }}
        onChange={({ values }) => {
          setFieldData('endDate', {
            warning: values.openEnded ? (
              <div data-test-warn-clear-end-date>
                <FormattedMessage id="ui-licenses.warn.clearEndDate" />
              </div>
            ) : undefined
          });
        }}
      />
    );
  }
}
