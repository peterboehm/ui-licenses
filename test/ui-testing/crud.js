/* global describe, it, before, after, Nightmare */

const generateNumber = () => Math.round(Math.random() * 100000);

const generateLicenseValues = () => {
  const number = generateNumber();
  return {
    name: `Fledgling License #${number}`,
    description: `This license of count #${number} is still in its initial stages.`,
    type: 'Alliance',
    status: 'In negotiation',
    startDate: '2020-01-01',
    endDate: '2020-01-11',

    editedName: `Edited License #${number}`,
    editedType: 'National',
    editedStatus: 'Active',
  };
};

const createLicense = (nightmare, done, defaultValues) => {
  const values = defaultValues || generateLicenseValues();

  nightmare
    .wait('#list-licenses')
    .wait('#clickable-new-license')
    .click('#clickable-new-license')

    .waitUntilNetworkIdle(2000) // Wait for the default values to be fetched and set.

    .insert('#edit-license-name', values.name)

    .type('#edit-license-type', values.type)
    .type('#edit-license-status', values.status)

    .insert('#edit-license-start-date', values.startDate)
    .insert('#edit-license-end-date', values.endDate)

    .insert('#edit-license-description', values.description)

    .click('#clickable-create-license')
    .wait('#licenseInfo')
    .waitUntilNetworkIdle(500)
    .evaluate(expectedValues => {
      const foundName = document.querySelector('[data-test-license-name]').innerText;
      if (foundName !== expectedValues.name) {
        throw Error(`Name of license is incorrect. Expected "${expectedValues.name}" and got "${foundName}" `);
      }

      const foundType = document.querySelector('[data-test-license-type]').innerText;
      if (foundType !== expectedValues.type) {
        throw Error(`Type of license is incorrect. Expected "${expectedValues.type}" and got "${foundType}" `);
      }

      const foundStatus = document.querySelector('[data-test-license-status]').innerText;
      if (foundStatus !== expectedValues.status) {
        throw Error(`Status of license is incorrect. Expected "${expectedValues.status}" and got "${foundStatus}" `);
      }

      const foundDescription = document.querySelector('[data-test-license-description]').innerText;
      if (foundDescription !== expectedValues.description) {
        throw Error(`Description of license is incorrect. Expected "${expectedValues.description}" and got "${foundDescription}" `);
      }
    }, values)
    .then(() => nightmare.click('#pane-view-license button[icon=times]'))
    .then(done)
    .catch(done);

  return values;
};

module.exports.generateLicenseValues = generateLicenseValues;
module.exports.createLicense = createLicense;

