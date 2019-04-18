/* global describe, it, before, after, Nightmare */

let NUMBER_OF_TERMS;

const TERM = {
  name: 'otherRestrictions',
  label: 'Other restrictions',
  value: 'A Few',
  editedValue: 'A Lot',
};

const generateNumber = () => Math.round(Math.random() * 100000);

module.exports.test = (uiTestCtx, term = TERM) => {
  describe(`ui-licenses: set license term: "${term.label}"`, function test() {
    const { config, helpers } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));

    describe('login > open licenses > create license > edit terms > logout', () => {
      before((done) => {
        helpers.login(nightmare, config, done);
      });

      after((done) => {
        helpers.logout(nightmare, config, done);
      });

      it('should open Licenses app', done => {
        helpers.clickApp(nightmare, done, 'licenses');
      });

      it('should navigate to create license page', done => {
        const name = `Terms License #${generateNumber()}`;

        console.log(`\tCreating ${name}`);

        nightmare
          .wait('#list-licenses')
          .wait('#clickable-new-license')
          .click('#clickable-new-license')

          .waitUntilNetworkIdle(2000) // Wait for the default values to be fetched and set.

          .insert('#edit-license-name', name)
          .click('#accordion-toggle-button-licenseFormTerms')

          .then(done)
          .catch(done);
      });

      it('should count the number of terms', done => {
        nightmare
          .evaluate(() => [...document.querySelectorAll('[data-test-term-name]')].length)
          .then(count => {
            NUMBER_OF_TERMS = count;
          })
          .then(done)
          .catch(done);
      });

      it('should add term', done => {
        nightmare
          .click('#add-term-btn')
          .wait(500)
          .evaluate(() => [...document.querySelectorAll('[data-test-term-name]')].length)
          .then(count => {
            if (count !== NUMBER_OF_TERMS + 1) {
              throw Error(`Expected ${NUMBER_OF_TERMS + 1} terms but found ${count}!`);
            }

            NUMBER_OF_TERMS += 1;
          })
          .then(done)
          .catch(done);
      });

      it(`should set term to: ${term.value}`, done => {
        nightmare
          .type(`#edit-term-${NUMBER_OF_TERMS - 1}-name`, term.label)
          .type(`#edit-term-${NUMBER_OF_TERMS - 1}-value`, term.value)
          .then(done)
          .catch(done);
      });

      it('should create license', done => {
        nightmare
          .click('#clickable-create-license')
          .waitUntilNetworkIdle(2000) // Wait for record to be fetched
          .then(done)
          .catch(done);
      });

      it('should find new term in terms list', done => {
        nightmare
          .evaluate((expectedTerm) => {
            const nameElement = document.querySelector(`[data-test-term-label=${expectedTerm.name}]`);
            const valueElement = document.querySelector(`[data-test-term-value=${expectedTerm.name}]`);

            if (!nameElement) {
              throw Error(`Expected to find ${expectedTerm.name} label`);
            }

            if (nameElement.textContent !== expectedTerm.label) {
              throw Error(`Expected to find ${expectedTerm.label}`);
            }

            if (!valueElement) {
              throw Error(`Expected to find ${expectedTerm.name} value`);
            }

            if (valueElement.textContent !== expectedTerm.value) {
              throw Error(`Expected to find ${expectedTerm.value}`);
            }
          }, term)
          .then(done)
          .catch(done);
      });

      it('should edit license and find term', done => {
        nightmare
          .click('[class*=paneHeader] [class*=dropdown] button')
          .wait('#clickable-edit-license')
          .click('#clickable-edit-license')
          .wait('#licenseFormInfo')
          .waitUntilNetworkIdle(2000)
          .click('#accordion-toggle-button-licenseFormTerms')
          .evaluate((expectedTerm, row) => {
            const nameElement = document.querySelector(`#edit-term-${row}-name`);
            const valueElement = document.querySelector(`#edit-term-${row}-value`);

            if (nameElement.selectedOptions[0].textContent !== expectedTerm.label) {
              throw Error(`Expected #edit-term-${row}-name to have label ${expectedTerm.label}`);
            }
            if (nameElement.value !== expectedTerm.name) {
              throw Error(`Expected #edit-term-${row}-name to have value ${expectedTerm.name}`);
            }
            const value = valueElement.selectedOptions ?
              valueElement.selectedOptions[0].textContent : valueElement.value;

            if (value !== expectedTerm.value) {
              throw Error(`Expected #edit-term-${row}-value to be ${expectedTerm.value}. It is ${value}`);
            }
          }, term, NUMBER_OF_TERMS - 1)
          .then(done)
          .catch(done);
      });

      it(`should edit term value to: ${term.editedValue}`, done => {
        nightmare
          .insert(`#edit-term-${NUMBER_OF_TERMS - 1}-value`, '')
          .type(`#edit-term-${NUMBER_OF_TERMS - 1}-value`, term.editedValue)
          .then(done)
          .catch(done);
      });

      it('should save updated license', done => {
        nightmare
          .click('#clickable-update-license')
          .waitUntilNetworkIdle(2000) // Wait for record to be fetched
          .then(done)
          .catch(done);
      });

      it('should find edited term in terms list', done => {
        nightmare
          .evaluate((expectedTerm) => {
            const nameElement = document.querySelector(`[data-test-term-label=${expectedTerm.name}]`);
            const valueElement = document.querySelector(`[data-test-term-value=${expectedTerm.name}]`);

            if (!nameElement) {
              throw Error(`Expected to find ${expectedTerm.name} label`);
            }

            if (nameElement.textContent !== expectedTerm.label) {
              throw Error(`Expected to find term name ${expectedTerm.label}`);
            }

            if (!valueElement) {
              throw Error(`Expected to find ${expectedTerm.name} value`);
            }

            if (valueElement.textContent !== expectedTerm.editedValue) {
              throw Error(`Expected to find term value ${expectedTerm.editedValue}`);
            }
          }, term)
          .then(done)
          .catch(done);
      });

      it('should edit license and find edited term', done => {
        nightmare
          .click('[class*=paneHeader] [class*=dropdown] button')
          .wait('#clickable-edit-license')
          .click('#clickable-edit-license')
          .wait('#licenseFormInfo')
          .waitUntilNetworkIdle(2000)
          .click('#accordion-toggle-button-licenseFormTerms')
          .evaluate((expectedTerm, row) => {
            const nameElement = document.querySelector(`#edit-term-${row}-name`);
            const valueElement = document.querySelector(`#edit-term-${row}-value`);

            if (expectedTerm.label !== nameElement.selectedOptions[0].textContent) {
              throw Error(`Expected #edit-term-${row}-name to have label ${expectedTerm.label}`);
            }
            if (expectedTerm.name !== nameElement.value) {
              throw Error(`Expected #edit-term-${row}-name to have label ${expectedTerm.name}`);
            }

            const value = valueElement.selectedOptions ?
              valueElement.selectedOptions[0].textContent : valueElement.value;

            if (value !== expectedTerm.editedValue) {
              throw Error(`Expected #edit-term-${row}-value to be ${expectedTerm.editedValue}. It is ${value}`);
            }
          }, term, NUMBER_OF_TERMS - 1)
          .then(done)
          .catch(done);
      });

      it('should remove term from license and save', done => {
        nightmare
          .click(`#edit-term-${NUMBER_OF_TERMS - 1}-delete`)
          .wait(500)
          .click('#clickable-update-license')
          .waitUntilNetworkIdle(2000) // Wait for record to be fetched
          .then(done)
          .catch(done);
      });

      it('should not find term in list', done => {
        nightmare
          .evaluate((expectedTerm) => {
            const nameElement = document.querySelector(`[data-test-term-label=${expectedTerm.name}]`);
            const valueElement = document.querySelector(`[data-test-term-value=${expectedTerm.name}]`);

            if (nameElement) {
              throw Error(`Expected to NOT FIND ${expectedTerm.name} label`);
            }

            if (valueElement) {
              throw Error(`Expected to NOT FIND ${expectedTerm.name} value`);
            }
          }, term)
          .then(done)
          .catch(done);
      });
    });
  });
};
