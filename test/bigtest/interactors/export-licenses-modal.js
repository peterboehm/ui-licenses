import {
  clickable,
  collection,
  interactor,
} from '@bigtest/interactor';

@interactor class CheckboxInteractor {
  click = clickable();
}

export default @interactor class ExportLicenseAsCSVModalInteractor {
  checkBoxList = collection('input[type="checkbox"]', CheckboxInteractor);
  clickSaveAndClose = clickable('#export-licenses-modal-save-button');
  clickClose = clickable('#export-licenses-modal-close-button');
  clickCancelButton = clickable('#export-licenses-modal-cancel-button');
}
