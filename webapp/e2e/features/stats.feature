Feature: Stats visualization functionality

  Scenario: Cannot access stats if not logged in
    Given I am not logged in
    When I click the stats button
    Then I am redirected to login page

  Scenario: No stats displayed when you haven't played any game
    Given I am logged in
    And I haven't completed any game
    When I click the stats button
    Then I see the no stats information text

  Scenario: Stats are displayed when you have completed at least one game
    Given I am logged in
    And I have completed one game
    When I click the stats button
    Then I see the stats from that game