import {
  clickable,
  collection,
  count,
  fillable,
  interactor,
  isPresent,
  selectable,
  value,
} from '@bigtest/interactor';

@interactor class RuleInteractor {
  operator = value('[data-test-rule-operator]');
  selectOperator = selectable('[data-test-rule-operator]');

  value = value('[data-test-rule-value]');
  fillValue = fillable('[data-test-rule-value]');
  selectValue = selectable('[data-test-rule-value]');

  delete = clickable('[data-test-delete-rule-btn]');
}

@interactor class TermFilterInteractor {
  rules = collection('[data-test-rule-row]', RuleInteractor);
  rulesCount = count('[data-test-rule-row]');
  addRule = clickable('[data-test-add-rule-btn]');

  term = value('[data-test-term]');
  selectTerm = selectable('[data-test-term');
}

 export default @interactor class TermFiltersFormInteractor {
  open = clickable('[data-test-open-custprops-filters]');
  cancel = clickable('[data-test-cancel-filters]');
  apply = clickable('[data-test-apply-filters]');
  addTermFilter = clickable('[data-test-add-term-filter-btn]');
  modalIsVisible = isPresent('#term-filters-modal');
  errorIsVisible = isPresent('[class*=feedbackError]');

  filters = collection('[data-test-term-filter]', TermFilterInteractor);
  filtersCount = count('[data-test-term-filter]');
}