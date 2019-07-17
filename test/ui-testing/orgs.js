/* global describe, it, before, after, Nightmare */

const generateNumber = () => Math.round(Math.random() * 100000);

const ORGS = [{
  name: `Licensor ${generateNumber()}`,
  role: 'Licensor',
  toDelete: true,
}, {
  name: `Licensee ${generateNumber()}`,
  role: 'Licensee',
  editedName: `Consortium Admin ${generateNumber()}`,
  editedRole: 'Consortium Administrator',
}];


module.exports.test = (uiTestCtx) => {
  const orgs = ORGS;

  describe(`ui-licenses: set orgs: "${orgs.map(o => o.name).join(', ')}"`, function test() {
    const { config, helpers } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));

    const licensor = orgs.find(o => o.role === 'Licensor');
    const orgToEdit = orgs.find(o => o.editedName);
    const orgToDelete = orgs.find(o => o.toDelete);

    describe('login > open licenses > create license > edit orgs > logout', () => {
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
        const name = `Orgs License #${generateNumber()}`;

        console.log(`\tCreating ${name}`);

        nightmare
          .wait('#list-licenses')
          .wait('#clickable-new-license')
          .click('#clickable-new-license')

          .waitUntilNetworkIdle(1000)
          .insert('#edit-license-name', name)

          .then(done)
          .catch(done);
      });

      orgs.forEach((org, row) => {
        it('should add org', done => {
          nightmare
            .click('#add-org-btn')
            .evaluate((r) => {
              if (!document.querySelector(`#orgs-nameOrg-${r}-search-button`)) {
                throw Error('Expected organization picker button to exist.');
              }

              if (!document.querySelector(`#orgs-role-${r}`)) {
                throw Error('Expected role dropdown to exist.');
              }
            }, row)
            .then(done)
            .catch(done);
        });

        it('should select org', done => {
          nightmare
            .click(`#orgs-nameOrg-${row}-search-button`)
            .wait('#clickable-filter-status-active')
            .click('#clickable-filter-status-active')
            .wait(`#list-plugin-find-organization [aria-rowindex="${row + 3}"] > a`)
            .click(`#list-plugin-find-organization [aria-rowindex="${row + 3}"] > a`)
            .waitUntilNetworkIdle(2000)
            .evaluate((r, _orgs) => {
              const orgElement = document.querySelector(`#orgs-nameOrg-${r}`);
              const name = orgElement.textContent;
              if (!name) {
                throw Error('Org field has no value!');
              }

              return name;
            }, row, orgs)
            .then(name => {
              orgs[row].name = name;
            })
            .then(done)
            .catch(done);
        });

        it(`should assign role: ${org.role}`, done => {
          nightmare
            .wait(`#orgs-role-${row}`)
            .click(`#orgs-role-${row}`)
            .type(`#orgs-role-${row}`, org.role)
            .evaluate((r, o) => {
              const roleElement = document.querySelector(`#orgs-role-${r}`);
              const role = roleElement.selectedOptions[0].textContent;
              if (role !== o.role) {
                throw Error(`Expected role to be ${o.role} but is ${role}`);
              }
            }, row, org)
            .then(done)
            .catch(done);
        });
      });

      it('should create license', done => {
        nightmare
          .click('#clickable-create-license')
          .waitUntilNetworkIdle(2000) // Wait for record to be fetched
          .then(done)
          .catch(done);
      });

      orgs.forEach(org => {
        it(`should find "${org.name}" in Organizations list with role ${org.role}`, done => {
          nightmare
            .evaluate(o => {
              const rows = [...document.querySelectorAll('[data-test-organization-card]')].map(e => e.textContent);
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
          .wait('#clickable-edit-license')
          .click('#clickable-edit-license')
          .waitUntilNetworkIdle(1000)
          .then(done)
          .catch(done);
      });

      orgs.forEach((org, i) => {
        it(`should find correctly loaded values for org ${i}`, done => {
          nightmare
            .evaluate(o => {
              const orgElements = [...document.querySelectorAll('[id^=orgs-nameOrg-]')];
              const orgElement = orgElements.find(e => e.textContent === o.name);
              if (!orgElement) {
                throw Error(`Failed to find org name picker with loaded org of ${o.name}`);
              }

              const roleElementId = orgElement.id.replace('nameOrg', 'role');
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
        it('should edit license', done => {
          nightmare
            .evaluate(o => {
              const nameElements = [...document.querySelectorAll('[id^=orgs-nameOrg-]')];
              const index = nameElements.findIndex(e => e.textContent === o.name);
              if (index === -1) {
                throw Error(`Failed to find org picker with loaded value of ${o.name}`);
              }
              return index;
            }, orgToEdit)
            .then(row => {
              return nightmare
                .wait(`#orgs-unlink-${row}`)
                .click(`#orgs-unlink-${row}`)
                .wait(`#orgs-nameOrg-${row}-search-button`)
                .click(`#orgs-nameOrg-${row}-search-button`)
                .wait('#clickable-filter-status-active')
                .click('#clickable-filter-status-active')
                .wait('#list-plugin-find-organization [aria-rowindex="12"] > a')
                .click('#list-plugin-find-organization [aria-rowindex="12"] > a')
                .waitUntilNetworkIdle(2000)
                .wait(`#orgs-role-${row}`)
                .click(`#orgs-role-${row}`)
                .type(`#orgs-role-${row}`, orgToEdit.editedRole)
                .evaluate((r, _orgs) => {
                  const orgElement = document.querySelector(`#orgs-nameOrg-${r}`);
                  const name = orgElement.textContent;
                  if (!name) {
                    throw Error('Org name field has no value!');
                  }
                  return name;
                }, row, orgs)
                .then(name => {
                  orgToEdit.editedName = name;
                });
            })
            .then(done)
            .catch(done);
        });
      }

      if (orgToDelete) {
        it('should delete org', done => {
          nightmare
            .evaluate(o => {
              const nameElements = [...document.querySelectorAll('[id^=orgs-nameOrg-]')];
              const index = nameElements.findIndex(e => e.textContent === o.name);
              if (index === -1) {
                throw Error(`Failed to find org picker with loaded user of ${o.name}`);
              }

              return index;
            }, orgToDelete)
            .then(row => nightmare.click(`#orgs-delete-${row}`))
            .then(done)
            .catch(done);
        });
      }

      it('should save updated license', done => {
        nightmare
          .click('#clickable-update-license')
          .waitUntilNetworkIdle(2000) // Wait for record to be fetched
          .then(done)
          .catch(done);
      });


      if (orgToEdit) {
        it(`should find org in Organizations list with role ${orgToEdit.editedRole}`, done => {
          nightmare
            .evaluate(o => {
              const rows = [...document.querySelectorAll('[data-test-organization-card]')].map(e => e.textContent);
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
        it(`should NOT find org in organizations list with role ${orgToDelete.role}`, done => {
          nightmare
            .evaluate(o => {
              const rows = [...document.querySelectorAll('[data-test-organization-card]')].map(e => e.textContent);
              const row = rows.find(r => r.indexOf(o.name) >= 0);
              if (row) {
                throw Error(`Found a row with a org named ${o.name} when it should have been deleted.`);
              }
            }, orgToDelete)
            .then(done)
            .catch(done);
        });
      }
    });
  });
};
