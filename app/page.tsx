import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";
import ServiceAreas from "@/components/home/ServiceAreas";
import PageWrapper from "@/components/shared/PageWrapper";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <PageWrapper>
      <Hero />
      <Features />
      <HowItWorks />
      <ServiceAreas />

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary to-blue-900 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            {/* Background Light */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

            <h2 className="text-4xl md:text-6xl font-bold mb-8 relative z-10">
              Ready to send your <br /> first parcel?
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto relative z-10">
              Join thousands of happy customers in Haripur. Get started today and experience the future of local delivery.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 relative z-10">
              <Button size="lg" variant="secondary" className="px-10">
                Sign Up Now
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
