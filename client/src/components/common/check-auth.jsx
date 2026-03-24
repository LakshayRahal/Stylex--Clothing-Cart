// import { Navigate, useLocation } from "react-router-dom";

// function CheckAuth({ isAuthenticated, user, children }) {
//   const location = useLocation();

//   console.log(location.pathname, isAuthenticated);

//   if (location.pathname === "/") {
//     if (!isAuthenticated) {
//       return <Navigate to="/auth/login" />;
//     } else {
//       if (user?.role === "admin") {
//         return <Navigate to="/admin/dashboard" />;
//       } else {
//         return <Navigate to="/shop/home" />;
//       }
//     }
//   }

//   if (
//     !isAuthenticated &&
//     !(
//       location.pathname.includes("/login") ||
//       location.pathname.includes("/register")
//     )
//   ) {
//     return <Navigate to="/auth/login" />;
//   }

//   if (
//     isAuthenticated &&
//     (location.pathname.includes("/login") ||
//       location.pathname.includes("/register"))
//   ) {
//     if (user?.role === "admin") {
//       return <Navigate to="/admin/dashboard" />;
//     } else {
//       return <Navigate to="/shop/home" />;
//     }
//   }

//   if (
//     isAuthenticated &&
//     user?.role !== "admin" &&
//     location.pathname.includes("admin")
//   ) {
//     return <Navigate to="/unauth-page" />;
//   }

//   if (
//     isAuthenticated &&
//     user?.role === "admin" &&
//     location.pathname.includes("shop")
//   ) {
//     return <Navigate to="/admin/dashboard" />;
//   }

//   return <>{children}</>;
// }

// export default CheckAuth;


import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const path = location.pathname;

  /* ---------------- PUBLIC AUTH ROUTES ---------------- */
  const publicAuthRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
  ];

  const isResetPasswordRoute = path.startsWith("/auth/reset-password");

  /* ---------------- ROOT ROUTE ---------------- */
  if (path === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" replace />;
    }

    return user?.role === "admin" ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/shop/home" replace />
    );
  }

  /* ---------------- NOT AUTHENTICATED ---------------- */
  if (
    !isAuthenticated &&
    !publicAuthRoutes.includes(path) &&
    !isResetPasswordRoute
  ) {
    return <Navigate to="/auth/login" replace />;
  }

  /* ---------------- AUTHENTICATED BUT VISITING AUTH PAGES ---------------- */
  if (
    isAuthenticated &&
    (publicAuthRoutes.includes(path) || isResetPasswordRoute)
  ) {
    return user?.role === "admin" ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/shop/home" replace />
    );
  }

  /* ---------------- ROLE-BASED PROTECTION ---------------- */
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    path.startsWith("/admin")
  ) {
    return <Navigate to="/unauth-page" replace />;
  }

  if (
    isAuthenticated &&
    user?.role === "admin" &&
    path.startsWith("/shop")
  ) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}

export default CheckAuth;
