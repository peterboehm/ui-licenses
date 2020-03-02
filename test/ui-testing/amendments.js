/* global describe, it, before, after, Nightmare */

const NUMBER = Math.round(Math.random() * 100000);
const LICENSE_NAME = `Amendments License #${NUMBER}`;

const AMENDMENTS = [{
  name: `Amendment ${NUMBER}.1`,
  status: 'Not yet active',
  description: 'The first amendment',
  startDate: '04/01/2020',
  openEnded: true,
  coreDocs: ['C1', 'C2'],
  supplementaryDocs: ['S1', 'S2'],
  terms: [{
    input: 'O',
    label: 'Other restrictions',
    name: 'otherRestrictions',
    value: 'A Few',
  }],
  editedName: '.1',
}, {
  name: `Amendment ${NUMBER}.2`,
  status: 'Not yet active',
  description: 'The second amendment',
  startDate: '05/01/2020',
  delete: true,
}];

module.exports.test = (uiTestCtx) => {
  describe('ui-licenses: manage amendments', function test() {
    const { config, helpers } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));

    describe('login > open licenses > create license > add amendments > logout', () => {
      before((done) => {
        helpers.login(nightmare, config, done);
      });

      after((done) => {
        helpers.logout(nightmare, config, done);
      });

      it('should open Licenses app', done => {
        helpers.clickApp(nightmare, done, 'licenses');
      });


      it(`should create license ${LICENSE_NAME}`, done => {
        nightmare
          .wait('#list-licenses')
          .wait('#clickable-new-license')
          .click('#clickable-new-license')

          .wait('#edit-license-name')
          .insert('#edit-license-name', LICENSE_NAME)
          .click('#clickable-create-license')
          .waitUntilNetworkIdle(2000) // Wait for record to be created

          .then(done)
          .catch(done);
      });

      AMENDMENTS.forEach(amendment => {
        it('should open create amendment page', done => {
          nightmare
            .wait('#accordion-toggle-button-licenseAmendments')
            .click('#accordion-toggle-button-licenseAmendments')
            .wait('#add-amendment-button')
            .click('#add-amendment-button')
            .then(done)
            .catch(done);
        });

        it('should fill out amendment info', done => {
          let chain = nightmare
            .wait('#edit-amendment-name')
            .insert('#edit-amendment-name', amendment.name);

          if (amendment.status) chain = chain.type('#edit-amendment-status', amendment.status);
          if (amendment.description) chain = chain.insert('#edit-amendment-description', amendment.description);
          if (amendment.startDate) chain = chain.insert('#edit-amendment-start-date', amendment.startDate);
          if (amendment.endDate) chain = chain.insert('#edit-amendment-end-date', amendment.endDate);
          if (amendment.openEnded) chain = chain.click('#edit-amendment-open-ended');
          chain.then(done).catch(done);
        });

        if (amendment.terms) {
          it('should fill out amendment terms', done => {
            let chain = nightmare;

            amendment.terms.forEach(term => {
              chain = chain
                .wait('#add-customproperty-btn')
                .click('#add-customproperty-btn')
                .wait(500)
                .evaluate(() => [...document.querySelectorAll('[data-test-customproperty]')].length - 1)
                .then(index => {
                  nightmare
                    .wait(`#edit-customproperty-${index}-name`)
                    .type(`#edit-customproperty-${index}-name`, term.input)
                    .wait(`#edit-customproperty-${index}-value`)
                    .type(`#edit-customproperty-${index}-value`, term.value);
                });
            });

            chain.then(done).catch(done);
          });
        }

        if (amendment.supplementaryDocs) {
          it('should fill out amendment supplementary docs', done => {
            let chain = nightmare;

            amendment.supplementaryDocs.forEach((doc, i) => {
              chain = chain
                .click('#add-supplementaryDocs-btn')
                .insert(`#supplementaryDocs-${i}-name`, doc)
                .insert(`#supplementaryDocs-${i}-location`, 'Filing Cabinet');
            });

            chain.then(done).catch(done);
          });
        }

        if (amendment.coreDocs) {
          it('should fill out amendment core docs', done => {
            let chain = nightmare;

            amendment.coreDocs.forEach((doc, i) => {
              chain = chain
                .click('#add-docs-btn')
                .insert(`#docs-${i}-name`, doc)
                .insert(`#docs-${i}-location`, 'Filing Cabinet');
            });

            chain.then(done).catch(done);
          });
        }

        it('should create amendment', done => {
          nightmare
            .click('#clickable-create-amendment')
            .waitUntilNetworkIdle(1000)
            .then(done)
            .catch(done);
        });

        it('should close amendment view pane', done => {
          nightmare
            .click('#pane-view-amendment [icon="times"]')
            .wait('#licenseAmendments')
            .then(done)
            .catch(done);
        });
      });

      it('should have the correct number of amendments in the badge', done => {
        nightmare
          .evaluate(numberOfAmendments => {
            const badge = document.querySelector('#licenseAmendments [class*="badge"]').textContent;
            if (badge !== `${numberOfAmendments}`) {
              throw Error(`Expected badge to be ${numberOfAmendments} and is ${badge}`);
            }
          }, AMENDMENTS.length)
          .then(done)
          .catch(done);
      });

      AMENDMENTS.forEach(amendment => {
        it(`should find amendments table row for ${amendment.name}`, done => {
          nightmare
            .evaluate(_amendment => {
              const NADate = date => {
                const parts = date.split('/').map(p => parseInt(p, 10));
                return `${parts[0]}/${parts[1]}/${parts[2]}`;
              };

              const cells = [...document.querySelectorAll('#amendments-table [role="gridcell"]')];
              const nameCell = cells.find(c => c.textContent === _amendment.name);
              if (!nameCell) throw Error(`Failed to find row with cell for ${_amendment.name}`);

              const rowCells = [...nameCell.parentNode.children];
              if (_amendment.status) {
                const statusCell = rowCells.find(c => c.textContent === _amendment.status);
                if (!statusCell) throw Error(`Failed to find status of ${_amendment.status} for ${_amendment.name}`);
              }

              if (_amendment.startDate) {
                const startDateCell = rowCells.find(c => c.textContent === NADate(_amendment.startDate));
                if (!startDateCell) throw Error(`Failed to find start date of ${NADate(_amendment.startDate)} for ${_amendment.name}`);
              }

              if (_amendment.endDate) {
                const endDateCell = rowCells.find(c => c.textContent === NADate(_amendment.endDate));
                if (!endDateCell) throw Error(`Failed to find end date of ${NADate(_amendment.endDate)} for ${_amendment.name}`);
              }

              if (_amendment.openEnded) {
                const openEndedCell = rowCells.find(c => c.textContent === 'Open ended');
                if (!openEndedCell) throw Error(`Failed to find 'Open ended' end date for ${_amendment.name}`);
              }
            }, amendment)
            .then(done)
            .catch(done);
        });

        it(`should open view amendment pane for ${amendment.name}`, done => {
          nightmare
            .click('#accordion-toggle-button-licenseAmendments')
            .evaluate(_amendment => {
              const cells = [...document.querySelectorAll('#amendments-table [role="gridcell"]')];
              const nameCell = cells.find(c => c.textContent === _amendment.name);
              if (!nameCell) throw Error(`Failed to find row with cell for ${_amendment.name}`);

              return nameCell.parentNode.getAttribute('aria-rowindex');
            }, amendment)
            .then(rowIndex => {
              nightmare
                .click(`#amendments-table [aria-rowindex="${rowIndex}"] a`)
                .wait('#amendment-info');
            })
            .then(done)
            .catch(done);
        });

        it(`should have correct info values for ${amendment.name}`, done => {
          nightmare
            .evaluate((_licenseName, _amendment) => {
              const NADate = date => {
                const parts = date.split('/').map(p => parseInt(p, 10));
                return `${parts[0]}/${parts[1]}/${parts[2]}`;
              };

              const licenseName = document.querySelector('[data-test-license-card-name]').textContent;
              if (licenseName !== _licenseName) throw Error(`Expected license name to be ${licenseName} and found ${_licenseName}`);

              const amendmentName = document.querySelector('[data-test-amendment-name]').textContent;
              if (amendmentName !== _amendment.name) throw Error(`Expected amendment name to be ${_amendment.name} and found ${amendmentName}`);

              if (_amendment.status) {
                const amendmentStatus = document.querySelector('[data-test-amendment-status]').textContent;
                if (amendmentStatus !== _amendment.status) throw Error(`Expected amendment status to be ${_amendment.status} and found ${amendmentStatus}`);
              }

              if (_amendment.description) {
                const amendmentDescription = document.querySelector('[data-test-amendment-description]').textContent;
                if (amendmentDescription !== _amendment.description) throw Error(`Expected amendment description to be ${_amendment.description} and found ${amendmentDescription}`);
              }

              if (_amendment.startDate) {
                const amendmentStartDate = document.querySelector('[data-test-amendment-start-date]').textContent;
                if (amendmentStartDate !== NADate(_amendment.startDate)) throw Error(`Expected amendment start date to be ${NADate(_amendment.startDate)} and found ${amendmentStartDate}`);
              }

              if (_amendment.endDate) {
                const amendmentEndDate = document.querySelector('[data-test-amendment-end-date]').textContent;
                if (amendmentEndDate !== NADate(_amendment.endDate)) throw Error(`Expected amendment end date to be ${NADate(_amendment.endDate)} and found ${amendmentEndDate}`);
              }

              if (_amendment.openEnded) {
                const amendmentOpenEnded = document.querySelector('[data-test-amendment-end-date]').textContent;
                if (amendmentOpenEnded !== 'Open ended') throw Error(`Expected amendment end date to be "Open ended" and found ${amendmentOpenEnded}`);
              }
            }, LICENSE_NAME, amendment)
            .then(done)
            .catch(done);
        });

        if (amendment.terms) {
          it(`should have correct term values for ${amendment.name}`, done => {
            let chain = nightmare.click('#accordion-toggle-button-amendmentTerms');

            amendment.terms.forEach(term => {
              chain = chain
                .evaluate(_term => {
                  const termValueNode = document.querySelector(`[data-test-customproperty-value="${_term.name}"]`);
                  if (!termValueNode) throw Error(`Failed to find term value for ${_term.label}`);
                  if (termValueNode.textContent !== _term.value) throw Error(`Expected term value to be ${_term.value} and found ${termValueNode.textContent}.`);
                }, term);
            });

            chain.then(done).catch(done);
          });
        }

        if (amendment.coreDocs) {
          it(`should have correct core docs for ${amendment.name}`, done => {
            let chain = nightmare.click('#accordion-toggle-button-amendmentCoreDocs');

            amendment.coreDocs.forEach(doc => {
              chain = chain
                .evaluate(_doc => {
                  const docCard = document.querySelector(`[data-test-doc="${_doc}"]`);
                  if (!docCard) throw Error(`Failed to find core document ${_doc}`);
                }, doc);
            });

            chain.then(done).catch(done);
          });
        }

        if (amendment.supplementaryDocs) {
          it(`should have correct supplementary docs for ${amendment.name}`, done => {
            let chain = nightmare.click('#accordion-toggle-button-amendmentSupplementaryDocs');

            amendment.supplementaryDocs.forEach(doc => {
              chain = chain
                .evaluate(_doc => {
                  const docCard = document.querySelector(`[data-test-doc="${_doc}"]`);
                  if (!docCard) throw Error(`Failed to find supplementary document ${_doc}`);
                }, doc);
            });

            chain.then(done).catch(done);
          });
        }

        if (amendment.editedName) {
          it(`should edit amendment name from ${amendment.name} to ${amendment.name}${amendment.editedName}`, done => {
            nightmare
              .click('#clickable-edit-amendment')
              .wait('#edit-amendment-name')
              .insert('#edit-amendment-name', amendment.editedName)
              .click('#clickable-update-amendment')
              .waitUntilNetworkIdle(1000)
              .wait('#amendment-info')
              .evaluate(_amendment => {
                const amendmentName = document.querySelector('[data-test-amendment-name]').textContent;
                if (amendmentName !== _amendment.name + _amendment.editedName) throw Error(`Expected amendment name to be ${_amendment.name}${_amendment.editedName} and found ${amendmentName}`);
              }, amendment)
              .then(done)
              .catch(done);
          });
        }

        if (amendment.delete) {
          it(`should delete amendment ${amendment.name}`, done => {
            nightmare
              .click('#pane-view-amendment [class*="dropdown"] button')
              .click('#clickable-delete-amendment')
              .then(done)
              .catch(done);
          });

          it(`should not find ${amendment.name} in amendments table`, done => {
            nightmare
              .wait('#pane-view-license')
              .wait('#amendments-table')
              .evaluate(_amendment => {
                const cells = [...document.querySelectorAll('#amendments-table [role="gridcell"]')];
                const nameCell = cells.find(c => c.textContent === _amendment.name);
                if (nameCell) throw Error(`Found a row with cell for ${_amendment.name} when it should have been deleted.`);
              }, amendment)
              .then(done)
              .catch(done);
          });
        }

        if (amendment.delete !== true) {
          it('should close amendment view pane', done => {
            nightmare
              .click('#pane-view-amendment [icon="times"]')
              .wait('#licenseAmendments')
              .then(done)
              .catch(done);
          });
        }
      });
    });
  });
};
