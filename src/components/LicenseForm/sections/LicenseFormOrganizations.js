import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';

import {
  Accordion,
  Button,
  Col,
  Row,
} from '@folio/stripes/components';

import { CreateOrganizationModal } from '@folio/stripes-erm-components';

import OrganizationsFieldArray from '../components/OrganizationsFieldArray';

class LicenseFormOrganizations extends React.Component {
  static propTypes = {
    parentResources: PropTypes.shape({
      orgRoleValues: PropTypes.object,
    }),
  };

  state = {
    showCreateOrgModal: false,
  }

  render() {
    return (
      <div style={{ marginLeft: '2rem' }}>
        <Accordion label={<FormattedMessage id="ui-licenses.section.organizations" />}>
          <Row>
            <Col xs={12}>
              <FieldArray
                name="orgs"
                component={OrganizationsFieldArray}
                roles={get(this.props.parentResources.orgRoleValues, ['records'], [])}
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
