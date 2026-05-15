"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Avatar,
  Menu,
  Text,
  Divider,
  Group,
  Modal,
  TextInput,
  Button,
  Image,
  Stack,
  ActionIcon,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useUpdateProfileMutation } from "../services/userApi";
import { logoutSuccess as logoutAction, setUser } from "../store/authSlice";
import { toast } from "@/hooks/use-toast";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import {
  Heart,
  CalendarDays,
  Home,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  Upload,
  X,
  Image as ImageIcon,
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
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLButtonElement>(null);
  const [preview, setPreview] = useState<string | null>(user?.image || null);

  useEffect(() => {
    if (user?.image) {
      if (user.image.startsWith("http")) {
        setPreview(user.image);
      }
    }
  }, [user?.image]);

  useEffect(() => {
    setMounted(true);
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      // Get the API base URL
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

      // Clear local state
      dispatch(logoutAction());
      router.push("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
      toast.error("Failed to logout");
    }
  };

  const handleProfileUpdate = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("email", email.trim());
    formData.append("phone", phone || "");

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const updatedUser = await updateProfile(formData).unwrap();
      // Update Redux store - no token needed (stored in HTTP-only cookies)
      dispatch(
        setUser({
          user: { ...user, ...updatedUser },
        }),
      );
      toast.success("Profile updated successfully");
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Failed to update profile:", {
        status: error?.status,
        data: error?.data,
        message: error?.message,
        error: error,
      });

      const errorMessage =
        error?.data?.message || error?.message || "Failed to update profile";
      toast.error(errorMessage);
    }
  };

  if (!mounted) return null;

  return (
    <>
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
            onClick={() => {
              setName(user?.name || "");
              setEmail(user?.email || "");
              setPhone(user?.phone || "");
              setIsModalOpen(true);
            }}
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

          {(user?.role === "agent" || user?.role === "admin") && (
            <Menu.Item
              leftSection={<LayoutDashboard size={18} />}
              onClick={() => router.push("/agent-dashboard")}
            >
              Agent dashboard
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

      <Modal
        zIndex={1300}
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Profile"
        centered
        radius="lg"
        size="sm"
        overlayProps={{
          style: {
            backdropFilter: "blur(5px)",
          },
        }}
        styles={{
          title: { fontSize: 18, fontWeight: 600 },
          body: { paddingTop: 12 },
          content: { padding: "12px", margin: "8px" },
        }}
      >
        <Stack gap="sm">
          <TextInput
            label="Name"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            required
            radius="md"
            size="sm"
          />
          <TextInput
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            required
            type="email"
            radius="md"
            size="sm"
          />
          <div>
            <label className="text-xs sm:text-sm font-medium">
              Phone Number (with Country code) *
            </label>
            <PhoneInput
              placeholder="Phone Number (with Country code)"
              value={phone}
              onChange={(value) => setPhone(value || "")}
              className="w-full mt-1 p-2 sm:p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              defaultCountry="IN"
              required
            />
          </div>

          <Dropzone
            onDrop={(files) => {
              setImageFile(files[0]);
              setPreview(URL.createObjectURL(files[0]));
            }}
            onReject={() => toast.error("Invalid image")}
            maxSize={3 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}
            radius="md"
            styles={{
              root: {
                padding: "0.75rem",
                border: "2px dashed #ced4da",
                backgroundColor: "#fff",
                transition: "background-color 0.2s",
              },
            }}
          >
            <Group
              justify="center"
              gap="xl"
              mih={120}
              style={{ pointerEvents: "none" }}
            >
              {preview ? (
                <div style={{ position: "relative" }}>
                  <Image
                    src={preview}
                    width={100}
                    height={100}
                    radius="md"
                    style={{
                      border: "2px solid #dee2e6",
                      padding: 4,
                    }}
                  />
                  <ActionIcon
                    variant="filled"
                    color="red"
                    size="sm"
                    style={{
                      position: "absolute",
                      top: -5,
                      right: -5,
                      zIndex: 10,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreview(null);
                      setImageFile(null);
                    }}
                  >
                    <X size={14} />
                  </ActionIcon>
                </div>
              ) : (
                <Stack align="center" gap="xs">
                  <Upload size={40} strokeWidth={1.5} color="#495057" />
                  <Text size="sm" c="dimmed">
                    Drop image here or click to upload
                  </Text>
                  <Text size="xs" c="dimmed">
                    File should not exceed 3MB
                  </Text>
                </Stack>
              )}
            </Group>
          </Dropzone>

          <Button
            onClick={handleProfileUpdate}
            unstyled
            className="bg-[#4161df] hover:bg-[#3759dd] text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 w-full text-sm sm:text-base"
            loading={isLoading}
            fullWidth
            mt="sm"
            radius="md"
            size="sm"
          >
            Update Profile
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export default ProfileMenu;
