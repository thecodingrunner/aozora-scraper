"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import google from "../public/icons/google-icon.svg";

import { getProviders, signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const SignIn = ({ setFormType }) => {
  const [providers, setProviders] = useState(null);
  const { data: session } = useSession();

  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();
      console.log(response);

      setProviders(response);
    };

    setUpProviders();
  }, []);

  useEffect(() => {
    console.log(username);
    console.log(password);
  }, [username]);

  async function signin(e) {
    e.preventDefault();
    console.log(username);
    console.log(password);
    const result = await signIn("credentials", {
      username: username,
      password: password,
      redirect: false,
    });

    if (result?.error) {
      console.error(result.error);
    } else {
      router.push("/");
    }
  }

  return (
    <div className="shadow-xl py-6 px-10 bg-[#D9D9D9]">
      <h1 className="text-3xl font-semibold">Sign in</h1>
      <h3 className="pb-6">Get started scanning books</h3>
      <form onSubmit={(e) => signin(e)} className="gap-4 flex flex-col">
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="px-2 py-1"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="px-2 py-1"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <button type="submit" variant="outline" className="w-full font-bold">
          Sign in
        </button>
      </form>
      <p className="w-full text-center my-4">or</p>
      {session?.user ? (
        <div className="flex items-center gap-4">
          <button type="button" className="w-full" onClick={() => signOut()}>
            <img src={google.src} className="h-6 mr-2" alt="google icon" />
            Sign out with Google
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          {providers &&
            Object.values(providers)
              .filter((provider) => provider.name === "Google")
              .map((provider) => (
                <button
                  type="button"
                  className="w-full bg-white p-2 flex justify-center gap-1 rounded-lg"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                >
                  <img
                    src={google.src}
                    className="h-6 mr-2"
                    alt="google icon"
                  />
                  Sign in with Google
                </button>
              ))}
        </div>
      )}
      <p className="mt-4">
        Don't have an account yet?{" "}
        <button onClick={() => setFormType("signup")} className="underline">
          Sign up
        </button>
      </p>
    </div>
  );
};

export default SignIn;
