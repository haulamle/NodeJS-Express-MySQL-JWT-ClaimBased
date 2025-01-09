import { Permission } from "../../models/Permission";

export const seedPermissions = async () => {
  try {
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
        action: "update",
        apiEndpoint: "/api/users/status/:id",
        apiMethod: "PUT",
      },
      {
        action: "delete",
        apiEndpoint: "/api/users/:id",
        apiMethod: "DELETE",
      },
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
      {
        action: "update",
        apiEndpoint: "/api/products/:id",
        apiMethod: "PUT",
      },
      {
        action: "delete",
        apiEndpoint: "/api/products/:id",
        apiMethod: "DELETE",
      },
      {
        action: "update",
        apiEndpoint: "/api/permissions/status/:id/",
        apiMethod: "PUT",
      },
    ];

    for (const permission of userPermissions) {
      await Permission.findOrCreate({
        where: {
          action: permission.action,
          apiEndpoint: permission.apiEndpoint,
          apiMethod: permission.apiMethod,
        },
        defaults: permission,
      });
    }

    console.log("Permissions seeded successfully");
  } catch (error) {
    console.error("Error seeding permissions:", error);
  }
};
