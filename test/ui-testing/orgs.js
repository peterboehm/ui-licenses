/* global describe, it, before, after, Nightmare */

const generateNumber = () => Math.round(Math.random() * 100000);

const ORGS = [{
  name: `Licensor ${generateNumber()}`,
  role: 'Licensor',
  toDelete: true,
}, {
  name: `Consortium ${generateNumber()}`,
  role: 'Consortium',
  editedName: `Consortium Admin ${generateNumber()}`,
  editedRole: 'Consortium Administrator',
}];


module.exports.test = (uiTestCtx) => {
  const orgs = ORGS;

  describe(`ui-licenses: set orgs: "${orgs.map(o => o.name).join(', ')}"`, function test() {
    const { config, helpers: { login, logout } } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));

    const createOrg = (org) => {
      it(`should create org: ${org.name}`, done => {
        nightmare
          .click('#create-license-org-btn')
          .wait(1000)
          .insert('#create-org-modal-name-field', org.name)
          .click('#create-org-modal-submit-btn')
          .waitUntilNetworkIdle(1000)
          .then(done)
          .catch(done);
      });
    };

    const licensor = orgs.find(o => o.role === 'Licensor');
    const orgToEdit = orgs.find(o => o.editedName);
    const orgToDelete = orgs.find(o => o.toDelete);

    describe('login > open licenses > create license > edit orgs > logout', () => {
      before((done) => {
        login(nightmare, config, done);
      });

      after((done) => {
        logout(nightmare, config, done);
      });

      it('should navigate to create license page', done => {
        const name = `Orgs License #${generateNumber()}`;

        console.log(`\tCreating ${name}`);

        nightmare
          .wait('#app-list-item-clickable-licenses-module')
          .click('#app-list-item-clickable-licenses-module')
          .wait('#licenses-module-display')
          .wait('#clickable-newlicense')
          .click('#clickable-newlicense')

          .waitUntilNetworkIdle(2000) // Wait for the default values to be fetched and set.

          .insert('#edit-license-name', name)

          .then(done)
          .catch(done);
      });

      orgs.forEach((org, row) => {
        createOrg(org);

        it('should add org line', done => {
          nightmare
            .click('#add-license-org-btn')
            .evaluate((r) => {
              if (!document.querySelector(`#org-name-${r}`)) {
                throw Error('Expected name dropdown to exist.');
              }

              if (!document.querySelector(`#org-role-${r}`)) {
                throw Error('Expected role dropdown to exist.');
              }
            }, row)
            .then(done)
            .catch(done);
        });

        it(`should select org: ${org.name}`, done => {
          nightmare
            .click(`#org-name-${row}`)
            .insert(`#sl-container-org-name-${row} input`, org.name)
            .waitUntilNetworkIdle(2000)
            .click(`#sl-container-org-name-${row} ul li[aria-selected=false]`)
            .evaluate((r, o) => {
              const nameElement = document.querySelector(`#org-name-${r}`);
              const name = nameElement.textContent;
              if (name !== o.name) {
                throw Error(`Expected name to be ${o.name} and is ${name}`);
              }
            }, row, org)
            .then(done)
            .catch(done);
        });

        it(`should assign role: ${org.role}`, done => {
          nightmare
            .type(`#org-role-${row}`, org.role)
            .evaluate((r, o) => {
              const roleElement = document.querySelector(`#org-role-${r}`);
              const role = roleElement.selectedOptions[0].textContent;
              if (role !== o.role) {
                throw Error(`Expected role to be ${o.role} and is ${role}`);
              }
            }, row, org)
            .then(done)
            .catch(done);
        });
      });

      it('should create license', done => {
        nightmare
          .click('#clickable-createlicense')
          .waitUntilNetworkIdle(2000) // Wait for record to be fetched
          .then(done)
          .catch(done);
      });

      orgs.forEach(org => {
        it(`should find "${org.name}" in Organizations list with role ${org.role}`, done => {
          nightmare
            .evaluate(o => {
              const rows = [...document.querySelectorAll('[data-test-license-org]')].map(e => e.textContent);
              const row = rows.find(r => r.indexOf(o.name) >= 0);
              if (!row) {
                throw Error(`Could not find row with an org named ${o.name}`);
              }
              if (row.indexOf(o.role) < 0) {
                throw Error(`Expected row for "${o.name}" to contain role ${o.role}.`);
              }
            }, org)
            .then(done)
            .catch(done);
        });
      });

      if (licensor) {
        it(`should find ${licensor.name} in header as Licensor`, done => {
          nightmare
            .evaluate(o => {
              const headerLicensor = document.querySelector('[data-test-license-card-licensor-name]').textContent;
              if (headerLicensor !== o.name) {
                throw Error(`Expected to find Licensor as ${o.name}. It is ${headerLicensor}.`);
              }
            }, licensor)
            .then(done)
            .catch(done);
        });
      }

      it('should open edit license', done => {
        nightmare
          .click('[class*=paneHeader] [class*=dropdown] button')
          .wait('#clickable-edit-license')
          .click('#clickable-edit-license')
          .wait('#licenseFormInfo')
          .waitUntilNetworkIdle(2000)
          .then(done)
          .catch(done);
      });

      orgs.forEach(org => {
        it(`should find correctly loaded values for ${org.name}`, done => {
          nightmare
            .evaluate(o => {
              const nameElements = [...document.querySelectorAll('button[id^=org-name-]')];
              const nameElement = nameElements.find(e => e.textContent === o.name);
              if (!nameElement) {
                throw Error(`Failed to find org name select with loaded value of ${o.name}`);
              }

              const roleElementId = nameElement.id.replace('name', 'role');
              const roleElement = document.getElementById(roleElementId);
              const roleValue = roleElement.selectedOptions[0].textContent;
              if (roleValue !== o.role) {
                throw Error(`Expected ${o.name}'s role to be ${o.role}. It is ${roleValue}.`);
              }
            }, org)
            .then(done)
            .catch(done);
        });
      });

      if (orgToEdit) {
        const newOrg = { name: orgToEdit.editedName, role: orgToEdit.editedRole };

        createOrg(newOrg);

        it(`should edit license with new org ${newOrg.name}`, done => {
          nightmare
            .evaluate(o => {
              const nameElements = [...document.querySelectorAll('button[id^=org-name-]')];
              const index = nameElements.findIndex(e => e.textContent === o.name);
              if (index === -1) {
                throw Error(`Failed to find org name select with loaded value of ${o.name}`);
              }

              return index;
            }, orgToEdit)
            .then(row => {
              return nightmare
                .click(`#org-name-${row}`)
                .insert(`#sl-container-org-name-${row} input`, newOrg.name)
                .waitUntilNetworkIdle(2000)
                .click(`#sl-container-org-name-${row} ul li[aria-selected=false]`)
                .type(`#org-role-${row}`, newOrg.role)
                .evaluate((r, o) => {
                  const nameElement = document.querySelector(`#org-name-${r}`);
                  const name = nameElement.textContent;
                  if (name !== o.name) {
                    throw Error(`Expected name to be ${o.name} and is ${name}`);
                  }

                  const roleElement = document.querySelector(`#org-role-${r}`);
                  const role = roleElement.selectedOptions[0].textContent;
                  if (role !== o.role) {
                    throw Error(`Expected role to be ${o.role} and is ${role}`);
                  }
                }, row, newOrg);
            })
            .then(done)
            .catch(done);
        });
      }

      if (orgToDelete) {
        it(`should delete org ${orgToDelete.name}`, done => {
          nightmare
            .evaluate(o => {
              const nameElements = [...document.querySelectorAll('button[id^=org-name-]')];
              const index = nameElements.findIndex(e => e.textContent === o.name);
              if (index === -1) {
                throw Error(`Failed to find org name select with loaded value of ${o.name}`);
              }

              return index;
            }, orgToDelete)
            .then(row => nightmare.click(`#org-delete-${row}`))
            .then(done)
            .catch(done);
        });
      }

      it('should save updated license', done => {
        nightmare
          .click('#clickable-updatelicense')
          .waitUntilNetworkIdle(2000) // Wait for record to be fetched
          .then(done)
          .catch(done);
      });

      if (orgToEdit) {
        it(`should find "${orgToEdit.editedName}" in Organizations list with role ${orgToEdit.editedRole}`, done => {
          nightmare
            .evaluate(o => {
              const rows = [...document.querySelectorAll('[data-test-license-org]')].map(e => e.textContent);
              const row = rows.find(r => r.indexOf(o.editedName) >= 0);
              if (!row) {
                throw Error(`Could not find row with an org named ${o.editedName}`);
              }
              if (row.indexOf(o.editedRole) < 0) {
                throw Error(`Expected row for "${o.editedName}" to contain role ${o.editedRole}.`);
              }
            }, orgToEdit)
            .then(done)
            .catch(done);
        });
      }

      if (orgToDelete) {
        it(`should NOT find "${orgToDelete.name}" in Organizations list with role ${orgToDelete.role}`, done => {
          nightmare
            .evaluate(o => {
              const rows = [...document.querySelectorAll('[data-test-license-org]')].map(e => e.textContent);
              const row = rows.find(r => r.indexOf(o.name) >= 0);
              if (row) {
                throw Error(`Found a row with an org named ${o.name} when it should have been deleted.`);
              }
            }, orgToDelete)
            .then(done)
            .catch(done);
        });
      }
    });
  });
};
