import Header from "@/components/Header";
import SubFooter from "@/components/SubFooter";
import ContactForm from "./components/contactform";

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <ContactForm />
      </div>
      <SubFooter className="-mt-42.5" />
    </main>
  );
}
