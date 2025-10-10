import Hero from '@/components/Hero';
import ImpactNumbers from '@/components/ImpactNumbers';
import Projects from '@/components/Projects';
import YouTubeChannel from '@/components/YouTubeChannel';
import SuccessStory from '@/components/SuccessStory';
import Publications from '@/components/Publications';
import Blog from '@/components/Blog';
import Partners from '@/components/Partners';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

export default function Home() {

  return (
    <>
      <main>
        {/* Hero Section */}
        <Hero />
        <ImpactNumbers />
        <Projects />
        <YouTubeChannel />
        <SuccessStory />
        <Publications />
        <Blog />
        <Partners />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}