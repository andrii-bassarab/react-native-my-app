import { gql } from '@apollo/client';

export const GET_INSPECTION_TEMPLATES = gql`
  query GetInspectionTemplates {
    inspectionTemplates {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;