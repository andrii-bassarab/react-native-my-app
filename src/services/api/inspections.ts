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
        completedOn
        completedBy
        unit {
            id
            streetAddress
            city
            state
            postalCode
            numberOfBedrooms
            numberOfBathrooms
            squareFootage
            isHandicapAccessible
            yearConstructed
            landlord{
                firstName
                lastName
            }
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