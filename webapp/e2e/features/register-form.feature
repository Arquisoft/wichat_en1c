Feature: Registering a new user

  Scenario: Register with valid, new credentials
    Given An unregistered user with valid credentials
    When I fill in the register form and submit
    Then I should be redirected to home
    And I should be logged in

  Scenario: Registering an existing user
    Given A user that already exists
    When I try to register again with the same username
    Then I should be redirected to login
    And I should see an error message

  Scenario: Registering with invalid data - Short username
    Given A user with a short invalid username
    When I try to register
    Then I shouldn't be able to register

  Scenario: Registering with invalid data - Long username
    Given A user with a long invalid username
    When I try to register
    Then I shouldn't be able to register

  Scenario: Registering with invalid data - Non-alphanumeric username
    Given A user with special characters in the username
    When I try to register
    Then I shouldn't be able to register

  Scenario: Registering with invalid data - Empty username
    Given A user with an empty username
    When I try to register
    Then I shouldn't be able to register

  Scenario: Registering with invalid data - Empty password
    Given A user with an empty password
    When I try to register
    Then I shouldn't be able to register

  Scenario: Registering with invalid data - Empty confirm password
    Given A user with an empty confirm password
    When I try to register
    Then I shouldn't be able to register

  Scenario: Registering with invalid data - Weak password
    Given A user with a weak password
    When I try to register
    Then I shouldn't be able to register

  Scenario: Registering with invalid data - Not matching confirm password
    Given A user with passwords not matching
    When I try to register
    Then I shouldn't be able to register