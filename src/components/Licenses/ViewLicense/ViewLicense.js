import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import {
  AccordionSet,
  Icon,
  Layout,
  Pane,
  Layer,
} from '@folio/stripes/components';

import {
  LicenseInfo
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

  state = {
    sections: {
      licenseInfo: true
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
    const { resources: { query }, stripes: { intl } } = this.props;

    return (
      <Layer
        isOpen={query.layer === 'edit'}
        contentLabel={intl.formatMessage({ id: 'ui-licenses.licenses.editLicense' })}
      >
        <EditLicense
          {...this.props}
          onSubmit={this.handleSubmit}
          parentMutator={this.props.mutator}
          initialValues={this.getLicense()}
        />
      </Layer>
    );
  }

  render() {
    const license = this.getLicense();
    if (!license) return this.renderLoadingPane();

    const { stripes } = this.props;
    const sectionProps = this.getSectionProps();

    return (
      <Pane
        id="pane-view-license"
        defaultWidth={this.props.paneWidth}
        paneTitle={license.name}
        dismissible
        onClose={this.props.onClose}
        actionMenuItems={stripes.hasPerm('ui-licenses.licenses.edit') ? [{
          id: 'clickable-edit-license',
          title: stripes.intl.formatMessage({ id: 'ui-licenses.licenses.editLicense' }),
          label: stripes.intl.formatMessage({ id: 'ui-licenses.licenses.edit' }),
          href: this.props.editLink,
          onClick: this.props.onEdit,
          icon: 'edit',
        }] : []}
      >
        <AccordionSet>
          <LicenseInfo id="licenseInfo" open={this.state.sections.licenseInfo} {...sectionProps} />
        </AccordionSet>
        <pre>{JSON.stringify(license, null, '\t')}</pre>
        { this.renderEditLayer() }
      </Pane>
    );
  }
}

export default ViewLicense;
