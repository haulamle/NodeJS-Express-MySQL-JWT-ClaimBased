// Tạo permission cho User management
const permissions = [
  {
    action: "create",
    apiEndpoint: "/api/users",
    apiMethod: "POST"
  },
  {
    action: "read",
    apiEndpoint: "/api/users", 
    apiMethod: "GET"
  },
  {
    action: "update",
    apiEndpoint: "/api/users/:id",
    apiMethod: "PUT"
  },
  {
    action: "delete", 
    apiEndpoint: "/api/users/:id",
    apiMethod: "DELETE"
  }
];

# 1. Đăng ký user mới
POST http://localhost:3000/api/auth/register
{
  "username": "admin",
  "password": "123456"
}

# 2. Đăng nhập để lấy token
POST http://localhost:3000/api/auth/login  
{
  "username": "admin",
  "password": "123456"
}

# 3. Tạo role ADMIN
POST http://localhost:3000/api/roles
Headers: Authorization: Bearer <token>
{
  "name": "ADMIN",
  "description": "Administrator role"
}

# 4. Gán permission cho role
POST http://localhost:3000/api/role-permissions
Headers: Authorization: Bearer <token>
{
  "roleId": "<role_id từ bước 3>",
  "permissionId": "<permission_id từ database>"
}

# 5. Gán role cho user
POST http://localhost:3000/api/user-roles
Headers: Authorization: Bearer <token>
{
  "userId": "<user_id từ bước 1>",
  "roleId": "<role_id từ bước 3>"
}

// Test các chức năng User management:
# Tạo user mới
POST http://localhost:3000/api/users
Headers: Authorization: Bearer <token>
{
  "username": "user1",
  "password": "123456",
  "roleIds": ["<role_id>"]
}

# Lấy danh sách users
GET http://localhost:3000/api/users
Headers: Authorization: Bearer <token>

# Update user
PUT http://localhost:3000/api/users/<user_id>
Headers: Authorization: Bearer <token>
{
  "username": "user1_updated",
  "roleIds": ["<role_id>"]
}

# Delete user
DELETE http://localhost:3000/api/users/<user_id>
Headers: Authorization: Bearer <token>
