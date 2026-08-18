import { HelpCircle } from "lucide-react";
import { Reveal, SectionTag } from "@/features/career/components/landing/primitives";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqs } from "@/features/career/services/landingData";

export default function FAQ() {
  return (
    <section id="faq" className="relative overflow-hidden bg-[#F1F5F9] py-24 lg:py-32" data-testid="faq-section">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <Reveal className="text-center">
          <SectionTag icon={HelpCircle}>FAQ</SectionTag>
          <h2 className="mt-6 text-3xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-4xl lg:text-[52px]">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`item-${i}`}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white px-6 shadow-soft transition-shadow hover:shadow-medium"
                data-testid={`faq-item-${i}`}
              >
                <AccordionTrigger className="py-5 text-left text-[16px] font-semibold text-slate-900 hover:no-underline [&>svg]:text-blue-600">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-[15px] leading-relaxed text-slate-600">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
