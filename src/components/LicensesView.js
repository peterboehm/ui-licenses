import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import get from 'lodash/get';
import { FormattedDate, FormattedMessage } from 'react-intl';

import { IntlConsumer, AppIcon } from '@folio/stripes/core';
import {
  MultiColumnList,
  SearchField,
  Paneset,
  Pane,
  Icon,
  Button,
  PaneMenu,
} from '@folio/stripes/components';

import {
  SearchAndSortQuery,
  SearchAndSortNoResultsMessage as NoResultsMessage,
  SearchAndSortSearchButton as FilterPaneToggle,
} from '@folio/stripes/smart-components';

import { LicenseEndDate } from '@folio/stripes-erm-components';

import LicenseFilters from './LicenseFilters';

import css from './LicensesView.css';

export default class LicensesView extends React.Component {
  static propTypes = {
    contentRef: PropTypes.object,
    data: PropTypes.object,
    initialFilterState: PropTypes.object,
    initialSortState: PropTypes.string,
    queryGetter: PropTypes.func,
    querySetter: PropTypes.func,
    onNeedMoreData: PropTypes.func,
    source: PropTypes.object,
    visibleColumns: PropTypes.arrayOf(PropTypes.string),
  }

  static defaultProps = {
    data: {},
    visibleColumns: ['name', 'type', 'status', 'startDate', 'endDate'],
  }

  state = {
    filterPaneIsVisible: true,
  }

  columnMapping = {
    name: <FormattedMessage id="ui-licenses.prop.name" />,
    type: <FormattedMessage id="ui-licenses.prop.type" />,
    status: <FormattedMessage id="ui-licenses.prop.status" />,
    startDate: <FormattedMessage id="ui-licenses.prop.startDate" />,
    endDate: <FormattedMessage id="ui-licenses.prop.endDate" />
  }

  columnWidths = {
    name: 300,
    type: 150,
    status: 150,
    startDate: 200,
    endDate: 200
  }

  formatter = {
    type: ({ type }) => type && type.label,
    status: ({ status }) => status && status.label,
    startDate: ({ startDate }) => (startDate ? <FormattedDate value={startDate} /> : ''),
    endDate: license => (license.endDate ? <LicenseEndDate license={license} /> : ''),
  }


  toggleFilterPane = () => {
    this.setState(curState => ({
      filterPaneIsVisible: !curState.filterPaneIsVisible,
    }));
  }

  renderResultsFirstMenu = (filters) => {
    const { filterPaneIsVisible } = this.state;
    const filterCount = filters.string !== '' ? filters.string.split(',').length : 0;
    const hideOrShowMessageId = filterPaneIsVisible ?
      'stripes-smart-components.hideSearchPane' : 'stripes-smart-components.showSearchPane';

    return (
      <PaneMenu>
        <FormattedMessage id="stripes-smart-components.numberOfFilters" values={{ count: filterCount}}>
          {appliedFiltersMessage => (
            <FormattedMessage id={hideOrShowMessageId}>
              {hideOrShowMessage => (
                <FilterPaneToggle
                  visible={filterPaneIsVisible}
                  aria-label={`${hideOrShowMessage} \n\n${appliedFiltersMessage}`}
                  onClick={this.toggleFilterPane}
                  badge={!filterPaneIsVisible && filterCount ? filterCount : undefined}
                />
              )}
            </FormattedMessage>
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  render() {
    const {
      contentRef,
      data,
      onNeedMoreData,
      queryGetter,
      querySetter,
      initialFilterState,
      initialSortState,
      source,
      visibleColumns,
    } = this.props;

    const query = queryGetter() || {};
    const count = source ? source.totalCount() : 0;
    const sortOrder = query.sort || '';
    const resultsStatusMessage = source ? (
      <div data-test-licenses-no-results-message>
        <NoResultsMessage
          source={source}
          searchTerm={query.query || ''}
          filterPaneIsVisible
          toggleFilterPane={noop}
        />
      </div>
    ) : 'no source yet';

    const resultsHeader = 'License Search Results';
    let resultPaneSub = <FormattedMessage id="stripes-smart-components.searchCriteria" />;
    if (source && source.loaded()) {
      resultPaneSub = <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count }} />;
    }

    return (
      <div data-test-licenses ref={contentRef}>
        <SearchAndSortQuery
          queryGetter={queryGetter}
          querySetter={querySetter}
          initialFilterState={initialFilterState}
          initialSortState={initialSortState}
        >
          {
            ({
              searchValue,
              getSearchHandlers,
              onSubmitSearch,
              onSort,
              getFilterHandlers,
              activeFilters,
              filterChanged,
              searchChanged,
              resetAll,
            }) => {
              const disableReset = () => (!filterChanged && !searchChanged);

              return (
                <Paneset id="licenses-paneset">
                  {this.state.filterPaneIsVisible &&
                    <Pane defaultWidth="22%" paneTitle="License Search">
                      <form onSubmit={onSubmitSearch}>
                        <div className={css.searchGroupWrap}>
                          <SearchField
                            aria-label="license search"
                            autoFocus
                            className={css.searchField}
                            data-test-license-search-input
                            inputRef={this.searchField}
                            marginBottom0
                            name="query"
                            onChange={getSearchHandlers().query}
                            value={searchValue.query}
                          />
                          <Button
                            buttonStyle="primary"
                            data-test-user-search-submit
                            disabled={!searchValue.query || searchValue.query === ''}
                            fullWidth
                            marginBottom0
                            type="submit"
                          >
                            Search
                          </Button>
                        </div>
                        <div className={css.resetButtonWrap}>
                          <Button
                            buttonStyle="none"
                            id="clickable-reset-all"
                            disabled={disableReset()}
                            fullWidth
                            onClick={resetAll}
                          >
                            <Icon icon="times-circle-solid">
                              <FormattedMessage id="stripes-smart-components.resetAll" />
                            </Icon>
                          </Button>
                        </div>
                        <LicenseFilters
                          activeFilters={activeFilters.state}
                          data={data}
                          filterHandlers={getFilterHandlers()}
                        />
                      </form>
                    </Pane>
                  }
                  <Pane
                    defaultWidth="fill"
                    firstMenu={this.renderResultsFirstMenu(activeFilters)}
                    padContent={false}
                    paneSub={resultPaneSub}
                    paneTitle={resultsHeader}
                  >
                    <MultiColumnList
                      visibleColumns={visibleColumns}
                      contentData={data.licenses}
                      totalCount={count}
                      columnMapping={this.columnMapping}
                      columnWidths={this.columnWidths}
                      formatter={this.formatter}
                      onNeedMoreData={onNeedMoreData}
                      onHeaderClick={onSort}
                      sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                      sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
                      isEmptyMessage={resultsStatusMessage}
                      autosize
                      virtualize
                    />
                  </Pane>
                </Paneset>
              );
            }
          }
        </SearchAndSortQuery>
      </div>
    );
  }
}