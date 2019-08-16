/* global describe, it, before, after, Nightmare */

module.exports.test = (uiTestCtx) => {
  const number = Math.round(Math.random() * 100000);
  const editText = '-edited';
  const pickList = `${number}pickList`;
  const editedPickList = `${pickList}${editText}`;
  const pickListValue = `${number}pickListValue`;
  const editedPickListValue = `${pickListValue}${editText}`;

  describe('Pick list crud', function test() {
    const { config, helpers } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);
    nightmare.options.width = 1300; // added this temporarily as MultiSelect doesnt work well with narrow screen sizes

    this.timeout(Number(config.test_timeout));

    describe('Login > Open settings > Create and edit pick list > Create and edit pick list value > Delete value and pick list > Logout\n', () => {
      before((done) => {
        helpers.login(nightmare, config, done);
      });

      after((done) => {
        helpers.logout(nightmare, config, done);
      });

      it('should open Settings', done => {
        helpers.clickSettings(nightmare, done);
      });

      it(`should create pick list ${pickList} in settings`, done => {
        nightmare
          .wait('a[href="/settings/licenses"]')
          .click('a[href="/settings/licenses"]')
          .wait('a[href="/settings/licenses/pick-lists"]')
          .click('a[href="/settings/licenses/pick-lists"]')
          .waitUntilNetworkIdle(1000)
          .wait('#clickable-add-pick-lists')
          .click('#clickable-add-pick-lists')
          .wait('input[name="items[0].desc"]')
          .type('input[name="items[0].desc"]', pickList)
          .wait('#clickable-save-pick-lists-0')
          .click('#clickable-save-pick-lists-0')
          .wait(222)
          .then(done)
          .catch(done);
      });

      it(`should find pick list ${pickList}`, done => {
        nightmare
          .wait('a[href="/settings/licenses"]')
          .click('a[href="/settings/licenses"]')
          .wait('a[href="/settings/licenses/pick-lists"]')
          .click('a[href="/settings/licenses/pick-lists"]')
          .wait('#editList-pick-lists')
          .evaluate(list => {
            const listRows = [...document.querySelectorAll('#editList-pick-lists')].map(e => e.textContent);
            const listElement = listRows.find(r => r.indexOf(list) >= 0);
            if (!listElement) {
              throw Error(`Could not find row with the list ${list} but found ${listElement}`);
            }
          }, pickList)
          .then(done)
          .catch(done);
      });

      it(`should edit pick list ${pickList} in settings`, done => {
        nightmare
          .wait('a[href="/settings/licenses"]')
          .click('a[href="/settings/licenses"]')
          .wait('a[href="/settings/licenses/pick-lists"]')
          .click('a[href="/settings/licenses/pick-lists"]')
          .waitUntilNetworkIdle(1000)
          .wait('#clickable-edit-pick-lists-0')
          .click('#clickable-edit-pick-lists-0')
          .wait('input[name="items[0].desc"]')
          .insert('input[name="items[0].desc"]', '')
          .insert('input[name="items[0].desc"]', editedPickList)
          //  .type('input[name="items[0].desc"]', editText)
          .wait('#clickable-save-pick-lists-0')
          .click('#clickable-save-pick-lists-0')
          .wait(222)
          .then(done)
          .catch(done);
      });

      it(`should find edited pick list ${editedPickList}`, done => {
        nightmare
          .wait('a[href="/settings/licenses"]')
          .click('a[href="/settings/licenses"]')
          .wait('a[href="/settings/licenses/pick-lists"]')
          .click('a[href="/settings/licenses/pick-lists"]')
          .wait('#editList-pick-lists')
          .evaluate(list => {
            const listRows = [...document.querySelectorAll('#editList-pick-lists')].map(e => e.textContent);
            const listElement = listRows.find(r => r.indexOf(list) >= 0);
            if (!listElement) {
              throw Error(`Could not find row with the edited list ${list} but found ${listElement}`);
            }
          }, editedPickList)
          .then(done)
          .catch(done);
      });

      it(`should not find pick list ${pickList}`, done => {
        nightmare
          .wait('a[href="/settings/licenses"]')
          .click('a[href="/settings/licenses"]')
          .wait('a[href="/settings/licenses/pick-lists"]')
          .click('a[href="/settings/licenses/pick-lists"]')
          .wait('#editList-pick-lists')
          .evaluate(list => {
            const row = document.evaluate(
              `//*[@id="editList-pick-lists"]//div[.="${list}"]`,
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE
            ).singleNodeValue;
            if (row != null) {
              throw Error(`Should not find row with list ${list}`);
            }
          }, pickList)
          .then(done)
          .catch(done);
      });


      it(`should create pick list value ${pickListValue} in settings`, done => {
        nightmare
          .wait('a[href="/settings/licenses"]')
          .click('a[href="/settings/licenses"]')
          .wait('a[href="/settings/licenses/pick-list-values"]')
          .click('a[href="/settings/licenses/pick-list-values"]')
          .waitUntilNetworkIdle(1000)
          .wait('#categorySelect')
          .type('#categorySelect', editedPickList)
          .wait('#clickable-add-pick-list-values')
          .click('#clickable-add-pick-list-values')
          .wait('input[name="items[0].label"]')
          .type('input[name="items[0].label"]', pickListValue)
          .wait('#clickable-save-pick-list-values-0')
          .click('#clickable-save-pick-list-values-0')
          .wait(222)
          .then(done)
          .catch(done);
      });

      it(`should find pick list value ${pickListValue} in list`, done => {
        nightmare
          .wait('#editList-pick-list-values')
          .evaluate(value => {
            const valueRows = [...document.querySelectorAll('#editList-pick-list-values')].map(e => e.textContent);
            const valueElement = valueRows.find(r => r.indexOf(value) >= 0);
            if (!valueElement) {
              throw Error(`Could not find row with the edited value ${value} but found ${valueElement}`);
            }
          }, pickListValue)
          .then(done)
          .catch(done);
      });

      it(`should edit pick list value ${pickListValue} in settings`, done => {
        nightmare
          .wait('a[href="/settings/licenses"]')
          .click('a[href="/settings/licenses"]')
          .wait('a[href="/settings/licenses/pick-list-values"]')
          .click('a[href="/settings/licenses/pick-list-values"]')
          .waitUntilNetworkIdle(1000)
          .wait('#categorySelect')
          .type('#categorySelect', editedPickList)
          .wait('#clickable-edit-pick-list-values-0')
          .click('#clickable-edit-pick-list-values-0')
          .wait('input[name="items[0].label"]')
          .type('input[name="items[0].label"]', editText)
          .wait('#clickable-save-pick-list-values-0')
          .click('#clickable-save-pick-list-values-0')
          .wait(222)
          .then(done)
          .catch(done);
      });

      it(`should find edited pick list value ${editedPickListValue} in list`, done => {
        nightmare
          .wait('#editList-pick-list-values')
          .evaluate(value => {
            const valueRows = [...document.querySelectorAll('#editList-pick-list-values')].map(e => e.textContent);
            const valueElement = valueRows.find(r => r.indexOf(value) >= 0);
            if (!valueElement) {
              throw Error(`Could not find row with the edited value ${value} but found ${valueElement}`);
            }
          }, editedPickListValue)
          .then(done)
          .catch(done);
      });

      it(`should not find pick list value ${pickListValue} in list`, done => {
        nightmare
          .wait('#editList-pick-list-values')
          .evaluate(value => {
            const row = document.evaluate(
              `//*[@id="editList-pick-list-values"]//div[.="${value}"]`,
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE
            ).singleNodeValue;
            if (row != null) {
              throw Error(`Should not find row with value ${value}`);
            }
          }, pickListValue)
          .then(done)
          .catch(done);
      });

      it(`should delete pick list value ${editedPickListValue}`, done => {
        nightmare
          .waitUntilNetworkIdle(1000)
          .wait('#editList-pick-list-values')
          .wait('#clickable-delete-pick-list-values-0')
          .click('#clickable-delete-pick-list-values-0')
          .waitUntilNetworkIdle(1000)
          .wait('#clickable-delete-controlled-vocab-entry-confirmation-confirm')
          .click('#clickable-delete-controlled-vocab-entry-confirmation-confirm')
          .waitUntilNetworkIdle(1000)
          .evaluate(value => {
            const row = document.evaluate(
              `//*[@id="editList-pick-list-values"]//div[.="${value}"]`,
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE
            ).singleNodeValue;
            if (row != null) {
              throw Error(`Should not find row with value ${value}`);
            }
          }, editedPickListValue)
          .then(done)
          .catch(done);
      });

      it(`should delete the pick list ${editedPickList}`, done => {
        nightmare
          .wait('a[href="/settings/licenses"]')
          .click('a[href="/settings/licenses"]')
          .wait('a[href="/settings/licenses/pick-lists"]')
          .click('a[href="/settings/licenses/pick-lists"]')
          .waitUntilNetworkIdle(1000)
          .wait('#clickable-delete-pick-lists-0')
          .click('#clickable-delete-pick-lists-0')
          .waitUntilNetworkIdle(1000)
          .wait('#clickable-delete-controlled-vocab-entry-confirmation-confirm')
          .click('#clickable-delete-controlled-vocab-entry-confirmation-confirm')
          .waitUntilNetworkIdle(1000)
          .evaluate(list => {
            const row = document.evaluate(
              `//*[@id="editList-pick-lists"]//div[.="${list}"]`,
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE
            ).singleNodeValue;
            if (row != null) {
              throw Error(`Should not find row with list ${list}`);
            }
          }, editedPickList)
          .then(done)
          .catch(done);
      });
    });
  });
};
