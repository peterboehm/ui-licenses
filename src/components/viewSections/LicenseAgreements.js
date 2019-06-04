import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedDate, FormattedMessage } from 'react-intl';
import Link from 'react-router-dom/Link';
import { IfInterface } from '@folio/stripes/core';
import {
  Accordion,
  Badge,
  InfoPopover,
  Layout,
  MultiColumnList,
} from '@folio/stripes/components';
import { Spinner } from '@folio/stripes-erm-components';

export default class LicenseAgreements extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    license: PropTypes.shape({
      id: PropTypes.string,
      linkedAgreements: PropTypes.arrayOf(PropTypes.shape({
        note: PropTypes.string,
        owner: PropTypes.shape({
          agreementStatus: PropTypes.shape({
            label: PropTypes.string,
          }),
          endDate: PropTypes.string,
          id: PropTypes.string,
          name: PropTypes.string,
          startDate: PropTypes.string,
        }),
        status: PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string,
        }).isRequired,
      })).isRequired,
    }).isRequired,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  state = {
    groupedLinkedAgreements: [],
  }


  static getDerivedStateFromProps(props, state) {
    const { license: { linkedAgreements } } = props;

    if (
      (linkedAgreements.length !== state.groupedLinkedAgreements.length) ||
      (get(linkedAgreements, [0, 'owner', 'id']) !== get(state.groupedLinkedAgreements, [0, 'owner', 'id']))
    ) {
      return {
        groupedLinkedAgreements: [
          ...linkedAgreements.filter(a => a.status.value === 'controlling'),
          ...linkedAgreements.filter(a => a.status.value !== 'controlling'),
        ]
      };
    }

    return null;
  }

  renderLinkedAgreements = () => {
    return (
      <MultiColumnList
        columnMapping={{
          linkNote: '',
          name: <FormattedMessage id="ui-licenses.prop.name" />,
          startDate: <FormattedMessage id="ui-licenses.prop.startDate" />,
          endDate: <FormattedMessage id="ui-licenses.prop.endDate" />,
          agreementStatus: <FormattedMessage id="ui-licenses.prop.agreementStatus" />,
          linkStatus: <FormattedMessage id="ui-licenses.prop.linkStatus" />,
        }}
        columnWidths={{
          linkNote: 30,
          name: '30%',
          startDate: '15%',
          endDate: '15%',
          agreementStatus: '15%',
          linkStatus: '15%',
        }}
        contentData={this.state.groupedLinkedAgreements}
        formatter={{
          linkNote: link => (link.note ? <InfoPopover content={link.note} /> : ''),
          name: ({ owner:agreement = {} }) => <Link to={`/erm/agreements/view/${agreement.id}`}>{agreement.name}</Link>,
          startDate: ({ owner:agreement = {} }) => (agreement.startDate ? <FormattedDate value={agreement.startDate} /> : '-'),
          endDate: ({ owner:agreement = {} }) => (agreement.endDate ? <FormattedDate value={agreement.endDate} /> : '-'),
          agreementStatus: ({ owner:agreement = {} }) => get(agreement, ['agreementStatus', 'label'], '-'),
          linkStatus: link => (link.status ? link.status.label : '-'),
        }}
        id="linked-agreements-table"
        interactive={false}
        visibleColumns={[
          'linkNote',
          'name',
          'startDate',
          'endDate',
          'agreementStatus',
          'linkStatus',
        ]}
      />
    );
  }

  renderBadge = () => {
    const count = this.props.license.linkedAgreements.length;
    return count !== undefined ? <Badge>{count}</Badge> : <Spinner />;
  }

  render() {
    const { id, onToggle, open } = this.props;

    return (
      <IfInterface name="erm">
        <Accordion
          displayWhenClosed={this.renderBadge()}
          displayWhenOpen={this.renderBadge()}
          id={id}
          label={<FormattedMessage id="ui-licenses.section.licenseAgreements" />}
          onToggle={onToggle}
          open={open}
        >
          <Layout className="padding-bottom-gutter">
            { this.state.groupedLinkedAgreements.length ? this.renderLinkedAgreements() : <FormattedMessage id="ui-licenses.licenseAgreements.none" /> }
          </Layout>
        </Accordion>
      </IfInterface>
    );
  }
}
