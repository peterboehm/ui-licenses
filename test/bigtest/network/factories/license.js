import { Factory, trait } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: () => faker.random.uuid(),
  name: () => faker.name.firstName(),
  orgs: () => [],

  withContacts: trait({
    afterCreate(license, server) {
      const contact = server.create('contact', license.internalContactData);
      license.update({
        contacts: [contact]
      });
      license.save();
    }
  }),
});
