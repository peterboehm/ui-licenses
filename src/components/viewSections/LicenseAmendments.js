import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import Link from 'react-router-dom/Link';
import {
  Accordion,
  Badge,
  Button,
  FormattedUTCDate,
  MultiColumnList,
} from '@folio/stripes/components';

import { LicenseEndDate } from '@folio/stripes-erm-components';

export default class LicenseAmendments extends React.Component {
  static propTypes = {
    license: PropTypes.shape({
      amendments: PropTypes.array,
    }),
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    urls: PropTypes.shape({
      addAmendment: PropTypes.func,
      viewAmendment: PropTypes.func.isRequired,
    }).isRequired
  };

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
    const { id, license, onToggle, open, urls } = this.props;

    return (
      <Accordion
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderAddAmendmentButton()}
        id={id}
        label={<FormattedMessage id="ui-licenses.section.amendments" />}
        open={open}
        onToggle={onToggle}
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
            name: a => <Link to={urls.viewAmendment(a.id)}>{a.name}</Link>,
            status: a => get(a, ['status', 'label'], '-'),
            startDate: a => (a.startDate ? <FormattedUTCDate value={a.startDate} /> : '-'),
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
