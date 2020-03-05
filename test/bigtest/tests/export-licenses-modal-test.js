import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import chai from 'chai';
import spies from 'chai-spies';
import { mountWithContext } from '../helpers/mountWithContext';
import ExportLicenseAsCSVModal from '../../../src/components/ExportLicenseAsCSVModal';
import ExportLicenseAsCSVModalInteractor from '../interactors/export-licenses-modal';
import translations from '../../../translations/ui-licenses/en';

chai.use(spies);
const { expect, spy } = chai;
const interactor = new ExportLicenseAsCSVModalInteractor();

const terms = [
  {
    name: 'authorisedUsers',
    label: 'Definition of authorised user'
  },
  {
    name: 'remoteAccess',
    label: 'Access restricted to on-campus/campus network?'
  }
];

const selectedLicenses = ['1', '2'];
const onCompareLicenseTerms = spy(() => Promise.resolve());
const onClose = spy();

const checkBoxes = {
  selectAll: 0,
  licenseInformation: 1,
  name: 2,
  startDate: 3,
  endDate: 4,
  status: 5,
  type: 6,
  terms: 7,
  value: 8,
  note: 9,
  publicNote: 10,
  internal: 11,
  termName: 12
};

describe('ExportLicenseAsCSVModal', () => {
  describe('Select all properties', () => {
    const expectedPayLoad = {
      'ids': ['1', '2'],
      'include' : {
        'customProperties': {
          'authorisedUsers': true,
          'remoteAccess': true,
        },
        'name': true,
        'startDate': true,
        'endDate': true,
        'status': true,
        'type': true,
      },
      'terms': {
        'value': true,
        'note': true,
        'publicNote': true,
        'internal': true
      }
    };

    beforeEach(async () => {
      await mountWithContext(
        <ExportLicenseAsCSVModal
          onClose={onClose}
          onCompareLicenseTerms={onCompareLicenseTerms}
          selectedLicenses={selectedLicenses}
          terms={terms}
        />,
        [{ translations, prefix: 'ui-licenses' }]
      );
      await interactor.checkBoxList(checkBoxes.selectAll).click();
      await interactor.clickSaveAndClose();
    });

    it('onCompareLicenseTerms callback should be called', () => {
      expect(onCompareLicenseTerms).to.have.been.called();
    });

    it('renders expected payload', () => {
      expect(onCompareLicenseTerms).to.have.been.called.with(expectedPayLoad);
    });
  });

  describe('Select name and startDate properties', () => {
    const expectedPayLoad = {
      'ids': ['1', '2'],
      'include' : {
        'customProperties': {},
        'name': true,
        'startDate': true,
      },
      'terms': {}
    };

    beforeEach(async () => {
      await mountWithContext(
        <ExportLicenseAsCSVModal
          onClose={onClose}
          onCompareLicenseTerms={onCompareLicenseTerms}
          selectedLicenses={selectedLicenses}
          terms={terms}
        />,
        [{ translations, prefix: 'ui-licenses' }]
      );

      await interactor.checkBoxList(checkBoxes.name).click();
      await interactor.checkBoxList(checkBoxes.startDate).click();
      await interactor.clickSaveAndClose();
    });

    it('onCompareLicenseTerms callback should be called', () => {
      expect(onCompareLicenseTerms).to.have.been.called();
    });

    it('renders expected payload', () => {
      expect(onCompareLicenseTerms).to.have.been.called.with(expectedPayLoad);
    });
  });

  describe('Check and uncheck startDate checkbox', () => {
    const expectedPayLoad = {
      'ids': ['1', '2'],
      'include' : {
        'customProperties': {},
        'name': true,
      },
      'terms': {}
    };

    beforeEach(async () => {
      await mountWithContext(
        <ExportLicenseAsCSVModal
          onClose={onClose}
          onCompareLicenseTerms={onCompareLicenseTerms}
          selectedLicenses={selectedLicenses}
          terms={terms}
        />,
        [{ translations, prefix: 'ui-licenses' }]
      );

      await interactor.checkBoxList(checkBoxes.name).click();
      await interactor.checkBoxList(checkBoxes.startDate).click();
      await interactor.checkBoxList(checkBoxes.startDate).click();
      await interactor.clickSaveAndClose();
    });

    it('onCompareLicenseTerms callback should be called', () => {
      expect(onCompareLicenseTerms).to.have.been.called();
    });

    it('renders expected payload', () => {
      expect(onCompareLicenseTerms).to.have.been.called.with(expectedPayLoad);
    });
  });

  describe('Checking the licenseInformation section', () => {
    const expectedPayLoad = {
      'ids': ['1', '2'],
      'include' : {
        'customProperties': {},
        'name': true,
        'startDate': true,
        'endDate': true,
        'status': true,
        'type': true,
      },
      'terms': {}
    };

    beforeEach(async () => {
      await mountWithContext(
        <ExportLicenseAsCSVModal
          onClose={onClose}
          onCompareLicenseTerms={onCompareLicenseTerms}
          selectedLicenses={selectedLicenses}
          terms={terms}
        />,
        [{ translations, prefix: 'ui-licenses' }]
      );

      await interactor.checkBoxList(checkBoxes.licenseInformation).click();
      await interactor.clickSaveAndClose();
    });

    it('onCompareLicenseTerms callback should be called', () => {
      expect(onCompareLicenseTerms).to.have.been.called();
    });

    it('renders expected payload', () => {
      expect(onCompareLicenseTerms).to.have.been.called.with(expectedPayLoad);
    });
  });

  describe('Checking the terms section', () => {
    const expectedPayLoad = {
      'ids': ['1', '2'],
      'include' : {
        'customProperties': {},
      },
      'terms': {
        'value': true,
        'note': true,
        'publicNote': true,
        'internal': true
      }
    };

    beforeEach(async () => {
      await mountWithContext(
        <ExportLicenseAsCSVModal
          onClose={onClose}
          onCompareLicenseTerms={onCompareLicenseTerms}
          selectedLicenses={selectedLicenses}
          terms={terms}
        />,
        [{ translations, prefix: 'ui-licenses' }]
      );

      await interactor.checkBoxList(checkBoxes.terms).click();
      await interactor.clickSaveAndClose();
    });

    it('onCompareLicenseTerms callback should be called', () => {
      expect(onCompareLicenseTerms).to.have.been.called();
    });

    it('renders expected payload', () => {
      expect(onCompareLicenseTerms).to.have.been.called.with(expectedPayLoad);
    });
  });

  describe('Checking the termName section', () => {
    const expectedPayLoad = {
      'ids': ['1', '2'],
      'include' : {
        'customProperties': {
          'authorisedUsers': true,
          'remoteAccess': true,
        },
      },
      'terms': {}
    };

    beforeEach(async () => {
      await mountWithContext(
        <ExportLicenseAsCSVModal
          onClose={onClose}
          onCompareLicenseTerms={onCompareLicenseTerms}
          selectedLicenses={selectedLicenses}
          terms={terms}
        />,
        [{ translations, prefix: 'ui-licenses' }]
      );

      await interactor.checkBoxList(checkBoxes.termName).click();
      await interactor.clickSaveAndClose();
    });

    it('onCompareLicenseTerms callback should be called', () => {
      expect(onCompareLicenseTerms).to.have.been.called();
    });

    it('renders expected payload', () => {
      expect(onCompareLicenseTerms).to.have.been.called.with(expectedPayLoad);
    });
  });

  describe('Close the modal by clicking the X button', () => {
    beforeEach(async () => {
      await mountWithContext(
        <ExportLicenseAsCSVModal
          onClose={onClose}
          onCompareLicenseTerms={onCompareLicenseTerms}
          selectedLicenses={selectedLicenses}
          terms={terms}
        />,
        [{ translations, prefix: 'ui-licenses' }]
      );
      await interactor.clickClose();
    });

    it('onClose callback should be called', () => {
      expect(onClose).to.have.been.called();
    });
  });

  describe('Close the modal by clicking the cancel button', () => {
    beforeEach(async () => {
      await mountWithContext(
        <ExportLicenseAsCSVModal
          onClose={onClose}
          onCompareLicenseTerms={onCompareLicenseTerms}
          selectedLicenses={selectedLicenses}
          terms={terms}
        />,
        [{ translations, prefix: 'ui-licenses' }]
      );
      await interactor.clickCancelButton();
    });

    it('onClose callback should be called', () => {
      expect(onClose).to.have.been.called();
    });
  });
});
