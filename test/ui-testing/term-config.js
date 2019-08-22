/* global describe, it, before, after, Nightmare */

const BASE_TERM = {
  label: 'Sample Term: ',
  name: 'sample',
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
            .click('#clickable-new-term')
            .wait('input[name="terms[0].label"]');

          Object.entries(term).forEach(([key, value]) => {
            chain = chain.type(`[name="terms[0].${key}"]`, value);
          });

          if (term.type === 'Pick list') {
            chain = chain.type('[name="terms[0].category"]', 'Permitted/Prohibited');
          }

          chain = chain
            .click('[data-test-term-save-btn]')
            .waitUntilNetworkIdle(2000)
            .evaluate(_term => {
              const card = document.querySelector('[data-test-term-name="terms[0]"]');
              Object.entries(_term).forEach(([key, expectedValue]) => {
                const foundValue = card.querySelector(`[data-test-term-${key}] > [data-test-kv-value]`).textContent;
                if (foundValue !== expectedValue) {
                  throw Error(`Expected ${key} with value ${expectedValue}. Found ${foundValue}`);
                }
              });
            }, term)
            .then(() => {
              nightmare
                .click('[data-test-term-name="terms[0]"] [data-test-term-delete-btn]')
                .waitUntilNetworkIdle(2000)
                .then(done)
                .catch(done);
            })
            .catch(done);
        });
      });

      it('should create, edit and delete term', done => {
        let chain = nightmare // eslint-disable-line no-unused-vars
          .click('#clickable-new-term')
          .wait('input[name="terms[0].label"]');

        Object.entries(editableTerm).forEach(([key, value]) => {
          chain = chain.type(`[name="terms[0].${key}"]`, value);
        });

        chain = chain
          .click('[data-test-term-save-btn]')
          .waitUntilNetworkIdle(2000);

        chain = chain
          .click('[data-test-term-name="terms[0]"] [data-test-term-delete-btn]')
          .wait('input[name="terms[0].label"]');

        const newValues = {
          primary: 'No',
          defaultInternal: 'Internal',
        };

        Object.entries(newValues).forEach(([key, value]) => {
          chain = chain.type(`[name="terms[0].${key}"]`, value);
        });

        chain
          .click('[data-test-term-save-btn]')
          .waitUntilNetworkIdle(2000)
          .evaluate(_term => {
            const card = document.querySelector('[data-test-term-name="terms[0]"]');
            Object.entries(_term).forEach(([key, expectedValue]) => {
              const foundValue = card.querySelector(`[data-test-term-${key}] > [data-test-kv-value]`).textContent;
              if (foundValue !== expectedValue) {
                throw Error(`Expected ${key} with value ${expectedValue}. Found ${foundValue}`);
              }
            });
          }, newValues)
          .click('[data-test-term-name="terms[0]"] [data-test-term-delete-btn]')
          .waitUntilNetworkIdle(2000)
          .then(done)
          .catch(done);
      });

      it('should not have any sample terms', done => {
        nightmare
          .refresh()
          .wait('[data-test-term-name="terms[0]"]')
          .evaluate(() => {
            const termLabels = [...document.querySelectorAll('[data-test-term-label] > [data-test-kv-value]')];
            const sampleTerm = termLabels.find(l => l.textContent.indexOf('Sample Term') >= 0);

            if (sampleTerm) {
              throw Error(`Found sample term with label of ${sampleTerm.textContent} when all should be deleted.`);
            }
          })
          .then(done)
          .catch(done);
      });
    });
  });
};
