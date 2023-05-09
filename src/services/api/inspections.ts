import { gql } from '@apollo/client';

export const GET_ALL_INSPECTIONS = gql`
  query GetInspections {
    inspections(order: { createdOn: ASC }, first: 30) {
    edges {
      node {
        id
        scheduledOn
        visitationRange
        assignedTo
        status
        inspectionType
        propertyType
        templateId
        hasPassed
        createdOn
        createdBy
        completedOn
        completedBy
        householdPhone
        inspectionComments {
          createdBy
          createdOn
          commentBody
        }
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