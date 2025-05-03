Feature: Custom game functionality

  Scenario: Create a custom game
    Given I am logged at custom game
    And I have entered my custom configuration
    When I click the start button
    Then the game its initialiced with my configuration

  Scenario: Create a custom infinite game
    Given I am logged at custom game
    And I have entered my custom configuration
    And I have selected infinite mode
    When I click the start button
    Then the game its initialiced with my configuration
    And the rounds are now infinite

  Scenario: Create a custom AI game
    Given I am logged at custom game
    And I have entered my custom configuration
    And I have selected AI game mode
    When I click the start button
    Then the game its initialiced with my configuration
    And when I finish the game I see the result vs the AI


