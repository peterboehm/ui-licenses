import React from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, get } from 'lodash';
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
  LicenseAgreements,
  LicenseCoreDocs,
  LicenseHeader,
  LicenseInfo,
  LicenseTerms,
} from './sections';

import EditLicense from '../EditLicense';

class ViewLicense extends React.Component {
  static manifest = Object.freeze({
    selectedLicense: {
      type: 'okapi',
      path: 'licenses/licenses/:{id}',
    },
    linkedAgreements: {
      type: 'okapi',
      path: 'licenses/licenses/:{id}/linkedAgreements',
      params: {
        sort: 'owner.startDate;asc'
      },
      throwErrors: false,
    },
    query: {},
  });

  static propTypes = {
    defaultLicenseValues: PropTypes.shape({
      customProperties: PropTypes.object,
    }),
    editLink: PropTypes.string,
    match: PropTypes.object,
    mutator: PropTypes.shape({
      selectedLicense: PropTypes.shape({
        PUT: PropTypes.func,
      })
    }),
    onEdit: PropTypes.func,
    onClose: PropTypes.func,
    onCloseEdit: PropTypes.func,
    paneWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    parentResources: PropTypes.object,
    resources: PropTypes.shape({
      selectedLicense: PropTypes.object,
    }),
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

  getLicense = () => {
    return get(this.props.resources.selectedLicense, ['records', 0], {});
  }

  getInitialValues = () => {
    const license = cloneDeep(this.getLicense());
    const { customProperties = {}, orgs, status, type } = license;

    if (status && status.id) {
      license.status = status.id;
    }

    if (type && type.id) {
      license.type = type.id;
    }

    if (orgs && orgs.length) {
      license.orgs = orgs.map(o => ({ ...o, role: o.role.id }));
    }

    const defaultCustomProperties = get(this.props.defaultLicenseValues, ['customProperties'], {});
    license.customProperties = {
      ...defaultCustomProperties,
      ...customProperties,
    };

    return license;
  }

  getSectionProps = () => {
    return {
      license: this.getLicense(),
      linkedAgreements: get(this.props.resources.linkedAgreements, ['records'], []),
      onToggle: this.handleSectionToggle,
      parentResources: this.props.parentResources,
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

  renderLoadingPane = () => {
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

  renderEditLayer = () => {
    const { resources: { query } } = this.props;

    return (
      <FormattedMessage id="ui-licenses.editLicense">
        {layerContentLabel => (
          <Layer
            isOpen={query.layer === 'edit'}
            contentLabel={layerContentLabel}
          >
            <EditLicense
              {...this.props}
              onCancel={this.props.onCloseEdit}
              onSubmit={this.handleSubmit}
              parentMutator={this.props.mutator}
              initialValues={this.getInitialValues()}
            />
          </Layer>
        )}
      </FormattedMessage>
    );
  }

  getActionMenu = ({ onToggle }) => {
    if (!this.props.stripes.hasPerm('ui-licenses.licenses.edit')) return null;

    const handleClick = () => {
      this.props.onEdit();
      onToggle();
    };

    return (
      <React.Fragment>
        <Button
          buttonStyle="dropdownItem"
          href={this.props.editLink}
          id="clickable-edit-license"
          onClick={handleClick}
        >
          <Icon icon="edit">
            <FormattedMessage id="ui-licenses.editLicense" />
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
        <LicenseHeader {...sectionProps} />
        <AccordionSet>
          <LicenseInfo
            id="licenseInfo"
            open={this.state.sections.licenseInfo}
            {...sectionProps}
          />
          <LicenseCoreDocs
            id="licenseCoreDocs"
            open={this.state.sections.licenseCoreDocs}
            {...sectionProps}
          />
          <LicenseTerms
            id="licenseTerms"
            open={this.state.sections.licenseTerms}
            {...sectionProps}
          />
          <LicenseAgreements
            id="licenseAgreements"
            open={this.state.sections.licenseAgreements}
            {...sectionProps}
          />
        </AccordionSet>

        { this.renderEditLayer() }
      </Pane>
    );
  }
}

export default ViewLicense;
