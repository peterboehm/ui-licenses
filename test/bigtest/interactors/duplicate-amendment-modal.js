import {
  clickable,
  collection,
  interactor,
  isPresent,
  property,
  value,
} from '@bigtest/interactor';

@interactor class CheckboxInteractor {
  click = clickable();
  label = property('value');
  value = value;
}

export default @interactor class DuplicateAmendmentModalInteractor {
  isDuplicateModalPresent = isPresent('#duplicate-modal');
  checkBoxList = collection('input[type="checkbox"]', CheckboxInteractor);
  clickSaveAndClose = clickable('#duplicate-modal-save-button');
  clickClose = clickable('#duplicate-modal-close-button');
  clickCancelButton = clickable('#duplicate-modal-cancel-button');
}
