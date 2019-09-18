/* global describe, it, before, after, Nightmare */

let NUMBER_OF_TERMS;

const TERM = {
  name: 'otherRestrictions',
  label: 'Other restrictions',
  value: 'A Few',
  editedValue: 'A Lot',
  note: 'Internal note',
  publicNote: 'Public note'
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

          .then(done)
          .catch(done);
      });

      it('should count the number of terms', done => {
        nightmare
          .evaluate(() => [...document.querySelectorAll('[data-test-term]')].length)
          .then(count => {
            NUMBER_OF_TERMS = count;
          })
          .then(done)
          .catch(done);
      });

      it('should find a primary term and shouldnt have a name field and delete button', done => {
        nightmare
          .evaluate(() => {
            const primaryTermsList = [...document.querySelectorAll('[data-test-term=primary]')];
            if (primaryTermsList.length > 0) {
              const nameField = document.querySelector('#edit-term-0-name');
              const trashButton = document.querySelector('#edit-term-0-delete');
              if (nameField) throw Error('Should not have an editable name field');
              if (trashButton) throw Error('Should not have the ability to delete the term');
            }
          })
          .then(done)
          .catch(done);
      });

      it('should add term', done => {
        nightmare
          .click('#add-term-btn')
          .wait(500)
          .evaluate(() => [...document.querySelectorAll('[data-test-term]')].length)
          .then(count => {
            if (count !== NUMBER_OF_TERMS + 1) {
              throw Error(`Expected ${NUMBER_OF_TERMS + 1} terms but found ${count}!`);
            }

            NUMBER_OF_TERMS += 1;
          })
          .then(done)
          .catch(done);
      });

      it('added term should be optional term', done => {
        nightmare
          .evaluate((totalTerms) => {
            const addedTerm = [...document.querySelectorAll('[data-test-term]')][totalTerms - 1];
            const optionalTerm = [...document.querySelectorAll('[data-test-term=optional]')][0];
            return addedTerm === optionalTerm;
          }, NUMBER_OF_TERMS)
          .then(value => {
            if (!value) {
              throw Error('Expect the added term to be an optional term');
            }
          })
          .then(done)
          .catch(done);
      });

      it('added optional term should have name field and delete option', done => {
        nightmare
          .evaluate((totalTerms) => {
            const optionalTermNameField = document.querySelector(`#edit-term-${totalTerms - 1}-name`);
            const optionalTermTrashButton = document.querySelectorAll(`#edit-term-${totalTerms - 1}-delete`);
            if (!optionalTermNameField) throw Error('Optional term should have a name field');
            if (!optionalTermTrashButton) throw Error('Optional term should have a delete button');
          }, NUMBER_OF_TERMS)
          .then(done)
          .catch(done);
      });

      it(`should set term to: ${term.value}`, done => {
        nightmare
          .type(`#edit-term-${NUMBER_OF_TERMS - 1}-name`, term.label)
          .type(`#edit-term-${NUMBER_OF_TERMS - 1}-value`, term.value)
          .type(`#edit-term-${NUMBER_OF_TERMS - 1}-internal-note`, term.note)
          .type(`#edit-term-${NUMBER_OF_TERMS - 1}-public-note`, term.publicNote)
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
            const noteElement = document.querySelector(`[data-test-term-note=${expectedTerm.name}]`);
            const pubNoteElement = document.querySelector(`[data-test-term-public-note=${expectedTerm.name}]`);
            const visibilityElement = document.querySelector(`[data-test-term-visibility=${expectedTerm.name}]`);

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

            if (!noteElement) {
              throw Error(`Expected to find ${expectedTerm.note} note`);
            }

            if (noteElement.textContent !== expectedTerm.note) {
              throw Error(`Expected to find ${expectedTerm.note}`);
            }

            if (pubNoteElement) {
              throw Error(`Should not find ${expectedTerm.publicNote} public note`);
            }

            if (!visibilityElement) {
              throw Error('Expected to find visibility');
            }

            if (visibilityElement.textContent !== 'Internal') {
              throw Error('Expected to find visibility \'Internal\'');
            }
          }, term)
          .then(done)
          .catch(done);
      });

      it('should edit license and find term', done => {
        nightmare
          .wait('#clickable-edit-license')
          .click('#clickable-edit-license')
          .wait('#licenseFormInfo')
          .waitUntilNetworkIdle(2000)
          .evaluate((expectedTerm, row) => {
            const nameElement = document.querySelector(`#edit-term-${row}-name`);
            const valueElement = document.querySelector(`#edit-term-${row}-value`);
            const noteElement = document.querySelector(`#edit-term-${row}-internal-note`);
            const pubNoteElement = document.querySelector(`#edit-term-${row}-public-note`);
            const note = noteElement.value;
            const publicNote = pubNoteElement.value;


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

            if (note !== expectedTerm.note) {
              throw Error(`Expected #edit-term-${row}-internal-note to be ${expectedTerm.note}. It is ${note}`);
            }

            if (publicNote !== expectedTerm.publicNote) {
              throw Error(`Expected #edit-term-${row}-public-note to be ${expectedTerm.publicNote}. It is ${publicNote}`);
            }
          }, term, NUMBER_OF_TERMS - 1)
          .then(done)
          .catch(done);
      });

      it(`should edit term value to: ${term.editedValue} and set visibility to ${term.internal.text}`, done => {
        nightmare
          .insert(`#edit-term-${NUMBER_OF_TERMS - 1}-value`, '')
          .type(`#edit-term-${NUMBER_OF_TERMS - 1}-value`, term.editedValue)
          .wait(`#edit-term-${NUMBER_OF_TERMS - 1}-visibility`)
          .type(`#edit-term-${NUMBER_OF_TERMS - 1}-visibility`, term.internal.text)
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
            const visibilityElement = document.querySelector(`[data-test-term-visibility=${expectedTerm.name}]`);

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

            if (!visibilityElement) {
              throw Error(`Expected to find ${expectedTerm.name} visibility`);
            }

            if (visibilityElement.textContent !== expectedTerm.internal.text) {
              throw Error(`Expected to find term visibility ${expectedTerm.internal.text}`);
            }
          }, term)
          .then(done)
          .catch(done);
      });

      it('should edit license and find edited term', done => {
        nightmare
          .wait('#clickable-edit-license')
          .click('#clickable-edit-license')
          .wait('#licenseFormInfo')
          .waitUntilNetworkIdle(2000)
          .evaluate((expectedTerm, row) => {
            const nameElement = document.querySelector(`#edit-term-${row}-name`);
            const valueElement = document.querySelector(`#edit-term-${row}-value`);
            const visibilityElement = document.querySelector(`#edit-term-${row}-visibility`);

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

            const visibility = visibilityElement.value;

            if (visibility !== expectedTerm.internal.value) {
              throw Error(`Expected #edit-term-${row}-visibility to be ${expectedTerm.internal.value}. It is ${visibility}`);
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
