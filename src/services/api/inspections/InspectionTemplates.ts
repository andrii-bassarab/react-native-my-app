import { gql } from '@apollo/client';

export const GET_INSPECTION_TEMPLATES = gql`
  query GetInspectionTemplates {
    inspectionTemplates (first: 50) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;