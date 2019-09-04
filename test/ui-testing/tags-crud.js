/* global describe, it, before, after, Nightmare */

module.exports.test = (uiTestCtx) => {
  const number = Math.round(Math.random() * 100000);
  const testTag = `test${Math.floor(Math.random() * 100000)}`;
  const license = {
    name: `Tags License #${number}`,
  };

  describe('tags-crud', function test() {
    const { config, helpers } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);
    nightmare.options.width = 1300; // added this temporarily as MultiSelect doesnt work well with narrow screen sizes

    this.timeout(Number(config.test_timeout));

    describe('Login > Enable Tags > Find license > Create Tags > Logout\n', () => {
      before((done) => {
        helpers.login(nightmare, config, done);
      });

      after((done) => {
        helpers.logout(nightmare, config, done);
      });

      it('should Enable tags in settings', done => {
        nightmare
          .wait(config.select.settings)
          .click(config.select.settings)
          .wait('#app-list-item-clickable-settings')
          .wait('a[href="/settings/tags"]')
          .click('a[href="/settings/tags"]')
          .wait('a[href="/settings/tags/general"]')
          .click('a[href="/settings/tags/general"]')
          .wait('#tags_enabled')
          .waitUntilNetworkIdle(2000)
          .evaluate(() => {
            const list = document.querySelectorAll('#tags_enabled[value="true"]');
            list.forEach(el => (el.click()));
          })
          .then(() => {
            nightmare
              .waitUntilNetworkIdle(2000)
              .wait('#tags_enabled')
              .click('#tags_enabled')
              .wait('#clickable-save-config')
              .click('#clickable-save-config')
              .then(done)
              .catch(done);
          });
      });

      it('should open Licenses app', done => {
        helpers.clickApp(nightmare, done, 'licenses');
      });

      it('should confirm correct URL', done => {
        nightmare
          .evaluate(() => document.location.pathname)
          .then(pathName => {
            if (!pathName.includes('/licenses')) throw Error('URL is incorrect');
            done();
          })
          .catch(done);
      });

      it('should navigate to create license page', done => {
        nightmare
          .wait('#list-licenses')
          .wait('#clickable-new-license')
          .click('#clickable-new-license')
          .waitUntilNetworkIdle(2000) // Wait for the default values to be fetched and set.
          .insert('#edit-license-name', license.name)
          .then(done)
          .catch(done);
      });

      it(`should create license ${license.name}`, done => {
        nightmare
          .click('#clickable-create-license')
          .waitUntilNetworkIdle(2000) // Wait for record to be fetched
          .then(done)
          .catch(done);
      });

      it('should add a new Tag', done => {
        nightmare
          .wait('#clickable-show-tags')
          .click('#clickable-show-tags')
          .wait('#input-tag-input')
          .type('#input-tag-input', testTag)
          .wait('#multiselect-option-list-input-tag > ul > li')
          .click('#multiselect-option-list-input-tag > ul > li')
          .wait((tagValue) => {
            return Array.from(
              document.querySelectorAll('div[class*="valueChipValue"]')
            ).findIndex(e => e.textContent === tagValue) >= 0;
          }, testTag)
          .then(done)
          .catch(done);
      });

      it('should have the badge count equal to 1', done => {
        nightmare
          .wait('#clickable-show-tags')
          .wait(() => parseInt(document.querySelector('#clickable-show-tags').textContent, 10) === 1)
          .then(done)
          .catch(done);
      });

      it('should close tags pane', done => {
        nightmare
          .click('#clickable-show-tags')
          .then(done)
          .catch(done);
      });

      it('should filter licenses by the tag', done => {
        nightmare
          .wait('#accordion-toggle-button-clickable-tags-filter')
          .click('#accordion-toggle-button-clickable-tags-filter')
          .wait('#tags-filter-input')
          .type('#tags-filter-input', testTag)
          .wait('#multiselect-option-list-tags-filter > ul > li')
          .click('#multiselect-option-list-tags-filter > ul > li')
          .wait('#list-licenses')
          .wait(() => document.querySelector('#list-licenses [aria-rowindex="2"]') !== null)
          .wait((_license) => (
            document.querySelector('#list-licenses [aria-rowindex="2"]')
              .textContent.indexOf(_license)
              >= 0
          ), license.name)
          .then(done)
          .catch(done);
      });
    });
  });
};
