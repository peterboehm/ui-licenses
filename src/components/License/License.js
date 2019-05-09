import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  Icon,
  Layout,
  Pane,
  Button,
} from '@folio/stripes/components';
import { TitleManager } from '@folio/stripes/core';
import { Spinner } from '@folio/stripes-erm-components';

import {
  LicenseAgreements,
  LicenseCoreDocs,
  LicenseHeader,
  LicenseInfo,
  LicenseSupplement,
  LicenseTerms,
} from './sections';

class License extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      license: PropTypes.object,
      terms: PropTypes.array,
      users: PropTypes.array,
    }),
    editUrl: PropTypes.string,
    onEdit: PropTypes.func,
    stripes: PropTypes.object,
  };

  state = {
    sections: {
      licenseInfo: true,
      licenseCoreDocs: false,
      licenseTerms: false,
      licenseSupplement: false,
      licenseAgreements: false,
    }
  }

  getSectionProps = (id) => {
    const { data } = this.props;

    return {
      id,
      onToggle: this.handleSectionToggle,
      open: this.state.sections[id],
      license: data.license,
      terms: data.terms,
      users: data.users,
    };
  }

  handleSectionToggle = ({ id }) => {
    this.setState((prevState) => ({
      sections: {
        ...prevState.sections,
        [id]: !prevState.sections[id],
      }
    }));
  }

  getActionMenu = () => {
    const { editUrl } = this.props;

    if (!editUrl) return null;

    return (
      <React.Fragment>
        <Button
          buttonStyle="dropdownItem"
          id="clickable-edit-license"
          to={editUrl}
        >
          <Icon icon="edit">
            <FormattedMessage id="ui-licenses.editLicense" />
          </Icon>
        </Button>
      </React.Fragment>
    );
  }

  renderLoadingPane = () => {
    return (
      <Pane
        defaultWidth="45%"
        dismissible
        id="pane-view-license"
        onClose={this.props.onClose}
        paneTitle={<FormattedMessage id="ui-licenses.loading" />}
      >
        <Layout className="marginTop1">
          <Spinner />
        </Layout>
      </Pane>
    );
  }

  render() {
    const { data, isLoading, onClose } = this.props;

    if (isLoading) return this.renderLoadingPane();

    return (
      <Pane
        actionMenu={this.getActionMenu}
        defaultWidth="45%"
        dismissible
        id="pane-view-license"
        onClose={onClose}
        paneTitle={data.license.name}
      >
        <TitleManager record={data.license.name}>
          <LicenseHeader {...this.getSectionProps()} />
          <AccordionSet>
            <LicenseInfo {...this.getSectionProps('licenseInfo')} />
            <LicenseCoreDocs {...this.getSectionProps('licenseCoreDocs')} />
            <LicenseTerms {...this.getSectionProps('licenseTerms')} />
            <LicenseSupplement {...this.getSectionProps('licenseSupplement')} />
            <LicenseAgreements {...this.getSectionProps('licenseAgreements')} />
          </AccordionSet>
        </TitleManager>
      </Pane>
    );
  }
}

export default License;
