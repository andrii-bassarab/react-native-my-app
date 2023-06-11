import { gql } from "@apollo/client"

export const GET_ALL_INSPECTIONS_CATEGORY = gql`
  query GetInspectionCategories ($ids: [String!]) {
    inspectionCategories (
        first: 50
        order: { createdOn: ASC } 
        where: {      
          inspectionTemplateId: {in: $ids}
      }   
    ) {
     edges {
       node {
        id
        inspectionTemplateId       
        name
        isRequired
        importKey
        amenities{
          id
          name
        } 
        items{
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