import { useMemo, useCallback } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { AppProvider, DashboardLayout } from "@toolpad/core";
import { useDispatch, useSelector } from "react-redux";
import type { Router } from "@toolpad/core";
import type { RootState } from "../../app/store";
import { buildNavigation } from "../../navigation/sidebar.tsx";
import { UserRole } from "../../types/enums";
import { logout } from "../../features/auth/authSlice";
import { ROUTES } from "../../routes/routes";
import theme from "../../theme/theme";
import GlobalSnackbar from "../common/GlobalSnackbar";

export default function AppDashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  // Build role-filtered navigation from the sidebar config
  const role = user?.role?.name?.toLowerCase() as UserRole | undefined;
  const navigation = useMemo(() => buildNavigation(role), [role]);

  // Adapt react-router-dom to Toolpad's Router interface
  const router: Router = useMemo(
    () => ({
      pathname: location.pathname,
      searchParams: new URLSearchParams(location.search),
      navigate: (url: string | URL) => navigate(String(url)),
    }),
    [location, navigate]
  );

  // Map Redux auth user to Toolpad's Session format
  const session = useMemo(
    () => (user ? { user: { name: user.name, email: user.email } } : null),
    [user]
  );

  const handleSignOut = useCallback(() => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  }, [dispatch, navigate]);

  const authentication = useMemo(
    () => ({
      signIn: () => navigate(ROUTES.LOGIN),
      signOut: handleSignOut,
    }),
    [navigate, handleSignOut]
  );

  return (
    <AppProvider
      navigation={navigation}
      router={router}
      theme={theme}
      session={session}
      authentication={authentication}
      branding={{ title: "LMS Portal" }}
    >
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
      <GlobalSnackbar />
    </AppProvider>
  );
}
