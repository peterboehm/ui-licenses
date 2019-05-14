import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';

import {
  Accordion,
  Button,
  Col,
  Row,
} from '@folio/stripes/components';

import { CreateOrganizationModal, OrganizationsFieldArray } from '@folio/stripes-erm-components';

class LicenseFormOrganizations extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      orgRoleValues: PropTypes.array,
    }),
  };

  state = {
    showCreateOrgModal: false,
  }

  render() {
    return (
      <div style={{ marginLeft: '2rem' }}>
        <Accordion
          closedByDefault
          id="licenseFormOrgs"
          label={<FormattedMessage id="ui-licenses.section.organizations" />}
        >
          <Row>
            <Col xs={12}>
              <FieldArray
                name="orgs"
                component={OrganizationsFieldArray}
                roles={this.props.data.orgRoleValues}
              />
              <Button
                id="create-license-org-btn"
                onClick={() => this.setState({ showCreateOrgModal: true })}
              >
                <FormattedMessage id="ui-licenses.organizations.createNew" />
              </Button>
              <CreateOrganizationModal
                onClose={() => this.setState({ showCreateOrgModal: false })}
                open={this.state.showCreateOrgModal}
                path="licenses/org"
              />
            </Col>
          </Row>
        </Accordion>
      </div>
    );
  }
}

export default LicenseFormOrganizations;
