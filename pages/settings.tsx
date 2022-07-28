import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BackIcon from "../icons/back";
import * as Switch from "@radix-ui/react-switch";
import styles from "../styles/settings.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

interface Settings {
  name: string;
  email: string;
  acceptInvites: boolean;
}

const Settings: NextPage = () => {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function logout() {
    const res = await fetch(`${API_URL}/logout`, {
      credentials: "include",
    });
    if (res.ok) {
      router.push("/login");
    }
  }

  async function toggleAcceptInvite() {
    if (!settings) return;
    const res = await fetch(`${API_URL}/settings`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        acceptInvites: String(!settings.acceptInvites),
      }),
    });

    if (res.ok) {
      setSettings({
        ...settings,
        acceptInvites: !settings.acceptInvites,
      });
    }
  }

  async function fetchSettings() {
    const res = await fetch(`${API_URL}/settings`, {
      credentials: "include",
    });
    if (res.ok) {
      const json = await res.json();
      setSettings(json);
    }
    setLoading(false);
  }

  if (!settings) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-bg min-h-screen">
      <div className="w-screen border-b border-slate-400 py-2 drop-shadow-lg flex items-center justify-between px-2 mb-2">
        <BackIcon
          className="dark:fill-white text-2xl"
          onClick={() => router.back()}
        />
        <h1 className="text-xl font-medium text-center dark:text-white">
          Settings
        </h1>
        <BackIcon className="invisible text-2xl" />
      </div>

      <div className="grid grid-cols-[1fr_max-content] items-center px-2 py-1">
        <div>
          <h1 className="dark:text-white text-lg ">Accept invites</h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            You currently {settings.acceptInvites === false ? "don't " : ""}
            accept invites
          </p>
        </div>
        <Switch.Root
          className={styles.switch}
          onCheckedChange={toggleAcceptInvite}
          checked={settings.acceptInvites}
        >
          <Switch.Thumb className={styles.thumb} />
        </Switch.Root>
      </div>

      <hr className="my-2" />
      
      <div className="px-4">
        <button
          className="w-full bg-red-500 rounded-lg py-2 font-medium"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;
