import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Accordion } from '@folio/stripes/components';

import { FormCustomProperties } from '@folio/stripes-erm-components';

class FormTerms extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    const { id, onToggle, open, data: { terms = [] } } = this.props;
    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-licenses.section.terms" />}
        open={open}
        onToggle={onToggle}
      >
        <FormCustomProperties
          customProperties={terms}
          name="customProperties"
          optionalSectionLabel={<FormattedMessage id="ui-licenses.terms.optionalTerms" />}
          primarySectionLabel={<FormattedMessage id="ui-licenses.terms.primaryTerms" />}
          translationKey="term"
        />
      </Accordion>
    );
  }
}

export default FormTerms;
