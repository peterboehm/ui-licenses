import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  license: belongsTo()
});
