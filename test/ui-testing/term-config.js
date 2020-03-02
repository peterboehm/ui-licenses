/* global describe, it, before, after, Nightmare */

const randomNumber = Math.round(Math.random() * 1000);
const BASE_TERM = {
  label: `Term ${randomNumber}: `,
  name: `sample${randomNumber}`,
  description: 'A sample term for testing: ',
  weight: '2',
  primary: 'Yes',
  defaultInternal: 'Public',
};

const editableTerm = {
  ...BASE_TERM,
  label: `${BASE_TERM.label}Editable`,
  name: `${BASE_TERM.name}Editable`,
  description: `${BASE_TERM.description}Editable`,
  type: 'Text',
};

const TYPES = ['Decimal', 'Integer', 'Pick list', 'Text'];

module.exports.test = (uiTestCtx) => {
  describe('ui-licenses: configure terms', function test() {
    const { config, helpers } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));

    describe('open settings > create terms > edit terms > delete terms', () => {
      before((done) => {
        helpers.login(nightmare, config, done);
      });

      after((done) => {
        helpers.logout(nightmare, config, done);
      });

      it('should open Settings', done => {
        helpers.clickSettings(nightmare, done);
      });

      it('should open term settings', done => {
        nightmare
          .wait('a[href="/settings/licenses"]')
          .click('a[href="/settings/licenses"]')
          .wait('a[href="/settings/licenses/terms"]')
          .click('a[href="/settings/licenses/terms"]')
          .waitUntilNetworkIdle(2000)
          .then(done)
          .catch(done);
      });

      TYPES.forEach(type => {
        it(`should create and delete ${type} term`, done => {
          const term = {
            ...BASE_TERM,
            label: `${BASE_TERM.label}${type}`,
            name: `${BASE_TERM.name}${type.substring(0, 3)}`,
            description: `${BASE_TERM.description} ${type}`,
            type,
          };

          let chain = nightmare // eslint-disable-line no-unused-vars
            .click('#clickable-new-customproperty')
            .wait('input[name="customProperties[0].label"]');

          Object.entries(term).forEach(([key, value]) => {
            chain = chain.type(`[name="customProperties[0].${key}"]`, value);
          });

          if (term.type === 'Pick list') {
            chain = chain.type('[name="customProperties[0].category"]', 'Permitted/Prohibited');
          }

          chain = chain
            .click('[data-test-customproperty-save-btn]')
            .waitUntilNetworkIdle(2000)
            .evaluate(_term => {
              const card = document.querySelector(`[data-test-customproperty=${_term.name}]`);
              Object.entries(_term).forEach(([key, expectedValue]) => {
                const foundValue = card.querySelector(`[data-test-customproperty-${key.toLowerCase()}] > [data-test-kv-value]`).textContent;
                if (foundValue !== expectedValue) {
                  throw Error(`Expected ${key} with value ${expectedValue}. Found ${foundValue}`);
                }
              });
            }, term)
            .then(() => {
              nightmare
                .click(`[data-test-customproperty=${term.name}] [data-test-customproperty-delete-btn]`)
                .waitUntilNetworkIdle(2000)
                .then(done)
                .catch(done);
            })
            .catch(done);
        });
      });

      it('should create, edit and delete term', done => {
        let chain = nightmare // eslint-disable-line no-unused-vars
          .click('#clickable-new-customproperty')
          .wait('input[name="customProperties[0].label"]');

        // Fill out the terms values for the first time.
        Object.entries(editableTerm).forEach(([key, value]) => {
          chain = chain.type(`[name="customProperties[0].${key}"]`, value);
        });

        // Save the term.
        chain = chain
          .click('[data-test-customproperty-save-btn]')
          .waitUntilNetworkIdle(2000);

        chain = chain
          .wait(`[data-test-customproperty=${editableTerm.name}] [data-test-customproperty-edit-btn]`)
          .click(`[data-test-customproperty=${editableTerm.name}] [data-test-customproperty-edit-btn]`)
          .wait(`[data-test-customproperty=${editableTerm.name}] input[name*=label]`);

        // Make some changes and cancel out of them.
        const garbageText = 'This data should never be saved or shown in a view field.';
        chain = chain
          .insert(`[data-test-customproperty=${editableTerm.name}] input[name*=label]`, garbageText)
          .click('[data-test-customproperty-cancel-btn]')
          .evaluate((_term, _garbageText) => {
            const label = document.querySelector(`[data-test-customproperty=${_term.name}] [data-test-customproperty-label] > [data-test-kv-value]`);
            if (label.textContent.indexOf(_garbageText) >= 0) {
              throw Error('Found garbage text that should not be visible when cancelling edits.');
            }
          }, editableTerm, garbageText);

        // Start editing the term again.
        chain = chain
          .click(`[data-test-customproperty=${editableTerm.name}] [data-test-customproperty-edit-btn]`)
          .wait(`[data-test-customproperty=${editableTerm.name}] input[name*=label]`);

        const newValues = {
          primary: 'No',
          defaultInternal: 'Internal',
        };

        // Edit the term with the new values.
        Object.entries(newValues).forEach(([key, value]) => {
          chain = chain.type(`[data-test-customproperty=${editableTerm.name}] [name*=${key}]`, value);
        });

        // Save the changes and confirm they were persisted.
        chain
          .click('[data-test-customproperty-save-btn]')
          .waitUntilNetworkIdle(2000)
          .evaluate((_term, _name) => {
            const card = document.querySelector(`[data-test-customproperty=${_name}]`);
            Object.entries(_term).forEach(([key, expectedValue]) => {
              const foundValue = card.querySelector(`[data-test-customproperty-${key.toLowerCase()}] > [data-test-kv-value]`).textContent;
              if (foundValue !== expectedValue) {
                throw Error(`Expected ${key} with value ${expectedValue}. Found ${foundValue}`);
              }
            });
          }, newValues, editableTerm.name)
          // Delete the term.
          .click(`[data-test-customproperty=${editableTerm.name}] [data-test-customproperty-delete-btn]`)
          .waitUntilNetworkIdle(2000)
          .then(done)
          .catch(done);
      });

      it('should not have any sample terms', done => {
        nightmare
          .refresh()
          .wait('[data-test-customproperty]')
          .evaluate(_baseTermName => {
            const termNames = [...document.querySelectorAll('[data-test-customproperty] > [data-test-kv-value]')];
            const sampleTermName = termNames.find(l => l.textContent.indexOf(_baseTermName) >= 0);

            if (sampleTermName) {
              throw Error(`Found sample term with name of ${sampleTermName.textContent} when all should be deleted.`);
            }
          }, BASE_TERM.name)
          .then(done)
          .catch(done);
      });
    });
  });
};
