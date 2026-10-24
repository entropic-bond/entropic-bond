# approved: 2026-10-23
Feature: Cached props refresh driven by installCachedPropsUpdater
  As a host using cached property references
  I want installing the cached-props updater to subscribe to reference changes
  So that cached props refresh without a caller-side listener bridge

  Background:
    Given an in-memory JsonDataSource is the active data source
    # the registered owner class declares references to "Child" whose cached prop is "name",
    # one stored in the root collection and one in the subcollection "Root/a/..."
    # owner document "a" references child "a2"; owners "b" and "c" reference nothing
    # a refresh completes asynchronously: scenarios wait for the data source to settle

  Scenario: Reproduce: installing the updater alone refreshes cached props. Issue: #14 [REQ-10]
    Given owner "a" in the root collection "Parent" references child "a2" in the root collection "Child"
    And the data store already holds both collections
    And the cached-props updater is installed with installCachedPropsUpdater() and no caller-side listener
    When child "a2" is renamed and saved
    Then owner "a" stores the new cached name
    And the refresh is reported once through afterDocumentChange
    And owners "b" and "c" are left untouched
    # before the fix: install created the updater but never subscribed, so nothing refreshed

  Scenario: Refresh a reference stored in a templated subcollection with install alone. Issue: #14 [REQ-11]
    Given owner "a" in the root collection "Parent" references child "a2" stored in the subcollection "Root/a/Child"
    And the cached-props updater is installed with no caller-side listener
    When child "a2" is renamed and saved
    Then owner "a" stores the new cached name
    # the watched template is "Root/{customerId}/Child"; the parameter comes from the change event

  Scenario: Refresh an owner stored in a templated subcollection with install alone. Issue: #14 [REQ-12]
    Given owner "a" in the subcollection "Root/a/Parent" references child "a2" in the root collection "Child"
    And the cached-props updater is installed with no caller-side listener
    When child "a2" is renamed and saved
    Then owner "a" in "Root/a/Parent" stores the new cached name
    # the owner template "Root/{customerId}/Parent" is resolved from the change event parameters

  Scenario: Refresh after a watched collection is created post-install. Issue: #14 [REQ-13]
    Given an empty data source where the cached-props updater is installed before any collection exists
    When owner "a" and child "a2" are saved, creating their collections
    And child "a2" is renamed and saved
    Then owner "a" stores the new cached name
    # template matches are resolved at subscribe time today, so install must not depend on existing collections

  Scenario: Refresh a subcollection created post-install with a new path parameter. Issue: #14 [REQ-14]
    Given child "b2" exists in the subcollection "Root/b/Child" when the updater is installed
    And no document exists yet in the subcollection "Root/a/Child"
    When child "a2" is created in "Root/a/Child" and owner "a" in "Root/a/Parent" references it
    And child "a2" is renamed and saved
    Then owner "a" in "Root/a/Parent" stores the new cached name
    # a collection matching a watched template but appearing later must be observed too

  Scenario: Ignore changes in collections no cached prop watches. Issue: #14 [REQ-15]
    Given the cached-props updater is installed
    When a document of an unwatched collection is saved
    Then no owner collection is queried
    And no change is reported to beforeDocumentChange or afterDocumentChange

  Scenario: Hand an install-driven refresh failure to the failure handler. Issue: #14 [REQ-16]
    Given the cached-props updater is installed with a failure handler
    And saving an owner document fails
    When child "a2" is renamed and saved
    Then the failure handler receives that save error
    # updateProps() rejects and change listeners are invoked synchronously

  Scenario: Leave no unhandled rejection when an install-driven refresh fails. Issue: #14 [REQ-17]
    Given the cached-props updater is installed with a failure handler
    When an owner save fails during an install-driven refresh
    Then the failure is handled once
    And no unhandled promise rejection is raised

  Scenario: Keep refreshing after a failed refresh. Issue: #14 [REQ-18]
    Given an install-driven refresh failed while child "a2" was renamed
    When child "a2" is renamed again and saved
    Then owner "a" stores the second new cached name
    And the updater is still subscribed

  Scenario: Replace the previous subscription when the updater is re-installed. Issue: #14 [REQ-19]
    Given the first updater installed on the data source reports to its own callbacks
    When the updater is installed a second time
    And child "a2" is renamed and saved
    Then the second updater reports the refresh once
    And the first updater reports nothing

  Scenario: Refresh owners through the data source that installed the updater. Issue: #14 [REQ-20]
    Given data source A holds owner "a" and child "a2" and has an installed updater
    And data source B is the active data source and stores its own owner "a"
    When child "a2" changes in data source A
    Then data source A's owner "a" stores the new cached name
    And data source B's owner "a" is unchanged

  Scenario: Show a cached-prop refresh in the cached-props sample without a bridge. Issue: #14 [REQ-21]
    Given the sample "08-cached-props" installs the cached-props updater and registers no listener
    When the sample changes the team name and saves the team
    Then the sample reads an employee whose cached team name is the new one
    # the sample must not reference onDocumentTemplateChange anywhere

  Scenario: Keep a direct updateProps() call working. Issue: #14 [REQ-22]
    Given the updater is installed and its change subscription is active
    And a caller builds the change event for child "a2"
    When the caller calls updateProps('Child', event) directly
    Then the direct call resolves after owner "a" stored the new cached name
