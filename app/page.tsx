import ParticleScene from '@/features/particle-field/ParicleScene';
import Hero from '@/sections/Hero/Hero';
import Navbar from '@/components/Navbar';
import Work from '@/sections/Work/Work';
import About from '@/sections/About/About';
import Contact from '@/sections/Contact/Contact';


export default function Home() {
  return (
    <main>
      <div className='particle-background'>
        <ParticleScene />
      </div>

      <Navbar/>

      <Hero/>

      <Work/>

      <About/>

      <Contact/>

    </main>
  );
}