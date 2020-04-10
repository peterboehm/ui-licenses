import { beforeEach, describe, it } from '@bigtest/mocha';

import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import LicenseFormInteractor from '../interactors/license-form';
import LicenseViewInteractor from '../interactors/license-view';

const number = Math.round(Math.random() * 100000);

const licenseData = {
  id: '1234',
  name: `license clone #${number}`,
  status: { value: 'active' },
  type: { value: 'local' },
};

const internalContactData = {
  user: '333',
  personal: {
    firstName: 'John',
    middleName: 'paul',
    lastName: 'parker'
  },
  role: { label: 'License owner', value: 'license' },
};

describe('Clone License test', () => {
  setupApplication();
  const licenseView = new LicenseViewInteractor();
  const licenseEdit = new LicenseFormInteractor();
  let license;

  beforeEach(async function () {
    licenseData.internalContactData = internalContactData;
    license = this.server.create('license', 'withContacts', licenseData);
  });

  describe('click duplicate license button', () => {
    const { firstName = '', lastName = '-', middleName = '' } = internalContactData.personal;
    const name = `${lastName}${firstName ? ', ' : ' '}${firstName} ${middleName}`;

    beforeEach(async function () {
      await this.visit(`licenses/${license.id}`);
      await licenseView.whenLoaded();
    });

    describe('select only the licenseInfo checkbox to duplicate', () => {
      beforeEach(async function () {
        await licenseView.whenLoaded();
        await licenseView.headerDropdown.click();
        await licenseView.headerDropdownMenu.clickDuplicate();
        await licenseView.duplicateModal.checkBoxList(1).click();
        await licenseView.duplicateModal.clickSaveAndClose();
        await licenseView.whenLoaded();
      });

      it('should render the expected name on the edit page', () => {
        expect(licenseEdit.name).to.equal(licenseData.name);
      });

      it('should not render an internalContact card', () => {
        expect(licenseEdit.internalContacts(0)).to.be.empty;
      });
    });

    describe('select all properties to duplicate', () => {
      beforeEach(async function () {
        await licenseView.headerDropdown.click();
        await licenseView.headerDropdownMenu.clickDuplicate();
        await licenseView.duplicateModal.checkBoxList(0).click();
        await licenseView.duplicateModal.clickSaveAndClose();
        await licenseEdit.whenLoaded();
      });

      it('should render the expected name on the edit page', () => {
        expect(licenseEdit.name).to.equal(licenseData.name);
      });

      it('should render an internalContact card', () => {
        expect(licenseEdit.internalContacts(0)).is.not.undefined;
      });

      it('should render the expected users name on the internalContact card', () => {
        expect(licenseEdit.internalContacts(0).userName).to.equal(name);
      });
    });
  });
});
