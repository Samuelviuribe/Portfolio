import ParticleScene from '@/features/particle-field/ParicleScene';
import Hero from '@/sections/Hero';


export default function Home() {
  return (
    <main>
      <div style={{ height: '50vh', width:'50vw', position:'fixed'}}>
        <ParticleScene />
      </div>


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