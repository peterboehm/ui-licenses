import {
  clickable,
  interactor,
  isPresent,
} from '@bigtest/interactor';

import DuplicateModalInteractor from '@folio/stripes-erm-components/lib/DuplicateModal/tests/interactor';

@interactor class HeaderDropdown {
  click = clickable('button');
}

@interactor class HeaderDropdownMenu {
  isDuplicateButtonPresent = isPresent('#clickable-dropdown-duplicate-license')
  clickDuplicate = clickable('#clickable-dropdown-duplicate-license');
}

export default @interactor class LicenseViewInteractor {
  isViewLicense = isPresent('#pane-view-license');
  headerDropdown = new HeaderDropdown('[data-pane-header-actions-dropdown]');
  headerDropdownMenu = new HeaderDropdownMenu();
  duplicateModal = new DuplicateModalInteractor();

  whenLoaded() {
    return this.when(() => this.isViewLicense).timeout(5000);
  }
}
