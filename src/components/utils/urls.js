const urls = {
  licenses: () => '/licenses',
  notes: () => '/licenses/notes',
  noteView: id => `/licenses/notes/${id}`,
  noteEdit: id => `/licenses/notes/${id}/edit`,
  noteCreate: () => '/licenses/notes/create',
};

export default urls;
