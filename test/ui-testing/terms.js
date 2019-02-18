/* global describe, it, before, after, Nightmare */

const generateNumber = () => Math.round(Math.random() * 100000);

let NUMBER_OF_TERMS;
const TERM = {
  name: 'authorisedUsers',
  label: 'Definition of authorised user',
  value: 'A Good Fellow',
};

module.exports.test = (uiTestCtx) => {
  describe('Module test: ui-licenses: set license terms', function test() {
    const { config, helpers: { login, logout } } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));

    describe('Login > open licenses > create, view, edit license > logout', () => {
      before((done) => {
        login(nightmare, config, done);
      });

      after((done) => {
        logout(nightmare, config, done);
      });

      it('should navigate to create license page', done => {
        const name = `Terms License #${generateNumber()}`;
        nightmare
          .wait('#clickable-licenses-module')
          .click('#clickable-licenses-module')
          .wait('#licenses-module-display')
          .wait('#clickable-newlicense')
          .click('#clickable-newlicense')

          .waitUntilNetworkIdle(2000) // Wait for the default values to be fetched and set.

          .insert('#edit-license-name', name)

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

      it('should set term', done => {
        nightmare
          .type(`#edit-term-${NUMBER_OF_TERMS - 1}-name`, 'Definition')
          .type(`#edit-term-${NUMBER_OF_TERMS - 1}-value`, 'A Good Fellow')
          .wait(500)
          .evaluate((termId, expectedTerm) => {
            const nameElement = document.querySelector(`#edit-term-${termId}-name`);
            const valueElement = document.querySelector(`#edit-term-${termId}-value`);

            if (expectedTerm.label !== nameElement.selectedOptions[0].textContent) {
              throw Error(`Expected #edit-term-${termId}-name to have label ${expectedTerm.label}. It is ${nameElement.selectedOptions[0].textContent}`);
            }
            if (expectedTerm.name !== nameElement.value) {
              throw Error(`Expected #edit-term-${termId}-name to have value ${expectedTerm.name}. It is ${nameElement.value}`);
            }
            if (expectedTerm.value !== valueElement.value) {
              throw Error(`Expected #edit-term-${termId}-value to have label ${expectedTerm.value}. It is ${valueElement.value}`);
            }
          }, NUMBER_OF_TERMS - 1, TERM)
          .then(done)
          .catch(done);
      });

      it('should create license', done => {
        nightmare
          .click('#clickable-createlicense')
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
          }, TERM)
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
          .evaluate((expectedTerm) => {
            const nameElement = document.querySelector('#edit-term-0-name');
            const valueElement = document.querySelector('#edit-term-0-value');

            if (expectedTerm.label !== nameElement.selectedOptions[0].textContent) {
              throw Error(`Expected #edit-term-0-name to have label ${expectedTerm.label}`);
            }
            if (expectedTerm.name !== nameElement.value) {
              throw Error(`Expected #edit-term-0-name to have label ${expectedTerm.name}`);
            }
            if (expectedTerm.value !== valueElement.value) {
              throw Error(`Expected #edit-term-0-name to have label ${expectedTerm.value}`);
            }
          }, TERM)
          .then(done)
          .catch(done);
      });

      it('should remove term from license and save', done => {
        nightmare
          .click('#edit-term-0-delete')
          .wait(500)
          .click('#clickable-updatelicense')
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
          }, TERM)
          .then(done)
          .catch(done);
      });
    });
  });
};
