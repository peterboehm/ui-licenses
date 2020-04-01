import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import chai from 'chai';
import spies from 'chai-spies';
import { StaticRouter as Router } from 'react-router-dom';

import '@folio/stripes-components/lib/global.css';

import { mountWithContext } from '../helpers/mountWithContext';
import translations from '../../../translations/ui-licenses/en';

import TermFiltersForm from '../../../src/components/LicenseFilters/TermFilters/TermFiltersForm';
import TermFiltersFormInteractor from '../interactors/term-filters-form';

import {
  DecimalTerm,
  IntegerTerm,
  RefDataTerm,
  TextTerm,
} from './terms';

const terms = [
  DecimalTerm,
  IntegerTerm,
  RefDataTerm,
  TextTerm,
];

chai.use(spies);
const { expect, spy } = chai;

let handleSubmit = spy(() => Promise.resolve());

const interactor = new TermFiltersFormInteractor();

describe('Term Filters', () => {
  describe('no initial values', () => {
    beforeEach(async () => {
      handleSubmit = spy(() => Promise.resolve());

      await mountWithContext(
        <Router context={{}}>
          <TermFiltersForm
            initialValues={{ filters: [{ rules: [{}] }] }}
            onSubmit={handleSubmit}
            terms={terms}
          />
        </Router>,
        [{ translations, prefix: 'ui-licenses' }]
      );
    });

    it('renders', () => {
      expect(1).to.equal(1);
    });

    describe('clicking the "Edit term filters" button', () => {
      beforeEach(async () => {
        await interactor.open();
      });

      it('opens the term filters modal', () => {
        expect(interactor.modalIsVisible).to.equal(true);
      });

      it('is initialized with one filter', () => {
        expect(interactor.filtersCount).to.equal(1);
      });

      it('has no term selected', () => {
        expect(interactor.filters(0).term).to.equal('');
      });

      it('is initialized with one rule ', () => {
        expect(interactor.filters(0).rulesCount).to.equal(1);
      });

      it('has no operator selected', () => {
        expect(interactor.filters(0).rules(0).operator).to.equal('');
      });

      it('has no value entered', () => {
        expect(interactor.filters(0).rules(0).value).to.equal('');
      });

      describe('applying filters without selecting a term', () => {
        beforeEach(async () => {
          await interactor.apply();
        });

        it('did not call handleSubmit', () => {
          expect(handleSubmit).to.have.been.called.exactly(0);
        });

        it('displayed an error', () => {
          expect(interactor.errorIsVisible).to.be.true;
        });
      });

      describe('applying filters without selecting a rule operator', () => {
        beforeEach(async () => {
          await interactor.filters(0).selectTerm(DecimalTerm.label);
          await interactor.filters(0).rules(0).fillValue('15.5');
          await interactor.apply();
        });

        it('did not call handleSubmit', () => {
          expect(handleSubmit).to.have.been.called.exactly(0);
        });

        it('displayed an error', () => {
          expect(interactor.errorIsVisible).to.be.true;
        });
      });

      describe('applying filters without filling a rule value', () => {
        beforeEach(async () => {
          await interactor.filters(0).selectTerm(DecimalTerm.label);
          await interactor.filters(0).rules(0).selectOperator('equals');
          await interactor.apply();
        });

        it('did not call handleSubmit', () => {
          expect(handleSubmit).to.have.been.called.exactly(0);
        });

        it('displayed an error', () => {
          expect(interactor.errorIsVisible).to.be.true;
        });
      });

      describe('applying filters with an incomplete second filter set', () => {
        beforeEach(async () => {
          await interactor.filters(0).selectTerm(DecimalTerm.label);
          await interactor.filters(0).rules(0).selectOperator('equals');
          await interactor.filters(0).rules(0).fillValue('15.5');
          await interactor.addTermFilter();
          await interactor.apply();
        });

        it('did not call handleSubmit', () => {
          expect(handleSubmit).to.have.been.called.exactly(0);
        });

        it('displayed an error', () => {
          expect(interactor.errorIsVisible).to.be.true;
        });

        describe('applying filters after filling out the second filter set', () => {
          beforeEach(async () => {
            await interactor.filters(1).selectTerm(IntegerTerm.label);
            await interactor.filters(1).rules(0).selectOperator('equals');
            await interactor.filters(1).rules(0).fillValue('51');
            await interactor.apply();
          });

          it('calls handleSubmit with the expected filters', () => {
            expect(handleSubmit).to.have.been.called.with({
              filters: [{
                customProperty: DecimalTerm.name,
                rules: [
                  { operator: '==', value: '15.5' },
                ],
              }, {
                customProperty: IntegerTerm.name,
                rules: [
                  { operator: '==', value: '51' },
                ],
              }],
            });
          });
        });
      });

      describe('clicking the "Add term filter" button', () => {
        beforeEach(async () => {
          await interactor.addTermFilter();
        });

        it('is creates a second empty filter', () => {
          expect(interactor.filtersCount).to.equal(2);
          expect(interactor.filters(1).term).to.equal('');
          expect(interactor.filters(1).rulesCount).to.equal(1);
          expect(interactor.filters(1).rules(0).operator).to.equal('');
          expect(interactor.filters(1).rules(0).value).to.equal('');
        });
      });

      describe('selecting the Decimal Term, setting a rule to "is set" and applying', () => {
        beforeEach(async () => {
          await interactor.filters(0).selectTerm(DecimalTerm.label);
          await interactor.filters(0).rules(0).selectOperator('is set');
          await interactor.apply();
        });

        it('calls handleSubmit with the expected filters', () => {
          expect(handleSubmit).to.have.been.called.with({
            filters: [{
              customProperty: DecimalTerm.name,
              rules: [
                { operator: ' isSet', value: '' }
              ],
            }],
          });
        });
      });

      describe('selecting the Decimal Term, setting a rule to "equals 42.5" and applying', () => {
        beforeEach(async () => {
          await interactor.filters(0).selectTerm(DecimalTerm.label);
          await interactor.filters(0).rules(0).selectOperator('equals');
          await interactor.filters(0).rules(0).fillValue('15.5');
          await interactor.apply();
        });

        it('calls handleSubmit with the expected filters', () => {
          expect(handleSubmit).to.have.been.called.with({
            filters: [{
              customProperty: DecimalTerm.name,
              rules: [
                { operator: '==', value: '15.5' }
              ],
            }],
          });
        });
      });

      describe('selecting the Decimal Term, setting a rule to "does not equal 42.5" and applying', () => {
        beforeEach(async () => {
          await interactor.filters(0).selectTerm(DecimalTerm.label);
          await interactor.filters(0).rules(0).selectOperator('does not equal');
          await interactor.filters(0).rules(0).fillValue('15.5');
          await interactor.apply();
        });

        it('calls handleSubmit with the expected filters', () => {
          expect(handleSubmit).to.have.been.called.with({
            filters: [{
              customProperty: DecimalTerm.name,
              rules: [
                { operator: '!=', value: '15.5' }
              ],
            }],
          });
        });
      });

      describe('selecting the Decimal Term, setting a rule to "is greater than or equals 42.5" and applying', () => {
        beforeEach(async () => {
          await interactor.filters(0).selectTerm(DecimalTerm.label);
          await interactor.filters(0).rules(0).selectOperator('is greater than or equals');
          await interactor.filters(0).rules(0).fillValue('15.5');
          await interactor.apply();
        });

        it('calls handleSubmit with the expected filters', () => {
          expect(handleSubmit).to.have.been.called.with({
            filters: [{
              customProperty: DecimalTerm.name,
              rules: [
                { operator: '>=', value: '15.5' }
              ],
            }],
          });
        });
      });

      describe('selecting the Decimal Term, setting a rule to "is less than or equals 42.5" and applying', () => {
        beforeEach(async () => {
          await interactor.filters(0).selectTerm(DecimalTerm.label);
          await interactor.filters(0).rules(0).selectOperator('is less than or equals');
          await interactor.filters(0).rules(0).fillValue('15.5');
          await interactor.apply();
        });

        it('calls handleSubmit with the expected filters', () => {
          expect(handleSubmit).to.have.been.called.with({
            filters: [{
              customProperty: DecimalTerm.name,
              rules: [
                { operator: '<=', value: '15.5' }
              ],
            }],
          });
        });
      });

      describe('selecting the Integer Term, setting a rule to "equals 42" and applying', () => {
        beforeEach(async () => {
          await interactor.filters(0).selectTerm(IntegerTerm.label);
          await interactor.filters(0).rules(0).selectOperator('equals');
          await interactor.filters(0).rules(0).fillValue(42);
          await interactor.apply();
        });

        it('calls handleSubmit with the expected filters', () => {
          expect(handleSubmit).to.have.been.called.with({
            filters: [{
              customProperty: IntegerTerm.name,
              rules: [
                { operator: '==', value: '42' }
              ],
            }],
          });
        });
      });

      describe('selecting the Integer Term, setting a rule to "is set" and applying', () => {
        beforeEach(async () => {
          await interactor.filters(0).selectTerm(IntegerTerm.label);
          await interactor.filters(0).rules(0).selectOperator('is set');
          await interactor.apply();
        });

        it('calls handleSubmit with the expected filters', () => {
          expect(handleSubmit).to.have.been.called.with({
            filters: [{
              customProperty: IntegerTerm.name,
              rules: [
                { operator: ' isSet', value: '' }
              ],
            }],
          });
        });
      });

      describe('selecting the RefData Term, setting a rule to "is Yes" and applying', () => {
        beforeEach(async () => {
          await interactor.filters(0).selectTerm(RefDataTerm.label);
          await interactor.filters(0).rules(0).selectOperator('is');
          await interactor.filters(0).rules(0).selectValue('Yes');
          await interactor.apply();
        });

        it('calls handleSubmit with the expected filters', () => {
          const YesOption = RefDataTerm.category.values.find(v => v.label === 'Yes');
          expect(handleSubmit).to.have.been.called.with({
            filters: [{
              customProperty: RefDataTerm.name,
              rules: [
                { operator: '==', value: YesOption.id }
              ],
            }],
          });
        });
      });

      describe('selecting the RefData Term, setting a rule to "is set" and applying', () => {
        beforeEach(async () => {
          await interactor.filters(0).selectTerm(RefDataTerm.label);
          await interactor.filters(0).rules(0).selectOperator('is set');
          await interactor.apply();
        });

        it('calls handleSubmit with the expected filters', () => {
          expect(handleSubmit).to.have.been.called.with({
            filters: [{
              customProperty: RefDataTerm.name,
              rules: [
                { operator: ' isSet', value: '' }
              ],
            }],
          });
        });
      });

      describe('selecting the Text Term, setting a rule to "contains foo" and applying', () => {
        beforeEach(async () => {
          await interactor.filters(0).selectTerm(TextTerm.label);
          await interactor.filters(0).rules(0).selectOperator('contains');
          await interactor.filters(0).rules(0).fillValue('foo');
          await interactor.apply();
        });

        it('calls handleSubmit with the expected filters', () => {
          expect(handleSubmit).to.have.been.called.with({
            filters: [{
              customProperty: TextTerm.name,
              rules: [
                { operator: '=~', value: 'foo' }
              ],
            }],
          });
        });
      });

      describe('selecting the Text Term, setting a rule to "does not contain foo" and applying', () => {
        beforeEach(async () => {
          await interactor.filters(0).selectTerm(TextTerm.label);
          await interactor.filters(0).rules(0).selectOperator('does not contain');
          await interactor.filters(0).rules(0).fillValue('foo');
          await interactor.apply();
        });

        it('calls handleSubmit with the expected filters', () => {
          expect(handleSubmit).to.have.been.called.with({
            filters: [{
              customProperty: TextTerm.name,
              rules: [
                { operator: '!~', value: 'foo' }
              ],
            }],
          });
        });
      });

      describe('selecting the Text Term, setting a rule to "is set" and applying', () => {
        beforeEach(async () => {
          await interactor.filters(0).selectTerm(TextTerm.label);
          await interactor.filters(0).rules(0).selectOperator('is set');
          await interactor.apply();
        });

        it('calls handleSubmit with the expected filters', () => {
          expect(handleSubmit).to.have.been.called.with({
            filters: [{
              customProperty: TextTerm.name,
              rules: [
                { operator: ' isSet', value: '' }
              ],
            }],
          });
        });
      });

      describe('setting multiple rules for one filter', () => {
        beforeEach(async () => {
          await interactor.filters(0).selectTerm(TextTerm.label);
          await interactor.filters(0).rules(0).selectOperator('does not contain');
          await interactor.filters(0).rules(0).fillValue('foo');
          await interactor.filters(0).addRule();
          await new Promise(resolve => { setTimeout(resolve, 500); }); // Should be removed as a part of ERM-825
          await interactor.filters(0).rules(1).selectOperator('contains');
          await interactor.filters(0).rules(1).fillValue('bar');
          await interactor.apply();
        });

        it('calls handleSubmit with the expected filters', () => {
          expect(handleSubmit).to.have.been.called.with({
            filters: [{
              customProperty: TextTerm.name,
              rules: [
                { operator: '!~', value: 'foo' },
                { operator: '=~', value: 'bar' },
              ],
            }],
          });
        });
      });

      describe('`setting multiple rules for multiple filters`', () => {
        beforeEach(async () => {
          await interactor.filters(0).selectTerm(TextTerm.label);
          await interactor.filters(0).rules(0).selectOperator('does not contain');
          await interactor.filters(0).rules(0).fillValue('foo');
          await interactor.filters(0).addRule();
          await new Promise(resolve => { setTimeout(resolve, 500); }); // Should be removed as a part of ERM-825
          await interactor.filters(0).rules(1).selectOperator('contains');
          await interactor.filters(0).rules(1).fillValue('bar');

          await interactor.addTermFilter();
          await new Promise(resolve => { setTimeout(resolve, 500); }); // Should be removed as a part of ERM-825

          await interactor.filters(1).selectTerm(IntegerTerm.label);
          await interactor.filters(1).rules(0).selectOperator('is greater than or equals');
          await interactor.filters(1).rules(0).fillValue('5');
          await interactor.filters(1).addRule();
          await new Promise(resolve => { setTimeout(resolve, 500); }); // Should be removed as a part of ERM-825
          await interactor.filters(1).rules(1).selectOperator('is less than or equals');
          await interactor.filters(1).rules(1).fillValue('15');

          await interactor.apply();
        });

        it('calls handleSubmit with the expected filters', () => {
          expect(handleSubmit).to.have.been.called.with({
            filters: [{
              customProperty: TextTerm.name,
              rules: [
                { operator: '!~', value: 'foo' },
                { operator: '=~', value: 'bar' },
              ],
            }, {
              customProperty: IntegerTerm.name,
              rules: [
                { operator: '>=', value: '5' },
                { operator: '<=', value: '15' },
              ],
            }],
          });
        });
      });
    });
  });
});
