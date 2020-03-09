import React from 'react';
import PropTypes from 'prop-types';
import { keyBy, mapValues, pickBy, sortBy } from 'lodash';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Checkbox,
  Layout,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

import css from './ExportLicenseAsCSVModal.css';

export default class ExportLicenseAsCSVModal extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
    onCompareLicenseTerms: PropTypes.func,
    selectedLicenses: PropTypes.arrayOf(PropTypes.string),
    terms: PropTypes.arrayOf(PropTypes.object),
  };

  constructor(props) {
    super(props);

    this.licenseInformation = [
      { key: 'name', value: <FormattedMessage id="ui-licenses.exportLicensesModal.name" /> },
      { key: 'startDate', value: <FormattedMessage id="ui-licenses.exportLicensesModal.startDate" /> },
      { key: 'endDate', value : <FormattedMessage id="ui-licenses.exportLicensesModal.endDate" /> },
      { key: 'status', value: <FormattedMessage id="ui-licenses.exportLicensesModal.status" /> },
      { key: 'type', value: <FormattedMessage id="ui-licenses.exportLicensesModal.type" /> },
    ];

    this.terms = [
      { key: 'value', value: <FormattedMessage id="ui-licenses.exportLicensesModal.value" /> },
      { key: 'note', value: <FormattedMessage id="ui-licenses.exportLicensesModal.note" /> },
      { key: 'publicNote', value : <FormattedMessage id="ui-licenses.exportLicensesModal.publicNote" /> },
      { key: 'internal', value: <FormattedMessage id="ui-licenses.exportLicensesModal.internal" /> },
    ];

    this.termNames = sortBy(props.terms, (term) => {
      return term?.label?.toLowerCase();
    }).map(item => {
      return {
        'key': item.name,
        'value': item.label
      };
    });

    // Default state for all the checkboxes initialized to false (unchecked)
    this.state = {
      licenseInformation: mapValues(keyBy(this.licenseInformation, 'key'), () => false),
      terms: mapValues(keyBy(this.terms, 'key'), () => false),
      termNames: mapValues(keyBy(this.termNames, 'key'), () => false)
    };
  }

  toggleSelectAll = (e) => {
    const { checked } = e.target;

    this.setState(prevState => ({
      licenseInformation: mapValues(prevState.licenseInformation, () => checked),
      terms: mapValues(prevState.terms, () => checked),
      termNames: mapValues(prevState.termNames, () => checked),
    }));
  }

  toggleSelectSection = (e, section) => {
    const { checked } = e.target;

    this.setState(prevState => ({
      [section]: mapValues(prevState[section], () => checked),
    }));
  }

  updateSelection = (e, section) => {
    const { checked, name } = e.target;
    this.setState(prevState => ({
      [section]: { ...prevState[section], [name]: checked }
    }));
  };

  renderCheckboxesList = (section) => {
    return (
      <>
        <Checkbox
          checked={Object.values(this.state[section]).includes(false) !== true}
          label={<strong><FormattedMessage id={`ui-licenses.exportLicensesModal.${section}`} /></strong>}
          onChange={(e) => this.toggleSelectSection(e, section)}
          value={section}
        />
        <Layout className="padding-start-gutter">
          {
          this[section].map(({ key, value }, index) => (
            <Checkbox
              key={index}
              checked={this.state[section][key]}
              label={value}
              labelClass={css.labelClass}
              name={key}
              onChange={(e) => this.updateSelection(e, section)}
              value={key}
            />
          ))
        }
        </Layout>
      </>
    );
  }

  renderExportLicenseAsCSVModal = () => {
    const { licenseInformation, terms, termNames } = this.state;
    const footer = (
      <ModalFooter>
        <Button
          buttonStyle="primary"
          disabled={Object.values({ ...licenseInformation, ...terms, ...termNames }).includes(true) !== true}
          id="export-licenses-modal-save-button"
          onClick={() => {
            const payload = {
              ids: this.props.selectedLicenses,
              include: { ...pickBy(licenseInformation), ...{ 'customProperties': pickBy(termNames) } },
              terms: pickBy(terms)
            };

            this.props.onCompareLicenseTerms(payload)
              .then(() => this.props.onClose());
          }}
        >
          <FormattedMessage id="stripes-components.saveAndClose" />
        </Button>
        <Button
          buttonStyle="default"
          id="export-licenses-modal-cancel-button"
          onClick={this.props.onClose}
        >
          <FormattedMessage id="stripes-components.cancel" />
        </Button>
      </ModalFooter>
    );

    return (
      <Modal
        dismissible
        footer={footer}
        id="export-licenses-modal"
        label={<FormattedMessage id="ui-licenses.exportLicenses" />}
        onClose={this.props.onClose}
        open
        size="medium"
      >
        <Layout className="padding-bottom-gutter">
          <FormattedMessage id="ui-licenses.exportLicensesModal.message" />
        </Layout>
        <Layout className="padding-bottom-gutter">
          <Checkbox
            checked={Object.values({ ...licenseInformation, ...terms, ...termNames }).includes(false) !== true}
            label={<strong><FormattedMessage id="ui-licenses.exportLicensesModal.selectAll" /></strong>}
            onChange={this.toggleSelectAll}
            value="selectAll"
          />
        </Layout>
        <div className={css.separator} />
        {this.renderCheckboxesList('licenseInformation')}
        {this.renderCheckboxesList('terms')}
        <Layout className="padding-start-gutter">
          {this.renderCheckboxesList('termNames')}
        </Layout>
      </Modal>
    );
  }

  render() {
    return (
      <div>
        {this.renderExportLicenseAsCSVModal()}
      </div>
    );
  }
}
