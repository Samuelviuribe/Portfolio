import ParticleScene from '@/features/particle-field/ParicleScene';
import Hero from '@/sections/Hero';
import Navbar from '@/components/Navbar';
import Work from '@/sections/Work';
import About from '@/sections/About';


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

    </main>
  );
}