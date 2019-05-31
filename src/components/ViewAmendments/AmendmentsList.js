import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import Link from 'react-router-dom/Link';

import { MultiColumnList } from '@folio/stripes/components';

export default class AmendmentsList extends React.Component {
  static propTypes = {
    license: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      amendments: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        status: PropTypes.shape({
          label: PropTypes.string.isRequired,
        }).isRequired,
      })),
    }),
    amendmentURL: PropTypes.func.isRequired,
    selectedAmendment: PropTypes.object,
  }

  rowFormatter = (row) => {
    const { rowClass, rowData, rowIndex, rowProps = {}, cells } = row;

    return (
      <Link
        aria-rowindex={rowIndex + 2}
        className={rowClass}
        data-label={rowData.name}
        key={`row-${rowIndex}`}
        role="row"
        to={this.props.amendmentURL(rowData.id)}
        {...rowProps}
      >
        {cells}
      </Link>
    );
  }

  render() {
    const { license, selectedAmendment } = this.props;

    return (
      <MultiColumnList
        columnMapping={{
          name: <FormattedMessage id="ui-licenses.prop.name" />,
          status: <FormattedMessage id="ui-licenses.prop.status" />,
        }}
        columnWidths={{
          name: '80%',
          status: '20%',
        }}
        contentData={license.amendments || []}
        formatter={{
          name: a => a.name || a.id,
          status: a => get(a, ['status', 'label'], '-'),
        }}
        id="amendments-table"
        rowFormatter={this.rowFormatter}
        selectedRow={selectedAmendment}
        visibleColumns={[
          'name',
          'status',
        ]}
      />
    );
  }
}
