import Header from "@/components/Header";
import SubFooter from "@/components/SubFooter";
import ContactForm from "./component/contactform";

export default function ContactPage() {
  return (
    <main>
      <Header />
      <ContactForm />
      <SubFooter className="mt-[-110px]" />
    </main>
  );
}
