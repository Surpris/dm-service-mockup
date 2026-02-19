# Implementation Plan: Backend Test Coverage Enhancement (Issue #42)

## 1. Overview

This plan outlines the strategy to enhance the test coverage and quality of the backend service (`backend`). The goal is to ensure system reliability, prevent regressions, and meet the **Minimum Test Coverage of 80%** as defined in `.agent/rules/testing.md`. We will focus on implementing missing unit tests, expanding integration tests to cover edge cases, and verifying end-to-end scenarios.

## 2. Current Status Assessment

| Module | Service Test (`.spec.ts`) | Resolver Test (`.spec.ts`) | E2E Test Coverage | Notes |
| :--- | :---: | :---: | :---: | :--- |
| **Project** | ✅ | ✅ | ✅ | Core CRUD covered. |
| **Dataset** | ✅ | ✅ | ⚠️ | E2E coverage needed for dataset specifics. |
| **Contributor** | ✅ | ✅ | ⚠️ | Basic coverage exists. |
| **Graph** | ✅ | ❌ | ⚠️ | Resolver tests missing. Logic is complex. |
| **UserDefinedRelationship** | ✅ | ❌ | ❌ | Resolver tests missing. |
| **DmpMetadata** | ❌ | ❌ | ❌ | **Completely missing tests.** |

- **General Observation**: Existing tests focus primarily on the "Happy Path". Error handling, validations, and edge cases are under-tested.

## 3. Objectives

1. **Achieve >80% Code Coverage**: Measure and improve coverage across all modules.
2. **Complete Unit Test Suite**: Implement missing tests for `dmp-metadata`, `graph`, and `user-defined-relationship`.
3. **Enhance Robustness**: Add test cases for:
    - **Error Handling**: Database errors, Not Found exceptions.
    - **Validation**: Invalid inputs, boundary values.
    - **Logic**: Complex graph generation logic.
4. **Solidify E2E Scenarios**: Ensure critical user journeys are protected.

## 4. Action Items

### Phase 1: Baseline & Missing Modules (Priority: High)

*Goal: Ensure every module has at least basic test coverage.*

1. **Measure Baseline Coverage**: Run `npm run test:cov` to establish the current metric.
2. **Implement `DmpMetadata` Tests**:
    - Create `dmp-metadata.service.spec.ts`.
    - Create `dmp-metadata.resolver.spec.ts`.
3. **Implement Missing Resolver Tests**:
    - Create `graph.resolver.spec.ts`.
    - Create `user-defined-relationship.resolver.spec.ts`.

### Phase 2: Deepen Unit & Integration Tests (Priority: Medium)

*Goal: Cover edge cases and enforce validation.*

1. **Enhance Service Tests**:
    - **Project/Dataset/Contributor**: Add tests for `update` and `delete` failure scenarios (e.g., ID not found).
    - **Graph**: Test graph generation with empty data, disconnected nodes, and circular references.
2. **Enhance Resolver Tests**:
    - Verify input validation (DTO constraints).
    - Mock service errors to ensure GraphQL errors are returned correctly.

### Phase 3: E2E Expansion (Priority: Medium)

*Goal: Verify system behavior from an API perspective.*

1. **Scenario: Full Data Lifecycle**:
    - Create Project -> Add Contributor -> Add Dataset -> Link them (UserDefinedRelationship) -> Generate Graph -> Verify Output.
2. **Scenario: Error Handling**:
    - Attempt to access deleted projects.
    - Attempt to create relationships between non-existent entities.

### Phase 4: CI/CD Readiness (Priority: Low)

1. **Refine Test Configuration**: Ensure `jest-e2e.json` and `package.json` scripts are optimized for CI environments (e.g., force exit, silent modes).

## 5. Execution Guidelines

- **TDD Workflow**: For new tests (especially Phase 1 & 2), follow the **Red-Green-Refactor** cycle.
    1. Write the test case (fail).
    2. Implement/Fix the code (pass).
    3. Refactor if necessary.
- **Mocking**: Use `jest.fn()` and standard NestJS testing utilities (`Test.createTestingModule`). Avoid connecting to a real database for Unit Tests.
- **Naming**: Test descriptions (`describe`, `it`) should clearly state the **condition** and the **expected outcome** (e.g., `it('should throw NotFoundException when project ID does not exist')`).

## 6. Next Steps

1. Execute **Phase 1** immediately.
2. Report coverage improvements.
