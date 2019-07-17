import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Link from 'react-router-dom/Link';
import { FormattedMessage } from 'react-intl';

import { Accordion, Badge } from '@folio/stripes/components';
import { Spinner } from '@folio/stripes-erm-components';

export default class LicenseInternalContacts extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    license: PropTypes.shape({
      contacts: PropTypes.arrayOf(
        PropTypes.shape({
          role: PropTypes.shape({
            label: PropTypes.string,
          }),
          user: PropTypes.shape({
            personal: PropTypes.shape({
              firstName: PropTypes.string,
              lastName: PropTypes.string,
            }).isRequired,
          }).isRequired,
        })
      ),
    }).isRequired,
    onToggle: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
  };

  renderBadge = () => {
    const count = get(this.props, 'license.contacts.length');
    return count !== undefined ? <Badge>{count}</Badge> : <Spinner />;
  }

  renderContacts = () => {
    const { license } = this.props;
    const contacts = license.contacts || [];

    if (!contacts.length) return <FormattedMessage id="ui-agreements.contacts.noContacts" />;

    return contacts.map((contact, i) => {
      if (!contact.user) return null;

      const firstName = get(contact, 'user.personal.firstName');
      const lastName = get(contact, 'user.personal.lastName');
      const middleName = get(contact, 'user.personal.middleName');
      let displayName = lastName;
      if (firstName) displayName = `${displayName}, ${firstName}`;
      if (middleName) displayName = `${displayName} ${middleName}`;

      const role = get(contact, 'role.label', '');

      return (
        <div
          data-test-license-contact
          key={`${contact.user.id}-${i}`}
        >
          <Link to={`/users/view/${contact.user.id}`}>{displayName}</Link>
          ,&nbsp;
          <span>{role}</span>
        </div>
      );
    });
  }

  render() {
    const { id, onToggle, open } = this.props;

    return (
      <Accordion
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
        id={id}
        label={<FormattedMessage id="ui-agreements.agreements.internalContacts" />}
        onToggle={onToggle}
        open={open}
      >
        { this.renderContacts() }
      </Accordion>
    );
  }
}
