import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Accordion, FilterAccordionHeader } from '@folio/stripes/components';

import TermFiltersForm from './TermFiltersForm';

export default class TermFilters extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.object,
    data: PropTypes.object.isRequired,
    filterHandlers: PropTypes.object,
  };

  handleSubmit = values => {
    const { activeFilters, filterHandlers } = this.props;
    const { filters = [] } = values;

    console.log('Term Filters:', filters);

    const filterStrings = filters
      .map(filter => filter.rules
        .map(rule => `customProperties.${filter.customProperty}.value${rule.operator}${rule.value}`)
        .join('||'));

    console.log('Term Filter Strings:', filterStrings);

    filterHandlers.state({ ...activeFilters, terms: filterStrings });
  }

  render() {
    const { activeFilters, data, filterHandlers } = this.props;

    let numberOfFilters = 0;
    const filterStrings = activeFilters.terms || [];
    const filters = filterStrings.map(filter => {
      let customProperty;
      const rules = filter.split('||').map(ruleString => {
        // ruleString is constructed in this.handleSubmit passed to TermFiltersForm
        // and has shape "customProperties.foo.value!=42"
        const tokens = ruleString.split('.value');
        customProperty = tokens[0].replace('customProperties.', '');

        numberOfFilters += 1;
        return {
          operator: tokens[1].substring(0, 2),
          value: tokens[1].substring(2),
        };
      });

      return {
        customProperty,
        rules,
      };
    });

    return (
      <Accordion
        // closedByDefault TODO uncomment this
        id="clickable-terms-filter"
        displayClearButton={numberOfFilters > 0}
        header={FilterAccordionHeader}
        label={<FormattedMessage id="ui-licenses.section.terms" />}
        onClearFilter={() => filterHandlers.state({ ...activeFilters, terms: [] })}
        separator={false}
      >
        {`${numberOfFilters} term filters applied`}
        <TermFiltersForm
          initialValues={{ filters: filters.length ? filters : [{}] }}
          onSubmit={this.handleSubmit}
          terms={data.terms}
        />
      </Accordion>
    );
  }
}