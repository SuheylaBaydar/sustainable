import ContactForm from "@/components/Contact/Form";
import ContactInfo from "@/components/Contact/ContactInfo";
import Location from "@/components/Contact/OfficeLocation";
import React from "react";
import HeroSub from "@/components/SharedComponent/HeroSub";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "İletişim | Sustainable",
};

const page = () => {
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/contact", text: "İletişim" },
  ];
  return (
    <>
      <HeroSub
        title="Bizimle İletişime Geçin"
        description=""

      />
      <ContactInfo />
      <ContactForm />
      <Location />
    </>
  );
};

export default page;
