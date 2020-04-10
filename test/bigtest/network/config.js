// typical mirage config export
// http://www.ember-cli-mirage.com/docs/v0.4.x/configuration/
import { get, isEmpty } from 'lodash';
import parseQueryString from './util';

const getItems = (schema, request, recordName) => {
  const queryString = request.url.split('?')[1];
  const params = parseQueryString(queryString);
  let { filters } = params;
  // when there is only one filter and its not an array
  if (filters && !isEmpty(filters) && !Array.isArray(filters)) filters = [filters];

  // returns a flattened array of { name, value } pairs of filter name and its value
  const parsed = filters && filters.map((filter) => {
    return filter.split('||').map(f => {
      const [name, value] = f.split('==');
      return { name, value };
    });
  }).flat();

  let results;
  if (parsed) {
    results = schema[recordName].where(record => {
      return parsed.reduce((acc, { name, value }) => {
        return acc || get(record, name) === value;
      }, false);
    }).models;
  } else {
    results = schema[recordName].all().models;
  }

  return { results, totalRecords: results.length };
};

export default function config() {
  this.get('/licenses/refdata', ({ pickLists }) => {
    return pickLists.all().models;
  });

  this.get('/licenses/refdata/:id', (schema, request) => {
    return (request.params.id !== 'undefined') && schema.pickLists.find(request.params.id).attrs;
  });

  this.get('/licenses/licenses/:id', (schema, request) => {
    return schema.licenses.find(request.params.id);
  });

  this.get('/licenses/org', () => []);

  this.get('/licenses/licenses', (schema, request) => {
    return getItems(schema, request, 'licenses');
  });

  this.get('/licenses/custprops', () => []);

  this.get('/tags', { tags: [] });

  this.get('/licenses/org', () => []);

  this.get('/licenses/refdata/License/status', () => []);

  this.get('/licenses/refdata/License/type', () => []);

  this.get('/licenses/refdata/LicenseOrg/role', () => []);

  this.get('/licenses/licenses/:id/linkedAgreements', () => []);

  this.get('/licenses/refdata/DocumentAttachment/atType', () => []);

  this.get('/licenses/refdata/InternalContact/role', () => []);

  this.get('/note-links/domain/licenses/type/license/id/:id', { notes: [] });

  this.get('/licenses/refdata/InternalContact/role', { noteTypes: [] });

  this.get('/note-types', () => []);

  this.get('/users', (schema) => {
    const users = schema.contacts.all().models;

    return {
      users,
      totalRecords: users.length,
    };
  });

  this.post('licenses/licenses/:id/clone', (schema, request) => {
    const license = schema.licenses.find(request.params.id);

    if (request.requestBody.internalContacts === false) {
      return this.create('license', { name: license.name });
    }

    const licenseData = {
      name: license.name,
      internalContactData: license.internalContactData
    };

    return this.create('license', 'withContacts', licenseData);
  });
}
