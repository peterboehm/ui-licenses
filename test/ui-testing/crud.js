/* global describe, it, before, after, Nightmare */

const generateNumber = () => Math.round(Math.random() * 100000);

const generateLicenseValues = () => {
  const number = generateNumber();
  return {
    name: `Fledgling License #${number}`,
    description: `This license of count #${number} is still in its initial stages.`,
    type: 'Alliance',
    status: 'In Negotiation',
    startDate: '2020-01-01',
    endDate: '2020-01-11',

    editedName: `Edited License #${number}`,
    editedType: 'National',
    editedStatus: 'Active',
  };
};

const createLicense = (nightmare, done, defaultValues, resourceId) => {
  const values = defaultValues || generateLicenseValues();

  nightmare
    .wait('#clickable-licenses-module')
    .click('#clickable-licenses-module')
    .wait('#licenses-module-display')
    .wait('#clickable-newlicense')
    .click('#clickable-newlicense')

    .waitUntilNetworkIdle(2000) // Wait for the default values to be fetched and set.

    .insert('#edit-license-name', values.name)

    .type('#edit-license-type', values.type)
    .type('#edit-license-status', values.status)

    .insert('#edit-license-start-date', values.startDate)
    .insert('#edit-license-end-date', values.endDate)

    .insert('#edit-license-description', values.description)

    .click('#clickable-createlicense')
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
    const { config, helpers: { login, logout } } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);
    const values = generateLicenseValues();

    this.timeout(Number(config.test_timeout));

    describe('login > open licenses > create, view, edit license > logout', () => {
      before((done) => {
        login(nightmare, config, done);
      });

      after((done) => {
        logout(nightmare, config, done);
      });

      it('should open app and navigate to Licenses', done => {
        nightmare
          .wait('#clickable-licenses-module')
          .click('#clickable-licenses-module')
          .wait('#licenses-module-display')
          .evaluate(() => document.location.pathname)
          .then(pathName => {
            if (!pathName.includes('/licenses')) throw Error('URL is incorrect');
            done();
          })
          .catch(done);
      });

      it('should clear default status filters', done => {
        nightmare
          .wait('#filter-accordion-status button[icon=times-circle-solid]')
          .click('#filter-accordion-status button[icon=times-circle-solid]')
          .then(done)
          .catch(done);
      });

      it('should create license with correct default values', done => {
        const name = `Default License #${generateNumber()}`;
        nightmare
          .wait('#clickable-licenses-module')
          .click('#clickable-licenses-module')
          .wait('#licenses-module-display')
          .wait('#clickable-newlicense')
          .click('#clickable-newlicense')

          .waitUntilNetworkIdle(2000) // Wait for the default values to be fetched and set.

          .insert('#edit-license-name', name)

          .click('#clickable-createlicense')
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

      it('should create license', done => {
        createLicense(nightmare, done, values);
      });

      it(`should search for and find license: ${values.name}`, done => {
        nightmare
          .wait('#input-license-search')
          .insert('#input-license-search', values.name)
          .click('[data-test-search-and-sort-submit]')
          .wait(1000) // If another license was open wait for the new one to be open before the next operation.
          .wait('#licenseInfo')
          .waitUntilNetworkIdle(1000)
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
          .click('[class*=paneHeader] [class*=dropdown] button')
          .wait('#clickable-edit-license')
          .click('#clickable-edit-license')
          .wait('#licenseFormInfo')
          .insert('#edit-license-name', '')
          .insert('#edit-license-name', values.editedName)

          .click('#datepicker-clear-button-edit-license-start-date')
          .insert('#edit-license-start-date', '2020-02-02')
          .click('#datepicker-clear-button-edit-license-end-date')
          .insert('#edit-license-end-date', '2020-02-12')

          .type('#edit-license-type', values.editedType)
          .type('#edit-license-status', values.editedStatus)
          .click('#clickable-updatelicense')
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
          .click('#clickable-newlicense')
          .wait('#licenseFormInfo')
          .waitUntilNetworkIdle(1000)
          .insert('#edit-license-name', 'Invalid Date')

          .type('#edit-license-end-date', '2020-01-04\u000d')
          .type('#edit-license-start-date', '2020-01-05\u000d')
          .wait(1000)

          .evaluate(() => {
            if (!document.querySelector('[data-test-error-end-date-too-early]')) {
              throw Error('Expected to find an error message at [data-test-error-end-date-too-early] for the End Date');
            }
          })
          .then(() => {
            nightmare
              .click('form button[icon=times]')
              .click('[data-test-confirmation-modal-cancel-button]');
          })
          .then(done)
          .catch(done);
      });

      it('should create open-ended license', done => {
        nightmare
          .click('#clickable-newlicense')
          .wait('#licenseFormInfo')
          .waitUntilNetworkIdle(1000)
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
          .click('#clickable-createlicense')
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
