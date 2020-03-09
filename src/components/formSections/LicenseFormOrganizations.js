import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import {
  Accordion,
  Col,
  Row,
} from '@folio/stripes/components';

import { OrganizationsFieldArray } from '@folio/stripes-erm-components';

class LicenseFormOrganizations extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    data: PropTypes.shape({
      orgRoleValues: PropTypes.array,
    }),
  };

  render() {
    const { data, id, onToggle, open } = this.props;

    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-licenses.section.organizations" />}
        onToggle={onToggle}
        open={open}
      >
        <Row>
          <Col xs={12}>
            <FieldArray
              addOrganizationBtnLabel={<FormattedMessage id="ui-licenses.organizations.addOrganizationToLicense" />}
              component={OrganizationsFieldArray}
              name="orgs"
              roles={data.orgRoleValues}
              uniqueRole="licensor"
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

export default LicenseFormOrganizations;
