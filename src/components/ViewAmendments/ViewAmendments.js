import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  PaneMenu,
  Paneset,
  Pane,
} from '@folio/stripes/components';

import { IfPermission } from '@folio/stripes/core';

import AmendmentsList from './AmendmentsList';
import Amendment from './Amendment';

export default class ViewAmendments extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      license: PropTypes.shape({
        amendments: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          status: PropTypes.shape({
            label: PropTypes.string.isRequired,
          }).isRequired,
        })),
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }),
      selectedAmendmentId: PropTypes.string,
    }),
    onClose: PropTypes.func.isRequired,
    urls: PropTypes.shape({
      createAmendment: PropTypes.func.isRequired,
    }).isRequired,
  }

  state = {
    selectedAmendment: {}
  }

  static getDerivedStateFromProps(props, state) {
    const { data, selectedAmendmentId } = props;
    const amendments = get(data, 'license.amendments', []);
    const selectedAmendment = amendments.find(a => a.id === selectedAmendmentId);
    if (selectedAmendment && selectedAmendment.id !== state.selectedAmendment.id) {
      return { selectedAmendment };
    }

    return null;
  }

  renderCreateAmendmentPaneMenu = () => (
    <IfPermission perm="ui-licenses.licenses.edit">
      <PaneMenu>
        <FormattedMessage id="ui-licenses.amendments.create">
          {ariaLabel => (
            <Button
              aria-label={ariaLabel}
              buttonStyle="primary"
              id="clickable-new-license"
              marginBottom0
              to={this.props.urls.createAmendment()}
            >
              <FormattedMessage id="stripes-smart-components.new" />
            </Button>
          )}
        </FormattedMessage>
      </PaneMenu>
    </IfPermission>
  )

  render() {
    const { data: { license }, onClose, urls } = this.props;
    const { selectedAmendment } = this.state;

    return (
      <Paneset id="amendments-paneset">
        <Pane
          defaultWidth="50%"
          id="pane-list-amendments"
          lastMenu={this.renderCreateAmendmentPaneMenu()}
          paneTitle={license.name}
        >
          <AmendmentsList
            amendmentURL={urls.viewAmendment}
            license={license}
            selectedAmendment={selectedAmendment}
          />
        </Pane>
        <Pane
          defaultWidth="50%"
          dismissible
          id="pane-view-amendment"
          onClose={onClose}
          paneTitle={selectedAmendment.names}
        >
          <Amendment
            amendment={selectedAmendment}
            license={license}
          />
        </Pane>
      </Paneset>
    );
  }
}
