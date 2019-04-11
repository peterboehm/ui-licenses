import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import { stripesConnect, withStripes } from '@folio/stripes/core';
import { StripesConnectedSource } from '@folio/stripes/smart-components';

import getSASParams from '../util/getSASParams';
import packageInfo from '../../package';

import EditLicense from '../components/EditLicense';
import LicenseFilters from '../components/LicenseFilters';
import ViewLicense from '../components/ViewLicense';
import LicensesView from '../components/LicensesView';

const INITIAL_RESULT_COUNT = 100;
const RESULT_COUNT_INCREMENT = 100;

class LicensesRoute extends React.Component {
  static manifest = Object.freeze({
    licenses: {
      type: 'okapi',
      records: 'results',
      recordsRequired: '%{resultCount}',
      perRequest: RESULT_COUNT_INCREMENT,
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
        sort: 'name',
      }
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    selectedLicenseId: { initialValue: '' },
  });

  static propTypes = {
    children: PropTypes.node,
    mutator: PropTypes.object,
    resources: PropTypes.object,
    stripes: PropTypes.shape({
      logger: PropTypes.object,
    }),
  }

  constructor(props) {
    super(props);

    this.logger = props.stripes.logger;
    this.searchField = React.createRef();
  }

  componentDidMount() {
    this.source = new StripesConnectedSource(this.props, this.logger, 'licenses');

    if (this.searchField.current) {
      this.searchField.current.focus();
    }
  }

  handleNeedMoreData = () => {
    if (this.source) {
      this.source.fetchMore(RESULT_COUNT_INCREMENT);
    }
  }

  querySetter = ({ nsValues, state }) => {
    if (/reset/.test(state.changeType)) {
      this.props.mutator.query.replace(nsValues);
    } else {
      this.props.mutator.query.update(nsValues);
    }
  }

  queryGetter = () => {
    return get(this.props.resources, 'query', {});
  }

  render() {
    const { children, resources } = this.props;

    if (this.source) {
      this.source.update(this.props, 'licenses');
    }

    return (
      <LicensesView
        // initialSearch="?sort=name&filters=status.Active"
        initialFilterState={{
          status: ['Active']
        }}
        initialSortState="name"
        source={this.source}
        queryGetter={this.queryGetter}
        querySetter={this.querySetter}
        onNeedMoreData={this.handleNeedMoreData}
        data={{
          licenses: get(resources, 'licenses.records', []),
          statusValues: get(resources, 'statusValues.records', []),
          typeValues: get(resources, 'typeValues.records', []),
          orgRoleValues: get(resources, 'orgRoleValues.records', []),
        }}
      >
        {children}
      </LicensesView>
    );
  }
}

export default withStripes(stripesConnect(LicensesRoute));