module.exports.test = (uiTestCtx) => {
  describe('ui-licenses: basic license crud', function test() {
    const { config, helpers } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);
    const values = generateLicenseValues();

    this.timeout(Number(config.test_timeout));

    describe('login > open licenses > create, view, edit license > logout', () => {
      before((done) => {
        helpers.login(nightmare, config, done);
      });

      after((done) => {
        helpers.logout(nightmare, config, done);
      });

      it('should open Licenses app', done => {
        helpers.clickApp(nightmare, done, 'licenses');
      });

      it('should create license with correct default values', done => {
        const name = `Default License #${generateNumber()}`;
        nightmare
          .wait('#list-licenses')
          .wait('#clickable-new-license')
          .click('#clickable-new-license')

          .waitUntilNetworkIdle(2000) // Wait for the default values to be fetched and set.

          .insert('#edit-license-name', name)

          .click('#clickable-create-license')
          .wait('#licenseInfo')
          .waitUntilNetworkIdle(1000)
          .evaluate(expectedName => {
            const foundName = document.querySelector('[data-test-license-name]').innerText;
            if (foundName !== expectedName) {
              throw Error(`Name of license is incorrect. Expected "${expectedName}" and got "${foundName}" `);
            }

            const foundType = document.querySelector('[data-test-license-type]').innerText;
            if (foundType !== 'Local') {
              throw Error(`Type of license is incorrect. Expected "Local" and got "${foundType}" `);
            }

            const foundStatus = document.querySelector('[data-test-license-status]').innerText;
            if (foundStatus !== 'Active') {
              throw Error(`Status of license is incorrect. Expected "Active" and got "${foundStatus}" `);
            }
          }, name)
          .then(() => nightmare.click('#pane-view-license button[icon=times]'))
          .then(done)
          .catch(done);
      });

      it(`should create license: ${values.name}`, done => {
        createLicense(nightmare, done, values);
      });

      it('should clear default status filters', done => {
        nightmare
          .waitUntilNetworkIdle(1000)
          .wait('#filter-accordion-status button[icon=times-circle-solid]')
          .click('#filter-accordion-status button[icon=times-circle-solid]')
          .then(done)
          .catch(done);
      });

      it(`should search for and find license: ${values.name}`, done => {
        nightmare
          .wait('#input-license-search')
          .insert('#input-license-search', values.name)
          .click('#clickable-search-licenses')
          .waitUntilNetworkIdle(1000)
          .wait('#licenseInfo')
          .evaluate(expectedValues => {
            const node = document.querySelector('[data-test-license-name]');
            if (!node || !node.innerText) throw Error('No license name node found.');

            const name = node.innerText;
            if (name !== expectedValues.name) {
              throw Error(`Name of found license is incorrect. Expected "${expectedValues.name}" and got "${name}" `);
            }
          }, values)
          .then(done)
          .catch(done);
      });

      it(`should edit license to: ${values.editedName}`, done => {
        nightmare
          .wait('#clickable-edit-license')
          .click('#clickable-edit-license')
          .wait('#edit-license-name')
          .insert('#edit-license-name', '')
          .insert('#edit-license-name', values.editedName)

          .click('#datepicker-clear-button-edit-license-start-date')
          .insert('#edit-license-start-date', '2020-02-02')
          .click('#datepicker-clear-button-edit-license-end-date')
          .insert('#edit-license-end-date', '2020-02-12')

          .type('#edit-license-type', values.editedType)
          .type('#edit-license-status', values.editedStatus)
          .click('#clickable-update-license')
          .wait('#licenseInfo')
          .waitUntilNetworkIdle(1000)
          .evaluate(expectedValues => {
            const name = document.querySelector('[data-test-license-name]').innerText;
            if (name !== expectedValues.editedName) {
              throw Error(`Name of found license is incorrect. Expected "${expectedValues.editedName}" and got "${name}" `);
            }

            const type = document.querySelector('[data-test-license-type]').innerText;
            if (type !== expectedValues.editedType) {
              throw Error(`Type of license is incorrect. Expected "${expectedValues.editedType}" and got "${type}" `);
            }

            const status = document.querySelector('[data-test-license-status]').innerText;
            if (status !== expectedValues.editedStatus) {
              throw Error(`Status of license is incorrect. Expected "${expectedValues.editedStatus}" and got "${status}" `);
            }
          }, values)
          .then(done)
          .catch(done);
      });

      it('should reject endDate <= startDate', done => {
        nightmare
          .click('#clickable-new-license')
          .wait('#edit-license-name')
          .insert('#edit-license-name', 'Invalid Date')

          .type('#edit-license-end-date', '2020-01-04\u000d')
          .type('#edit-license-start-date', '2020-01-05\u000d')
          .click('#clickable-create-license')

          .evaluate(() => {
            if (!document.querySelector('[data-test-error-end-date-too-early]')) {
              throw Error('Expected to find an error message at [data-test-error-end-date-too-early] for the End Date');
            }
          })
          .then(() => {
            nightmare
              .click('#close-license-form-button')
              .click('#clickable-cancel-editing-confirmation-cancel');
          })
          .then(done)
          .catch(done);
      });

      it('should create open-ended license', done => {
        nightmare
          .wait('#clickable-new-license')
          .click('#clickable-new-license')
          .wait('#edit-license-name')
          .insert('#edit-license-name', `Open Ended License #${generateNumber()}`)
          .type('#edit-license-end-date', '2020-01-11\u000d')
          .click('#edit-license-open-ended')
          .type('#edit-license-start-date', '2020-01-01\u000d')
          .wait(1000)

          .evaluate(() => {
            if (!document.querySelector('#edit-license-end-date').disabled) {
              throw Error('Expected to find #edit-license-end-date disabled');
            }
          })
          .click('#clickable-create-license')
          .wait('#licenseInfo')
          .waitUntilNetworkIdle(1000)

          .evaluate(() => {
            const endDate = document.querySelector('[data-test-license-end-date]').innerText;
            if (endDate !== 'Open ended') {
              throw Error('Expected [data-test-license-end-date] to be "Open ended"');
            }
          })
          .then(done)
          .catch(done);
      });
    });
  });
};
