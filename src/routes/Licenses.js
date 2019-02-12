import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

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
      recordsRequired: '%{resultCount}',
      perRequest: 100,
      limitParam: 'perPage',
      path: 'licenses/licenses',
      params: getSASParams({
        searchKey: 'name',
        columnMap: {
          'Name': 'name',
          'Description': 'description',
        }
      })
    },
    selectedLicense: {
      type: 'okapi',
      path: 'licenses/licenses/${selectedLicenseId}', // eslint-disable-line no-template-curly-in-string
      fetch: false,
    },
    statusValues: {
      type: 'okapi',
      path: 'licenses/refdata/License/status',
    },
    typeValues: {
      type: 'okapi',
      path: 'licenses/refdata/License/type',
    },
    endDateSemanticsValues: {
      type: 'okapi',
      path: 'licenses/refdata/License/endDateSemantics',
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
      typeValues: PropTypes.object,
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
      .then((newLicense) => {
        mutator.query.update({
          _path: `/licenses/view/${newLicense.id}`,
          layer: '',
        });
      });
  };

  handleUpdate = (license) => {
    this.props.mutator.selectedLicenseId.replace(license.id);

    return this.props.mutator.selectedLicense.PUT(license);
  }

  validateLicense = (values) => {
    const errors = {};

    if (values.startDate && values.endDate) {
      const startDate = new Date(values.startDate);
      const endDate = new Date(values.endDate);

      if (startDate >= endDate) {
        errors.endDate = (
          <div data-test-error-end-date-too-early>
            <FormattedMessage id="ui-licenses.errors.endDateGreaterThanStartDate" />
          </div>
        );
      }
    }

    return errors;
  }

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

  getDefaultLicenseValues = () => {
    const status = get(this.props.resources.statusValues, ['records'], []).find(v => v.value === 'active') || {};
    const type = get(this.props.resources.typeValues, ['records'], []).find(v => v.value === 'local') || {};

    return {
      status: status.id,
      type: type.id,
    };
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
          name: <FormattedMessage id="ui-licenses.prop.name" />,
          description: <FormattedMessage id="ui-licenses.prop.description" />
        }}
        columnWidths={{
          name: 300,
          description: 'auto',
        }}
        detailProps={{
          onUpdate: this.handleUpdate,
          validateLicense: this.validateLicense,
        }}
        editRecordComponent={EditLicense}
        initialResultCount={INITIAL_RESULT_COUNT}
        key="licenses"
        newRecordInitialValues={this.getDefaultLicenseValues()}
        newRecordPerms="ui-licenses.licenses.edit"
        objectName="license"
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
        viewRecordPerms="ui-licenses.licenses.view"
        visibleColumns={['name', 'description']}
      />
    );
  }
}
