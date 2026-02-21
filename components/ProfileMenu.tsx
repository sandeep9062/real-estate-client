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
import { authClient } from "@/lib/auth-client";
import { toast } from "@/hooks/use-toast";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import {
  Heart,
  CalendarDays,
  Home,
  LogOut,
  User as UserIcon,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";

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
      // Sign out using better-auth
      await authClient.signOut();
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
      dispatch(
        setUser({
          user: { ...user, ...updatedUser },
          token: localStorage.getItem("token") || "",
        })
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
      
      const errorMessage = error?.data?.message || error?.message || "Failed to update profile";
      toast.error(errorMessage);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <Menu
        width={250}
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
            padding: 10,
          },
          item: {
            fontSize: 14,
            borderRadius: 8,
            padding: "9px 12px",
          },
        }}
      >
        <Menu.Target>
          <Avatar
            src={
              user?.image && user.image.startsWith("http")
                ? user.image
                : `http://localhost:9000/${user?.image?.replace(/\\/g, "/")}`
            }
            alt="user image"
            radius="xl"
            size="44px"
            style={{
              cursor: "pointer",
              border: "2px solid rgba(255,255,255,0.5)",
            }}
            role="button"
          />
        </Menu.Target>

        <Menu.Dropdown>
          <Group gap="sm" px="xs" py="xs">
            <Avatar
              src={
                user?.image && user.image.startsWith("http")
                  ? user.image
                  : `http://localhost:9000/${user?.image?.replace(/\\/g, "/")}`
              }
              radius="xl"
              size="lg"
            />
            <div>
              <Text fw={600} size="sm">
                {user?.name || "User"}
              </Text>
              <Text size="xs" c="dimmed">
                {user?.email}
              </Text>
              <Text size="xs" c="dimmed">
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
        overlayProps={{
          style: {
            backdropFilter: "blur(5px)",
          },
        }}
        styles={{
          title: { fontSize: 22, fontWeight: 600 },
          body: { paddingTop: 18 },
        }}
      >
        <Stack gap="md">
          <TextInput
            label="Name"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            required
            radius="md"
            size="md"
          />
          <TextInput
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            required
            type="email"
            radius="md"
            size="md"
          />
          <div>
            <label className="text-sm font-medium">Phone Number *</label>
            <PhoneInput
              placeholder="Phone Number"
              value={phone}
              onChange={(value) => setPhone(value || "")}
              className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                padding: "1rem",
                border: "2px dashed #ced4da",
                backgroundColor: "#fff",
                transition: "background-color 0.2s",
              },
            }}
          >
            <Group
              justify="center"
              gap="xl"
              mih={180}
              style={{ pointerEvents: "none" }}
            >
              {preview ? (
                <div style={{ position: "relative" }}>
                  <Image
                    src={preview}
                    width={120}
                    height={120}
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
                  <Upload size={50} strokeWidth={1.5} color="#495057" />
                  <Text size="md" c="dimmed">
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
            className=" bg-[#4161df] hover:bg-[#3759dd] text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 w-full"
            loading={isLoading}
            fullWidth
            mt="md"
            radius="md"
            size="md"
          >
            Update Profile
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export default ProfileMenu;
