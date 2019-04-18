import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Button,
  Col,
  IconButton,
  Label,
  Layout,
  Row,
  Select,
} from '@folio/stripes/components';

import {
  OrganizationSelection,
  withKiwtFieldArray,
} from '@folio/stripes-erm-components';

import { required } from '../../../util/validators';

class OrganizationsFieldArray extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string.isRequired,
    onAddField: PropTypes.func.isRequired,
    onDeleteField: PropTypes.func.isRequired,
    roles: PropTypes.arrayOf(PropTypes.object), // eslint-disable-line react/no-unused-prop-types
  }

  static defaultProps = {
    roles: [],
  }

  state = {
    licensorRoleId: undefined,
  }

  static getDerivedStateFromProps(nextProps, state) {
    const { roles } = nextProps;
    if (!state.licensorRoleId && roles.length) {
      return {
        licensorRoleId: (roles.find(r => r.value === 'licensor') || {}).id,
      };
    }

    return null;
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

  renderEmpty = () => (
    <Layout className="padding-bottom-gutter">
      <FormattedMessage id="ui-licenses.organizations.licenseHasNone" />
    </Layout>
  )

  renderOrgs = () => {
    return (
      <React.Fragment>
        { this.renderOrgsHeaders() }
        { this.renderOrgsList() }
      </React.Fragment>
    );
  }

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
    </Row>
  )

  renderOrgsList = () => {
    const { items, name, onDeleteField } = this.props;

    return items.map((org, i) => (
      <Row key={i}>
        <Col xs={8}>
          <Field
            component={OrganizationSelection}
            id={`org-name-${i}`}
            name={`${name}[${i}].org`}
            path="licenses/org"
            validate={required}
          />
        </Col>
        <Col xs={3}>
          <FormattedMessage id="ui-licenses.organizations.selectRole">
            {placeholder => (
              <Field
                component={Select}
                dataOptions={this.props.roles}
                id={`org-role-${i}`}
                name={`${name}[${i}].role`}
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
            id={`org-delete-${i}`}
            onClick={() => onDeleteField(i, org)}
          />
        </Col>
      </Row>
    ));
  }

  render = () => {
    const { items, onAddField } = this.props;

    return (
      <div>
        <div>
          { items.length ? this.renderOrgs() : this.renderEmpty() }
        </div>
        <Button
          id="add-license-org-btn"
          onClick={() => onAddField({})}
        >
          <FormattedMessage id="ui-licenses.organizations.add" />
        </Button>
      </div>
    );
  }
}

export default withKiwtFieldArray(OrganizationsFieldArray);
