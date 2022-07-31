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

type Invitation = {
  id: string;
  inviter: {
    name: string;
    email: string;
  };
  list: {
    name: string;
  };
};

const Home: NextPage = () => {
  const router = useRouter();
  const [lists, setLists] = useState<List[]>([]);
  const [invites, setInvites] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [invite, setInvite] = useState<number>(0);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    await fetchLists();
    await fetchInvites();
  }

  async function fetchLists() {
    setLoading(true);
    const res = await fetch(`${API_URL}/get-all-lists`, {
      credentials: "include",
    });
    if (res.status === 401) {
      router.push("/login");
      return;
    }
    const data = await res.json();
    setLists(data.lists);
    setLoading(false);
  }

  async function fetchInvites() {
    const res = await fetch(`${API_URL}/get-all-invites`, {
      credentials: "include",
    });
    if (res.status === 401) {
      router.push("/login");
      return;
    }
    const data = await res.json();
    setInvites(data);
  }

  function openList(id: string) {
    router.push(`/list/${id}`);
  }

  function openInviteModal(id: number) {
    setInvite(id);
    setInviteModalOpen(true);
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
        <SettingsIcon
          className="dark:fill-white text-2xl cursor-pointer"
          onClick={() => router.push("/settings")}
        />
        <h1 className="text-xl font-medium text-center dark:text-white">
          Your lists
        </h1>
        <PlusIcon
          className="dark:fill-white text-2xl cursor-pointer"
          onClick={() => setCreateModalOpen(true)}
        />
      </div>
      <div>
        <ul className="px-2">
          {lists.map((list) => (
            <li
              key={list.id}
              onClick={() => openList(list.id)}
              className="dark:text-white border-b border-slate-300 dark:border-slate-500 py-2 px-2 cursor-pointer"
            >
              {list.name}
            </li>
          ))}
        </ul>
      </div>
      {invites.length === 0 ? (
        <></>
      ) : (
        <div>
          <h1 className="dark:text-white text-center font-medium text-xl mt-5 mb-2">
            Invites
          </h1>
          <ul>
            {invites.map((invite, index) => (
              <li
                key={invite.id}
                className="dark:text-white border-b border-slate-300 dark:border-slate-500 py-2 px-2 cursor-pointer"
                onClick={() => openInviteModal(index)}
              >
                {invite.list.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      <CreateListModal
        closeModal={() => setCreateModalOpen(false)}
        modalOpen={createModalOpen}
        updateData={fetchLists}
      />
      <InviteModal
        closeModal={() => setInviteModalOpen(false)}
        modalOpen={inviteModalOpen}
        inviteData={invites[invite]}
        fetchData={fetchData}
        fetchInvites={fetchInvites}
      />
    </div>
  );
};

type InviteModalProps = {
  closeModal: () => void;
  modalOpen: boolean;
  inviteData: Invitation;
  fetchInvites: () => void;
  fetchData: () => void;
};

const InviteModal = ({
  modalOpen,
  closeModal,
  inviteData,
  fetchData,
  fetchInvites
}: InviteModalProps) => {
  const [loading, setLoading] = useState(false);

  async function acceptInvite() {
    setLoading(true);
    const res = await fetch(`${API_URL}/accept-invite`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inviteId: inviteData.id,
      }),
    });
    setLoading(false);
    fetchData();
    closeModal();
  }

  async function declineInvite() {
    setLoading(true);
    const res = await fetch(`${API_URL}/decline-invite`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inviteId: inviteData.id,
      }),
    });
    setLoading(false);
    fetchInvites();
    closeModal();
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

  if (!inviteData) {
    return <></>;
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
        <h1 className="dark:text-white text-center font-medium text-xl">
          {inviteData.list.name}
        </h1>
        <p className="dark:text-white text-center">
          You have been invited to the list <span className="italic">{inviteData.list.name}</span>{" "}
          by <span className="italic">{inviteData.inviter.email}</span>
        </p>
        <div className="mt-3">
          <button className="dark:text-white border border-slate-400 rounded w-full py-1" onClick={acceptInvite}>Accept invite</button>
          <button className="dark:text-white border border-slate-400 rounded w-full py-1 my-2" onClick={declineInvite}>Decline invite</button>
          <button className="dark:text-white border border-slate-400 rounded w-full py-1" onClick={() => closeModal()}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

type CreateModalProps = {
  closeModal: () => void;
  modalOpen: boolean;
  updateData: () => void;
};

const CreateListModal = ({
  closeModal,
  modalOpen,
  updateData,
}: CreateModalProps) => {
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
