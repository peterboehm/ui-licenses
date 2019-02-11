import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { Accordion, AccordionSet, FilterAccordionHeader } from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

const FILTERS = [
  'status',
];

export default class LicenseFilters extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    resources: PropTypes.object.isRequired,
  };

  static defaultProps = {
    activeFilters: {
      status: [],
    }
  };

  state = {
    status: [],
  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};

    FILTERS.forEach(filter => {
      const values = get(props.resources, [`${filter}Values`, 'records'], []);
      if (values.length !== state[filter].length) {
        newState[filter] = values.map(({ label }) => ({ label, value: label }));
      }
    });

    if (Object.keys(newState).length) return newState;

    return null;
  }

  createClearFilterHandler = (name) => () => {
    this.props.onChange({ name, values: [] });
  }

  renderCheckboxFilter = (name, props) => {
    const activeFilters = this.props.activeFilters[name] || [];

    return (
      <Accordion
        displayClearButton={activeFilters.length > 0}
        header={FilterAccordionHeader}
        label={<FormattedMessage id={`ui-licenses.prop.${name}`} />}
        onClearFilter={() => { this.props.onChange({ name, values: [] }); }}
        {...props}
      >
        <CheckboxFilter
          dataOptions={this.state[name]}
          name={name}
          onChange={this.props.onChange}
          selectedValues={activeFilters}
        />
      </Accordion>
    );
  }

  render() {
    return (
      <AccordionSet>
        {this.renderCheckboxFilter('status')}
      </AccordionSet>
    );
  }
}
