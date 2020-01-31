import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import { noop } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  FormattedUTCDate,
  Icon,
  MultiColumnList,
  Pane,
  PaneMenu,
  Paneset,
  SearchField,
} from '@folio/stripes/components';

import { AppIcon, IfPermission } from '@folio/stripes/core';

import {
  SearchAndSortQuery,
  SearchAndSortNoResultsMessage as NoResultsMessage,
  SearchAndSortSearchButton as FilterPaneToggle,
} from '@folio/stripes/smart-components';

import { LicenseEndDate } from '@folio/stripes-erm-components';

import LicenseFilters from '../LicenseFilters';

import css from './Licenses.css';

export default class Licenses extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    contentRef: PropTypes.object,
    data: PropTypes.object,
    onNeedMoreData: PropTypes.func,
    queryGetter: PropTypes.func,
    querySetter: PropTypes.func,
    searchString: PropTypes.string,
    selectedRecordId: PropTypes.string,
    source: PropTypes.object,
  }

  static defaultProps = {
    data: {},
    searchString: '',
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
    startDate: 150,
    endDate: 150
  }

  formatter = {
    name: a => {
      return (
        <AppIcon
          size="small"
          app="licenses"
          iconKey="app"
        >
          {a.name}
        </AppIcon>
      );
    },
    type: ({ type }) => type && type.label,
    status: ({ status }) => status && status.label,
    startDate: ({ startDate }) => (startDate ? <FormattedUTCDate value={startDate} /> : ''),
    endDate: license => <LicenseEndDate license={license} />,
  }

  rowFormatter = (row) => {
    const { rowClass, rowData, rowIndex, rowProps = {}, cells } = row;

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
                  aria-label={`${hideOrShowMessage}...${appliedFiltersMessage}`}
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

  renderResultsLastMenu() {
    return (
      <IfPermission perm="ui-licenses.licenses.edit">
        <PaneMenu>
          <FormattedMessage id="ui-licenses.createLicense">
            {ariaLabel => (
              <Button
                aria-label={ariaLabel}
                buttonStyle="primary"
                id="clickable-new-license"
                marginBottom0
                to={`/licenses/create${this.props.searchString}`}
              >
                <FormattedMessage id="stripes-smart-components.new" />
              </Button>
            )}
          </FormattedMessage>
        </PaneMenu>
      </IfPermission>
    );
  }

  render() {
    const {
      children,
      contentRef,
      data,
      onNeedMoreData,
      queryGetter,
      querySetter,
      selectedRecordId,
      source,
    } = this.props;

    const query = queryGetter() || {};
    const count = source ? source.totalCount() : 0;
    const sortOrder = query.sort || '';

    const getFilterStringToObject = ({
      rawFilterNames,
    }) => {
      return (str) => {
        const filterObject = {};
        const filterArray = str.split(',');
        filterArray.forEach(filter => {
          const isRawFilter = rawFilterNames.some(rawFilterName => {
            if (filter.includes(rawFilterName)) {
              filterObject[rawFilterName] = filter;
              return true;
            }

            return false;
          });

          if (isRawFilter === false) {
            const filters = filter.split('||');
            filters.forEach(f => {
              const [filterName, filterValue] = f.split('==');
              if (!filterObject[filterName]) filterObject[filterName] = [];
              filterObject[filterName].push(filterValue);
            });
          }
        });
        return filterObject;
      };
    };

    const filterStringToObject = getFilterStringToObject({ rawFilterNames: ['customProperties'] });

    // const filterStringToObject = (str) => {
    //   const filterObject = {};
    //   const filterArray = str.split(',');
    //   filterArray.forEach(f => {
    //     const filter = f.split('.');
    //     if (filterObject[filter[0]]) {
    //       filterObject[filter[0]].push(filter[1]);
    //     } else {
    //       filterObject[filter[0]] = [filter[1]];
    //     }
    //   });
    //   return filterObject;
    // };

    const getBuildFilterString = ({
      rawFilterNames,
    }) => {
      return (activeFilters) => {
        const enabledFilters = Object.keys(activeFilters)
          .filter((filterName) => {
            const filters = activeFilters[filterName];
            if (!Array.isArray(filters) && !typeof filters === 'string') return false;

            return filters.length;
          });

        const standardFilters = enabledFilters.filter(filterName => !rawFilterNames.includes(filterName));
        const rawFilters = enabledFilters.filter(filterName => rawFilterNames.includes(filterName));

        const standardFilterString = standardFilters
          .map(filterName => {
            return activeFilters[filterName]
              .map(filterValue => `${filterName}==${filterValue}`)
              .join('||');
          })
          .join(',');

        const rawFilterString = rawFilters
          .map(filterName => activeFilters[filterName])
          .join(',');

        if (!standardFilterString) return rawFilterString;
        if (!rawFilterString) return standardFilterString;

        return `${standardFilterString},${rawFilterString}`;
      };
    };

    const customBuildFilterString = getBuildFilterString({ rawFilterNames: ['customProperties'] });

    const customBuildFilterParams = activeFilters => ({
      filters: customBuildFilterString(activeFilters)
    });

    // output is ?filters=name.value,name.value,name.value
    // const buildFilterString = (activeFilters) => {
    //   // activeFilters is of form SASQ.state.filterFields, ie, `props.initialFilterState`
    //   const newFiltersString = Object.keys(activeFilters)
    //     .filter((filterName) => Array.isArray(activeFilters[filterName]) && activeFilters[filterName].length)
    //     .map((filterName) => {
    //       return activeFilters[filterName].map((filterValue) => {
    //         return `${filterName}.${filterValue}`;
    //       }).join(',');
    //     }).join(',');

    //   return newFiltersString;
    // };

    // const buildFilterParams = (activeFilters) => {
    //   // activeFilters is of form SASQ.state.filterFields, ie, `props.initialFilterState`
    //   const filterString = buildFilterString(activeFilters);
    //   return { filters: filterString };
    // };

    return (
      <div data-test-licenses ref={contentRef}>
        <SearchAndSortQuery
          filterParamsMapping={{
            filters: filterStringToObject,
          }}
          filtersToString={customBuildFilterString}
          filtersToParams={customBuildFilterParams}
          // initialFilterState={{
          //   status: ['Active'],
          //   customProperties: [
          //     'remoteAccess.value==1883e41b6fe75466016fe7a1bd9e001f||remoteAccess.value==1883e41b6fe75466016fe7a1bd9e001e',
          //     'concurrentAccess.value>10',
          //     'remoteAccess.value!=deadbeef',
          //   ]
            // 'customProperties.remoteAccess.value': [
            //   '1883e41b6fe75466016fe7a1bd9e001f',
            //   '1883e41b6fe75466016fe7a1bd90001e'
            // ]
          // }}
          initialFilterState={{ 'status.value': ['active'] }}
          initialSortState={{ sort: 'name' }}
          initialSearchState={{ query: '' }}
          queryGetter={queryGetter}
          querySetter={querySetter}
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
                        {/* TODO: Use forthcoming <SearchGroup> or similar component */}
                        <div className={css.searchGroupWrap}>
                          <FormattedMessage id="ui-licenses.searchInputLabel">
                            {ariaLabel => (
                              <SearchField
                                aria-label={ariaLabel}
                                autoFocus
                                className={css.searchField}
                                data-test-license-search-input
                                id="input-license-search"
                                inputRef={this.searchField}
                                marginBottom0
                                name="query"
                                onChange={getSearchHandlers().query}
                                onClear={getSearchHandlers().reset}
                                value={searchValue.query}
                              />
                            )}
                          </FormattedMessage>
                          <Button
                            buttonStyle="primary"
                            disabled={!searchValue.query || searchValue.query === ''}
                            fullWidth
                            id="clickable-search-licenses"
                            marginBottom0
                            type="submit"
                          >
                            <FormattedMessage id="stripes-smart-components.search" />
                          </Button>
                        </div>
                        <div className={css.resetButtonWrap}>
                          <Button
                            buttonStyle="none"
                            id="clickable-reset-all"
                            disabled={disableReset()}
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
                    appIcon={<AppIcon app="licenses" />}
                    defaultWidth="fill"
                    firstMenu={this.renderResultsFirstMenu(activeFilters)}
                    lastMenu={this.renderResultsLastMenu()}
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
                      id="list-licenses"
                      isEmptyMessage={this.renderIsEmptyMessage(query, source)}
                      onHeaderClick={onSort}
                      onNeedMoreData={onNeedMoreData}
                      isSelected={({ item }) => item.id === selectedRecordId}
                      rowFormatter={this.rowFormatter}
                      sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
                      sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                      totalCount={count}
                      virtualize
                      visibleColumns={['name', 'type', 'status', 'startDate', 'endDate']}
                    />
                  </Pane>
                  {children}
                </Paneset>
              );
            }
          }
        </SearchAndSortQuery>
      </div>
    );
  }
}
