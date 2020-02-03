/* eslint-disable react/jsx-closing-tag-location */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Accordion, AccordionSet, FilterAccordionHeader, Selection, KeyValue } from '@folio/stripes/components';
import { CheckboxFilter, MultiSelectionFilter } from '@folio/stripes/smart-components';
import { OrganizationSelection } from '@folio/stripes-erm-components';

import TermFilters from './TermFilters';

const FILTERS = [
  'status',
  'type',
  'tags'
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
    tags: [],
  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};

    FILTERS.forEach(filter => {
      const values = props.data[`${filter}Values`];
      if (values.length !== state[filter].length) {
        newState[filter] = values;
      }
    });

    if (Object.keys(newState).length) return newState;

    return null;
  }

  renderCheckboxFilter = (name, props) => {
    const internalName = `${name}.value`;

    const { activeFilters } = this.props;
    const groupFilters = activeFilters[internalName] || [];

    return (
      <Accordion
        id={`filter-accordion-${name}`}
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        label={<FormattedMessage id={`ui-licenses.prop.${name}`} />}
        onClearFilter={() => { this.props.filterHandlers.clearGroup(internalName); }}
        separator={false}
        {...props}
      >
        <CheckboxFilter
          dataOptions={this.state[name]}
          name={internalName}
          onChange={(group) => { this.props.filterHandlers.state({ ...activeFilters, [group.name]: group.values }); }}
          selectedValues={groupFilters}
        />
      </Accordion>
    );
  }

  renderOrganizationFilter = () => {
    const { activeFilters } = this.props;
    const orgFilters = activeFilters['orgs.org'] || [];

    return (
      <Accordion
        closedByDefault
        displayClearButton={orgFilters.length > 0}
        header={FilterAccordionHeader}
        label={<FormattedMessage id="ui-licenses.filters.organization" />}
        onClearFilter={() => {
          this.props.filterHandlers.state({
            ...activeFilters,
            role: [],
            'orgs.org': [],
          });
        }}
        separator={false}
      >
        <OrganizationSelection
          path="licenses/org"
          input={{
            name: 'license-orgs-filter',
            onChange: value => this.props.filterHandlers.state({ ...activeFilters, 'orgs.org': [value] }),
            value: orgFilters[0] || '',
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

    const { activeFilters } = this.props;
    const orgFilters = activeFilters['orgs.org'] || [];
    const roleFilters = activeFilters['orgs.role'] || [];

    return (
      <Accordion
        closedByDefault
        displayClearButton={roleFilters.length > 0}
        header={FilterAccordionHeader}
        label={<FormattedMessage id="ui-licenses.filters.organizationRole" />}
        onClearFilter={() => { this.props.filterHandlers.clearGroup('orgs.role'); }}
        separator={false}
      >
        <Selection
          dataOptions={dataOptions}
          disabled={orgFilters.length === 0}
          value={roleFilters[0] || ''}
          onChange={value => this.props.filterHandlers.state({ ...activeFilters, 'orgs.role': [value] })}
        />
      </Accordion>
    );
  }

  renderTagsFilter = () => {
    const { activeFilters } = this.props;
    const tagFilters = activeFilters['tags.value'] || [];

    return (
      <Accordion
        closedByDefault
        id="clickable-tags-filter"
        displayClearButton={tagFilters.length > 0}
        header={FilterAccordionHeader}
        label={<FormattedMessage id="ui-licenses.tags" />}
        onClearFilter={() => { this.props.filterHandlers.clearGroup('tags.value'); }}
        separator={false}
      >
        <MultiSelectionFilter
          dataOptions={this.state.tags}
          id="tags-filter"
          name="tags.value"
          onChange={e => this.props.filterHandlers.state({ ...activeFilters, 'tags.value': e.values })}
          selectedValues={tagFilters}
        />
      </Accordion>
    );
  }

  renderTermFilters = () => {
    return <TermFilters {...this.props} />;
  }

  render() {
    return (
      <AccordionSet>
        {this.renderCheckboxFilter('status')}
        {this.renderCheckboxFilter('type')}
        {this.renderOrganizationFilter()}
        {this.renderRoleLabel()}
        {this.renderTagsFilter()}
        {this.renderTermFilters()}
      </AccordionSet>
    );
  }
}
