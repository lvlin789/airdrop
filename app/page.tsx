"use client";

import HeroSection from '@/components/HeroSection';
import EventDetails from '@/components/EventDetails';
import CountdownTimer from '@/components/CountdownTimer';
import Milestones from '@/components/Milestones';
import WhyEthereum from '@/components/WhyEthereum';
import Footer from '@/components/Footer';
import AirdropCard from '@/components/AirdropCard';

export default function AirdropPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <HeroSection />
      <EventDetails />
      <CountdownTimer />
      <AirdropCard />
      <Milestones />
      <WhyEthereum />
      <Footer />
    </div>
  );
}
