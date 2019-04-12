import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import { noop } from 'lodash';
import { FormattedDate, FormattedMessage } from 'react-intl';

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

import LicenseFilters from '../LicenseFilters';

import css from './Licenses.css';

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

  rowFormatter = (row) => {
    const { rowClass, rowData, rowIndex, rowProps, cells } = row;

    return (
      <Link
        aria-rowindex={rowIndex + 2}
        className={rowClass}
        data-label={[
          rowData.name,
          this.formatter.type(rowData),
          this.formatter.status(rowData),
        ].join('...')}
        key={`row-${rowIndex}`}
        role="row"
        to={this.rowURL(rowData.id)}
        {...rowProps}
      >
        {cells}
      </Link>
    );
  }

  rowURL = (id) => {
    return `/licenses/${id}${this.props.searchString}`;
  }

  toggleFilterPane = () => {
    this.setState(curState => ({
      filterPaneIsVisible: !curState.filterPaneIsVisible,
    }));
  }

  renderIsEmptyMessage = (query, source) => {
    if (!source) {
      return 'no source yet';
    }

    return (
      <div data-test-licenses-no-results-message>
        <NoResultsMessage
          source={source}
          searchTerm={query.query || ''}
          filterPaneIsVisible
          toggleFilterPane={noop}
        />
      </div>
    );
  }

  renderResultsFirstMenu = (filters) => {
    const { filterPaneIsVisible } = this.state;
    const filterCount = filters.string !== '' ? filters.string.split(',').length : 0;
    const hideOrShowMessageId = filterPaneIsVisible ?
      'stripes-smart-components.hideSearchPane' : 'stripes-smart-components.showSearchPane';

    return (
      <PaneMenu>
        <FormattedMessage id="stripes-smart-components.numberOfFilters" values={{ count: filterCount }}>
          {appliedFiltersMessage => (
            <FormattedMessage id={hideOrShowMessageId}>
              {hideOrShowMessage => (
                <FilterPaneToggle
                  visible={filterPaneIsVisible}
                  aria-label={`${hideOrShowMessage}...s${appliedFiltersMessage}`}
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

  renderResultsPaneSubtitle = (source) => {
    if (source && source.loaded()) {
      const count = source ? source.totalCount() : 0;
      return <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count }} />;
    }

    return <FormattedMessage id="stripes-smart-components.searchCriteria" />;
  }

  render() {
    const {
      children,
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
                    <Pane
                      defaultWidth="22%"
                      onClose={this.toggleFilterPane}
                      paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
                    >
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
                    paneTitle={<FormattedMessage id="ui-licenses.meta.title" />}
                    paneSub={this.renderResultsPaneSubtitle(source)}
                  >
                    <MultiColumnList
                      autosize
                      columnMapping={this.columnMapping}
                      columnWidths={this.columnWidths}
                      contentData={data.licenses}
                      formatter={this.formatter}
                      isEmptyMessage={this.renderIsEmptyMessage(query, source)}
                      onHeaderClick={onSort}
                      onNeedMoreData={onNeedMoreData}
                      rowFormatter={this.rowFormatter}
                      sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
                      sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                      totalCount={count}
                      virtualize
                      visibleColumns={visibleColumns}
                    />
                  </Pane>
                  { children }
                </Paneset>
              );
            }
          }
        </SearchAndSortQuery>
      </div>
    );
  }
}
