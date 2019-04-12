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

import { Spinner } from '@folio/stripes-erm-components';

import {
  LicenseAgreements,
  LicenseCoreDocs,
  LicenseHeader,
  LicenseInfo,
  LicenseTerms,
} from './sections';

class ViewLicense extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      license: PropTypes.object,
      terms: PropTypes.array,
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
      licenseAgreements: false,
    }
  }

  getSectionProps = (sectionId) => {
    const { data } = this.props;

    return {
      id: sectionId,
      onToggle: this.handleSectionToggle,
      open: this.state.sections[sectionId],
      license: data.license,
      terms: data.terms,
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

  getActionMenu = ({ onToggle }) => {
    const { editUrl } = this.props;

    if (!editUrl) return null;

    const handleClick = () => {
      // this.props.onEdit();
      onToggle();
    };

    return (
      <React.Fragment>
        <Button
          buttonStyle="dropdownItem"
          id="clickable-edit-license"
          // onClick={handleClick}
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
        paneTitle="Loading..."
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
        <LicenseHeader {...this.getSectionProps()} />
        <AccordionSet>
          <LicenseInfo {...this.getSectionProps('licenseInfo')} />
          <LicenseCoreDocs {...this.getSectionProps('licenseCoreDocs')} />
          <LicenseTerms {...this.getSectionProps('licenseTerms')} />
          <LicenseAgreements {...this.getSectionProps('licenseAgreements')} />
        </AccordionSet>
      </Pane>
    );
  }
}

export default ViewLicense;
