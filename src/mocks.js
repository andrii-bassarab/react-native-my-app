const node = {
  node: {
    id: "5e94bb43fa86cf0016c4d9fe",
    scheduledOn: "2020-04-21T06:00:00.000Z", //appointment time
    visitationRange: null,
    assignedTo: "5e94b7f0fa86cf0016c4d92c",
    status: "complete",
    inspectionType: "Initial", //how often should i do inspection
    propertyType: "unit", //openspace | unit
    hasPassed: true,
    createdOn: "2020-04-13T19:19:31.525Z",
    createdBy: "heather@hdslabs.com",
    completedOn: "",
    hasPermissionToEnter: true, //permission to enter
    unit: {
      id: "5dec0c8accba88001629756a",
      streetAddress: "2889 Bagshot Row",
      city: "Hobbiton",
      state: "The Shire",
      postalCode: 33111,
    },
    inspectionComments: {
      commentBody: "Please knock, if no response, then you can enter.",
      createdBy: "heather@hdslabs.com",
      createdOn: "2020-04-13T19:19:31.460Z",
    },
    household: {
      lastActionName: "Interim Recertification",
      headOfHouseholdId: "5dec1a82ccba88001629772e", //tenant
    },
  },
  cursor: "MA==",
};

//landlord, phone another endpoint

const inspectionTemplates = {
  inspectionTemplates: {
    edges: [
      {
        node: {
          id: "57e58f5899760c2500c4787b",
          name: "HQS", //inspection form
        },
        cursor: "MA==",
      },
      {
        node: {
          id: "586acddd4428dd00118ef2e1",
          name: "UPCS",
        },
        cursor: "MQ==",
      },
    ],
    pageInfo: {
      startCursor: "MA==",
      endCursor: "MQ==",
      hasNextPage: false,
      hasPreviousPage: false,
    },
  },
};
