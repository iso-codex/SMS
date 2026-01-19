# Quick Start Guide: User Management

## Accessing User Management
1. Log in as an admin user
2. Navigate to **Admin Dashboard** → **Users** (or go to `/admin/users`)

## Adding a New User

### Steps:
1. Click the **"Add User"** button (top right)
2. Fill in the form:
   - **Full Name**: User's complete name
   - **Email Address**: Valid email (will be used for login)
   - **Role**: Select from dropdown (Student, Teacher, Parent, or Admin)
   - **Password**: Set initial password for the user
3. Click **"Create User"**
4. The new user will appear in the table

### Example:
```
Full Name: John Doe
Email: john.doe@school.com
Role: Teacher
Password: SecurePass123!
```

## Changing a User's Role ⭐ NEW FEATURE

### Steps:
1. Find the user in the table
2. Locate the **Role** column
3. Click on the colored role dropdown for that user
4. Select the new role from the dropdown menu
5. The role updates **immediately** - no save button needed!

### Visual Indicators:
- **Hover Effect**: When you hover over a role dropdown, you'll see:
  - A subtle shadow appears
  - The background color slightly darkens
  - A small edit icon (✏️) appears next to the dropdown
- **Color Coding**:
  - 🔵 **Admin** - Blue
  - 🟣 **Teacher** - Purple
  - 🟢 **Student** - Emerald Green
  - 🟠 **Parent** - Orange

### Example Use Case:
**Scenario**: A student has graduated and is now working as a teacher at the school.

1. Search for the student: "Sarah Johnson"
2. Click on the green "Student" dropdown
3. Select "Teacher" from the options
4. The badge instantly changes to purple "Teacher"
5. Sarah now has teacher permissions!

## Deleting a User

### Steps:
1. Find the user in the table
2. Click the **trash icon** (🗑️) in the Actions column
3. Confirm the deletion in the popup dialog
4. The user is permanently removed from the system

### ⚠️ Warning:
- Deletion is **permanent** and cannot be undone
- All user data and associated records may be affected
- Use with caution!

## Searching for Users

### Steps:
1. Use the search bar at the top of the table
2. Type the user's name or email
3. The table filters in real-time

### Tips:
- Search is **case-insensitive**
- Searches both name and email fields
- Clear the search box to see all users again

## User Roles Explained

### 👨‍💼 Admin
- Full system access
- Can manage all users, classes, subjects, etc.
- Can add/edit/delete any data

### 👨‍🏫 Teacher
- Can manage their assigned classes
- Can take attendance and enter grades
- Can view student information

### 👨‍🎓 Student
- Can view their own schedule and grades
- Can see their attendance records
- Limited to their own data

### 👨‍👩‍👧 Parent
- Can view their children's information
- Can see grades and attendance
- Read-only access to student data

## Troubleshooting

### "Error updating role"
- Check your internet connection
- Ensure you're logged in as an admin
- Try refreshing the page and attempting again

### "Error creating user"
- Verify the email address is unique (not already in use)
- Ensure password meets minimum requirements
- Check that all required fields are filled

### "Error deleting user"
- Ensure you have admin permissions
- Check if the user has dependent records that need to be handled first
- Try refreshing the page

## Best Practices

1. **Regular Audits**: Periodically review user roles to ensure they're up to date
2. **Least Privilege**: Assign the minimum role necessary for each user
3. **Strong Passwords**: Use strong, unique passwords when creating users
4. **Immediate Updates**: Change roles immediately when a user's position changes
5. **Documentation**: Keep a log of role changes for important users

## Keyboard Shortcuts

- **Tab**: Navigate between form fields
- **Enter**: Submit the "Add User" form
- **Esc**: Close the "Add User" modal
- **Arrow Keys**: Navigate dropdown options when selecting a role

## Need Help?

If you encounter any issues or have questions about user management:
1. Check this guide first
2. Review the detailed documentation in `USER_MANAGEMENT_FEATURE.md`
3. Contact your system administrator
