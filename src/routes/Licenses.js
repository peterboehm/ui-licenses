import React from 'react';
import PropTypes from 'prop-types';
import { SearchAndSort } from '@folio/stripes/smart-components';

import getSASParams from '../util/getSASParams';
import packageInfo from '../../package';

import ViewLicense from '../components/Licenses/ViewLicense';
import EditLicense from '../components/Licenses/EditLicense';

const INITIAL_RESULT_COUNT = 100;

class Licenses extends React.Component {
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
  }

  render() {
    // II Copied from ../ui-users/src/Users.js - I have no idea which of these might be needed for other things, or where this list
    // is defined, so leaving it here in full, along with the signpost to Users.js to try and help the next lost soul who finds themseleves here.
    const { onSelectRow, showSingleResult } = this.props;

    const path = '/licenses';
    packageInfo.stripes.route = path;
    packageInfo.stripes.home = path;

    return (
      <React.Fragment>
        <SearchAndSort
          key="licenses"
          packageInfo={packageInfo}
          filterConfig={[]}
          objectName="title"
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={INITIAL_RESULT_COUNT}
          viewRecordComponent={ViewLicense}
          editRecordComponent={EditLicense}
          visibleColumns={['id', 'name', 'description']}
          viewRecordPerms="module.licenses.enabled"
          newRecordPerms="module.licenses.enabled"
          onCreate={this.create}
          onSelectRow={onSelectRow}
          parentResources={this.props.resources}
          parentMutator={this.props.mutator}
          showSingleResult
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
        />
      </React.Fragment>
    );
  }
}

export default Licenses;
