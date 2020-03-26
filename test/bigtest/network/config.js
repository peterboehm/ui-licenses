// typical mirage config export
// http://www.ember-cli-mirage.com/docs/v0.4.x/configuration/
export default function config() {
  this.get('/licenses/refdata', ({ pickLists }) => {
    return pickLists.all().models;
  });

  this.get('/licenses/refdata/:id', (schema, request) => {
    return (request.params.id !== 'undefined') && schema.pickLists.find(request.params.id).attrs;
  });
}
