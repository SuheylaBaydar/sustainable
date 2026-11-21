import UrunlerClient from "./UrunlerClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ürünler | Sustainable",
};

export default function UrunlerPage() {
  return <UrunlerClient />;
}
