const node = {
  node: {
    id: "5e94bb43fa86cf0016c4d9fe", //5e94bb43fa86cf0016c4d9fe
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
    inspectionComments: [
      {
        createdBy: "string",
        createdOn: "string",
        commentBody: "string",
      },
    ],
    unit: {
      id: "5dec0c8accba88001629756a",
      streetAddress: "2889 Bagshot Row",
      city: "Hobbiton",
      state: "The Shire",
      postalCode: 33111,
      numberOfBedrooms: 1,
      numberOfBathrooms: 1,
      squareFootage: 1 || null,
      isHandicapAccessible: false,
      yearConstructed: 1 | null,
      landlord:
        {
          firstName: "string",
          lastName: "string",
        } || null,
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

// lastInspectionDate
// custom Attributes
// Dog on Premises
// assigned

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

const comment = {
  data: {
    householdMembers: {
      edges: [
        {
          node: {
            firstName: "Gary",
            middleName: "L",
            lastName: "Ellis",
          },
          cursor: "MA==",
        },
      ],
      pageInfo: {
        startCursor: "MA==",
        endCursor: "MA==",
        hasNextPage: false,
        hasPreviousPage: false,
      },
    },
  },
};

const inspectionCategory = {
  id: "57e58f5899760c2500c4787c",
  inspectionTemplateId: "57e58f5899760c2500c4787b",
  name: "General Health and Safety",
  isRequired: true,
  importKey: null,
  amenities: [],
  items: [],
  createdOn: "2016-09-23T20:23:52.155Z",
  createdBy: "SYSTEM",
  modifiedOn: "2016-09-27T00:51:35.547Z",
  modifiedBy: "admin@hdslabs.com",
  deletedOn: null,
  deletedBy: null,
};
