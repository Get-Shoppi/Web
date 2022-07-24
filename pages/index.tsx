import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PlusIcon from "../icons/plus";
import LoadingIcon from "../icons/loading";
import SettingsIcon from "../icons/settings";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

type List = {
  id: string;
  name: string;
};

const Home: NextPage = () => {
  const router = useRouter();
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const res = await fetch(`${API_URL}/get-all-lists`, {
      credentials: "include",
    });
    if (res.status === 401) {
      router.push('/login');
      return;
    }
    const data = await res.json();
    setLists(data.lists);
    setLoading(false);
  }

  function openList(id: string) {
    router.push(`/list/${id}`);
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-bg min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <LoadingIcon className="dark:fill-white text-3xl" />
          <h1 className="dark:text-white">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-bg min-h-screen">
      <div className="w-screen border-b border-slate-400 py-2 drop-shadow-lg flex items-center justify-between px-2 mb-2">
        <SettingsIcon className="dark:fill-white text-2xl" onClick={() => router.push('/settings')}/>
        <h1 className="text-xl font-medium text-center dark:text-white">
          Your lists
        </h1>
        <PlusIcon
          className="dark:fill-white text-2xl"
          onClick={() => setModalOpen(true)}
        />
      </div>
      <div>
        <ul className="px-2">
          {lists.map((list) => (
            <li
              key={list.id}
              onClick={() => openList(list.id)}
              className="dark:text-white border-b border-slate-300 dark:border-slate-500 py-2 px-2"
            >
              {list.name}
            </li>
          ))}
        </ul>
      </div>
      <CreateListModal
        closeModal={() => setModalOpen(false)}
        modalOpen={modalOpen}
        updateData={fetchData}
      />
    </div>
  );
};

type ModalProps = {
  closeModal: () => void;
  modalOpen: boolean;
  updateData: () => void;
};

const CreateListModal = ({ closeModal, modalOpen, updateData }: ModalProps) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function createList() {
    if (!name) {
      setError("Name is required");
      return;
    }
    setLoading(true);
    const res = await fetch(`${API_URL}/create-list`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    setLoading(false);
    if (res.ok) {
      updateData();
      closeModal();
      setName("");
      setError("");
    } else {
      setError("Something went wrong");
    }
  }

  if (loading) {
    return (
      <div
        className={`${
          modalOpen ? "" : "hidden"
        } absolute top-0 left-0 flex items-center justify-center w-screen h-screen backdrop-blur`}
      >
        <div className="bg-white dark:bg-bg w-64 h-max border border-slate-400 rounded p-2 flex flex-col items-center">
          <LoadingIcon className="dark:fill-white text-3xl" />
          <p className="dark:text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        modalOpen ? "" : "hidden"
      } absolute top-0 left-0 flex items-center justify-center w-screen h-screen backdrop-blur`}
      onClick={() => closeModal()}
    >
      <div
        className="bg-white dark:bg-bg w-64 h-max border border-slate-400 rounded p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="dark:text-white text-center font-medium text-xl mb-2">
          Create new list
        </h1>
        <input
          className="w-full rounded px-1 py-1 bg-bg border border-slate-300 dark:border-slate-500 outline-none dark:text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="List name"
        />
        <p className="text-center text-red-400">{error}</p>
        <div className="flex justify-between mt-2">
          <button
            className="dark:text-white border rounded border-black dark:border-white px-2 py-1"
            onClick={() => closeModal()}
          >
            Cancel
          </button>
          <button
            className="dark:text-white border rounded border-black dark:border-white px-2 py-1"
            onClick={() => createList()}
          >
            Create List
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
