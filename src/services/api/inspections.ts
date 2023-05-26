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
        hasPermissionToEnter
        isReinspection
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

export const UPDATE_INSPECTION = gql`
  mutation updateInspectionMutation($command: UpdateInspectionCommandInput!){
    updateInspection(command: $command){
      commandName
      status
      issuedOn
      acceptedOn
      succeededOn
      failedOn
      failureReason
      affectedEntity{
        id            
        modifiedBy
      }
    }
  }
`

export const CREATE_INSPECTION_COMMENT = gql`
  mutation createInspectionCommentMutation($command: CreateInspectionCommentCommandInput!){
    createInspectionComment(command: $command){
        commandName
        status
        issuedOn
        acceptedOn
        succeededOn
        failedOn
        failureReason
        affectedEntity {
            id            
            createdBy
        }
    }
  }
`