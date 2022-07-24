import { NextPage } from "next";
import { useRouter } from "next/router";
import BackIcon from "../icons/back";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

const Settings: NextPage = () => {
  const router = useRouter();

  async function logout() {
    const res = await fetch(`${API_URL}/logout`, {
      credentials: "include",
    });
    if (res.ok) {
      router.push('/login');
    }
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
      <div className="px-4">
        <button className="w-full bg-red-500 rounded-lg py-2 font-medium" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;
