import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { Accordion, Badge, Icon, Layout } from '@folio/stripes/components';

export default class Organizations extends React.Component {
  static propTypes = {
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
  };

  renderOrgList = (orgs) => {
    return (
      <React.Fragment>
        { orgs.map((o, index) => (
          <Layout
            className="marginTopHalf"
            data-test-license-org
            key={index}
          >
            {o.org.vendorsUuid ?
              <Link to={`/vendors/view/${o.org.vendorsUuid}`}>{o.org.name}</Link> :
              o.org.name
            }
            {o.role && `, ${o.role.label}`}
          </Layout>
        ))}
      </React.Fragment>
    );
  }

  renderOrganizations = () => {
    const { orgs } = this.props.license;

    if (!orgs || !orgs.length) return <FormattedMessage id="ui-licenses.organizations.licenseHasNone" />;

    return this.renderOrgList(orgs);
  }

  renderBadge = () => {
    const count = get(this.props.license, ['orgs', 'length']);
    return count !== undefined ? <Badge>{count}</Badge> : <Icon icon="spinner-ellipsis" width="10px" />;
  }

  render() {
    return (
      <Accordion
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
        id="license-orgs"
        label={<FormattedMessage id="ui-licenses.section.organizations" />}
      >
        <Layout className="padding-bottom-gutter">
          { this.renderOrganizations() }
        </Layout>
      </Accordion>
    );
  }
}
