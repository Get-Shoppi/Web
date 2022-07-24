import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MailIcon from "../icons/mail";
import LoadingIcon from "../icons/loading";
import NextLink from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

const SignUp: NextPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successful, setSuccessful] = useState(false);

  async function signUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name) {
      setError("Please enter a name");
      return;
    }

    if (!email) {
      setError("Please enter an email address");
      return;
    }

    setLoading(true);

    const res = await fetch(`${API_URL}/signup`, {
      body: JSON.stringify({
        email,
        name,
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      setSuccessful(true);
    } else if (res.status === 400) {
      setLoading(false);
      const err = await res.json();
      if (err.error) setError(err.error);
      else setError("Sign up failed. Please try again.");
    } else {
      setLoading(false);
      setError("Sign up failed. Please try again.");
      console.log(res.status, res.body);
    }
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
      <div className="w-80 h-max py-4 rouned-lg border-2 border-slate-600 dark:border-slate-400 absolute inset-y-1/2 inset-x-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg">
        <h1 className="text-2xl font-medium text-center mb-2 dark:text-white">
          Sign up
        </h1>
        <form className="px-2 flex flex-col" onSubmit={signUp}>
          <label className="dark:text-white flex flex-col">
            Name:
            <input
              type="text"
              placeholder="Shoppi"
              className="rounded-lg outline-none dark:bg-neutral-900 border border-slate-400 px-1 focus:dark:bg-neutral-800"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="dark:text-white flex flex-col mt-2">
            Email:
            <input
              type="email"
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
            Sign up
          </button>
        </form>
        <div className="flex flex-col items-center mt-2">
          <p className="dark:text-white text-sm">Already have an account?</p>
          <NextLink href="/login">
            <p className="dark:text-white underline">Login</p>
          </NextLink>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
