export const redirectByRole = (role, navigate) => {
  if (role === "admin") navigate("/admin/dashboard");
  if (role === "staff") navigate("/staff/dashboard");
  if (role === "student") navigate("/student/dashboard");
};
