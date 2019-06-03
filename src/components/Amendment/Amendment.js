import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedDate, FormattedMessage } from 'react-intl';

import {
  Accordion,
  Button,
  Col,
  KeyValue,
  Layout,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';

import { IfPermission } from '@folio/stripes/core';

import {
  LicenseCard,
  LicenseEndDate,
  Spinner,
} from '@folio/stripes-erm-components';

export default class Amendment extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      amendment: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        status: PropTypes.shape({
          label: PropTypes.string,
        }),
      }).isRequired,
      license: PropTypes.object.isRequired,
    }),
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
    }),
    isLoading: PropTypes.bool,
    urls: PropTypes.shape({
      editAmendment: PropTypes.func,
      viewLicense: PropTypes.func,
    }),
  }

  renderLoadingPane = () => {
    return (
      <Pane
        defaultWidth="45%"
        dismissible
        id="pane-view-amendment"
        onClose={this.props.handlers.onClose}
        paneTitle={<FormattedMessage id="ui-licenses.loading" />}
      >
        <Layout className="marginTop1">
          <Spinner />
        </Layout>
      </Pane>
    );
  }

  renderEditAmendmentPaneMenu = () => (
    <IfPermission perm="ui-licenses.licenses.edit">
      <PaneMenu>
        <FormattedMessage id="ui-licenses.amendments.create">
          {ariaLabel => (
            <Button
              aria-label={ariaLabel}
              buttonStyle="primary"
              id="clickable-edit-amendment"
              marginBottom0
              to={this.props.urls.editAmendment()}
            >
              <FormattedMessage id="stripes-components.button.edit" />
            </Button>
          )}
        </FormattedMessage>
      </PaneMenu>
    </IfPermission>
  )

  render() {
    const {
      data: { amendment, license },
      handlers: { onClose },
      isLoading,
    } = this.props;

    if (isLoading) return this.renderLoadingPane();

    return (
      <Pane
        defaultWidth="45%"
        dismissible
        id="pane-view-amendment"
        lastMenu={this.renderEditAmendmentPaneMenu()}
        onClose={onClose}
        paneTitle={amendment.name}
      >

        <LicenseCard license={license} />
        <Accordion
          id="amendment-info-accordion"
          label={<FormattedMessage id="ui-licenses.amendments.amendmentInfo" />}
        >
          <Row>
            <Col xs={12}>
              <KeyValue label={<FormattedMessage id="ui-licenses.prop.name" />}>
                <div data-test-amendment-name>
                  {amendment.name || amendment.id}
                </div>
              </KeyValue>
            </Col>
          </Row>
          <Row>
            <Col xs={6} md={3}>
              <KeyValue label={<FormattedMessage id="ui-licenses.prop.status" />}>
                <div data-test-amendment-status>
                  {get(amendment, ['status', 'label'], '-')}
                </div>
              </KeyValue>
            </Col>
            <Col xs={6} md={3}>
              <KeyValue label={<FormattedMessage id="ui-licenses.prop.startDate" />}>
                <div data-test-amendment-start-date>
                  {amendment.startDate ? <FormattedDate value={amendment.startDate} /> : '-'}
                </div>
              </KeyValue>
            </Col>
            <Col xs={6} md={3}>
              <KeyValue label={<FormattedMessage id="ui-licenses.prop.endDate" />}>
                <div data-test-amendment-end-date>
                  <LicenseEndDate license={amendment} />
                </div>
              </KeyValue>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <KeyValue label={<FormattedMessage id="ui-licenses.prop.description" />}>
                <div data-test-amendment-description>
                  {amendment.description || '-'}
                </div>
              </KeyValue>
            </Col>
          </Row>
        </Accordion>
      </Pane>
    );
  }
}
