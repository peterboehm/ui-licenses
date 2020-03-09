import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { ViewOrganizationCard } from '@folio/stripes-erm-components';
import { Accordion, Badge, Icon, Layout } from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';

export default class LicenseOrganizations extends React.Component {
  static propTypes = {
    handlers: PropTypes.shape({
      onFetchCredentials: PropTypes.func,
    }),
    id: PropTypes.string.isRequired,
    license: PropTypes.shape({
      orgs: PropTypes.arrayOf(
        PropTypes.shape({
          org: PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string.isRequired,
            vendorsUuid: PropTypes.string,
          }).isRequired,
          role: PropTypes.shape({
            label: PropTypes.string.isRequired,
          }).isRequired,
        }),
      ),
    }).isRequired,
    onToggle: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
  };

  renderOrgList = (orgs) => {
    return orgs.map(o => {
      const { interfaces, org, role } = o;
      if (!org || !role) return null;

      return (
        <ViewOrganizationCard
          key={`${org.orgsUuid}-${role.value}`}
          data-test-license-org
          fetchCredentials={this.props.handlers.onFetchCredentials}
          headerStart={
            <span>
              <AppIcon
                app="organizations"
                size="small"
              >
                <Link to={`/organizations/view/${org.orgsUuid}`}>
                  <strong>{org.name}</strong>
                </Link>
                {` · ${role.label}`}
              </AppIcon>
            </span>
          }
          interfaces={interfaces}
        />
      );
    });
  }

  renderOrganizations = () => {
    const { orgs } = this.props.license;

    if (!orgs || !orgs.length) return <FormattedMessage id="ui-licenses.emptyAccordion.organizations" />;

    return this.renderOrgList(orgs);
  }

  renderBadge = () => {
    const count = get(this.props.license, ['orgs', 'length']);
    return count !== undefined ? <Badge>{count}</Badge> : <Icon icon="spinner-ellipsis" width="10px" />;
  }

  render() {
    const { id, onToggle, open } = this.props;

    return (
      <Accordion
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
        id={id}
        label={<FormattedMessage id="ui-licenses.section.organizations" />}
        onToggle={onToggle}
        open={open}
      >
        <Layout className="padding-bottom-gutter">
          {this.renderOrganizations()}
        </Layout>
      </Accordion>
    );
  }
}
