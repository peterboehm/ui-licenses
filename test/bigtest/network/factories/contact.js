import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  user: () => faker.random.uuid(),
  personal: () => {
    return {
      firstName: faker.name.firstName(),
      middleName: faker.random.words(),
      lastName: faker.name.lastName(),
    };
  },
  role: () => {
    return {
      label: 'License owner',
      value: 'license_owner'
    };
  },
});
