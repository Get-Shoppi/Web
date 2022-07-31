import { NextPage } from "next";
import BackIcon from "../../../icons/back";
import LoadingIcon from "../../../icons/loading";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TrashIcon from "../../../icons/trash";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

interface ListInvite {
  id: string;
  inviter: {
    id: string;
    name: string;
  };
  invitee: {
    id: string;
    email: string;
  };
}

const ListSettings: NextPage = () => {
  const router = useRouter();
  const listId = router.query.id as string;
  const [invitations, setInvitations] = useState<ListInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInvitations();
  }, [listId]);

  async function fetchInvitations() {
    if (!listId) return;
    const response = await fetch(`${API_URL}/get-all-invites-from-list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ listId: listId }),
      credentials: "include",
    });
    if (response.status === 401) {
      router.push("/login");
    }
    const data = await response.json();
    setInvitations(data.invites);
    setLoading(false);
  }

  async function deleteInvite(inviteId: string) {
    setLoading(true);
    const response = await fetch(`${API_URL}/delete-invite-from-list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inviteId: inviteId }),
      credentials: "include",
    });
    fetchInvitations();
  }

  async function inviteUser(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch(`${API_URL}/invite-user-to-list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ listId: listId, email: email }),
      credentials: "include",
    });
    if (!response.ok) {
      const json = await response.json();
      setError(json.error);
    } else {
      setEmail("");
    }
    fetchInvitations();
  }

  if (!listId) {
    return <></>;
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
      <div className="w-screen border-b border-slate-400 py-2 drop-shadow-lg flex items-center px-2 justify-between mb-2">
        <BackIcon
          className="dark:fill-white text-2xl cursor-pointer"
          onClick={() => router.back()}
        />
        <h1 className="text-xl font-medium text-center dark:text-white">
          List Settings
        </h1>
        <BackIcon className="invisible text-2xl" />
      </div>
      <div className="px-2">
        <h1 className="dark:text-white text-xl font-medium ">
          Invite another user
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          Invite another user to this list using their email address
        </p>
        <form className="mt-2 flex flex-col max-w-md" onSubmit={inviteUser}>
          <label className="dark:text-white" htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            id="email"
            className="rounded dark:bg-bg border border-slate-400 p-1 dark:text-white"
            placeholder="hello@shoppi.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="text-red-500 max-w-md">{error}</p>
          <button
            type="submit"
            className="dark:text-white border border-slate-500 rounded mt-2"
          >
            Send invite
          </button>
        </form>
      </div>
      <div className="px-2 mt-6 flex flex-col">
        <h1 className="dark:text-white text-xl font-medium">Invited users</h1>
        {invitations && invitations.length > 0 ? (
          <ul className="mt-2 max-w-md w-full">
            {invitations.map((invite, index) => (
              <li key={invite.id} className="px-2">
                <div className="flex justify-between items-center">
                  <p className="dark:text-white">{invite.invitee.email}</p>
                  <TrashIcon
                    className="dark:fill-white text-2xl cursor-pointer"
                    onClick={() => deleteInvite(invite.id)}
                  />
                </div>
                {index !== invitations.length - 1 ? (
                  <hr className="my-2" />
                ) : (
                  <></>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-neutral-500 dark:text-neutral-400">No users invited</p>
        )}
      </div>
    </div>
  );
};

export default ListSettings;
