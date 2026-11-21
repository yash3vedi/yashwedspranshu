import { wedding } from '@/config/wedding';

/** "Together with their families" — the formal invitation card. */
export function FamiliesSection() {
  const f = wedding.families;
  const d = (s: number) => ({ ['--dl' as string]: `${s}s` });
  return (
    <section className="sec families" id="families" aria-labelledby="famTitle">
      <div className="fam-wrap">
        <span className="fam-diya fam-diya-l" aria-hidden="true" />
        <span className="fam-diya fam-diya-r" aria-hidden="true" />
        <div className="fam-card">
          <p className="fam-kicker" lang="sa" data-reveal>{f.kicker}</p>
          <h2 className="fam-intro" id="famTitle" data-reveal style={d(.1)}>{f.intro}</h2>
          <div className="rule" aria-hidden="true"><i /></div>

          <div className="fam-person" data-reveal style={d(.2)}>
            <p className="fam-name">{f.groom.name}</p>
            <p className="fam-parents">{f.groom.parents}</p>
          </div>
          <p className="fam-amp" aria-label="and" data-reveal style={d(.3)}>&amp;</p>
          <div className="fam-person" data-reveal style={d(.4)}>
            <p className="fam-name">{f.bride.name}</p>
            <p className="fam-parents">{f.bride.parents}</p>
          </div>

          <p className="fam-invite" data-reveal style={d(.5)}>{f.invite}</p>
          <div className="fam-when" data-reveal style={d(.6)}>
            <span className="fam-date">{f.when}</span>
            <span className="fam-place">{f.where}</span>
          </div>
          <p className="fam-bless" data-reveal style={d(.7)}>{f.blessing}</p>
          <p className="fam-from" data-reveal style={d(.8)}>{f.from}</p>
        </div>
      </div>
    </section>
  );
}
