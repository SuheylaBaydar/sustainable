"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SocialSignUp from "../SocialSignUp";
import Logo from "@/components/Layout/Header/Logo"
import { useContext, useState } from "react";
import Loader from "@/components/Common/Loader";
import AuthDialogContext from "@/app/context/AuthDialogContext";
const SignUp = ({ signUpOpen }: { signUpOpen?: any }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const authDialog = useContext(AuthDialogContext);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData(e.currentTarget);
      const value = Object.fromEntries(data.entries());

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(result?.error || "Kayıt yapılamadı.");
      }

      toast.success("Kayıt başarılı. Şimdi giriş yapabilirsiniz.");
      authDialog?.setIsUserRegistered(true);
      setTimeout(() => authDialog?.setIsUserRegistered(false), 1100);
      setTimeout(() => signUpOpen?.(false), 900);
      setTimeout(() => router.push("/signin"), 900);
    } catch (err: any) {
      toast.error(err?.message || "Kayıt sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-10 text-center mx-auto inline-block max-w-[160px]">
        <Logo />
      </div>

      <SocialSignUp />

      <span className="z-1 relative my-8 block text-center">
        <span className="-z-1 absolute left-0 top-1/2 block h-px w-full bg-BorderLine dark:bg-dark_border"></span>
        <span className="text-body-secondary relative z-10 inline-block bg-white dark:bg-darklight px-3 text-base dark:bg-dark">
          YA DA
        </span>
      </span>

      <form onSubmit={handleSubmit}>
        <div className="mb-[22px]">
          <input
            type="text"
            placeholder="Ad"
            name="name"
            required
            className="w-full rounded-md border border-BorderLine dark:border-dark_border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
          />
        </div>
        <div className="mb-[22px]">
          <input
            type="email"
            placeholder="Email"
            name="email"
            required
            className="w-full rounded-md border border-BorderLine dark:border-dark_border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
          />
        </div>
        <div className="mb-[22px]">
          <input
            type="password"
            placeholder="Şifre"
            name="password"
            required
            className="w-full rounded-md border border-BorderLine dark:border-dark_border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
          />
        </div>
        <div className="mb-9">
          <button
            type="submit"
            className="flex w-full cursor-pointer items-center justify-center rounded-md bg-primary px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:bg-darkprimary! dark:hover:bg-darkprimary!"
          >
            Kaydol {loading && <Loader />}
          </button>
        </div>
      </form>

      <p className="text-body-secondary mb-4 text-base">
        Bir hesap oluşturarak bizimle aynı fikirde olduğunuzu kabul ediyorsunuz{" "}
        <a href="/#" className="text-primary hover:underline">
          Gizlilik
        </a>{" "}
        ve{" "}
        <a href="/#" className="text-primary hover:underline">
          Politika
        </a>
      </p>

      <p className="text-body-secondary text-base">
        Hesabın var mı?
        <Link
          href="/"
          className="pl-2 text-primary hover:bg-darkprimary hover:underline"
        >
          Giriş Yap
        </Link>
      </p>
    </>
  );
};

export default SignUp;
