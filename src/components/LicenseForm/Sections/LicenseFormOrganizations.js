import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { Field, FieldArray } from 'redux-form';

import {
  Accordion,
  Button,
  Col,
  IconButton,
  Label,
  Layout,
  Row,
  Select,
  Icon,
} from '@folio/stripes/components';

import {
  CreateOrganizationModal,
  OrganizationSelection
} from '@folio/stripes-erm-components';

import { required } from '../../../util/validators';

class LicenseFormOrganizations extends React.Component {
  static propTypes = {
    parentResources: PropTypes.shape({
      orgRoleValues: PropTypes.object,
    }),
  };

  state = {
    licensorRoleId: undefined,
    roles: [],
    showCreateOrgModal: false,
  }

  static getDerivedStateFromProps(nextProps, state) {
    const roles = get(nextProps.parentResources.orgRoleValues, ['records'], []);
    if (state.roles.length !== roles.length) {
      return {
        licensorRoleId: (roles.find(r => r.value === 'licensor') || {}).id,
        roles: roles.map(({ id, label }) => ({ value: id, label })),
      };
    }

    return null;
  }

  onRemoveOrganization = (fields, index, org) => {
    // mod-licenses is implemented so that it doesn't expect the entire
    // array of organizations to be sent back on edits bc of the potential
    // size of that array. Instead, organization deletions are expected
    // to be sent back as an object that looks like { id: '123', _delete: true }.
    //
    // There's no "edit" function in redux-form fields so we remove
    // the stale data and append the new data with the deletion marker property.

    fields.remove(index);

    if (org.id) {
      fields.push({
        id: org.id,
        _delete: true,
      });
    }
  }

  validateMultipleLicensors = (value, allValues) => {
    const { licensorRoleId } = this.state;
    if (value === licensorRoleId) {
      const licensorOrgs = allValues.orgs.filter(o => o.role === licensorRoleId);
      if (licensorOrgs.length > 1) {
        return <FormattedMessage id="ui-licenses.errors.multipleLicensors" />;
      }
    }

    return undefined;
  }

  renderNoOrgs = () => (
    <Layout className="padding-bottom-gutter">
      <FormattedMessage id="ui-licenses.organizations.licenseHasNone" />
    </Layout>
  )

  renderOrgsHeaders = () => (
    <Row>
      <Col xs={8}>
        <Label required tagName="span">
          <FormattedMessage id="ui-licenses.prop.orgName" />
        </Label>
      </Col>
      <Col xs={3}>
        <Label required tagName="span">
          <FormattedMessage id="ui-licenses.prop.orgRole" />
        </Label>
      </Col>
      <Col xs={1}>
        <FormattedMessage id="stripes-core.button.delete" />
      </Col>
    </Row>
  )

  renderOrgList = ({ fields }) => {
    const licenseOrgs = fields.getAll() || [];
    const renderedOrgs = licenseOrgs.filter(org => !org._delete);

    return (
      <div>
        <div>
          { !renderedOrgs.length && this.renderNoOrgs() }
          { renderedOrgs.length ? this.renderOrgsHeaders() : null }
          { renderedOrgs.map((org, index) => (
            <Row key={index}>
              <Col xs={8}>
                <Field
                  component={OrganizationSelection}
                  id={`org-name-${index}`}
                  name={`orgs[${index}].org`}
                  path="licenses/org"
                  validate={required}
                />
              </Col>
              <Col xs={3}>
                <FormattedMessage id="ui-licenses.organizations.selectRole">
                  {placeholder => (
                    <Field
                      component={Select}
                      dataOptions={this.state.roles}
                      id={`org-role-${index}`}
                      name={`orgs[${index}].role`}
                      placeholder={placeholder}
                      validate={[
                        required,
                        this.validateMultipleLicensors,
                      ]}
                    />
                  )}
                </FormattedMessage>
              </Col>
              <Col xs={1}>
                <IconButton
                  icon="trash"
                  id={`org-delete-${index}`}
                  onClick={() => this.onRemoveOrganization(fields, index, org)}
                />
              </Col>
            </Row>
          ))}
        </div>
        <Button
          id="add-license-org-btn"
          onClick={() => fields.push({ })}
        >
          <Icon icon="plus-sign">
            <FormattedMessage id="ui-licenses.organizations.add" />
          </Icon>
        </Button>
      </div>
    );
  }

  render() {
    return (
      <Accordion label={<FormattedMessage id="ui-licenses.section.organizations" />}>
        <Row>
          <Col xs={12}>
            <FieldArray
              name="orgs"
              component={this.renderOrgList}
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
    );
  }
}

export default LicenseFormOrganizations;
