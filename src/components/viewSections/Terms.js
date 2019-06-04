import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion } from '@folio/stripes/components';
import { LicenseTermsList } from '@folio/stripes-erm-components';

export default class Terms extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    record: PropTypes.shape({ customProperties: PropTypes.object }),
    terms: PropTypes.arrayOf(PropTypes.object),
  }

  render() {
    const { id, onToggle, open, record, terms } = this.props;

    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-licenses.section.terms" />}
        open={open}
        onToggle={onToggle}
      >
        <LicenseTermsList
          license={record}
          terms={terms}
        />
      </Accordion>
    );
  }
}
