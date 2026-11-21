import Signin from "@/components/Auth/SignIn";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Giriş Yap | Sustainable",
};

const SigninPage = () => {
  return (
    <>
      <Breadcrumb pageName="Giriş Yap" />

      <Signin />
    </>
  );
};

export default SigninPage;
