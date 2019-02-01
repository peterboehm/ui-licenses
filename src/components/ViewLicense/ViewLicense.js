import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  Icon,
  Layout,
  Pane,
  Layer,
  Button,
} from '@folio/stripes/components';

import {
  LicenseInfo,
  LicenseCustomProperties,
} from './Sections';

import EditLicense from '../EditLicense';

class ViewLicense extends React.Component {
  static manifest = Object.freeze({
    selectedLicense: {
      type: 'okapi',
      path: 'licenses/licenses/:{id}',
    },
    query: {},
  });

  static propTypes = {
    match: PropTypes.object,
    onClose: PropTypes.func,
    parentResources: PropTypes.object,
    paneWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stripes: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.getActionMenu = this.getActionMenu.bind(this);
  }

  state = {
    sections: {
      licenseInfo: true,
      licenseProperties: true
    }
  }

  getLicense() {
    return get(this.props.resources.selectedLicense, ['records', 0], {});
  }

  getSectionProps() {
    return {
      license: this.getLicense(),
      onToggle: this.handleSectionToggle,
      stripes: this.props.stripes,
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

  handleSubmit = (license) => {
    this.props.mutator.selectedLicense.PUT(license)
      .then(() => this.props.onCloseEdit());
  }

  renderLoadingPane() {
    return (
      <Pane
        id="pane-view-license"
        defaultWidth={this.props.paneWidth}
        paneTitle="Loading..."
        dismissible
        onClose={this.props.onClose}
      >
        <Layout className="marginTop1">
          <Icon icon="spinner-ellipsis" width="100px" />
        </Layout>
      </Pane>
    );
  }

  renderEditLayer() {
    const { resources: { query } } = this.props;

    return (
      <FormattedMessage id="ui-licenses.licenses.editLicense">
        {layerContentLabel => (
          <Layer
            isOpen={query.layer === 'edit'}
            contentLabel={layerContentLabel}
          >
            <EditLicense
              {...this.props}
              onSubmit={this.handleSubmit}
              parentMutator={this.props.mutator}
              initialValues={this.getLicense()}
            />
          </Layer>
        )}
      </FormattedMessage>
    );
  }

  getActionMenu = () => {
    if (!this.props.stripes.hasPerm('ui-licenses.licenses.edit')) return null;

    return (
      <React.Fragment>
        <Button
          buttonStyle="dropdownItem"
          href={this.props.editLink}
          id="clickable-edit-license"
          onClick={this.props.onEdit}
        >
          <Icon icon="edit">
            <FormattedMessage id="ui-licenses.licenses.editLicense" />
          </Icon>
        </Button>
      </React.Fragment>
    );
  }

  render() {
    const license = this.getLicense();
    if (!license) return this.renderLoadingPane();

    const sectionProps = this.getSectionProps();

    return (
      <Pane
        id="pane-view-license"
        defaultWidth={this.props.paneWidth}
        paneTitle={license.name}
        dismissible
        onClose={this.props.onClose}
        actionMenu={this.getActionMenu}
      >
        <AccordionSet>
          <LicenseInfo
            id="licenseInfo"
            open={this.state.sections.licenseInfo}
            {...sectionProps}
          />
          <LicenseCustomProperties
            id="licenseCustomProperties"
            open={this.state.sections.licenseCustomProperties}
            {...sectionProps}
          />
        </AccordionSet>

        { this.renderEditLayer() }
      </Pane>
    );
  }
}

export default ViewLicense;
