"use client";

import React, { useEffect, useState } from "react";
import { Avatar, Menu, Text, Divider, Group } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logoutSuccess as logoutAction } from "../store/authSlice";
import { toast } from "@/hooks/use-toast";

import {
  Heart,
  CalendarDays,
  Home,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
} from "lucide-react";

// Dynamic API URL detection for production vs development
const getApiBaseUrl = () => {
  // First priority: Environment variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Second priority: Detect production environment (client-side only)
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    // If on production domain, use production API URL
    if (
      hostname === "www.propertybulbul.com" ||
      hostname === "propertybulbul.com"
    ) {
      return "https://api.propertybulbul.com/api";
    }
  }

  // Default: localhost for development
  return "http://localhost:9000/api";
};

// Helper function to get user image URL
const getUserImageUrl = (imagePath: string | undefined): string | undefined => {
  if (!imagePath) return undefined;
  if (imagePath.startsWith("http")) return imagePath;
  const baseUrl = getApiBaseUrl().replace("/api", "");
  return `${baseUrl}/${imagePath.replace(/\\/g, "/")}`;
};

interface ProfileMenuProps {
  user: any;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ user }) => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      const apiBaseUrl = getApiBaseUrl();

      // Call logout endpoint
      // Note: HTTP-only cookies are sent automatically with credentials: 'include'
      await fetch(`${apiBaseUrl}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important: Include cookies
      });

      dispatch(logoutAction());
      router.push("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
      toast.error("Failed to logout");
    }
  };

  if (!mounted) return null;

  return (
    <Menu
      width={220}
      position="bottom-end"
      shadow="xl"
      radius="lg"
      transitionProps={{ transition: "scale-y" }}
      styles={{
        dropdown: {
          zIndex: 1300,
          backdropFilter: "blur(12px)",
          background: "rgba(255,255,255,0.85)",
          border: "1px solid rgba(255,255,255,0.3)",
          padding: "8px",
        },
        item: {
          fontSize: 13,
          borderRadius: 8,
          padding: "8px 10px",
        },
      }}
    >
      <Menu.Target>
        <Avatar
          src={getUserImageUrl(user?.image)}
          alt="user image"
          radius="xl"
          size="36px"
          style={{
            cursor: "pointer",
            border: "2px solid rgba(255,255,255,0.5)",
          }}
          role="button"
        />
      </Menu.Target>

      <Menu.Dropdown>
        <Group gap="sm" px="xs" py="xs">
          <Avatar src={getUserImageUrl(user?.image)} radius="xl" size="md" />
          <div className="min-w-0 flex-1">
            <Text fw={600} size="sm" className="truncate">
              {user?.name || "User"}
            </Text>
            <Text size="xs" c="dimmed" className="truncate">
              {user?.email}
            </Text>
            <Text size="xs" c="dimmed" className="truncate">
              {user?.phone}
            </Text>
          </div>
        </Group>

        <Divider my="xs" />

        <Menu.Item
          leftSection={<UserIcon size={18} />}
          onClick={() => router.push("/account/profile")}
        >
          Profile
        </Menu.Item>

        <Menu.Item
          leftSection={<Heart size={18} />}
          onClick={() => router.push("/favourites")}
        >
          Favourites
        </Menu.Item>

        <Menu.Item
          leftSection={<CalendarDays size={18} />}
          onClick={() => router.push("/bookings")}
        >
          Bookings
        </Menu.Item>

        <Menu.Item
          leftSection={<Home size={18} />}
          onClick={() => router.push("/owned")}
        >
          Owned Properties
        </Menu.Item>

        {user?.role === "agent" && (
          <Menu.Item
            leftSection={<LayoutDashboard size={18} />}
            onClick={() => router.push("/agent-dashboard")}
          >
            Agent dashboard
          </Menu.Item>
        )}

        {user?.role === "builder" && (
          <Menu.Item
            leftSection={<LayoutDashboard size={18} />}
            onClick={() => router.push("/builder/dashboard")}
          >
            Builder dashboard
          </Menu.Item>
        )}

        {user?.role === "user" && (
          <Menu.Item
            leftSection={<LayoutDashboard size={18} />}
            onClick={() => router.push("/user/dashboard")}
          >
            User dashboard
          </Menu.Item>
        )}
        {user?.role === "landlord" && (
          <Menu.Item
            leftSection={<LayoutDashboard size={18} />}
            onClick={() => router.push("/landlord/dashboard")}
          >
            Landlord dashboard
          </Menu.Item>
        )}

        <Divider my="xs" />

        <Menu.Item
          color="red"
          leftSection={<LogOut size={18} />}
          onClick={handleLogout}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ProfileMenu;
