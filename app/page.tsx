
import ParticleScene from '@/features/particle-field/ParicleScene';


export default function Home() {
  return (
    <main>
      <h1>Mi portafolio</h1>
      <div style={{ height: '550px' }}>
        <ParticleScene />
      </div>


      <section
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