import React from 'react';
import PropTypes from 'prop-types';
import { SearchAndSort } from '@folio/stripes/smart-components';

import getSASParams from '../util/getSASParams';
import packageInfo from '../../package';

import ViewLicense from '../components/ViewLicense';
import EditLicense from '../components/EditLicense';

const INITIAL_RESULT_COUNT = 100;

export default class Licenses extends React.Component {
  static manifest = Object.freeze({
    records: {
      type: 'okapi',
      records: 'results',
      path: 'licenses/licenses',
      params: getSASParams({
        searchKey: 'name',
      })
    },
    query: {},
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
  });

  static propTypes = {
    resources: PropTypes.shape({
      records: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]),
    }),
    mutator: PropTypes.object,
    onSelectRow: PropTypes.func,
  };

  create = (license) => {
    const { mutator } = this.props;

    mutator.records.POST(license)
      .then(() => {
        mutator.query.update({
          _path: `/licenses/view/${license.id}`,
          layer: '',
        });
      });
  };

  render() {
    // II Copied from ../ui-users/src/Users.js - I have no idea which of these might be needed for other things, or where this list
    // is defined, so leaving it here in full, along with the signpost to Users.js to try and help the next lost soul who finds themselves here.
    const { onSelectRow } = this.props;

    const path = '/licenses';
    packageInfo.stripes.route = path;
    packageInfo.stripes.home = path;

    return (
      <SearchAndSort
        columnMapping={{
          id: 'ID',
          name: 'Name',
          description: 'Description'
        }}
        columnWidths={{
          id: 300,
          name: 300,
          description: 'auto',
        }}
        editRecordComponent={EditLicense}
        filterConfig={[]}
        initialResultCount={INITIAL_RESULT_COUNT}
        key="licenses"
        newRecordPerms="module.licenses.enabled"
        objectName="title"
        onCreate={this.create}
        onSelectRow={onSelectRow}
        packageInfo={packageInfo}
        parentMutator={this.props.mutator}
        parentResources={this.props.resources}
        resultCountIncrement={INITIAL_RESULT_COUNT}
        showSingleResult
        viewRecordComponent={ViewLicense}
        viewRecordPerms="module.licenses.enabled"
        visibleColumns={['name', 'description']}
      />
    );
  }
}
