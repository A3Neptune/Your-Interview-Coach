/**
 * Utility functions for exporting data to Excel format
 */

interface User {
  _id: string;
  name: string;
  email: string;
  userType: "student" | "professional" | "admin";
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

/**
 * Convert data to CSV format
 */
const convertToCSV = (data: User[]): string => {
  const headers = [
    "Name",
    "Email",
    "User Type",
    "Status",
    "Verified",
    "Created Date",
    "Last Login",
  ];

  const rows = data.map((user) => [
    `"${user.name.replace(/"/g, '""')}"`,
    `"${user.email.replace(/"/g, '""')}"`,
    user.userType.charAt(0).toUpperCase() + user.userType.slice(1),
    user.isActive ? "Active" : "Inactive",
    user.isVerified ? "Yes" : "No",
    new Date(user.createdAt).toLocaleDateString("en-US"),
    user.lastLogin
      ? new Date(user.lastLogin).toLocaleDateString("en-US")
      : "Never",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  return csvContent;
};

/**
 * Create an XLSX workbook using native JavaScript (without external library)
 * Falls back to CSV if unable to create XLSX
 */
const createXLSXWorkbook = (data: User[]): ArrayBuffer | string => {
  // This is a simple CSV export that can be opened in Excel
  // For more advanced XLSX features, you would need the xlsx library
  return convertToCSV(data);
};

/**
 * Export users to Excel file
 */
export const exportUsersToExcel = (
  users: User[],
  filename: string = "users_export",
) => {
  try {
    // Try to use xlsx library if available
    if (typeof window !== "undefined" && (window as any).XLSX) {
      const XLSX = (window as any).XLSX;

      // Prepare data for Excel
      const exportData = users.map((user) => ({
        Name: user.name,
        Email: user.email,
        "User Type":
          user.userType.charAt(0).toUpperCase() + user.userType.slice(1),
        Status: user.isActive ? "Active" : "Inactive",
        Verified: user.isVerified ? "Yes" : "No",
        "Joined Date": new Date(user.createdAt).toLocaleDateString("en-US"),
        "Last Login": user.lastLogin
          ? new Date(user.lastLogin).toLocaleDateString("en-US")
          : "Never",
      }));

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

      // Set column widths
      worksheet["!cols"] = [
        { wch: 20 },
        { wch: 25 },
        { wch: 15 },
        { wch: 10 },
        { wch: 10 },
        { wch: 15 },
        { wch: 15 },
      ];

      // Write file
      XLSX.writeFile(
        workbook,
        `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`,
      );
    } else {
      // Fallback to CSV if xlsx is not available
      const csvData = convertToCSV(users);
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `${filename}_${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    throw new Error("Failed to export data. Please try again.");
  }
};

/**
 * Export users to CSV file (simpler format)
 */
export const exportUsersToCSV = (
  users: User[],
  filename: string = "users_export",
) => {
  try {
    const csvData = convertToCSV(users);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${filename}_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error exporting to CSV:", error);
    throw new Error("Failed to export data. Please try again.");
  }
};
