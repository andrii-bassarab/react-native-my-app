import { X_CUSTOMER_ID, X_SIDE_ID } from "~/constants/env";
import { makeRequest } from "~/utils/fetch/fetch";

export const updateHouseHoldPhoneNumber = (id: string, phoneNumber: string, email: string) =>
  makeRequest({
    url: "occupancy/graphql/",
    mutation: `
    mutation UpdateVendor {
        updateVendor(
            command: {modifiedBy: ${email}, customerId: ${X_CUSTOMER_ID}, siteId: ${X_SIDE_ID}, id: ${id}, phoneNumber: ${phoneNumber}}
        ) {
            commandName
            status
            issuedOn
            acceptedOn
            succeededOn
            failedOn
            failureReason
            affectedEntity {
                id
                firstName
                lastName
                name
                emailAddress
                phoneNumber
                vendorType
                paymentPreference
                siteId
                createdOn
                createdBy
                modifiedOn
                modifiedBy
            }
        }
    }
`,
  });
