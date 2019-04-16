import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect, withStripes } from '@folio/stripes/core';
import { StripesConnectedSource } from '@folio/stripes/smart-components';
import { getSASParams } from '@folio/stripes-erm-components';

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
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string,
    }).isRequired,
    mutator: PropTypes.object,
    resources: PropTypes.object,
    showSingleResult: PropTypes.bool,
    stripes: PropTypes.shape({
      logger: PropTypes.object,
    }),
  }

  static defaultProps = {
    showSingleResult: true,
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

  componentDidUpdate(prevProps) {
    const prevSource = new StripesConnectedSource(prevProps, this.logger, 'licenses');
    const oldCount = prevSource.totalCount();
    const oldRecords = prevSource.records();
    const newCount = this.source.totalCount();
    const newRecords = this.source.records();

    if (this.props.showSingleResult && newCount === 1) {
      if (oldCount !== 1 || (oldCount === 1 && oldRecords[0].id !== newRecords[0].id)) {
        const { history, location } = this.props;
        const record = newRecords[0];
        history.push(`/licenses/${record.id}${location.search}`);
      }
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
    const { children, location, resources } = this.props;

    if (this.source) {
      this.source.update(this.props, 'licenses');
    }

    if (this.state.hideView) {
      return children;
    }

    return (
      <View
        data={{
          licenses: get(resources, 'licenses.records', []),
          statusValues: get(resources, 'statusValues.records', []),
          typeValues: get(resources, 'typeValues.records', []),
          orgRoleValues: get(resources, 'orgRoleValues.records', []),
        }}
        initialSearch="?sort=name&filters=status.Active"
        onNeedMoreData={this.handleNeedMoreData}
        queryGetter={this.queryGetter}
        querySetter={this.querySetter}
        searchString={location.search}
        source={this.source}
      >
        {children}
      </View>
    );
  }
}

export default withStripes(stripesConnect(LicensesRoute));
