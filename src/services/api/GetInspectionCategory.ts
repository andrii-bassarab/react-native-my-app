import { gql } from "@apollo/client"

export const GET_ALL_INSPECTIONS_CATEGORY = gql`
  query GetInspectionCategories ($id: String){
    inspectionCategories (
      first: 50
      order: { createdOn: ASC }
      where: {      
        inspectionTemplateId: { eq: $id }
        deletedOn: { eq: null }
      }   
    ) {
      edges {
        node {
          id
          inspectionTemplateId       
          name
          isRequired   
          importKey
          amenities {
            id
            name
          } 
          items {
            id
            name
            description  
            itemsValues{  
              id          
              comment
              value
            }
            options {
              name
              description
            }                  
          }          
          createdOn
          createdBy
          modifiedOn
          modifiedBy
          deletedOn
          deletedBy
        }
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

export const UPDATE_CATEGOTY_ITEM_VALUE = gql`
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

export const UPDATE_INSPECTION_CATEGORY_MUTATION = gql`
  mutation updateInspectionCategoryMutation($command: UpdateInspectionCategoryCommandInput!){
    updateInspectionCategory(command: $command){
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