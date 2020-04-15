import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import { noop } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Checkbox,
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
import ExportLicenseAsCSVModal from '../ExportLicenseAsCSVModal';

import LicenseFilters from '../LicenseFilters';
import { statuses } from '../../constants';

import css from './Licenses.css';

export default class Licenses extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    contentRef: PropTypes.object,
    data: PropTypes.object,
    onCompareLicenseTerms: PropTypes.func,
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
    selectedLicenses: {},
    showExportLicenseAsCSVModal: false,
  }

  columnMapping = {
    selected: ' ',
    name: <FormattedMessage id="ui-licenses.prop.name" />,
    type: <FormattedMessage id="ui-licenses.prop.type" />,
    status: <FormattedMessage id="ui-licenses.prop.status" />,
    startDate: <FormattedMessage id="ui-licenses.prop.startDate" />,
    endDate: <FormattedMessage id="ui-licenses.prop.endDate" />
  }

  columnWidths = {
    selected: 40,
    name: 500,
    type: 150,
    status: 150,
    startDate: 120,
    endDate: 120
  }

  formatter = {
    selected: resource => (
      <Checkbox
        checked={!!(this.state.selectedLicenses[resource.id])}
        name={`selected-${resource.id}`}
        onChange={() => this.handleToggleLicenseCheckBox(resource)}
        onClick={e => e.stopPropagation()}
      />
    ),
    name: a => {
      const iconKey = a?.status?.value === statuses.EXPIRED || a?.status?.value === statuses.REJECTED ? 'inactiveLicense' : 'app';
      return (
        <AppIcon
          app="licenses"
          iconAlignment="baseline"
          iconKey={iconKey}
          size="small"
        >
          <div style={{ overflowWrap: 'break-word', width: 460 }}>
            {a.name}
          </div>
        </AppIcon>
      );
    },
    type: ({ type }) => type && type.label,
    status: ({ status }) => status && status.label,
    startDate: ({ startDate }) => (startDate ? <FormattedUTCDate value={startDate} /> : ''),
    endDate: license => <LicenseEndDate license={license} />,
  }

  getActionMenu = ({ onToggle }) => {
    const { selectedLicenses } = this.state;
    const count = Object.values(selectedLicenses).filter(item => item === true).length;
    return (
      <Button
        buttonStyle="dropdownItem"
        disabled={count === 0}
        id="export-licenses-csv"
        onClick={() => {
          this.openExportLicenseAsCSVModal();
          onToggle();
        }}
      >
        <FormattedMessage id="ui-licenses.export.csv.label" values={{ count }} />
      </Button>
    );
  };

  handleToggleLicenseCheckBox = (license) => {
    this.setState(prevState => ({
      selectedLicenses: {
        ...prevState.selectedLicenses,
        [license.id]: !(prevState.selectedLicenses[license.id])
      },
    }));
  }

  openExportLicenseAsCSVModal = () => {
    this.setState({ showExportLicenseAsCSVModal: true });
  }

  closeExportLicenseAsCSVModal = () => {
    this.setState({ showExportLicenseAsCSVModal: false });
  }

  rowFormatter = (row) => {
    const { rowClass, rowData, rowIndex, rowProps = {}, cells } = row;

    return (
      <Link
        key={`row-${rowIndex}`}
        aria-rowindex={rowIndex + 2}
        className={rowClass}
        data-label={[
          rowData.name,
          this.formatter.type(rowData),
          this.formatter.status(rowData),
        ].join('...')}
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
          filterPaneIsVisible
          searchTerm={query.query || ''}
          source={source}
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
                  aria-label={`${hideOrShowMessage}...${appliedFiltersMessage}`}
                  badge={!filterPaneIsVisible && filterCount ? filterCount : undefined}
                  onClick={this.toggleFilterPane}
                  visible={filterPaneIsVisible}
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
      onCompareLicenseTerms,
      onNeedMoreData,
      queryGetter,
      querySetter,
      selectedRecordId,
      source,
    } = this.props;

    const { selectedLicenses } = this.state;
    const query = queryGetter() || {};
    const count = source ? source.totalCount() : 0;
    const sortOrder = query.sort || '';

    return (
      <div ref={contentRef} data-test-licenses>
        <SearchAndSortQuery
          initialFilterState={{ status: ['active'] }}
          initialSearchState={{ query: '' }}
          initialSortState={{ sort: 'name' }}
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
                            disabled={disableReset()}
                            id="clickable-reset-all"
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
                    actionMenu={this.getActionMenu}
                    appIcon={<AppIcon app="licenses" />}
                    defaultWidth="fill"
                    firstMenu={this.renderResultsFirstMenu(activeFilters)}
                    lastMenu={this.renderResultsLastMenu()}
                    noOverflow
                    padContent={false}
                    paneSub={this.renderResultsPaneSubtitle(source)}
                    paneTitle={<FormattedMessage id="ui-licenses.meta.title" />}
                  >
                    <MultiColumnList
                      autosize
                      columnMapping={this.columnMapping}
                      columnWidths={this.columnWidths}
                      contentData={data.licenses}
                      formatter={this.formatter}
                      hasMargin
                      id="list-licenses"
                      isEmptyMessage={this.renderIsEmptyMessage(query, source)}
                      isSelected={({ item }) => item.id === selectedRecordId}
                      onHeaderClick={onSort}
                      onNeedMoreData={onNeedMoreData}
                      rowFormatter={this.rowFormatter}
                      rowUpdater={resource => this.state.selectedLicenses[resource.id]}
                      sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
                      sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                      totalCount={count}
                      virtualize
                      visibleColumns={['selected', 'name', 'type', 'status', 'startDate', 'endDate']}
                    />
                  </Pane>
                  {children}
                  {this.state.showExportLicenseAsCSVModal &&
                    <ExportLicenseAsCSVModal
                      onClose={this.closeExportLicenseAsCSVModal}
                      onCompareLicenseTerms={onCompareLicenseTerms}
                      selectedLicenses={Object.keys(selectedLicenses).filter(item => selectedLicenses[item] === true)}
                      terms={data.terms}
                    />
                  }
                </Paneset>
              );
            }
          }
        </SearchAndSortQuery>
      </div>
    );
  }
}
