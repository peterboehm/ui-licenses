import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedDate, FormattedMessage } from 'react-intl';
import Link from 'react-router-dom/Link';
import {
  Accordion,
  MultiColumnList,
} from '@folio/stripes/components';

import { LicenseEndDate } from '@folio/stripes-erm-components';

export default class LicenseAmendments extends React.Component {
  static propTypes = {
    license: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    const { id, license, onToggle, open } = this.props;

    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-licenses.section.amendments" />}
        open={open}
        onToggle={onToggle}
      >
        <MultiColumnList
          columnMapping={{
            name: <FormattedMessage id="ui-licenses.prop.name" />,
            status: <FormattedMessage id="ui-licenses.prop.agreementStatus" />,
            startDate: <FormattedMessage id="ui-licenses.prop.startDate" />,
            endDate: <FormattedMessage id="ui-licenses.prop.endDate" />,
          }}
          columnWidths={{
            name: '50%',
            status: '15%',
            startDate: '15%',
            endDate: '15%',
          }}
          contentData={license.amendments || []}
          formatter={{
            name: a => <Link to={`/licenses/${license.id}/amendments/${a.id}`}>{a.name}</Link>,
            status: a => get(a, ['status', 'label'], '-'),
            startDate: a => (a.startDate ? <FormattedDate value={a.startDate} /> : '-'),
            endDate: a => <LicenseEndDate license={a} />,
          }}
          id="amendments-table"
          interactive={false}
          visibleColumns={[
            'name',
            'status',
            'startDate',
            'endDate'
          ]}
        />
      </Accordion>
    );
  }
}
