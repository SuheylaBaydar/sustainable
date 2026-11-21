import SignUp from "@/components/Auth/SignUp";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Kayıt Ol | Sustainable",
};

const SignupPage = () => {
  return (
    <>
      <Breadcrumb pageName="Kayıt Ol" />

      <SignUp />
    </>
  );
};

export default SignupPage;
