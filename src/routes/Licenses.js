import React from 'react';
import PropTypes from 'prop-types';
import { SearchAndSort } from '@folio/stripes/smart-components';

import getSASParams from '../util/getSASParams';
import packageInfo from '../../package';

import EditLicense from '../components/EditLicense';
import LicenseFilters from '../components/LicenseFilters';
import ViewLicense from '../components/ViewLicense';

const INITIAL_RESULT_COUNT = 100;

export default class Licenses extends React.Component {
  static manifest = Object.freeze({
    records: {
      type: 'okapi',
      records: 'results',
      path: 'licenses/licenses',
      params: getSASParams({
        searchKey: 'name',
        columnMap: {
          'Name': 'name',
          'Description': 'description',
        }
      })
    },
    statusValues: {
      type: 'okapi',
      path: 'licenses/refdata/License/status',
    },
    query: { initialValue: {} },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    selectedLicenseId: { initialValue: '' },
  });

  static propTypes = {
    resources: PropTypes.shape({
      query: PropTypes.object,
      records: PropTypes.object,
      statusValues: PropTypes.object,
    }),
    mutator: PropTypes.object,
    onSelectRow: PropTypes.func,
    browseOnly: PropTypes.bool,
  };

  state = {
    activeFilters: [],
  }

  handleFilterChange = ({ name, values }) => {
    this.setState((prevState) => ({
      activeFilters: {
        ...prevState.activeFilters,
        [name]: values,
      }
    }), () => {
      const { activeFilters } = this.state;

      const filters = Object.keys(activeFilters)
        .map((filterName) => {
          return activeFilters[filterName]
            .map((filterValue) => `${filterName}.${filterValue}`)
            .join(',');
        })
        .filter(filter => filter)
        .join(',');

      this.props.mutator.query.update({ filters });
    });
  }

  handleCreate = (license) => {
    const { mutator } = this.props;

    mutator.records.POST(license)
      .then(() => {
        mutator.query.update({
          _path: `/licenses/view/${license.id}`,
          layer: '',
        });
      });
  };

  getActiveFilters = () => {
    const { query } = this.props.resources;

    if (!query || !query.filters) return undefined;

    return query.filters
      .split(',')
      .reduce((filterMap, currentFilter) => {
        const [name, value] = currentFilter.split('.');

        if (!Array.isArray(filterMap[name])) {
          filterMap[name] = [];
        }

        filterMap[name].push(value);
        return filterMap;
      }, {});
  }

  renderFilters = (onChange) => {
    return (
      <LicenseFilters
        activeFilters={this.getActiveFilters()}
        onChange={onChange}
        resources={this.props.resources}
      />
    );
  }

  render() {
    return (
      <SearchAndSort
        browseOnly={this.props.browseOnly}
        columnMapping={{
          name: 'Name',
          description: 'Description'
        }}
        columnWidths={{
          name: 300,
          description: 'auto',
        }}
        editRecordComponent={EditLicense}
        filterConfig={[]}
        initialResultCount={INITIAL_RESULT_COUNT}
        key="licenses"
        newRecordPerms="module.licenses.enabled"
        objectName="title"
        onCreate={this.handleCreate}
        onFilterChange={this.handleFilterChange}
        onSelectRow={this.props.onSelectRow}
        packageInfo={packageInfo}
        parentMutator={this.props.mutator}
        parentResources={this.props.resources}
        renderFilters={this.renderFilters}
        resultCountIncrement={INITIAL_RESULT_COUNT}
        showSingleResult
        viewRecordComponent={ViewLicense}
        viewRecordPerms="module.licenses.enabled"
        visibleColumns={['name', 'description']}
      />
    );
  }
}
