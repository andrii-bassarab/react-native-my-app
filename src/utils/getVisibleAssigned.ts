import { AvailableUser } from "~/modules/user/types";

export const getVisibleAssignedTo = (
  availableUsers: AvailableUser[],
  inspectionAssignedToId: string
) => {
  const assignedOptions = availableUsers.map((user) => ({
    value: user._id,
    name: user.fullName,
  }));

  const foundAssignedValue = assignedOptions.find(
    (user) => user.value === inspectionAssignedToId
  );

  return foundAssignedValue
    ? foundAssignedValue
    : inspectionAssignedToId === "5e94b7f0fa86cf0016c4d92c"
    ? {
        name: "Me",
        value: "5e94b7f0fa86cf0016c4d92c",
      }
    : {
        name: "Unnasigned",
        value: "null",
      };
};
