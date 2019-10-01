# Change history for ui-licenses

## 3.6.0 IN PROGRESS
* Port ui-licenses to RFF. ERM-487.
* Update stripes to v2.10.1 to support PaneFooter.
* Move the Save & close button and add a Cancel button to Pane footer. ERM-412.
* Apply the new large headline design to Licenses. ERM-260.

## 3.5.0 2019-09-09
* Added support for `mod-organizations-storage` 2.0
* Added settings page for License Terms. ERM-391
* Added settings page for Pick Lists. ERM-389 390
* Fixed bug where resetting query term wouldn't execute a search. ERM-426
* Show/hide interface credentials. Fixes ERM-431
* Added Tags functionality. ERM-424

## 3.4.0 2019-08-20
* Render Internal Contacts as cards. ERM-309
* Manage public notes on license term values. ERM-355

## 3.3.0 2019-07-24
* Attach Notes to licenses. ERM-269
* Use updated `Card` UI for organizations. ERM-230 280 281 282
* Block form submission when term note is set without a value. ERM-268
* Accordion UI cleanup. ERM-341 342
* Use dates instead of datetimes. ERM-294
* Only allow one organization to be a Licensor. ERM-344

## 3.2.0 2019-06-10
* Added ability to attach files to documents. ERM-257
* Added ability to manage amendments for licenses. ERM-147

## 3.1.0 2019-05-21
 * ERM-219 Support Organizations app as source of Organizations in Licenses
   * ERM-232 Front-end updates
 * ERM-212 Remove horizontal rules between filters in Agreements and License apps
 * ERM-163 View internal contacts for a license
 * ERM-162 Manage internal contacts for a license
   * ERM-180 Use generalised contacts component
   * ERM-179 Generalise agreements/contacts to shared component
 * ERM-75  Clearing the organization filter value not working as expected

## 3.0.0 2019-05-07

 * ERM-166 Remove unwanted extra license section
 * ERM-133 Configure Document Categories
 * ERM-143 Add License / Supplementaty License Information Panel UI
 * ERM-181 Fix data sync issue with GOKb (Resumption Token and Broken Coverage)
 * ERM-139 Convert from SearchAndSort to SearchAndSortQuery
 * ERM-79 Set supplementary informaiton for a license
 * ERM-173 Manage Tags on Agreements
 * ERM-174 Seach Agreements by Tag
 * ERM-194 BUGFIX: Opening edit/create license with only one page does not work

## 2.4.0 2019-04-08

 * ERM-115 Provide correct data for agreement line
 * ERM-111 Build Settings Page
 * ERM-112 Build Wrapper Component for supression
 * ERM-113 Use Wrapper Component in Agreements
 * ERM-114 Write tests
 * ERM-98 Rendering Controlling Terms License
 * ERM-127 Resources with no coverage set should not display
 * ERM-110 Agreement Detail record - View attached EBSCO eResource
 * ERM-109 Support the ability to create an agreement from eHoldings
 * ERM-108 Supress agreements app functions
 * ERM-64 Show Controlling License Terms

## 2.3.0 2019-03-22

* Added ability to view agreements linked to a license.

## 2.2.0 2019-03-04

* Added name export of Licenses search UI
* Use `LicenseCard` when rendering license header.

## 2.1.0 2019-02-12
* Added ability to view, add, edit, and remove core documents from licenses.

## 2.0.0 2019-01-18

* Upgrade to Stripes 2.0
* Removed usage of lookbehinds in regexes (avail in 2.0.1)
* Added License Status filter to search.
* Added ability to view, add, edit, and remove terms from licenses.
* Added ability to view, add, edit, and remove organizations from licenses.
* Added sticky license header.

## 1.1.0 2018-12-11

* First official release for Q4 Release

## 1.0.0
* Clone ui-erm
* Set up initial scaffolding
