import { gql } from '@apollo/client';

export const GET_ALL_INSPECTIONS = gql`
  query GetInspections {
    inspections {
    edges {
      node {
        id
        scheduledOn
        visitationRange
        assignedTo
        status
        inspectionType
        propertyType
        hasPassed
        createdOn
        createdBy
        unit {
            id
            streetAddress
            city
            state
            postalCode
        }
        household{
            lastActionName
            headOfHouseholdId
        }
      }
      cursor
    }
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
    }
  }
`;