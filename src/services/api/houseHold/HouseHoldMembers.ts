import { gql } from '@apollo/client';
import { makeRequest } from '~/utils/fetch';

export const GET_HOUSEHOLD_NAME = gql`
  query($householdId: String!) {
    householdMembers(
      first: 10
      where: {
        householdId: { eq: $householdId }
      }
    ) {
      edges {
        node {
          firstName
          lastName
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

export const getHouseHoldNameById = (id: string) => makeRequest({url: "occupancy/graphql/", query: `
  query {
    householdMembers(
      first: 10
      where: {
        id: {eq: "${id}"}
      }
    ) {
      edges {
        node {
          firstName
          middleName
          lastName
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
`});

export const getLandlordNameById = (id : string) => makeRequest({url: "occupancy/graphql/", query: `
  query QueryLandlords {
    landlords(
      first: 50
      where: { 
        id: {eq: "${id}"}
      }
    ) {
    edges {
      node {
        id
        firstName
        lastName
        phoneNumber
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
`})