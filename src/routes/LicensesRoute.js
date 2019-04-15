import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect, withStripes } from '@folio/stripes/core';
import { StripesConnectedSource } from '@folio/stripes/smart-components';

import getSASParams from '../util/getSASParams';

import View from '../components/Licenses';

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
      shouldRefresh: () => false,
    },
    typeValues: {
      type: 'okapi',
      path: 'licenses/refdata/License/type',
      shouldRefresh: () => false,
    },
    orgRoleValues: {
      type: 'okapi',
      path: 'licenses/refdata/LicenseOrg/role',
      shouldRefresh: () => false,
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
    location: PropTypes.shape({
      search: PropTypes.string,
    }).isRequired,
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

  state = {
    hideView: true,
  }

  static getDerivedStateFromProps(props) {
    const { location: { pathname } } = props;
    // Hide the view if we're on a create or edit route.
    const hideView = /\/create|\/edit/.test(pathname);

    return {
      hideView,
    };
  }

  componentDidMount() {
    this.source = new StripesConnectedSource(this.props, this.logger, 'licenses');

    if (this.searchField.current) {
      this.searchField.current.focus();
    }
  }

  // componentDidUpdate(nextProps) {
  //   const oldLicenses = get(this.props.resources, 'licenses.records', []);
  //   const newLicenses = get(nextProps.resources, 'licenses.records', []);

  //   if (newLicenses.length === 1 && oldLicenses.length !== 1) {
  //     const { history, location } = nextProps;
  //     const record = newLicenses[0];
  //     history.push(`/licenses/${record.id}${location.search}`);
  //   }
  // }


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
    const { children, location, resources } = this.props;

    if (this.source) {
      this.source.update(this.props, 'licenses');
    }

    if (this.state.hideView) {
      return children;
    }

    return (
      <View
        initialSearch="?sort=name&filters=status.Active"
        // initialFilterState={{
        //   status: ['Active']
        // }}
        // initialSortState="name"
        searchString={location.search}
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
      </View>
    );
  }
}

export default withStripes(stripesConnect(LicensesRoute));
