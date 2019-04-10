import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { Accordion, AccordionSet, FilterAccordionHeader, Selection } from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';
import { OrganizationSelection } from '@folio/stripes-erm-components';

const FILTERS = [
  'status',
  'type',
];

export default class LicenseFilters extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.object,
    data: PropTypes.object.isRequired,
    filterHandlers: PropTypes.object,
  };

  static defaultProps = {
    activeFilters: {
      status: [],
      type: [],
    }
  };

  state = {
    status: [],
    type: [],
  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};

    FILTERS.forEach(filter => {
      const values = props.data[`${filter}Values`];
      if (values.length !== state[filter].length) {
        newState[filter] = values.map(({ label }) => ({ label, value: label }));
      }
    });

    if (Object.keys(newState).length) return newState;

    return null;
  }

  renderCheckboxFilter = (name, props) => {
    const activeFilters = this.props.activeFilters[name] || [];

    return (
      <Accordion
        id={`filter-accordion-${name}`}
        displayClearButton={activeFilters.length > 0}
        header={FilterAccordionHeader}
        label={<FormattedMessage id={`ui-licenses.prop.${name}`} />}
        onClearFilter={() => { this.props.filterHandlers.clearGroup(name); }}
        {...props}
      >
        <CheckboxFilter
          dataOptions={this.state[name]}
          name={name}
          onChange={(group) => { this.props.filterHandlers.state({ [group.name]: group.values }); }}
          selectedValues={activeFilters}
        />
      </Accordion>
    );
  }

  renderOrganizationFilter = () => {
    const activeFilters = this.props.activeFilters.orgs || [];

    return (
      <Accordion
        closedByDefault
        displayClearButton={activeFilters.length > 0}
        header={FilterAccordionHeader}
        label={<FormattedMessage id="ui-licenses.filters.organization" />}
        onClearFilter={() => {
          this.props.filterHandlers.clearGroup('orgs');
          this.props.filterHandlers.clearGroup('role');
        }}
      >
        <OrganizationSelection
          path="licenses/org"
          input={{
            name: 'license-orgs-filter',
            onChange: value => this.props.filterHandlers.state({ orgs: [value] }),
            value: activeFilters[0] || '',
          }}
        />
      </Accordion>
    );
  }

  renderRoleLabel = () => {
    const roles = this.props.data.orgRoleValues;
    const dataOptions = roles.map(role => ({
      value: role.id,
      label: role.label,
    }));

    const orgFilters = this.props.activeFilters.orgs || [];
    const activeFilters = this.props.activeFilters.role || [];

    return (
      <Accordion
        closedByDefault
        displayClearButton={activeFilters.length > 0}
        header={FilterAccordionHeader}
        label={<FormattedMessage id="ui-licenses.filters.organizationRole" />}
        onClearFilter={() => { this.props.filterHandlers.clearGroup('role'); }}
      >
        <Selection
          dataOptions={dataOptions}
          disabled={orgFilters.length === 0}
          value={activeFilters[0] || ''}
          onChange={value => this.props.filterHandlers.state({ role: [value] })}
        />
      </Accordion>
    );
  }

  render() {
    return (
      <AccordionSet>
        {this.renderCheckboxFilter('status')}
        {this.renderCheckboxFilter('type')}
        {this.renderOrganizationFilter()}
        {this.renderRoleLabel()}
      </AccordionSet>
    );
  }
}
