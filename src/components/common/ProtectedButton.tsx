import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { hasPermission, PermissionKey } from "../../utils/permissions";

interface ProtectedButtonProps extends ButtonProps {
  permission: PermissionKey;
  children: React.ReactNode;
}

export const ProtectedButton: React.FC<ProtectedButtonProps> = ({
  permission,
  children,
  ...buttonProps
}) => {
  const { user } = useAuth();
  const role = user?.role?.name ?? "";

  if (!hasPermission(role, permission)) return null;

  return <Button {...buttonProps}>{children}</Button>;
};

export default ProtectedButton;
