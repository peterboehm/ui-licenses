import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedMessage } from 'react-intl';
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
          'Type': 'type',
          'Status': 'status',
          'Start Date': 'startDate',
          'End Date': 'endDate'
        },
        filterKeys: {
          orgs: 'orgs.org',
          role: 'orgs.role',
        },
      })
    },
    selectedLicense: {
      type: 'okapi',
      path: 'licenses/licenses/${selectedLicenseId}', // eslint-disable-line no-template-curly-in-string
      fetch: false,
    },
    terms: {
      type: 'okapi',
      path: 'licenses/custprops',
    },
    statusValues: {
      type: 'okapi',
      path: 'licenses/refdata/License/status',
    },
    typeValues: {
      type: 'okapi',
      path: 'licenses/refdata/License/type',
    },
    orgRoleValues: {
      type: 'okapi',
      path: 'licenses/refdata/LicenseOrg/role',
    },
    query: {
      initialValue: {
        filters: 'status.Active',
        sort: 'Name',
      }
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    selectedLicenseId: { initialValue: '' },
  });

  static propTypes = {
    browseOnly: PropTypes.bool,
    disableRecordCreation: PropTypes.bool,
    resources: PropTypes.shape({
      query: PropTypes.object,
      records: PropTypes.object,
      statusValues: PropTypes.object,
      terms: PropTypes.object,
      typeValues: PropTypes.object,
    }),
    mutator: PropTypes.object,
    onSelectRow: PropTypes.func,
    packageInfo: PropTypes.object,
  };

  handleFilterChange = ({ name, values }) => {
    const newFilters = {
      ...this.getActiveFilters(),
      [name]: values,
    };

    const filters = Object.keys(newFilters)
      .map((filterName) => {
        return newFilters[filterName]
          .map(filterValue => `${filterName}.${filterValue}`)
          .join(',');
      })
      .filter(filter => filter)
      .join(',');

    this.props.mutator.query.update({ filters });
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

  getDefaultLicenseValues = () => {
    const status = get(this.props.resources.statusValues, ['records'], []).find(v => v.value === 'active') || {};
    const type = get(this.props.resources.typeValues, ['records'], []).find(v => v.value === 'local') || {};

    const customProperties = {};
    get(this.props.resources.terms, ['records'], [])
      .filter(term => term.primary)
      .forEach(term => { customProperties[term.name] = ''; });

    return {
      status: status.id,
      type: type.id,
      customProperties,
    };
  }

  getActiveFilters = () => {
    const { query } = this.props.resources;

    if (!query || !query.filters) return {};

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

  renderEndDate = (license) => {
    if (license.openEnded) return <FormattedMessage id="ui-licenses.prop.openEnded" />;
    if (license.endDate) return <FormattedDate value={license.endDate} />;

    return '';
  }

  render() {
    return (
      <SearchAndSort
        browseOnly={this.props.browseOnly}
        columnMapping={{
          name: <FormattedMessage id="ui-licenses.prop.name" />,
          type: <FormattedMessage id="ui-licenses.prop.type" />,
          status: <FormattedMessage id="ui-licenses.prop.status" />,
          startDate: <FormattedMessage id="ui-licenses.prop.startDate" />,
          endDate: <FormattedMessage id="ui-licenses.prop.endDate" />
        }}
        columnWidths={{
          name: 300,
          type: 150,
          status: 150,
          startDate: 200,
          endDate: 200
        }}
        detailProps={{
          onUpdate: this.handleUpdate,
          defaultLicenseValues: this.getDefaultLicenseValues(),
        }}
        disableRecordCreation={this.props.disableRecordCreation}
        editRecordComponent={EditLicense}
        initialResultCount={INITIAL_RESULT_COUNT}
        key="licenses"
        newRecordInitialValues={this.getDefaultLicenseValues()}
        newRecordPerms="ui-licenses.licenses.edit"
        objectName="license"
        onCreate={this.handleCreate}
        onFilterChange={this.handleFilterChange}
        onSelectRow={this.props.onSelectRow}
        packageInfo={this.props.packageInfo || packageInfo}
        parentMutator={this.props.mutator}
        parentResources={this.props.resources}
        renderFilters={this.renderFilters}
        resultCountIncrement={INITIAL_RESULT_COUNT}
        resultsFormatter={{
          type: a => a.type && a.type.label,
          status: a => a.status && a.status.label,
          startDate: a => (a.startDate ? <FormattedDate value={a.startDate} /> : ''),
          endDate: this.renderEndDate,
        }}
        showSingleResult
        viewRecordComponent={ViewLicense}
        viewRecordPerms="ui-licenses.licenses.view"
        visibleColumns={['name', 'type', 'status', 'startDate', 'endDate']}
      />
    );
  }
}
