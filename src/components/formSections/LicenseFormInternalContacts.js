import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';

import { Accordion } from '@folio/stripes/components';
import { InternalContactsFieldArray } from '@folio/stripes-erm-components';

export default class LicenseFormInternalContacts extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      contactRoleValues: PropTypes.array,
      users: PropTypes.array,
    }),
  };

  render() {
    return (
      <div style={{ marginLeft: '2rem' }}>
        <Accordion
          closedByDefault
          id="licenseFormContacts"
          label={<FormattedMessage id="ui-licenses.section.internalContacts" />}
        >
          <FieldArray
            name="contacts"
            component={InternalContactsFieldArray}
            contactRoles={this.props.data.contactRoleValues}
            users={this.props.data.users}
          />
        </Accordion>
      </div>
    );
  }
}
