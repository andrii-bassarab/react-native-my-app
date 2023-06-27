import { gql } from "@apollo/client"

export const GET_ALL_INSPECTIONS_CATEGORY = gql`
  query GetInspectionCategories ($ids: [String!]) {
    inspectionCategories (
        first: 50
        order: { createdOn: ASC } 
        where: {      
          inspectionTemplateId: {in: $ids}
          deletedOn: { eq: null}
      }   
    ) {
     edges {
       node {
        id
        inspectionTemplateId       
        name
        isRequired
        importKey
        createdBy
        amenities{
          id
          name
        } 
        items{
          id
          name
          description
          options{
              name
              description
          }
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
`

export const ADD_INSPECTION_CATEGORY = gql`
  mutation createInspectionCategoryMutation($command: CreateInspectionCategoryCommandInput!){
    createInspectionCategory(command: $command){
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

export const GET_CATEGORY_ITEM_VALUE = gql`
  query GetInspectionItemValues ($ids: [String!]){
    inspectionItemValues (
        first: 50
        where: {
          inspectionItemId: {in: $ids}
      }
    ) {
    edges {
      node {
        id
        inspectionId
        inspectionItemId
        comment
        inspectedBy
        inspectedOn
        value
        itemOptionId
      }
    }
    }
  }
`

export const GET_CATEGORY_AMENITY_VALUE = gql`
  query GetInspectionAmenityValues ($ids: [String!]){
    inspectionAmenityValues (
        first: 50      
        where: {      
          inspectionAmenityId: {in: $ids}
      }   
    ) {
    edges {
      node {
        id
        inspectionId       
        inspectionAmenityId
        value
        comment         
      }
    } 
    }
  }
`

export const DELETE_CATEGORY = gql`
  mutation deleteInspectionCategoryMutation($command: DeleteInspectionCategoryCommandInput!){
    deleteInspectionCategory(command: $command){
      commandName
          status
          issuedOn
          acceptedOn
          succeededOn
          failedOn
          failureReason
      affectedEntity{
        id 
        deletedBy                       
      }
    }
  }
`

export const UPDATE_CATEGOTY_ITEM = gql`
  mutation updateInspectionItemValueMutation($command: UpdateInspectionItemValueCommandInput!){
    updateInspectionItemValue(command: $command){
        commandName
        status
        issuedOn
        acceptedOn
        succeededOn
        failedOn
        failureReason
        affectedEntity {
            id            
            comment
        }
    }
  }
`