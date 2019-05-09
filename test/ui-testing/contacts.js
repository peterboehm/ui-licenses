/* global describe, it, before, after, Nightmare */

const generateNumber = () => Math.round(Math.random() * 100000);

const CONTACTS = [{
  role: 'General Contact',
  editedRole: 'Subject Specialist',
}, {
  role: 'Agreement Owner',
  delete: true,
}];

const EDIT_CONTACT = CONTACTS.find(c => c.editedRole);
const DELETE_CONTACT = CONTACTS.find(c => c.delete);

module.exports.test = (uiTestCtx) => {
  describe('ui-licenses: set contacts', function test() {
    const { config, helpers } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));

    describe('login > open licenses > create license > edit contacts > logout', () => {
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
        const name = `Contacts License #${generateNumber()}`;

        console.log(`\tCreating ${name}`);

        nightmare
          .wait('#list-licenses')
          .wait('#clickable-new-license')
          .click('#clickable-new-license')

          .wait('#accordion-toggle-button-licenseFormContacts')
          .click('#accordion-toggle-button-licenseFormContacts')
          .waitUntilNetworkIdle(1000)
          .insert('#edit-license-name', name)

          .then(done)
          .catch(done);
      });

      CONTACTS.forEach((contact, row) => {
        it('should add contact', done => {
          nightmare
            .click('#add-license-contacts-btn')
            .evaluate((r) => {
              if (!document.querySelector(`#contacts-user-${r}-search-button`)) {
                throw Error('Expected user picker button to exist.');
              }

              if (!document.querySelector(`#contacts-role-${r}`)) {
                throw Error('Expected role dropdown to exist.');
              }
            }, row)
            .then(done)
            .catch(done);
        });

        it('should select user', done => {
          nightmare
            .click(`#contacts-user-${row}-search-button`)
            .wait('#clickable-filter-active-active')
            .click('#clickable-filter-active-active')
            .wait(`#list-plugin-find-user [aria-rowindex="${row + 3}"]`)
            .click(`#list-plugin-find-user [aria-rowindex="${row + 3}"]`)
            .evaluate((r, _contacts) => {
              const userElement = document.querySelector(`#contacts-user-${r}`);
              const name = userElement.value;
              if (!name) {
                throw Error('User field has no value!');
              }

              return name;
            }, row, CONTACTS)
            .then(name => {
              CONTACTS[row].name = name;
            })
            .then(done)
            .catch(done);
        });

        it(`should assign role: ${contact.role}`, done => {
          nightmare
            .type(`#contacts-role-${row}`, contact.role)
            .evaluate((r, c) => {
              const roleElement = document.querySelector(`#contacts-role-${r}`);
              const role = roleElement.selectedOptions[0].textContent;
              if (role !== c.role) {
                throw Error(`Expected role to be ${c.role} and is ${role}`);
              }
            }, row, contact)
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

      CONTACTS.forEach(contact => {
        it(`should find contact in Internal Contacts list with role ${contact.role}`, done => {
          nightmare
            .evaluate(c => {
              const rows = [...document.querySelectorAll('[data-test-license-contact]')].map(e => e.textContent);
              const row = rows.find(r => r.indexOf(c.name) >= 0);
              if (!row) {
                throw Error(`Could not find row with an contact named ${c.name}`);
              }
              if (row.indexOf(c.role) < 0) {
                throw Error(`Expected row for "${c.name}" to contain role ${c.role}.`);
              }
            }, contact)
            .then(done)
            .catch(done);
        });
      });

      it('should open edit license', done => {
        nightmare
          .click('[class*=paneHeader] [class*=dropdown] button')
          .wait('#clickable-edit-license')
          .click('#clickable-edit-license')
          .wait('#accordion-toggle-button-licenseFormContacts')
          .click('#accordion-toggle-button-licenseFormContacts')
          .waitUntilNetworkIdle(1000)
          .then(done)
          .catch(done);
      });

      CONTACTS.forEach((contact, i) => {
        it(`should find correctly loaded values for contact ${i}`, done => {
          nightmare
            .evaluate(c => {
              const userElements = [...document.querySelectorAll('input[id^=contacts-user-]')];
              const userElement = userElements.find(e => e.value === c.name);
              if (!userElement) {
                throw Error(`Failed to find user picker with loaded user of ${c.name}`);
              }

              const roleElementId = userElement.id.replace('user', 'role');
              const roleElement = document.getElementById(roleElementId);
              const roleValue = roleElement.selectedOptions[0].textContent;
              if (roleValue !== c.role) {
                throw Error(`Expected ${c.name}'s role to be ${c.role}. It is ${roleValue}.`);
              }
            }, contact)
            .then(done)
            .catch(done);
        });
      });

      if (EDIT_CONTACT) {
        it('should edit contact', done => {
          nightmare
            .evaluate(c => {
              const nameElements = [...document.querySelectorAll('input[id^=contacts-user-]')];
              const index = nameElements.findIndex(e => e.value === c.name);
              if (index === -1) {
                throw Error(`Failed to find user picker with loaded user of ${c.name}`);
              }

              return index;
            }, EDIT_CONTACT)
            .then(row => {
              return nightmare
                .click(`#contacts-user-${row}-search-button`)
                .wait('#clickable-filter-active-active')
                .click('#clickable-filter-active-active')
                .wait('#list-plugin-find-user [aria-rowindex="10"]')
                .click('#list-plugin-find-user [aria-rowindex="10"]')
                .type(`#contacts-role-${row}`, EDIT_CONTACT.editedRole)
                .evaluate((r, _contacts) => {
                  const userElement = document.querySelector(`#contacts-user-${r}`);
                  const name = userElement.value;
                  if (!name) {
                    throw Error('User field has no value!');
                  }

                  return name;
                }, row, CONTACTS)
                .then(name => {
                  EDIT_CONTACT.editedName = name;
                });
            })
            .then(done)
            .catch(done);
        });
      }

      if (DELETE_CONTACT) {
        it('should delete contact', done => {
          nightmare
            .evaluate(c => {
              const nameElements = [...document.querySelectorAll('input[id^=contacts-user-]')];
              const index = nameElements.findIndex(e => e.value === c.name);
              if (index === -1) {
                throw Error(`Failed to find user picker with loaded user of ${c.name}`);
              }

              return index;
            }, DELETE_CONTACT)
            .then(row => nightmare.click(`#contacts-delete-${row}`))
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

      if (EDIT_CONTACT) {
        it(`should find contact in Internal Contacts list with role ${EDIT_CONTACT.editedRole}`, done => {
          nightmare
            .evaluate(c => {
              const rows = [...document.querySelectorAll('[data-test-license-contact]')].map(e => e.textContent);
              const row = rows.find(r => r.indexOf(c.editedName) >= 0);
              if (!row) {
                throw Error(`Could not find row with a contact named ${c.editedName}`);
              }
              if (row.indexOf(c.editedRole) < 0) {
                throw Error(`Expected row for "${c.editedName}" to contain role ${c.editedRole}.`);
              }
            }, EDIT_CONTACT)
            .then(done)
            .catch(done);
        });
      }

      if (DELETE_CONTACT) {
        it(`should NOT find contact in Internal Contacts list with role ${DELETE_CONTACT.role}`, done => {
          nightmare
            .evaluate(c => {
              const rows = [...document.querySelectorAll('[data-test-license-contact]')].map(e => e.textContent);
              const row = rows.find(r => r.indexOf(c.name) >= 0);
              if (row) {
                throw Error(`Found a row with a contact named ${c.name} when it should have been deleted.`);
              }
            }, DELETE_CONTACT)
            .then(done)
            .catch(done);
        });
      }
    });
  });
};
