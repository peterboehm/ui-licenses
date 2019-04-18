import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion } from '@folio/stripes/components';
import { LicenseTermsList } from '@folio/stripes-erm-components';

export default class LicenseTerms extends React.Component {
  static propTypes = {
    license: PropTypes.shape({ customProperties: PropTypes.object }),
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    terms: PropTypes.arrayOf(PropTypes.object),
  }

  render() {
    const { id, license, onToggle, open, terms } = this.props;

    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-licenses.section.terms" />}
        open={open}
        onToggle={onToggle}
      >
        <LicenseTermsList
          license={license}
          terms={terms}
        />
      </Accordion>
    );
  }
}
