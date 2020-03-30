import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { sortBy } from 'lodash';

import setupApplication from '../helpers/setup-application';
import PickListInteractor from '../interactors/pick-list';

describe('Pick list', () => {
  let refDataCategories = [
    {
      'id': '188389637112212001711221f73f0000',
      'desc': 'License.EndDateSemantics',
      'internal': true,
      'values': [
        {
          'id': '188389637112212001711221f7a40002',
          'value': 'open_ended',
          'label': 'Open ended'
        },
        {
          'id': '188389637112212001711221f7960001',
          'value': 'explicit',
          'label': 'Explicit'
        }
      ]
    },
    {
      'id': '188389637112212001711221f7af0003',
      'desc': 'License.Status',
      'internal': true,
      'values': [
        {
          'id': '188389637112212001711221f7c30005',
          'value': 'not_yet_active',
          'label': 'Not yet active'
        },
        {
          'id': '188389637112212001711221f7cc0006',
          'value': 'active',
          'label': 'Active'
        },
        {
          'id': '188389637112212001711221f7d70007',
          'value': 'rejected',
          'label': 'Rejected'
        },
        {
          'id': '188389637112212001711221f7b80004',
          'value': 'in_negotiation',
          'label': 'In negotiation'
        },
        {
          'id': '188389637112212001711221f7e10008',
          'value': 'expired',
          'label': 'Expired'
        },
      ]
    },
    {
      'id': '188389637112212001711221f8550014',
      'desc': 'DocumentAttachment.AtType',
      'internal': false,
      'values': [
        {
          'id': '188389637112212001711221f8640016',
          'value': 'product_data_sheet',
          'label': 'Product data sheet'
        },
        {
          'id': '188389637112212001711221f85c0015',
          'value': 'consortium_authorization_statement',
          'label': 'Consortium authorization statement'
        },
        {
          'id': '188389637112212001711221f86d0017',
          'value': 'vendor_terms_and_conditions',
          'label': 'Vendor terms and conditions'
        }
      ]
    },
    {
      'id': '12345',
      'desc': 'userCreated',
      'internal': false,
      'values': []
    }
  ];

  refDataCategories = sortBy(refDataCategories, [(item) => item.desc]);

  function mockData() {
    this.server.create('pickList', refDataCategories[0]);
    this.server.create('pickList', refDataCategories[1]);
    this.server.create('pickList', refDataCategories[2]);
    this.server.create('pickList', refDataCategories[3]);
  }

  describe('Pick lists', () => {
    setupApplication();
    const interactor = new PickListInteractor();

    beforeEach(mockData);

    describe('Refdata category', () => {
      beforeEach(async function () {
        await this.visit('settings/licenses/pick-lists');
      });

      it(`list has ${refDataCategories.length} items`, () => {
        expect(interactor.pickList.rowCount).to.equal(refDataCategories.length);
      });

      refDataCategories.forEach((refDataCategory, index) => {
        describe(`${refDataCategory.desc} of type ${refDataCategory.internal ? 'Internal' : 'User'}`, () => {
          it('should not have an edit action button', () => {
            expect(interactor.pickList.rows(index).isEditPickListButtonPresent).to.equal(false);
          });

          it(`should ${(refDataCategory.internal || refDataCategory.values.length) ? 'not have' : 'have'} a delete action button`, () => {
            expect(interactor.pickList.rows(index).isDeletePickListButtonPresent).to.equal(!(refDataCategory.internal || refDataCategory.values.length));
          });
        });
      });
    });

    describe('Pick list values', () => {
      beforeEach(async function () {
        await this.visit('settings/licenses/pick-list-values');
      });

      refDataCategories.forEach(refDataCategory => {
        describe(`Selecting ${refDataCategory.desc} refData cateogory`, () => {
          beforeEach(async function () {
            await interactor.pickListDropdown.selectOption(refDataCategory.desc);
          });

          it(`should ${refDataCategory.internal ? 'not have' : 'have'} the new button enabled`, () => {
            expect(!!interactor.isNewButtonDisabled).to.equal(refDataCategory.internal);
          });

          refDataCategory.values.forEach((item, index) => {
            describe(`with value = ${item.value} `, () => {
              it(`should ${refDataCategory.internal ? 'not have' : 'have'} an edit action button`, () => {
                expect(!!interactor.valuesList.rows(index).isEditPickListValuesButtonPresent).to.be.true;
              });

              it(`should ${refDataCategory.internal ? 'have' : 'not have'} a delete action button`, () => {
                expect(interactor.valuesList.rows(index).isDeletePickListValuesButtonPresent).to.equal(!refDataCategory.internal);
              });
            });
          });
        });
      });

      describe('Selecting an Internal refDataCategory', () => {
        const internalRefData = refDataCategories.find(category => !category.internal);
        beforeEach(async function () {
          await interactor.pickListDropdown.selectOption(internalRefData.desc);
        });

        describe('Clicking new button', () => {
          beforeEach(async function () {
            await interactor.clickableNewButton();
          });

          it('Should add a new row', () => {
            expect(interactor.valuesList.rowCount).to.equal(internalRefData?.values?.length + 1);
          });
        });
      });
    });
  });
});
