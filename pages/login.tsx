import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MailIcon from "../icons/mail";
import LoadingIcon from "../icons/loading";
import NextLink from "next/link";
import Offline from "../components/offline";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

const Login: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successful, setSuccessful] = useState(false);

  useEffect(() => {
    if (router.query.token) {
      authenticate(); // if the user clicked on the link from an email, authenticate them
    } else {
      setLoading(false);
    }
  }, [router.query.token]);

  async function authenticate() {
    const { email, token } = router.query;
    if (!email || !token) {
      setError("Invalid token");
      setLoading(false);
      return;
    }
    const response = await fetch(`${API_URL}/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, token }),
      credentials: "include",
    });
    if (response.ok) {
      router.push("/");
    } else {
      setError("Authentication failed. Please try again.");
      console.log(response.status, response.body);
    }
  }

  async function sendEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email) {
      setError("Please enter an email address");
      return;
    }

    setLoading(true);

    const res = await fetch(`${API_URL}/login`, {
      body: JSON.stringify({
        email,
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    setSuccessful(true);
  }

  // if the email was sent successfully, show a message
  if (successful) {
    return (
      <div className="w-screen h-screen dark:bg-bg">
        <div className="w-80 h-max py-4 rouned-lg border-2 border-slate-600 dark:border-slate-400 absolute inset-y-1/2 inset-x-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg">
          <MailIcon className="dark:fill-white text-4xl font-light mx-auto" />
          <h1 className="dark:text-white text-lg font-medium text-center mt-2">
            Check your inbox
          </h1>
          <p className="dark:text-white px-2 text-center mt-1">
            You should soon receive an email with a login link from us. Just
            click on that link and we&apos;ll authenticate you!
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-screen h-screen dark:bg-bg">
        <div className="w-80 h-max py-4 rouned-lg border-2 border-slate-600 dark:border-slate-400 absolute inset-y-1/2 inset-x-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg">
          <LoadingIcon className="dark:fill-white text-4xl font-light mx-auto" />
          <p className="dark:text-white px-2 text-center mt-1">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen dark:bg-bg">
      <Offline />
      <div className="w-80 h-max py-4 rouned-lg border-2 border-slate-600 dark:border-slate-400 absolute inset-y-1/2 inset-x-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg">
        <h1 className="text-2xl font-medium text-center mb-2 dark:text-white">
          Login
        </h1>
        <form className="px-2 flex flex-col" onSubmit={sendEmail}>
          <label className="dark:text-white flex flex-col">
            Email:
            <input
              type="email"
              name="email"
              placeholder="hello@shoppi.com"
              className="rounded-lg outline-none dark:bg-neutral-900 border border-slate-400 px-1 focus:dark:bg-neutral-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <p className="text-red-400">{error}</p>
          <button
            type="submit"
            className="border border-slate-400 rounded-lg dark:text-white px-2 mt-1 ml-auto mb-2"
          >
            Send Email
          </button>
        </form>
        <div className="flex flex-col items-center mt-2">
          <p className="dark:text-white text-sm">New here?</p>
          <NextLink href="/signup">
            <p className="dark:text-white underline">Register</p>
          </NextLink>
        </div>
      </div>
    </div>
  );
};

export default Login;
