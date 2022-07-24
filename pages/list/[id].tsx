import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadingIcon from "../../icons/loading";
import BackIcon from "../../icons/back";
import NextLink from "next/link";
import SettingsIcon from "../../icons/settings";

type List = {
  name: string;
  items: string[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

//TODO: listen for updates using web sockets
const List: NextPage = () => {
  const router = useRouter();
  const listId = router.query.id as string;

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<List | null>(null);
  const [item, setItem] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const res = await fetch(`${API_URL}/get-list`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ listId }),
    });
    if (res.ok) {
      const { list } = await res.json();
      setList(list);
      setLoading(false);
    } else {
      //TODO: handle error
    }
  }

  async function addItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!item) {
      return;
    }
    const res = await fetch(`${API_URL}/add-item-to-list`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ listId, item }),
    });
    if (res.ok) {
      setItem("");
    }
    loadData();
  }

  async function removeItem(item: string) {
    await fetch(`${API_URL}/remove-item-from-list`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ listId, item }),
    });
    loadData();
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

  if (!list) {
    return (
      <div className="bg-white dark:bg-bg min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <h2 className="dark:text-white text-3xl mb-2">:(</h2>
          <h1 className="dark:text-white text-xl">Oh no.</h1>
          <p className="dark:text-white mb-4">
            Something went wrong. Please try again.
          </p>
          <NextLink href="/">
            <p className="dark:text-white underline">Go back</p>
          </NextLink>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-bg min-h-screen">
      <div className="w-screen border-b border-slate-400 py-2 drop-shadow-lg flex items-center justify-between px-2 mb-2">
        {/* Balance the flex */}
        <BackIcon className="dark:fill-white text-2xl" onClick={() => router.back()}/>
        <h1 className="text-xl font-medium text-center dark:text-white">
          {list.name}
        </h1>
        <SettingsIcon className="dark:fill-white text-2xl" onClick={() => router.push(`/list/${listId}/settings`)} />
      </div>
      <ul className="px-2">
        {list.items.map((item) => (
          <li
            key={item}
            className="border-b border-slate-400 py-2 dark:text-white"
            onClick={() => removeItem(item)}
          >
            {item}
          </li>
        ))}
      </ul>
      <div className="fixed bottom-0 left-0 w-screen px-2 py-1">
        <form onSubmit={addItem}>
          <input
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            className="dark:bg-bg border border-slate-400 dark:text-white py-2 px-1 w-full rounded outline-none"
            placeholder="Add an item"
          />
        </form>
      </div>
    </div>
  );
};

export default List;
