import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion } from '@folio/stripes/components';
import { CustomPropertiesList } from '@folio/stripes-erm-components';

export default class Terms extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    record: PropTypes.shape({ customProperties: PropTypes.object }),
    recordType: PropTypes.string.isRequired,
    terms: PropTypes.arrayOf(PropTypes.object),
  }

  render() {
    const { id, onToggle, open, record, recordType, terms } = this.props;

    return (
      <FormattedMessage id={`ui-licenses.${recordType}`}>
        {([type]) => (
          <Accordion
            id={id}
            label={<FormattedMessage id="ui-licenses.section.terms" />}
            onToggle={onToggle}
            open={open}
          >
            <CustomPropertiesList
              customProperties={terms}
              isEmptyMessage={<FormattedMessage id="ui-licenses.emptyAccordion.terms" values={{ type: type.toLowerCase() }} />}
              resource={record}
            />
          </Accordion>
        )}
      </FormattedMessage>
    );
  }
}
