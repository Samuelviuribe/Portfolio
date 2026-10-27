import ParticleScene from '@/features/particle-field/ParicleScene';
import Hero from '@/sections/Hero';
import Navbar from '@/components/Navbar';


export default function Home() {
  return (
    <main>
      <div className='particle-background'>
        <ParticleScene />
      </div>

      <Navbar/>

      <Hero/>

      <section 
        id='work'
        style={{
          height: '200vh',
          background: '#080808',
          color: 'white',
          padding: '40px',
        }}>
      </section>


    </main>
  );
}