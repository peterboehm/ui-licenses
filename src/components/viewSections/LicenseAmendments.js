import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Badge,
  Button,
  FormattedUTCDate,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';

import { LicenseEndDate } from '@folio/stripes-erm-components';

export default class LicenseAmendments extends React.Component {
  static propTypes = {
    license: PropTypes.shape({
      amendments: PropTypes.array,
    }),
    handlers: PropTypes.shape({
      onAmendmentClick: PropTypes.func,
    }),
    id: PropTypes.string,
    urls: PropTypes.shape({
      addAmendment: PropTypes.func,
      viewAmendment: PropTypes.func.isRequired,
    }).isRequired
  };

  onRowClick = (_, row) => {
    const { handlers: { onAmendmentClick } } = this.props;
    onAmendmentClick(row.id);
  }

  renderAddAmendmentButton = () => {
    const { urls } = this.props;
    if (!urls.addAmendment) return null;

    return (
      <Button id="add-amendment-button" to={urls.addAmendment()}>
        <FormattedMessage id="ui-licenses.amendments.add" />
      </Button>
    );
  }

  renderBadge = () => {
    const count = get(this.props.license, 'amendments.length', 0);
    return <Badge>{count}</Badge>;
  }

  render() {
    const { id, license } = this.props;

    return (
      <Accordion
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderAddAmendmentButton()}
        id={id}
        label={<FormattedMessage id="ui-licenses.section.amendments" />}
      >
        <MultiColumnList
          columnMapping={{
            name: <FormattedMessage id="ui-licenses.prop.name" />,
            status: <FormattedMessage id="ui-licenses.prop.status" />,
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
            name: a => a.name,
            status: a => a?.status?.label ?? <NoValue />,
            startDate: a => (a.startDate ? <FormattedUTCDate value={a.startDate} /> : <NoValue />),
            endDate: a => <LicenseEndDate license={a} />,
          }}
          id="amendments-table"
          isEmptyMessage={<FormattedMessage id="ui-licenses.emptyAccordion.amendments" />}
          onRowClick={this.onRowClick}
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
