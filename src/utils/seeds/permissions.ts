import { Permission } from "../../models/Permission";

export const seedPermissions = async () => {
  const userPermissions = [
    {
      action: "create",
      apiEndpoint: "/api/users",
      apiMethod: "POST",
    },
    {
      action: "read",
      apiEndpoint: "/api/users",
      apiMethod: "GET",
    },
    {
      action: "update",
      apiEndpoint: "/api/users/:id",
      apiMethod: "PUT",
    },
    {
      action: "delete",
      apiEndpoint: "/api/users/:id",
      apiMethod: "DELETE",
    },
    // add permissions for functions #
    {
      action: "create",
      apiEndpoint: "/api/products",
      apiMethod: "POST",
    },
    {
      action: "read",
      apiEndpoint: "/api/products",
      apiMethod: "GET",
    },
  ];

  for (const permission of userPermissions) {
    await Permission.findOrCreate({
      where: {
        apiEndpoint: permission.apiEndpoint,
        apiMethod: permission.apiMethod,
      },
      defaults: permission,
    });
  }
};
