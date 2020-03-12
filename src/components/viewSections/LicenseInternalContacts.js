import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { Accordion, Badge, Spinner } from '@folio/stripes/components';
import { InternalContactCard } from '@folio/stripes-erm-components';

export default class LicenseInternalContacts extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    license: PropTypes.shape({
      contacts: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
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

    if (!contacts.length) return <FormattedMessage id="ui-licenses.emptyAccordion.internalContacts" />;

    return contacts.map(contact => (
      <InternalContactCard
        key={contact.id}
        contact={contact}
      />
    ));
  }

  render() {
    const { id, onToggle, open } = this.props;

    return (
      <Accordion
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
        id={id}
        label={<FormattedMessage id="ui-licenses.section.internalContacts" />}
        onToggle={onToggle}
        open={open}
      >
        { this.renderContacts() }
      </Accordion>
    );
  }
}
