import Auth_header from "@/components/Auth_header";
import Auth_footer from "@/components/Auth_footer";
import VerifyForm from "./components/form";

export default function VerifyEmail() {
  return (
    <div className="flex min-h-[100vh] flex-col">
      <Auth_header />

      <main className="flex flex-1 items-center justify-center">
        <VerifyForm />
      </main>

      <Auth_footer />
    </div>
  );
}
