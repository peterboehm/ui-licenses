import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { StripesConnectedSource } from '@folio/stripes/smart-components';
import { generateQueryParams } from '@folio/stripes-erm-components';

import View from '../components/Licenses';
import NoPermissions from '../components/NoPermissions';

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
      params: generateQueryParams({
        searchKey: 'name,alternateNames.name',
        filterKeys: {
          org: 'orgs.org',
          role: 'orgs.role',
          status: 'status.value',
          tags: 'tags.value',
          type: 'type.value'
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
    tags: {
      type: 'okapi',
      path: 'tags',
      params: {
        limit: '1000',
        query: 'cql.allRecords=1 sortby label',
      },
      records: 'tags',
    },
    terms: {
      type: 'okapi',
      path: 'licenses/custprops',
      shouldRefresh: () => false,
    },
    query: { initialValue: {} },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
  });

  static propTypes = {
    children: PropTypes.node,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
      search: PropTypes.string,
    }).isRequired,
    mutator: PropTypes.object,
    resources: PropTypes.object,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
      logger: PropTypes.object,
      okapi: PropTypes.shape({
        tenant: PropTypes.string.isRequired,
        token: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }).isRequired,
    }),
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }),
  }

  constructor(props) {
    super(props);

    this.logger = props.stripes.logger;
    this.searchField = React.createRef();

    this.state = {
      hasPerms: props.stripes.hasPerm('ui-licenses.licenses.view'),
    };
  }

  componentDidMount() {
    this.source = new StripesConnectedSource(this.props, this.logger, 'licenses');

    if (this.searchField.current) {
      this.searchField.current.focus();
    }
  }

  componentDidUpdate(prevProps) {
    const newCount = this.source.totalCount();
    const newRecords = this.source.records();

    if (newCount === 1) {
      const { history, location } = this.props;

      const prevSource = new StripesConnectedSource(prevProps, this.logger, 'licenses');
      const oldCount = prevSource.totalCount();
      const oldRecords = prevSource.records();

      if (oldCount !== 1 || (oldCount === 1 && oldRecords[0].id !== newRecords[0].id)) {
        const record = newRecords[0];
        history.push(`/licenses/${record.id}${location.search}`);
      }
    }
  }

  downloadBlob = () => (
    blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'compare_terms.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  )

  handleCompareLicenseTerms = (payload) => {
    const { stripes: { okapi } } = this.props;

    return fetch(`${okapi.url}/licenses/licenses/compareTerms`, {
      method: 'POST',
      headers: {
        'X-Okapi-Tenant': okapi.tenant,
        'X-Okapi-Token': okapi.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
    }).then(response => response.blob())
      .then(this.downloadBlob());
  }

  handleNeedMoreData = () => {
    if (this.source) {
      this.source.fetchMore(RESULT_COUNT_INCREMENT);
    }
  }

  querySetter = ({ nsValues }) => {
    this.props.mutator.query.update(nsValues);
  }

  queryGetter = () => {
    return get(this.props.resources, 'query', {});
  }

  render() {
    const { children, location, resources, match } = this.props;

    if (this.source) {
      this.source.update(this.props, 'licenses');
    }

    if (!this.state.hasPerms) return <NoPermissions />;

    return (
      <View
        data={{
          licenses: resources?.licenses?.records ?? [],
          statusValues: resources?.statusValues?.records ?? [],
          typeValues: resources?.typeValues?.records ?? [],
          orgRoleValues: resources?.orgRoleValues?.records ?? [],
          tags: resources?.tags?.records ?? [],
          terms: resources?.terms?.records ?? [],
        }}
        onCompareLicenseTerms={this.handleCompareLicenseTerms}
        onNeedMoreData={this.handleNeedMoreData}
        queryGetter={this.queryGetter}
        querySetter={this.querySetter}
        searchString={location.search}
        selectedRecordId={match.params.id}
        source={this.source}
      >
        {children}
      </View>
    );
  }
}

export default stripesConnect(LicensesRoute);
